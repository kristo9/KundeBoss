const millInSec = 1000;
const bytesInKB = 1000;
const KBInMB = 1000;

const maxCacheSize = 10 * KBInMB;
const cacheTimeout = 300; /* Cache timout of objects in seconds */

let cacheWeight = 0; /* Used to keep track of which objects should stay in the cache when cleanCahce() is called */
let currentSizeKB = 0;
let cache = new Map();

/**
 * @desc Get object from cache map, and adjusts the usageAge of the cached objects
 * @param objId - key
 * @returns Object
 */
export async function getFromCache(objId) {
  /* Chechs if the object is in cache. Returns the object if status equals 200 and the age is less than the cacheTimout, 
  otherwise removes it from the cache*/
  if (cache.has(objId)) {
    let objAgeSec = (new Date().getTime() - cache.get(objId)?.time) / millInSec || 0;
    let obj = await cache.get(objId).data;
    if (obj?.status === 200 && objAgeSec < cacheTimeout) {
      /* console.log(
        'Retrieved object from cache. Age(sec): ' +
          Math.round(objAgeSec) +
          ' Timout(sec): ' +
          Math.round(cacheTimeout - objAgeSec) +
          '\nCurrent cache size(KB): ' +
          Math.round(currentSizeKB) +
          ' Objects: ' +
          cache.size
      ); */
      let temp = cache.get(objId);
      temp.usageAge = ++cacheWeight;
      cache.set(objId, temp);
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
export async function addToCacheAndReturn(objId, data) {
  currentSizeKB += roughSizeOfObject(await data) / bytesInKB;

  try {
    cache.set(objId, {
      data,
      usageAge: ++cacheWeight,
      time: new Date().getTime(),
    });
  } catch {
    deleteCache();
  }

  if (currentSizeKB >= maxCacheSize) {
    cleanCache();
  }

  return cache.get(objId).data;
}

/**
 * @desc Deletes about half of the object in the cache.
 * The objects that was called the most recent, remains in the cache
 */
async function cleanCache() {
  let keys = cache.keys();
  let arr = [cache.size];
  let median;
  let tempKey;
  let tempObj;

  /* Creates array with the age of obects in cache */
  for (let i = 0, range = cache.size; i < range; ++i) {
    arr[i] = cache.get(keys.next().value).usageAge;
  }
  /* Finds the median of the age of the objects */
  //#Source https://bit.ly/2neWfJ2
  const findMedian = (arr) => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  median = findMedian(arr);
  keys = cache.keys();

  /* Deletes all cached object with usageAge higher or equal to the median */
  for (let i = 0, range = cache.size; i < range; ++i) {
    tempKey = keys.next().value;
    tempObj = cache.get(tempKey);
    if (tempObj.usageAge <= median) {
      currentSizeKB -= roughSizeOfObject(await tempObj.data) / bytesInKB;
      cache.delete(tempKey);
    }
  }
  /* console.log('Cleaned cache. New cache size(KB): ' + Math.round(currentSizeKB) + ' Objects: ' + cache.size); */
}

/**
 * @desc Clear cache or delete one object from cache
 * @param key - key to the object to be deleted from cache: optional
 */
export function deleteCache(key = null) {
  if (key !== null) {
    cache.delete(key);
  } else {
    cache.clear();
    cacheWeight = 0;
    currentSizeKB = 0;
  }
}

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

export async function updateGetEmployee(customerId: string) {
  let obj0 = cache.get('GetCustomers');
  let obj = await obj0.data;
  if (obj) {
    for (let i = 0, len = obj.customerInformation.length; i < len; ++i) {
      if (obj.customerInformation[i]._id == customerId) {
        --obj.customerInformation[i].changedMails;
        break;
      }
    }
    obj0.data = obj;
    cache.set('GetCustomers', obj0);
  }
}
