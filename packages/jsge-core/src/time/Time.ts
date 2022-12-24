export class Time {
    protected static timeDiff: number = 0; // Difference between the actual time, and what should be reported to the game
    protected static timePaused = 0;
    protected static isPaused = false;
    protected static _deltaTime: number = 0;

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
}