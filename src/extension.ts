import * as vscode from 'vscode';
import { ConversionService } from './services/ConversionService';

let conversionService: ConversionService;

export function activate(context: vscode.ExtensionContext) {
  // Initialize conversion service
  conversionService = new ConversionService();

  // Register hover providers
  conversionService.registerHoverProviders(context);

  // Update decorations for active line
  let activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    conversionService.updateActiveLineDecorations(activeEditor);
  }

  // Update decorations when cursor position changes
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (event.textEditor === vscode.window.activeTextEditor) {
        conversionService.updateActiveLineDecorations(event.textEditor);
      }
    })
  );

  // Update decorations when active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      activeEditor = editor;
      conversionService.updateActiveLineDecorations(editor);
    })
  );

  // Update decorations when document changes (in case matches change)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (activeEditor && event.document === activeEditor.document) {
        conversionService.updateActiveLineDecorations(activeEditor);
      }
    })
  );

  // Clean up on deactivate
  context.subscriptions.push({
    dispose: () => {
      if (conversionService) {
        conversionService.dispose();
      }
    }
  });
}

export function deactivate() {
  if (conversionService) {
    conversionService.dispose();
  }
}
