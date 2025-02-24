import '@testing-library/jest-dom';

// Mock Chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn((_message, callback) => {
      callback({ success: true });
    })
  }
} as any;

// Mock Readability with proper types
jest.mock('@mozilla/readability', () => ({
  Readability: jest.fn().mockImplementation(() => ({
    parse: () => ({
      title: 'Test Title',
      textContent: 'Test Content',
      content: '<div>Test Content</div>',
      length: 100,
      excerpt: 'Test Excerpt',
      byline: null,
      dir: 'ltr',
      siteName: null,
      lang: null
    })
  }))
}));

// Reset DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});