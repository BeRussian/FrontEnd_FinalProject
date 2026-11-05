import { describe, it, expect } from 'vitest';

/**
 * Smoke Test / Environment Verification Test:
 * 
 * This test file verifies that the Vitest testing runner is correctly installed,
 * configured, and able to execute test suites in our Vite + TypeScript environment.
 * 
 * Key Vitest concepts explained:
 * - `describe`: Groups related test cases together under a single suite name.
 * - `it` (or `test`): Defines a single test scenario with a description of what it verifies.
 * - `expect`: The assertion function. Checks whether an actual value matches the expected result.
 */
describe('Vitest Test Runner Environment', () => {
  it('should run a basic assertion and pass', () => {
    // Explanation: Confirms that true is true and the assertion engine works
    const isVitestRunning = true;
    expect(isVitestRunning).toBe(true);
  });

  it('should perform arithmetic calculations accurately', () => {
    // Explanation: Verifies standard JavaScript/TypeScript logic execution
    const cookingTimeInMinutes = 10;
    const additionalPrepTime = 5;
    const totalTime = cookingTimeInMinutes + additionalPrepTime;

    expect(totalTime).toBe(15);
  });
});

