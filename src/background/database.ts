import Dexie, { Table } from 'dexie';
import type { ScrapedContent } from '../types';

class ScraperDatabase extends Dexie {
  scrapedContent!: Table<ScrapedContent, number>;

  constructor() {
    super('ScraperDatabase');
    
    // Define schema with indexes
    this.version(1).stores({
      scrapedContent: '++id, url, title, timestamp, &url'
    });

    // Automatic timestamp management using Unix timestamps
    this.scrapedContent.hook('creating', (_primKey, obj: Partial<ScrapedContent>) => {
      obj.timestamp = Date.now();  // Sets the timestamp to current Unix time
    });

    this.scrapedContent.hook('updating', (modifications: Partial<ScrapedContent>) => {
      modifications.timestamp = Date.now();
    });
  }

  async saveContent(content: Omit<ScrapedContent, 'id' | 'timestamp'>): Promise<number> {
    try {
      return await this.transaction('rw', this.scrapedContent, async () => {
        const existing = await this.scrapedContent
          .where('url')
          .equals(content.url)
          .first();

        if (existing) {
          await this.scrapedContent.update(existing.id!, {
            ...content,
            timestamp: Date.now()
          });
          return existing.id!;
        }
        return await this.scrapedContent.add({ ...content, timestamp: Date.now() } as ScrapedContent);
      });
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  }

  async getAllContent(limit?: number): Promise<ScrapedContent[]> {
    return await this.scrapedContent
      .orderBy('timestamp')
      .reverse()
      .limit(limit || Infinity)
      .toArray();
  }

  async getContentById(id: number): Promise<ScrapedContent | undefined> {
    return await this.scrapedContent.get(id);
  }

  async getRecentContent(count: number = 10): Promise<ScrapedContent[]> {
    return await this.scrapedContent
      .orderBy('timestamp')
      .reverse()
      .limit(count)
      .toArray();
  }

  async searchContent(query: string): Promise<ScrapedContent[]> {
    const terms = query.toLowerCase().split(/\s+/);
    
    return await this.scrapedContent
      .filter(content => 
        terms.every(term =>
          content.title.toLowerCase().includes(term) ||
          content.text.toLowerCase().includes(term)
        )
      )
      .sortBy('timestamp');
  }

  async deleteContent(id: number): Promise<void> {
    await this.scrapedContent.delete(id);
  }

  async clear(): Promise<void> {
    await this.scrapedContent.clear();
  }
}

// Export singleton instance
export const db = new ScraperDatabase();