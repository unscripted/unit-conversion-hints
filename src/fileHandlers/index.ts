import { FileHandler } from './BaseFileHandler';
import { JsonFileHandler } from './JsonFileHandler';

/**
 * Registry of all available file handlers
 */
export const fileHandlers: FileHandler[] = [
  new JsonFileHandler()
];

/**
 * Get file handler for a document
 */
export function getFileHandler(document: any): FileHandler | undefined {
  return fileHandlers.find(handler => handler.canHandle(document));
}

