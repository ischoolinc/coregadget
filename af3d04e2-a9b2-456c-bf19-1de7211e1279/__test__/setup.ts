import { afterEach,vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import '@testing-library/jest-dom';

vi.mock('zustand')

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
}
afterEach(() => {
  cleanup();
});