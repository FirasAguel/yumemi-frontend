import { expect } from 'vitest';

declare global {
  // Assigns Vitest's `expect` type to `globalThis.expect`
  var expect: typeof import('vitest').expect;
}

// Make sure global expect is defined before importing jest-dom
globalThis.expect = expect;

// Polyfill for ResizeObserver in the jsdom environment
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

import '@testing-library/jest-dom';
