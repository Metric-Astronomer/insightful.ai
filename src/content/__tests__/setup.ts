import '@testing-library/jest-dom';

// Mock Chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn((message, callback) => {
      callback({ success: true });
    })
  }
} as any;

// Mock Readability
jest.mock('@mozilla/readability', () => ({
  Readability: jest.fn().mockImplementation(() => ({
    parse: () => ({
      title: 'Test Title',
      textContent: 'Test Content'
    })
  }))
}));

// Reset DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});