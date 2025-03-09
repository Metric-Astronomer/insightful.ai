import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import { db } from '../database';
import type { ScrapedContent } from '../../types';

// Test data factory
function createMockContent(override?: Partial<Omit<ScrapedContent, 'id' | 'timestamp'>>) {
  return {
    url: 'https://example.com/test',
    title: 'Test Page',
    text: 'This is sample content for testing',
    ...override
  };
}

describe('ScraperDatabase - CRUD Operations', () => {
  // Initialize database before all tests
  beforeAll(async () => {
    try {
      await db.open();
    } catch (error) {
      console.log('Database setup error:', error);
    }
  });
  
  // Clear database before each test
  beforeEach(async () => {
    try {
      await db.clear();
    } catch (error) {
      console.log('Test cleanup error:', error);
    }
  });

  // Close database after all tests
  afterAll(async () => {
    db.close();
  });

  describe('Content Creation', () => {
    it('should save new content successfully', async () => {
      const mockContent = createMockContent();
      const id = await db.saveContent(mockContent);
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('number');
    });

    it('should retrieve saved content correctly', async () => {
      const mockContent = createMockContent();
      const id = await db.saveContent(mockContent);
      
      const savedContent = await db.getContentById(id);
      
      expect(savedContent).toBeDefined();
      expect(savedContent?.url).toBe(mockContent.url);
      expect(savedContent?.title).toBe(mockContent.title);
      expect(savedContent?.text).toBe(mockContent.text);
    });

    it('should update existing content', async () => {
      const mockContent = createMockContent();
      const id = await db.saveContent(mockContent);
      
      const updatedContent = {
        ...mockContent,
        title: 'Updated Title'
      };
      
      await db.saveContent(updatedContent);
      const savedContent = await db.getContentById(id);
      
      expect(savedContent?.title).toBe('Updated Title');
    });

    it('should delete content successfully', async () => {
      const mockContent = createMockContent();
      const id = await db.saveContent(mockContent);
      
      await db.deleteContent(id);
      const savedContent = await db.getContentById(id);
      
      expect(savedContent).toBeUndefined();
    });
  });
});