import { GameObject } from "../GameObject";
import { Scene } from "../Scene";

type Encapsulate<T> = {
    arr: T[];
}

export class EngineGameObjectManager {
    private static currentScene: Scene;
    private static gameObjects: Map<string, GameObject> = new Map();
    private static gameObjectsByName: Map<string, GameObject[]> = new Map();
    private static gameObjectsByGroup: Map<string, GameObject[]> = new Map();

    public static setCurrentScene(scene: Scene) {
        let oldScn = this.currentScene;
        this.currentScene = scene;
        this.deleteGameObject(oldScn);
        this.enrollGameObject(scene);
    }

    public static getCurrentScene(): Scene {
        return this.currentScene;
    }

    public static enrollGameObject(go: GameObject) {
        if (!go) return;
        // Check for ID
        if (this.gameObjects.has(go.id)) return;
        let toInitScripts: Encapsulate<GameObject> = {arr:[]};
        // Attach to the current Scene, unless we are attaching the scene itself or it's already been attached somewhere!
        if (go.id !== this.currentScene.id && !this.currentScene.hasGameObject(go)) {
            this.currentScene.attachGameObject(go);
        }
        this.enrollGameObjectHelper(go, toInitScripts);
        // initGameObjectScripts(toInitScripts.arr);
        for (const gameObject of toInitScripts.arr) {
            gameObject.initialize();
        }
        // go.initialize();
    }

    /**
     * Enrolls the Children, as well as the parent GameObject
     * @param {GameObject} go GameObject to enroll
     * @param {Object} refArr Reference Array encapsulated by an object to add all of the references to the added GOs to
     */
    private static enrollGameObjectHelper(go: GameObject, refArr: Encapsulate<GameObject>) {
        if (!refArr || refArr.arr === undefined) return;
        if (this.gameObjects.has(go.id)) return;
        refArr.arr.push(go); // Reference Array of things to Initialize
        this.gameObjects.set(go.id, go);

        // Add to Group Name List
        let groupArr;
        if (this.gameObjectsByGroup.has(go.group)) {
            groupArr = this.gameObjectsByGroup.get(go.group);
        } else {
            groupArr = [] as GameObject[];
            this.gameObjectsByGroup.set(go.group, groupArr);
        }

        if (groupArr) {
            groupArr.push(go);
        }

        // Add to GameObject Name List
        let nameArr;
        if (this.gameObjectsByName.has(go.name)) {
            nameArr = this.gameObjectsByName.get(go.name)
        } else {
            nameArr = [] as GameObject[];
            this.gameObjectsByName.set(go.name, nameArr);
        }

        if (nameArr) {
            nameArr.push(go);
        }

        // Add the children
        if (go.children && go.children.length > 0) {
            go.children.forEach((child) => {
                this.enrollGameObjectHelper(child, refArr);
            });
        }
        return refArr;
    }

    public static deleteGameObject(go: GameObject) {
        if (!go) return;
        if (!this.gameObjects.has(go.id)) return;

        // Delete Entry in Map
        const toDel = this.gameObjects.get(go.id);
        if (!toDel) return; // Item was not found
        this.gameObjects.delete(go.id);

        // Delete from name array
        const goNameArr = this.gameObjectsByName.get(toDel.name);
        if (goNameArr) {
            for (let i = 0; i < goNameArr.length; i++) {
                if (goNameArr[i]?.id === go.id) {
                    goNameArr.splice(i, 1);
                    break;
                }
            }
        }

        // delete from group array
        const goGroup = this.gameObjectsByName.get(toDel.group);
        if (goGroup) {
            for (let i = 0; i < goGroup.length; i++) {
                if (goGroup[i]?.id === go.id) {
                    goGroup.splice(i, 1);
                    break;
                }
            }
        }

        // Let GameObject know that it's about to be destroyed
        toDel.beforeDestroy();


        // Delete Parent's child reference (if any)
        if (toDel.parent != null && toDel.parent.children && toDel.parent.children.length) {
            let found = false;
            for (let i = 0; i < toDel.parent.children.length; i++) {
                let item = toDel.parent.children[i];
                if (item.id === go.id) {
                    toDel.parent.children.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.warn("Warning: gameObject not found in parent!", go.id, toDel.parent);
            }
        }

        // Delete the Children from the Array
        if (toDel.children && toDel.children.length) {
            let idsToFind: Encapsulate<GameObject> = {arr:[]}; // Encapsulating in a Object to get Pass by reference
            for (let i = 0; i < toDel.children.length; i++) {
                this.getChildIDs(toDel.children[i], idsToFind);
            }
            // Remove Children from maps
            for (let i = 0; i < idsToFind.arr.length; i++) {
                const childToDel = idsToFind.arr[i];
                this.gameObjects.delete(childToDel.id);

                // Delete from name array
                const goNameArr = this.gameObjectsByName.get(childToDel.name);
                if (goNameArr) {
                    for (let i = 0; i < goNameArr.length; i++) {
                        if (goNameArr[i]?.id === childToDel.id) {
                            goNameArr.splice(i, 1);
                            break;
                        }
                    }
                }

                // delete from group array
                const goGroup = this.gameObjectsByName.get(childToDel.group);
                if (goGroup) {
                    for (let i = 0; i < goGroup.length; i++) {
                        if (goGroup[i]?.id === childToDel.id) {
                            goGroup.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            // Find in the GameObject Array and remove
            for (const childGameObject of idsToFind.arr) {
                childGameObject.beforeDestroy();
                this.gameObjects.delete(childGameObject.id);
            }
        }
    }

    /**
     * Gets the IDs of all of the children
     * @param {GameObject} go GameObject to get the IDs of
     * @param {Object} idArr reference to an object encapsulating an array that the IDs will be added to
     */
    private static getChildIDs(go: GameObject, idArr: Encapsulate<GameObject>) {
        if (!idArr || idArr.arr === undefined) return;
        // let toRet = [];
        idArr.arr.push(go);
        if (go.children && go.children.length) {
            go.children.forEach((child) => {
                this.getChildIDs(child, idArr);
            });
        }
        return idArr.arr;
    }

    // Returns a reference to the GameObject by ID
    public static getGameObjectByID(id: string) {
        return this.gameObjects.get(id) || null;
    }

    // Return Gameobjects by name
    public static getGameObjectByName(name: string) {
        return this.gameObjectsByName.get(name) || null;
    }

    // Return Gameobjects by group
    public static getGameObjectByGroup(group: string) {
        return this.gameObjectsByGroup.get(group) || null;
    }
}