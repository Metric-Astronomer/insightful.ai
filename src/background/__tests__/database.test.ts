import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { ScraperDatabase } from '../database'; // Import the class instead of instance
import type { ScrapedContent } from '../../types';
import { indexedDB, IDBFactory } from 'fake-indexeddb';
import 'fake-indexeddb/auto';

// Store the original indexedDB for restoration later
const originalIndexedDB = global.indexedDB;

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
  // Create a fresh database instance for each test
  let db: ScraperDatabase;
  
  beforeEach(async () => {
    // Fully delete any existing DB instance
    await new Promise((resolve, reject) => {
      const delReq = indexedDB.deleteDatabase('ScraperDatabase');
      delReq.onsuccess = resolve;
      delReq.onerror = () => reject(delReq.error);
      delReq.onblocked = () => reject(new Error('DB deletion blocked'));
    });
    
    // Reset global indexedDB
    global.indexedDB = new IDBFactory();
    
    // Create a fresh database instance
    db = new ScraperDatabase();
    try {
      await db.open();
    } catch (error) {
      console.error('Database setup error:', error);
    }
  });
  
  afterAll(() => {
    // Clean up and restore original indexedDB
    db.close();
    global.indexedDB = originalIndexedDB;
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