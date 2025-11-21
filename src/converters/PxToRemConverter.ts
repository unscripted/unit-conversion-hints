import * as vscode from 'vscode';
import { UnitConverter } from './BaseConverter';

/**
 * Converter for px to rem values
 */
export class PxToRemConverter implements UnitConverter {
  id = 'pxToRem';
  name = 'PX to REM';
  private readonly regex = /"([0-9]+\.?[0-9]*)px"/g;

  getRegex(): RegExp {
    return this.regex;
  }

  convert(matchedValue: string, extractedValue: string, config: vscode.WorkspaceConfiguration): string {
    const baseFontSize = config.get<number>('baseFontSize', 16);
    const px = parseFloat(extractedValue);
    const rem = Math.round((px / baseFontSize) * 100) / 100; // Round to 2 decimal places
    return `${rem}rem`;
  }

  getConfigNamespace(): string {
    // Use the same baseFontSize config as remToPx since they share the same value
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
    const pxValue = matchedValue.replace(/"/g, '');
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**${pxValue}** = **${convertedValue}**`);
    markdown.appendText(`\n\n(Base font size: ${baseFontSize}px)`);
    return markdown;
  }
}

