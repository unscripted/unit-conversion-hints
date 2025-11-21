import * as vscode from 'vscode';
import { UnitConverter } from './BaseConverter';

/**
 * Converter for rem to px values
 */
export class RemToPxConverter implements UnitConverter {
  id = 'remToPx';
  name = 'REM to PX';
  private readonly regex = /"([0-9]+\.?[0-9]*)rem"/g;

  getRegex(): RegExp {
    return this.regex;
  }

  convert(matchedValue: string, extractedValue: string, config: vscode.WorkspaceConfiguration): string {
    const baseFontSize = config.get<number>('baseFontSize', 16);
    const rem = parseFloat(extractedValue);
    const px = Math.round(rem * baseFontSize * 100) / 100; // Round to 2 decimal places
    return `${px}px`;
  }

  getConfigNamespace(): string {
    return 'unitConversionHints.remToPx';
  }

  getDefaultConfig(): Record<string, any> {
    return {
      baseFontSize: 16
    };
  }

  formatHint(matchedValue: string, convertedValue: string): string {
    return ` // ${convertedValue}`;
  }

  formatHover(matchedValue: string, convertedValue: string, config: vscode.WorkspaceConfiguration): vscode.MarkdownString {
    const baseFontSize = config.get<number>('baseFontSize', 16);
    const remValue = matchedValue.replace(/"/g, '');
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**${remValue}** = **${convertedValue}**`);
    markdown.appendText(`\n\n(Base font size: ${baseFontSize}px)`);
    return markdown;
  }
}

