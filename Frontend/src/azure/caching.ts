const maxCacheSize = 10;
const cacheTimeout = 300; /* Cache timout of objects in seconds */

const millInSec = 1000;

let cache = new Map();
let usageAge = new Map(); /* Keeps track of when an object in cache was last being used */
let objectAge = new Map(); /* Keeps track of when an object in cache was created */

/**
 * @desc Get object from cache map, and adjusts the usageAge of the cached objects
 * @param objId - key
 * @returns Object
 */
export async function getFromCache(objId) {
  /* Sets the age of objects called for to 0. Ads 1 to the age of all the other objects */
  function adjustUsageAge() {
    let keys = usageAge.keys();
    let tempKey;
    for (let i = 0, range = cache.size; i < range; ++i) {
      tempKey = keys.next().value;
      if (tempKey != objId) {
        usageAge.set(tempKey, usageAge.get(tempKey) + 1);
      } else {
        usageAge.set(tempKey, 0);
      }
    }
  }

  let objAgeSec = (new Date().getTime() - objectAge.get(objId)) / millInSec || 0;

  /* Chechs if the object is in cache. Returns the object if status equals 200 and the age is less than the cacheTimout, otherwise removes it from the cache*/
  if (cache.has(objId)) {
    let obj = await cache.get(objId);
    if (obj?.status === 200 && objAgeSec < cacheTimeout) {
      console.log(
        'Retrieved object from cache. Age(sec): ' +
          Math.floor(objAgeSec) +
          ' Timout(sec): ' +
          Math.floor(cacheTimeout - objAgeSec) +
          '\nCurrent cache size: ' +
          cache.size +
          ' ' +
          objectAge.size +
          ' ' +
          usageAge.size
      );
      adjustUsageAge();
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
    usageAge.set(objId, 0);
    objectAge.set(objId, new Date().getTime());
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
  let keys = usageAge.keys();
  let arr = [usageAge.size];
  let median;
  let tempKey;

  /* Creates array with the age of obects in cache */
  for (let i = 0, range = usageAge.size; i < range; ++i) {
    arr[i] = usageAge.get(keys.next().value);
  }
  /* Finds the median of the age of the objects */
  //#Source https://bit.ly/2neWfJ2
  const findMedian = (arr) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  median = findMedian(arr);
  keys = usageAge.keys();

  /* Deletes all cached object with usageAge age higher or equal to the median */
  for (let i = 0, range = cache.size; i < range; ++i) {
    tempKey = keys.next().value;
    if (usageAge.get(tempKey) >= median) {
      usageAge.delete(tempKey);
      cache.delete(tempKey);
      objectAge.delete(tempKey);
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
    usageAge.delete(key);
    objectAge.delete(key);
  } else {
    cache.clear();
    usageAge.clear();
    objectAge.clear();
  }
}
