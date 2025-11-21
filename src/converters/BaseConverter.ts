import * as vscode from 'vscode';

/**
 * Base interface for unit converters
 */
export interface UnitConverter {
  /**
   * Unique identifier for this converter
   */
  id: string;

  /**
   * Display name for this converter
   */
  name: string;

  /**
   * Regular expression to match values that should be converted
   */
  getRegex(): RegExp;

  /**
   * Convert a matched value to the target unit
   * @param matchedValue The full matched string (e.g., "1.25rem")
   * @param extractedValue The extracted numeric value (e.g., "1.25")
   * @param config Configuration object from VS Code settings
   * @returns The converted value as a string (e.g., "20px")
   */
  convert(matchedValue: string, extractedValue: string, config: vscode.WorkspaceConfiguration): string;

  /**
   * Get configuration namespace for this converter
   */
  getConfigNamespace(): string;

  /**
   * Get default configuration for this converter
   */
  getDefaultConfig(): Record<string, any>;

  /**
   * Format the conversion hint for display (e.g., "1.25rem → 20px")
   */
  formatHint(matchedValue: string, convertedValue: string): string;

  /**
   * Format the conversion for hover tooltip
   */
  formatHover(matchedValue: string, convertedValue: string, config: vscode.WorkspaceConfiguration): vscode.MarkdownString;
}

