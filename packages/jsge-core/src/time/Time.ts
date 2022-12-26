import { TARGET_MILLIS_PER_FRAME as target } from "./const";
import { EngineTimeInterface } from "../engine/EngineTimeInterface";

export class Time {
    public static readonly TARGET_MILLIS_PER_FRAME = target;

    public static getTime() {
        return EngineTimeInterface.getTime();
    }

    public static get paused() {
        return EngineTimeInterface.paused;
    }

    public static get deltaTime() {
        return EngineTimeInterface.deltaTime;
    }
}