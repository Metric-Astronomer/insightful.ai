import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ScraperDatabase } from '../database'; // Import the class instead of instance
import type { ScrapedContent } from '../../types';
// Don't import fake-indexeddb/auto here - it's handled in setup.ts

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
  let db: ScraperDatabase;
  
  beforeEach(async () => {
    // Generate a unique database name for each test run
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const testDbName = `TestDatabase_${uniqueId}`;
    
    // Track this database name for potential cleanup
    if (global.__dbTestInfo) {
      global.__dbTestInfo.createdDatabases.add(testDbName);
    }
    
    // Create a new database instance with the unique name
    db = new ScraperDatabase(testDbName);
    
    try {
      await db.open();
    } catch (error) {
      console.error('Database setup error:', error);
      throw error; // Make test fail if DB setup fails
    }
  });
  
  afterEach(() => {
    // Close the database connection to prevent leaks
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