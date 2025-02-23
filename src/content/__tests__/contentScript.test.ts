import { describe, test, expect, beforeEach } from '@jest/globals';
import { createLightbulbButton } from '../contentScript';

describe('Content Script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('creates button with correct properties', () => {
    createLightbulbButton();
    
    const button = document.getElementById('scraper-lightbulb-button');
    expect(button).toBeTruthy();
    expect(button?.innerHTML).toBe('💡');
  });
});