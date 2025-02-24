import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { createLightbulbButton, handleLightbulbClick } from '../contentScript';
import '@testing-library/jest-dom';

// Define types for Chrome message handling
interface ChromeMessageResponse {
  success: boolean;
}

// Match Chrome's runtime.sendMessage signature
type ChromeCallback = (response: ChromeMessageResponse) => void;
type ChromeSendMessage = (
  message: unknown,
  callback: (response: ChromeMessageResponse) => void
) => void;

// Create properly typed mock function
const mockSendMessage = jest.fn<ChromeSendMessage>().mockImplementation(
  (_message: unknown, callback: ChromeCallback) => {
    callback({ success: true });
  }
);

// Mock Chrome API with proper Jest types
global.chrome = {
  runtime: {
    sendMessage: mockSendMessage as unknown as typeof chrome.runtime.sendMessage
  }
} as unknown as typeof chrome;

describe('Content Script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('creates button with correct properties', () => {
    createLightbulbButton();
    
    const button = document.getElementById('scraper-lightbulb-button');
    expect(button).toBeTruthy();
    expect(button?.innerHTML).toBe('💡');
    expect(button?.style.position).toBe('fixed');
    expect(button?.style.bottom).toBe('20px');
  });

  test('button shows loading state during content extraction', async () => {
    createLightbulbButton();
    const button = document.getElementById('scraper-lightbulb-button');
    
    // Start content extraction
    await handleLightbulbClick();
    
    expect(button?.innerHTML).toBe('⏳');
    expect(button?.style.pointerEvents).toBe('none');
  });

  test('button shows success state after content saved', async () => {
    createLightbulbButton();
    const button = document.getElementById('scraper-lightbulb-button');
    
    // Mock successful save with proper types
    mockSendMessage.mockImplementationOnce(
      (_msg: unknown, callback: ChromeCallback) => {
        callback({ success: true });
      }
    );

    await handleLightbulbClick();
    expect(button?.innerHTML).toBe('✅');
  });

  test('button shows error state when extraction fails', async () => {
    createLightbulbButton();
    const button = document.getElementById('scraper-lightbulb-button');
    
    // Force Readability to fail
    jest.mock('@mozilla/readability', () => ({
      Readability: jest.fn().mockImplementation(() => ({
        parse: () => null
      }))
    }));

    await handleLightbulbClick();
    expect(button?.innerHTML).toBe('❌');
  });
});