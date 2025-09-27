// Mock Framework7
global.window = {};
global.document = {
    createElement: () => ({})
};

// Mock Framework7 methods
global.$$ = jest.fn((selector) => ({
    on: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
    text: jest.fn(),
    val: jest.fn()
}));

global.f7 = {
    form: {
        convertToData: jest.fn(() => ({}))
    },
    dialog: {
        alert: jest.fn()
    },
    views: {
        main: {
            router: {
                navigate: jest.fn()
            }
        }
    }
};

// Mock IndexedDB
const indexedDB = require('fake-indexeddb');
const IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

global.indexedDB = indexedDB;
global.IDBKeyRange = IDBKeyRange;

// Mock crypto (Node.js crypto)
global.crypto = require('crypto');