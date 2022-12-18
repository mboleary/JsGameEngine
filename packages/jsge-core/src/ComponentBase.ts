/**
 * Contains the component class
 */

import {v4 as uuid} from "uuid";
import {GameObject} from "./GameObject";

const PREFIX = "comp-";

export type ComponentContructors = {
    name?: string;
    gameObject?: GameObject;
    attribute?: string | null;
}

export abstract class ComponentBase {

    public name: string;
    readonly id: string;
    public gameObject: GameObject | null;
    readonly _attrName: string | null;
    public _attrSet: boolean; // @TODO remove this and find a better way
    
    constructor({name, gameObject, attribute = null}: ComponentContructors = {}) {
        this.id = PREFIX + uuid();
        this.name = name || "";
        this.gameObject = gameObject || null;
        this._attrName = attribute; // Name of attribute that will be created on the GameObject
        this._attrSet = false; // true when the attribute has been set successfully
    }

    /**
     * Function called when Component initialized
     */
    abstract _init(): void;

    /**
     * Public-facing function for component initialization
     */
    abstract init(): void

    /**
     * Function called when component is destroyed
     */
    abstract _destroy (): void;

    /**
     * Public-facing function for component destruction
     */
    abstract destroy(): void;
}