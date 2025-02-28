import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock Chrome API with proper typing
global.chrome = {
  runtime: {
    sendMessage: jest.fn((_message: any, callback?: (response: any) => void) => {
      if (callback) {
        callback({ success: true });
      }
      return true;
    })
  }
} as any;

// Reset DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});