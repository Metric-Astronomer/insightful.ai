/**
 * Represents content scraped from a webpage
 */
export interface ScrapedContent {
    id?: number;        // Optional: Auto-generated by IndexedDB
    url: string;        // Current page URL
    title: string;      // Page title
    text: string;       // Extracted content
    timestamp: number;  // Unix timestamp (Date.now())
}

/**
 * Represents a search result from stored content
 */
export interface SearchResult {
    id: number;         // Database ID
    url: string;        // Original page URL
    title: string;      // Page title
    snippet: string;    // Content preview
    score?: number;     // Search relevance score
}

/**
 * Message types for extension communication
 */
export interface Message {
    type: 'SAVE_CONTENT' | 'SEARCH_CONTENT';
    payload?: ScrapedContent | { query: string };
}