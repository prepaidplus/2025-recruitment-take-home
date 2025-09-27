//tiny IndexedDB wrapper to securely store auth token and user info 

const DB_NAME = 'prepaidplus-auth';
const STORE_NAME = 'auth';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    r.onsuccess = (e) => resolve(e.target.result);
    r.onerror = (e) => reject(e.target.error);
  });
}

async function put(key, val) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(val, key);
    req.onsuccess = () => res(true);
    req.onerror = (e) => rej(e.target.error);
  });
}

async function get(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = (e) => rej(e.target.error);
  });
}

async function remove(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => res(true);
    req.onerror = (e) => rej(e.target.error);
  });
}

export default {
  async setAuth({ token, user }) {
    if (!token) throw new Error('Missing token');
    await put('token', token);
    await put('user', user || null);
  },
    async getToken() {
    return await get('token');
  },
  async getUser() {
    return await get('user');
  },
  async clear() {
    await remove('token');
    await remove('user');
  }
};