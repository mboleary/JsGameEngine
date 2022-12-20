export class Time {
    private static timeDiff: number = 0; // Difference between the actual time, and what should be reported to the game
    private static timePaused = 0;
    private static isPaused = false;
    private static _deltaTime: number = 0;

    public static getTime() {
        if (this.isPaused) return this.timePaused;
        return window.performance.now() - this.timeDiff;
    }
    
    public static pauseTime() {
        this.isPaused = true;
        this.timePaused = window.performance.now();
    }
    
    /**
     * Advance time While paused for debugging
     * @param {Number} amt Amount to advance the time
     */
    public static advanceTime(amt: number) {
        if (!this.isPaused || !amt || amt <= 0) return;
        this.timePaused += amt;
    }
    
    public static unpauseTime() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.timeDiff += window.performance.now() - this.timePaused;
        this.timePaused = 0;
    }
    
    public static get paused(): boolean {
        return this.isPaused;
    }

    public static get deltaTime(): number {
        return this._deltaTime;
    }
}