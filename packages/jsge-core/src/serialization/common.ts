/**
 * contains common functions for serialization
 */

export function getConstructor(type) {
    return serialTypes[type] && serialTypes[type].classRef;
}

// Get Keys from a class
export function getKeys(classRef, blacklist) {
    // Construct the class
    let obj = new classRef();

    // Get Keys
    let keys = Reflect.ownKeys(obj);

    // Check against blacklist
    if (blacklist && blacklist.length > 0) {
        blacklist.forEach((blkey) => {
            let idx = keys.indexOf(blkey);
            if (idx >= 0) {
                keys.splice(idx, 1);
            }
        });
    }

    return keys;
}