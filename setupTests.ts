import { expect } from 'vitest';
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

// Dynamically import jest-dom matchers
await import('@testing-library/jest-dom');
