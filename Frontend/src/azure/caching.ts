const maxCacheSize = 10;
const cacheTimeout = 10;

let cache = new Map();
let usage = new Map();

/**
 * @desc Get object from cache map, and adjusts the usage frequenzy of the cached objects
 * @param objId - key
 * @returns Object
 */
export async function getFromCache(objId) {
  /* Sets the age of objects called for to 0. Ads 1 to the age of all the other objects */
  function adjustUsage() {
    let keys = usage.keys();
    let tempKey;
    for (let i = 0, range = cache.size; i < range; ++i) {
      tempKey = keys.next().value;
      if (tempKey != objId) {
        usage.set(tempKey, usage.get(tempKey) + 1);
      } else {
        usage.set(tempKey, 0);
      }
    }
  }

  /* Ceches of the object is in cache. Returns the object if status equals 200, ot removes if it's not */
  if (cache.has(objId)) {
    let obj = await cache.get(objId);
    if (obj?.status === 200) {
      adjustUsage();
      console.log('Retrieved object from cache. ' + 'Cache size: ' + cache.size + ' ' + usage.size);
      return obj;
    } else {
      deleteCache(objId);
    }
  }
  /* returns null if the object was not found in the cache */
  return null;
}

/**
 * @desc Add an object to the cache map
 * @param objId - key
 * @param data - value
 * @returns the object that was added
 */
export function addToCacheAndReturn(objId, data) {
  if (cache.size >= maxCacheSize) {
    cleanCache();
  }
  try {
    cache.set(objId, data);
    usage.set(objId, 0);
  } catch {
    deleteCache();
  }
  return cache.get(objId);
}

/**
 * @desc Deletes about half of the object in the cache.
 * The objects that was called the most recent, remains in the cache
 */
function cleanCache() {
  let keys = usage.keys();
  let arr = [usage.size];
  let median;
  let tempKey;

  /* Creates array with the age of obects in cache */
  for (let i = 0, range = usage.size; i < range; ++i) {
    arr[i] = usage.get(keys.next().value);
  }
  /* Finds the median of the age of the objects */
  //#Source https://bit.ly/2neWfJ2
  const findMedian = (arr) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  median = findMedian(arr);
  keys = usage.keys();

  /* Deletes all cached object with usage age higher or equal to the median */
  for (let i = 0, range = cache.size; i < range; ++i) {
    tempKey = keys.next().value;
    if (usage.get(tempKey) >= median) {
      usage.delete(tempKey);
      cache.delete(tempKey);
    }
  }
}

/**
 * @desc Clear cache, or delete one object from cache
 * @param key - key to the object to be deleted from cache: optional
 */
export function deleteCache(key = null) {
  if (key !== null) {
    cache.delete(key);
    usage.delete(key);
  } else {
    cache.clear();
    usage.clear();
  }
}
