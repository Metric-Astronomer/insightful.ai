import { IDBFactory } from 'fake-indexeddb';
import { jest } from '@jest/globals';

// Define interface for our test info
interface DBTestInfo {
  createdDatabases: Set<string>;
}

// Properly extend the global namespace
declare global {
  // Use interface merging to extend the global object type
  interface Global {
    __dbTestInfo: DBTestInfo;
  }
  
  // Make TypeScript recognize __dbTestInfo on the global object
  var __dbTestInfo: DBTestInfo;
}

// Store original indexedDB for restoration
const originalIndexedDB = global.indexedDB;

// Define a global variable to track database names created during tests
global.__dbTestInfo = { createdDatabases: new Set<string>() };

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