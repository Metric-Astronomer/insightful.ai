import { ScrapedContent, SearchResult, Message } from '../index';

// Test scraping content
const content: ScrapedContent = {
    url: 'https://www.anthropic.com/research/building-effective-agents',
    title: 'Building Effective Agents',
    text: 'LLM Workflow: Training a model to predict the next action in a sequence of actions...',
    timestamp: Date.now()
};

// Test search result
const result: SearchResult = {
    id: 1,
    url: 'https://www.anthropic.com/research/building-effective-agents',
    title: 'Building Effective Agents but cheaper',
    snippet: 'Orchestration Layers: A new approach to training large language models...',
    score: 0.9
};

// Test messages
const saveMessage: Message = {
    type: 'SAVE_CONTENT',
    payload: content
};

const searchMessage: Message = {
    type: 'SEARCH_CONTENT',
    payload: { query: 'test' }
};