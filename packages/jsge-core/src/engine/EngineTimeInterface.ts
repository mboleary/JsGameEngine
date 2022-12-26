/**
 * This interfaces with the time class to set values such as delta time and advancing time while paused for debugging
 */

import { TARGET_MILLIS_PER_FRAME as target } from "../time/const";

export class EngineTimeInterface {
    protected static timeDiff: number = 0; // Difference between the actual time, and what should be reported to the game
    protected static timePaused = 0;
    protected static isPaused = false;
    protected static _deltaTime: number = 0;
    protected static currTime = 0;

    public static readonly TARGET_MILLIS_PER_FRAME = target;

    public static getTime() {
        if (this.isPaused) return this.timePaused;
        return window.performance.now() - this.timeDiff;
    }
    
    public static get paused(): boolean {
        return this.isPaused;
    }

    public static get deltaTime(): number {
        return this._deltaTime;
    }

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