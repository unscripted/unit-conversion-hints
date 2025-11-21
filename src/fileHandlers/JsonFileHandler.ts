import * as vscode from 'vscode';
import { FileHandler } from './BaseFileHandler';
import { UnitConverter } from '../converters/BaseConverter';

/**
 * File handler for JSON files
 */
export class JsonFileHandler implements FileHandler {
  supportedLanguages = ['json', 'jsonc'];

  canHandle(document: vscode.TextDocument): boolean {
    return this.supportedLanguages.includes(document.languageId);
  }

  findMatches(
    document: vscode.TextDocument,
    converters: UnitConverter[]
  ): Array<{
    range: vscode.Range;
    converter: UnitConverter;
    matchedValue: string;
    extractedValue: string;
  }> {
    const text = document.getText();
    const matches: Array<{
      range: vscode.Range;
      converter: UnitConverter;
      matchedValue: string;
      extractedValue: string;
    }> = [];

    for (const converter of converters) {
      const regex = converter.getRegex();
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const extractedValue = match[1] || match[0];

        matches.push({
          range: new vscode.Range(startPos, endPos),
          converter,
          matchedValue: match[0],
          extractedValue
        });
      }
    }

    // Sort matches by position to avoid conflicts
    matches.sort((a, b) => {
      if (a.range.start.line !== b.range.start.line) {
        return a.range.start.line - b.range.start.line;
      }
      return a.range.start.character - b.range.start.character;
    });

    return matches;
  }
}

