/**
 * Definitions for a GameObject
 */

// import Transform from './Transform.js';
// import uuid from './UUID.js';
import {v4 as uuid} from "uuid";
import { ComponentBase } from "./ComponentBase";

const KEY_BLACKLIST = ["name", "group", "id", "parent", "children", "components"];

export type GameObjectConstructor = {
    name?: string;
    group?: string;
    id?: string;
    parent?: GameObject | null;
}

export class GameObject {
    public name: string;
    public group: string;
    readonly id: string;
    public parent: GameObject | null;
    public readonly children: GameObject[];
    // public components: ComponentBase[];
    private _initialized: boolean;
    private readonly _childrenIDs: Set<string>;
    // private readonly _componentIDs: Set<string>;
    private readonly _componentsByID: Map<string, ComponentBase> = new Map();
    private readonly _componentsByName: Map<string, ComponentBase[]> = new Map();
    private readonly _componentsByType: Map<string, ComponentBase[]> = new Map();

    constructor({name = "", group = "", id, parent = null}: GameObjectConstructor = {}) {
        // Public
        // this.transform = new Transform(); // Position, Rotation, and Scale Relative to Parent, if any
        
        this.name = name; // Name of the GameObject
        this.group = group; // Name of the Group the GameObject belongs to

        // Private @TODO find a way to trim out these variables from scripts
        this.id = id || uuid(); // This should be unique, as this is how the gameObject will be serialized
        // this.zIndex = 0; // Used for order of rendering in 2D @TODO remove
        // this.priority = 0; // Determines the priority of the scripts. @TODO remove
        this.parent = parent; // Contains reference to the Parent GameObject
        // this.deleteFlag = false; // True if the GameObject should be destroyed.
        this.children = []; // Child GameObjects whose transformation will be relative to that of this GameObject
        // this.components = []; // Components of the GameObject
        this._initialized = false;

        this._childrenIDs = new Set();
        // this._componentIDs = new Set();

        // this = {test: true};
    }

    public get components(): ComponentBase[] {
        return Array.from(this._componentsByID.values());
    }

    /**
     * Attaches a GameObject to this GameObject.
     * This does NOT initialize the gameobject or add it to the engine
     * @param {GameObject} go gameobject to attach
     */
    public attachGameObject(go: GameObject) {
        if (this._childrenIDs.has(go.id)) {
            console.warn("already has child", go);
            return;
        }
        this._childrenIDs.add(go.id);
        go.parent = this;
        this.children.push(go);
    }

    /**
     * Attaches a Component to this GameObject. This _does_ initialize the component if it hasn't already been initialized
     * @param {Component} comp component to attach
     */
    public attachComponent(comp: ComponentBase) {
        if (this._componentsByID.has(comp.id)) {
            console.warn("already has component", comp);
            return;
        }
        this._componentsByID.set(comp.id, comp);

        // Add to components by name
        if (this._componentsByName.has(comp.name)) {
            const arr = this._componentsByName.get(comp.name);
            arr && arr.push(comp);
        } else {
            this._componentsByName.set(comp.name, [comp]);
        }

        // Add to component by type
        if (this._componentsByType.has(comp.constructor.name)) {
            const arr = this._componentsByType.get(comp.constructor.name);
            arr && arr.push(comp);
        } else {
            this._componentsByType.set(comp.constructor.name, [comp]);
        }

        comp.gameObject = this;
        // this.components.push(comp);
        if (this._initialized) {
            console.log("comp added after init");
            comp._init();
        }
        // if (comp._attrName && !(comp._attrName in KEY_BLACKLIST)) {
        //     // @TODO this is hacky and it should be changed
        //     this[comp._attrName] = comp;
        //     comp._attrSet = true;
        // }
    }

    /**
     * Removes a Component already attached to this GameObject. Component will be destroyed when removed
     * @param {Component} comp component to destroy
     */
    public detachComponent(comp: ComponentBase) {
        const toDetach = this._componentsByID.get(comp.id);
        if (toDetach) {
            // for (let i = 0; i < this.components.length; i++) {
            //     let component = this.components[i];
            //     if (component.id === comp.id) {
            //         this.components.splice(i, 1);
            //         component._destroy();
            //         break;
            //     }
            // }
            // @TODO change this
            // if (comp._attrSet && !comp._attrName in KEY_BLACKLIST) {
            //     delete this[comp._attrName];
            // }

            toDetach.destroy();
            
            this._componentsByID.delete(toDetach.id);

            // Remove from names mapping
            const byNameArr = this._componentsByName.get(toDetach.name);
            if (byNameArr) {
                for (let i = 0; i < byNameArr.length; i++) {
                    const component = byNameArr[i];
                    if (component.id === toDetach.id) {
                        byNameArr.splice(i, 1);
                        break;
                    }
                }
            }

            // remove rom type mapping
            const byTypeArr = this._componentsByType.get(toDetach.constructor.name);
            if (byTypeArr) {
                for (let i = 0; i < byTypeArr.length; i++) {
                    const component = byTypeArr[i];
                    if (component.id === toDetach.id) {
                        byTypeArr.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Get a component by the ID
     * @param {string} id UUID of component to return
     * @returns {Component | null} specified component or null
     */
    public getComponentByID(id: string): ComponentBase | null {
        // for (let i = 0; i < this.components.length; i++) {
        //     let component = this.components[i];
        //     if (component.id === id) {
        //         return component;
        //     }
        // }
        // return null;

        return this._componentsByID.get(id) || null;
    }

    /**
     * Get a component by its name
     * @param {string} name name of the component
     * @returns {Component[] | null} specified component or null 
     */
    public getComponentByName(name: string): ComponentBase[] | null {
        // for (let i = 0; i < this.components.length; i++) {
        //     let component = this.components[i];
        //     if (component.name === name) {
        //         return component;
        //     }
        // }
        // return null;

        return this._componentsByName.get(name) || null;
    }

    /**
     * Returns a component by the typename
     * @param {string} typename type of component to return
     * @returns {Component[] | null} specified component
     */
    public getComponentByType(classRef: typeof ComponentBase): ComponentBase[] | null {
        console.log("getComponentByType:", classRef, classRef.name);
        return this._componentsByType.get(classRef.name) || null;
    }

    /**
     * Detaches a GameObject attached to this GameObject. Warning: This will make the child GameObject an orphan!
     * @param {GameObject} go gameobject to detach
     */
    public detachGameObject(go: GameObject) {
        go.parent = null;
        this._childrenIDs.delete(go.id);
        for (let i = 0; i < this.children.length; i++) {
            if (go.id === this.children[i].id) {
                this.children.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Returns true if the gameobject is a descendant of this gameobject
     * @param {GameObject} go 
     * @returns 
     */
    public hasGameObject(go: GameObject): boolean {
        let result = this._childrenIDs.has(go.id);
        if (!result) {
            for (const child of this.children) {
                result = child.hasGameObject(go);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }

    public hasComponent(comp: ComponentBase): boolean {
        return this._componentsByID.has(comp.id);
    }

    /**
     * Gets called to initialize the Components
     */
    public initialize(): void {
        if (this.components && this.components.length) {
            this.components.forEach((c) => {
                c._init();
            });
        }
        this._initialized = true;
    }

    /**
     * Gets called before this GameObject is deleted
     */
    public beforeDestroy(): void {
        if (this.components && this.components.length) {
            this.components.forEach((c) => {
                c._destroy();
            });
        }
    }
}