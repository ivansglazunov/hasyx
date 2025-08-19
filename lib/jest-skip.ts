/**
 * Jest Skip Utility
 * 
 * Simplifies conditional test execution based on boolean conditions.
 * Returns describe if all conditions are true, otherwise describe.skip
 */

/**
 * Conditionally runs tests based on passed boolean conditions
 * @param conditions - array of boolean conditions
 * @returns describe if all conditions are true, otherwise describe.skip
 */
export function jestSkip(...conditions: boolean[]) {
  return conditions.every(Boolean) ? describe : describe.skip;
}
