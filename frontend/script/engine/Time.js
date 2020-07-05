/**
 * Contains all functions related to getting time. Also provides methods for pausing time for debugging.
 */

let timeDiff = 0; // Difference between the actual time, and what should be reported to the game
let timePaused = 0;
let isPaused = false;

/**
 * Get the current Game Time
 */
export function getTime() {
    if (isPaused) return timePaused;
    return window.performance.now() - timeDiff;
}

export function pauseTime() {
    isPaused = true;
    timePaused = window.performance.now();
}

/**
 * Advance time While paused for debugging
 * @param {Number} amt Amount to advance the time
 */
export function advanceTime(amt) {
    if (!isPaused || !amt || amt <= 0) return;
    timePaused += amt;
}

export function unpauseTime() {
    if (!isPaused) return;
    isPaused = false;
    timeDiff += window.performance.now() - timePaused;
    timePaused = 0;
}