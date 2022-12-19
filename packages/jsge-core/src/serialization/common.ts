/**
 * contains common functions for serialization
 */

// Get Keys from a class
export function getKeys(classRef: any, blacklist: string[]): string[] {
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

    return keys as string[];
}