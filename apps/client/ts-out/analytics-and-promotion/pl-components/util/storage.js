const memStore = {};
function testLocalStorageAvailability() {
    try {
        const testItem = 'test';
        localStorage.setItem(testItem, testItem);
        localStorage.removeItem(testItem);
        return true;
    }
    catch (e) {
        return false;
    }
}
const isLocalStorageAvailable = testLocalStorageAvailability();
export function setItem(key, value) {
    if (isLocalStorageAvailable) {
        window.localStorage.setItem(key, value);
    }
    else {
        memStore[key] = value;
    }
}
export function getItem(key) {
    if (isLocalStorageAvailable) {
        return window.localStorage.getItem(key);
    }
    else {
        return memStore[key] ?? null;
    }
}
//# sourceMappingURL=storage.js.map