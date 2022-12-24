/**
 * This interfaces with the time class to set values such as delta time and advancing time while paused for debugging
 */

import { Time } from "../time";

export class EngineTimeInterface extends Time {
    private static currTime = 0;

    /**
     * Initializes time
     */
    public static initTime() {
        this.currTime = window.performance.now();
    }

    /**
     * Advance time While paused for debugging
     * @param {Number} amt Amount to advance the time
     */
    public static advanceTime(amt: number) {
        if (!this.isPaused || !amt || amt <= 0) return;
        this.timePaused += amt;
    }

    /**
     * Updates the Delta Time
     */
    public static updateDeltaTime() {
        let prevTime = this.currTime;
        this.currTime = this.getTime();
        this._deltaTime = this.currTime - prevTime;
    }

    /**
     * Pause time for debugging
     */
    public static pauseTime() {
        this.isPaused = true;
        this.timePaused = window.performance.now();
    }
    
    /**
     * Unpause time for debugging
     */
    public static unpauseTime() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.timeDiff += window.performance.now() - this.timePaused;
        this.timePaused = 0;
    }
}