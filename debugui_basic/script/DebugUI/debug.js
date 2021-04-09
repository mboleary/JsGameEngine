// Manages Custom Debug Interfaces for the game

let instances = {};

export function debug(constructor, options) {
    if (!window.CONFIG.debug) return false;
    if (options && Object.keys(options).length > 0) {
        instances[constructor.name] = options;
    }
}
