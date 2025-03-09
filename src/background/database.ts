/**
 * Database implementation for Insightful.ai Chrome extension
 * 
 * This module provides a Dexie-based persistence layer for storing and retrieving
 * web content scraped by the extension. It uses IndexedDB under the hood through
 * the Dexie.js library for better developer ergonomics and Promise-based API.
 */

import Dexie, { Table } from 'dexie';
import type { ScrapedContent } from '../types';

/**
 * Database class for managing scraped content persistence
 * Extends Dexie to provide a typed, Promise-based API for IndexedDB operations
 */
class ScraperDatabase extends Dexie {
  // Declare table with TypeScript typing
  scrapedContent!: Table<ScrapedContent, number>;

  constructor() {
    super('ScraperDatabase');

    /**
     * Database schema definition:
     * ++id: Auto-incrementing primary key
     * url: Indexed for lookups, marked unique with &
     * title: Indexed for text search
     * timestamp: Indexed for sorting by recency
     */
    this.version(1).stores({
      scrapedContent: '++id, url, title, timestamp, &url'
    });

    // Hook: Auto-set timestamp on record creation
    this.scrapedContent.hook('creating', (_primKey, obj: Partial<ScrapedContent>) => {
      obj.timestamp = Date.now();
    });

    // Hook: Update timestamp when record is modified 
    this.scrapedContent.hook('updating', (modifications: Partial<ScrapedContent>) => {
      modifications.timestamp = Date.now();
    });
  }

  /**
   * Saves new content or updates existing content based on URL
   * Uses transaction for data consistency
   */
  async saveContent(content: Omit<ScrapedContent, 'id' | 'timestamp'>): Promise<number> {
    return await this.transaction('rw', this.scrapedContent, async () => {
      // Check for existing content with same URL
      const existing = await this.scrapedContent
        .where('url')
        .equals(content.url)
        .first();

      if (existing) {
        // Update existing record
        await this.scrapedContent.update(existing.id!, content);
        return existing.id!;
      }
      
      // Add new record (timestamp handled by hook)
      return await this.scrapedContent.add(content as ScrapedContent);
    });
  }

  /**
   * Retrieves content by database ID
   * Returns undefined if not found
   */
  async getContentById(id: number): Promise<ScrapedContent | undefined> {
    try {
      return await this.scrapedContent.get(id);
    } catch (error) {
      console.error(`Error retrieving content ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Retrieves content by URL
   * Returns undefined if not found
   */
  async getContentByUrl(url: string): Promise<ScrapedContent | undefined> {
    try {
      return await this.scrapedContent
        .where('url')
        .equals(url)
        .first();
    } catch (error) {
      console.error(`Error retrieving content for ${url}:`, error);
      return undefined;
    }
  }

  /**
   * Retrieves most recent content
   * @param limit Optional limit on number of items to return
   */
  async getRecentContent(limit?: number): Promise<ScrapedContent[]> {
    try {
      return await this.scrapedContent
        .orderBy('timestamp')
        .reverse()
        .limit(limit || 50)
        .toArray();
    } catch (error) {
      console.error('Error retrieving recent content:', error);
      return [];
    }
  }

  /**
   * Searches content by text query
   * Splits query into terms and matches against title and content
   */
  async searchContent(query: string): Promise<ScrapedContent[]> {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    
    if (!terms.length) return [];

    try {
      return await this.scrapedContent
        .filter(content => 
          terms.every(term =>
            content.title.toLowerCase().includes(term) ||
            content.text.toLowerCase().includes(term)
          )
        )
        .sortBy('timestamp');
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }

  /**
   * Deletes content by ID
   * Returns true if successful, false if deletion errors
   */
  async deleteContent(id: number): Promise<boolean> {
    try {
      await this.scrapedContent.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      return false;
    }
  }

  /**
   * Clears all content from the database
   * Uses transaction for consistency
   */
  async clear(): Promise<void> {
    return await this.transaction('rw', this.scrapedContent, async () => {
      await this.scrapedContent.clear();
    });
  }

  /**
   * Closes database connection
   * Important for cleanup in testing
   */
  close(): void {
    if (this.isOpen()) {
      super.close();
    }
  }

  /**
   * Deletes the entire database
   * Returns Dexie's PromiseExtended type for compatibility
   */
  delete(): Dexie.Promise<void> {
    if (this.isOpen()) {
      super.close();
    }
    return Dexie.delete('ScraperDatabase');
  }
}

// Export singleton instance
export const db = new ScraperDatabase();