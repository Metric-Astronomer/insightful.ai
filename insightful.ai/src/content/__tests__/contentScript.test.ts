import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { createLightbulbButton, handleLightbulbClick } from '../contentScript';

describe('Content Script', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Button Creation', () => {
    test('creates button with correct properties', () => {
      createLightbulbButton();
      
      const button = document.getElementById('scraper-lightbulb-button');
      expect(button).toBeTruthy();
      expect(button?.innerHTML).toBe('💡');
      expect(button?.style.position).toBe('fixed');
      expect(button?.style.bottom).toBe('20px');
      expect(button?.style.right).toBe('20px');
    });

    test('removes existing button before creating new one', () => {
      createLightbulbButton();
      createLightbulbButton();
      
      const buttons = document.querySelectorAll('#scraper-lightbulb-button');
      expect(buttons.length).toBe(1);
    });
  });
});