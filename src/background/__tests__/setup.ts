import { IDBFactory } from 'fake-indexeddb';
import { indexedDB as fakeIndexedDB } from 'fake-indexeddb';
import { jest } from '@jest/globals';

// Store original indexedDB for restoration
const originalIndexedDB = global.indexedDB;

// Define a global variable to track database names created during tests
global.__dbTestInfo = { createdDatabases: new Set() };

// Before each test: provide completely fresh indexedDB 
beforeEach(() => {
  // Replace the global indexedDB with a fresh instance
  global.indexedDB = new IDBFactory();
  
  // Reset our tracking of created test databases
  global.__dbTestInfo.createdDatabases.clear();
  
  // Clear all mocks
  jest.clearAllMocks();
});

// After all tests: restore original indexedDB
afterAll(() => {
  global.indexedDB = originalIndexedDB;
});