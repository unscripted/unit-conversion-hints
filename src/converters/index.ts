import { UnitConverter } from './BaseConverter';
import { RemToPxConverter } from './RemToPxConverter';
import { PxToRemConverter } from './PxToRemConverter';

/**
 * Registry of all available unit converters
 */
export const converters: UnitConverter[] = [
  new RemToPxConverter(),
  new PxToRemConverter()
];

/**
 * Get converter by ID
 */
export function getConverter(id: string): UnitConverter | undefined {
  return converters.find(c => c.id === id);
}

/**
 * Get all enabled converters from configuration
 */
export function getEnabledConverters(config: any): UnitConverter[] {
  // For now, return all converters. In the future, this can filter based on config
  return converters;
}

