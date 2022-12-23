import {EngineInternalModuleManager} from "./EngineInternalModuleManager";
import { Time, TARGET_MILLIS_PER_FRAME } from "../time";

export class EngineHotloopManager {
    private static _loopStarted: boolean = false;
    private static stopReference: number | null = null;
    private static loopFunctions: Function[] = [];

    public static get loopStarted(): boolean {
        return this._loopStarted;
    }

    /**
     * Starts the game loop if not already started
     */
    public static startLoop(): void {
        if (!this._loopStarted) {
            this._loopStarted = true;
            // @TODO set time as necessary
            this.loopFunctions = [...EngineInternalModuleManager.loopFunctions];
            this.main();
        }
    }

    public static stopLoop(): void {
        if (this._loopStarted && this.stopReference) {
            window.cancelAnimationFrame(this.stopReference);
            // @TODO pause game timer
        }
    }

    /**
     * Run the GameLoop Once
     * @param {Number} fakeDelta If provided, will set the deltaTime
     */
    public static stepLoop(fakeDelta: number): void {
        if (fakeDelta || fakeDelta === 0) {
            Time.advanceTime(fakeDelta);
        } else {
            Time.advanceTime(TARGET_MILLIS_PER_FRAME);
        }
        this.loop();
    }

    /**
     * This calls the hotloop and registers the callback for the next animation frame
     */
    private static main(): void {
        this.stopReference = window.requestAnimationFrame(this.main);
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
        // @TODO do time stuff here

        // @TODO handle script manager stuff here

        for (const func of this.loopFunctions) {
            func();
        }
    }
}