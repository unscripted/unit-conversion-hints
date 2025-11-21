import * as vscode from 'vscode';
import { UnitConverter } from '../converters/BaseConverter';

/**
 * Base interface for file type handlers
 */
export interface FileHandler {
  /**
   * Language ID(s) this handler supports
   */
  supportedLanguages: string[];

  /**
   * Check if this handler can process the given document
   */
  canHandle(document: vscode.TextDocument): boolean;

  /**
   * Find all ranges in the document that match any of the given converters
   */
  findMatches(document: vscode.TextDocument, converters: UnitConverter[]): Array<{
    range: vscode.Range;
    converter: UnitConverter;
    matchedValue: string;
    extractedValue: string;
  }>;
}

