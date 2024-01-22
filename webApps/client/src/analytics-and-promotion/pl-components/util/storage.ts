// Type for the in-memory storage
interface MemStore {
  [key: string]: string | undefined;
}

const memStore: MemStore = {};

function testLocalStorageAvailability(): boolean {
  try {
    const testItem = 'test';
    localStorage.setItem(testItem, testItem);
    localStorage.removeItem(testItem);
    return true;
  } catch (e) {
    return false;
  }
}

const isLocalStorageAvailable = testLocalStorageAvailability();

export function setItem(key: string, value: string): void {
  if (isLocalStorageAvailable) {
    window.localStorage.setItem(key, value);
  } else {
    memStore[key] = value;
  }
}

export function getItem(key: string): string | null {
  if (isLocalStorageAvailable) {
    return window.localStorage.getItem(key);
  } else {
    return memStore[key] ?? null;
  }
}
