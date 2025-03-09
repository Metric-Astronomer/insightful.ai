import { jest } from '@jest/globals';

export const Readability = jest.fn().mockImplementation(() => ({
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
}));