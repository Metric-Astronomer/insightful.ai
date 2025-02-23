/**
 * Content Script for insightful.ai Chrome Extension
 * 
 * This script adds a floating lightbulb button to webpages and handles content extraction.
 * It uses Mozilla's Readability library for content parsing and sends data to the
 * background script for storage.
 */

import { Readability } from '@mozilla/readability';
import type { ScrapedContent } from '../types/types';

/**
 * Creates and styles the floating lightbulb button
 */
export function createLightbulbButton() {
  // Remove existing button if present
  const existingButton = document.getElementById('scraper-lightbulb-button');
  if (existingButton) {
    existingButton.remove();
  }

  // Create new button element
  const button = document.createElement('div');
  button.id = 'scraper-lightbulb-button';
  button.innerHTML = '💡';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f5f5f5;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    z-index: 9999;
    transition: transform 0.3s ease;
  `;

  // Add hover effects
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });

  // Add click handler
  button.addEventListener('click', handleLightbulbClick);

  // Add to webpage
  document.body.appendChild(button);
}

/**
 * Handles the lightbulb button click
 * - Shows loading state
 * - Extracts content
 * - Sends to background script
 * - Shows success/error feedback
 */
export async function handleLightbulbClick() {
  try {
    // Update button to loading state
    const button = document.getElementById('scraper-lightbulb-button');
    if (button) {
      button.innerHTML = '⏳';
      button.style.pointerEvents = 'none';
    }

    // Extract page content
    const documentClone = document.cloneNode(true) as Document;
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (!article) {
      throw new Error('Failed to parse article content');
    }

    // Prepare content for storage
    const scrapedContent: ScrapedContent = {
      url: window.location.href,
      title: article.title || document.title,
      text: article.textContent,
      timestamp: Date.now()
    };

    // Send to background script
    chrome.runtime.sendMessage({
      action: 'saveScrapedContent',
      content: scrapedContent
    }, (response) => {
      if (button) {
        if (response && response.success) {
          button.innerHTML = '✅';
        } else {
          button.innerHTML = '❌';
        }
        setTimeout(() => {
          button.innerHTML = '💡';
          button.style.pointerEvents = 'auto';
        }, 1500);
      }
    });
  } catch (error) {
    console.error('Error scraping content:', error);
    const button = document.getElementById('scraper-lightbulb-button');
    if (button) {
      button.innerHTML = '❌';
      setTimeout(() => {
        button.innerHTML = '💡';
        button.style.pointerEvents = 'auto';
      }, 1500);
    }
  }
}

/**
 * Initialize content script functionality
 */
function initialize() {
  setTimeout(createLightbulbButton, 1000);
}

// Initialize if not being imported for tests
if (process.env.NODE_ENV !== 'test') {
    initialize();
}

// Handle SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (lastUrl !== location.href) {
    lastUrl = location.href;
    initialize();
  }
}).observe(document, { subtree: true, childList: true });

export { createLightbulbButton, handleLightbulbClick };