import * as vscode from 'vscode';
import { getEnabledConverters } from '../converters';
import { getFileHandler, fileHandlers } from '../fileHandlers';

/**
 * Service that manages unit conversions for documents
 */
export class ConversionService {
  private hoverProvider: ConversionHoverProvider;
  private decorationType: vscode.TextEditorDecorationType;

  constructor() {
    this.hoverProvider = new ConversionHoverProvider();
    this.decorationType = vscode.window.createTextEditorDecorationType({
      after: {
        margin: '0 0 0 4px'
      }
    });
  }

  /**
   * Update decorations for the active line only
   */
  updateActiveLineDecorations(editor: vscode.TextEditor | undefined) {
    if (!editor) {
      // Clear decorations if no active editor
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        activeEditor.setDecorations(this.decorationType, []);
      }
      return;
    }

    const document = editor.document;
    const fileHandler = getFileHandler(document);
    
    if (!fileHandler) {
      editor.setDecorations(this.decorationType, []);
      return;
    }

    const config = vscode.workspace.getConfiguration('unitConversionHints');
    const converters = getEnabledConverters(config);
    const matches = fileHandler.findMatches(document, converters);

    // Get the active line number
    const activeLine = editor.selection.active.line;
    const decorations: vscode.DecorationOptions[] = [];

    // Only show decorations for matches on the active line
    for (const match of matches) {
      if (match.range.start.line === activeLine) {
        const converterConfig = vscode.workspace.getConfiguration(match.converter.getConfigNamespace());
        const convertedValue = match.converter.convert(
          match.matchedValue,
          match.extractedValue,
          converterConfig
        );
        const displayText = match.converter.formatHint(match.matchedValue, convertedValue);

        // Find the comma after the match
        const line = document.lineAt(activeLine);
        const lineText = line.text;
        const matchEndChar = match.range.end.character;
        
        // Look for comma after the match
        let commaPosition = matchEndChar;
        for (let i = matchEndChar; i < lineText.length; i++) {
          if (lineText[i] === ',') {
            commaPosition = i + 1;
            break;
          }
          // Stop if we hit a non-whitespace character that's not a comma
          if (lineText[i] !== ' ' && lineText[i] !== '\t') {
            break;
          }
        }

        const decorationPosition = new vscode.Position(activeLine, commaPosition);
        const decoration: vscode.DecorationOptions = {
          range: new vscode.Range(decorationPosition, decorationPosition),
          renderOptions: {
            after: {
              contentText: displayText,
              color: new vscode.ThemeColor('disabledForeground'),
              fontStyle: 'italic',
              margin: '0 0 0 4px'
            }
          }
        };

        decorations.push(decoration);
      }
    }

    editor.setDecorations(this.decorationType, decorations);
  }

  /**
   * Register hover provider for all supported languages
   */
  registerHoverProviders(context: vscode.ExtensionContext): void {
    const config = vscode.workspace.getConfiguration('unitConversionHints');
    const showHover = config.get<boolean>('showHover', true);
    
    if (!showHover) {
      return;
    }

    // Get all unique language IDs from file handlers
    const supportedLanguages = new Set<string>();
    for (const handler of fileHandlers) {
      for (const lang of handler.supportedLanguages) {
        supportedLanguages.add(lang);
      }
    }

    // Register hover provider for each language
    for (const languageId of supportedLanguages) {
      context.subscriptions.push(
        vscode.languages.registerHoverProvider(languageId, this.hoverProvider)
      );
    }
  }

  dispose() {
    this.decorationType.dispose();
  }
}

/**
 * Hover provider for unit conversions
 */
class ConversionHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const config = vscode.workspace.getConfiguration('unitConversionHints');
    const showHover = config.get<boolean>('showHover', true);
    
    if (!showHover) {
      return null;
    }

    const fileHandler = getFileHandler(document);
    if (!fileHandler) {
      return null;
    }

    const converters = getEnabledConverters(config);
    const matches = fileHandler.findMatches(document, converters);

    // Find match at cursor position
    for (const match of matches) {
      if (match.range.contains(position)) {
        const converterConfig = vscode.workspace.getConfiguration(match.converter.getConfigNamespace());
        const convertedValue = match.converter.convert(
          match.matchedValue,
          match.extractedValue,
          converterConfig
        );
        const markdown = match.converter.formatHover(
          match.matchedValue,
          convertedValue,
          converterConfig
        );

        return new vscode.Hover(markdown, match.range);
      }
    }

    return null;
  }
}

