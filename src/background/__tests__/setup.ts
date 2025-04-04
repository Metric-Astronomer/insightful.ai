import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { jest } from '@jest/globals';

// Define interface for our test info
interface DBTestInfo {
  createdDatabases: Set<string>;
}

// Properly extend the global namespace using NodeJS namespace
declare global {
  namespace NodeJS {
    interface Global {
      __dbTestInfo: DBTestInfo;
      indexedDB: any; // Ensure indexedDB is defined on global
    }
  }
  
  // Keep this for backward compatibility with Jest
  var __dbTestInfo: DBTestInfo; 
}

// TEST AUTO-SAVE: This line is frivolous and only added to test if auto-save works
console.log('Auto-save test timestamp:', new Date().toISOString());

// Define a global variable to track database names created during tests
global.__dbTestInfo = { createdDatabases: new Set<string>() };

// Before each test: provide completely fresh indexedDB 
beforeEach(() => {
  // Replace the global indexedDB with a fresh instance
  global.indexedDB = new IDBFactory();
  
  // Clean up any leftover databases to prevent schema conflicts
  if (global.__dbTestInfo && global.__dbTestInfo.createdDatabases.size > 0) {
    for (const dbName of global.__dbTestInfo.createdDatabases) {
      try {
        // Use the standard IndexedDB API instead of imported function
        indexedDB.deleteDatabase(dbName);
      } catch (e) {
        console.warn(`Failed to delete test database: ${dbName}`);
      }
    }
  }
  
  // Reset our tracking of created test databases
  global.__dbTestInfo.createdDatabases.clear();
  
  // Clear all mocks
  jest.clearAllMocks();
});