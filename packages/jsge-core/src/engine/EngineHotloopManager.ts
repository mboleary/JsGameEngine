import {EngineInternalModuleManager} from "./EngineInternalModuleManager";
import { Time, TARGET_MILLIS_PER_FRAME } from "../time";
import { EngineTimeInterface } from "./EngineTimeInterface";

export class EngineHotloopManager {
    private static time = EngineTimeInterface;

    private static _loopRunning: boolean = false;
    private static stopReference: number | null = null;
    private static loopFunctions: Function[] = [];

    public static get loopRunning(): boolean {
        return this._loopRunning;
    }

    /**
     * Starts the game loop if not already started
     */
    public static startLoop(): void {
        if (!this._loopRunning) {
            this._loopRunning = true;
            this.loopFunctions = [...EngineInternalModuleManager.loopFunctions];
            if (this.time.paused) {
                this.time.unpauseTime();
            } else {
                this.time.initTime();
            }
            this.main();
        }
    }

    public static stopLoop(): void {
        if (this._loopRunning && this.stopReference) {
            window.cancelAnimationFrame(this.stopReference);
            this._loopRunning = false;
            this.time.pauseTime();
        }
    }

    /**
     * Run the GameLoop Once
     * @param {Number} fakeDelta If provided, will set the deltaTime
     */
    public static stepLoop(fakeDelta: number): void {
        if (fakeDelta || fakeDelta === 0) {
            this.time.advanceTime(fakeDelta);
        } else {
            this.time.advanceTime(TARGET_MILLIS_PER_FRAME);
        }
        this.loop();
    }

    /**
     * This calls the hotloop and registers the callback for the next animation frame
     */
    private static main(): void {
        this.stopReference = window.requestAnimationFrame(this.main.bind(this));
        try {
            this.loop();
        } catch (err) {
            console.error("Error thrown in main loop:", err);
            this.stopLoop();
        }
    }

    /**
     * Runs all loop functions
     */
    private static loop(): void {
        this.time.updateDeltaTime();

        for (const func of this.loopFunctions) {
            func();
        }
    }
}