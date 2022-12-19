/**
 * Contians helper functions for reading and writing prefab JSON.
 * 
 * Is capable of reading version `0` of prefabJson
 */

import {Scene} from '../Scene';
import {GameObject} from '../GameObject';
import { deserialize } from '../serialization';
// import {AssetLoader} from "asset-loader";
import { Prefab, PrefabOptions } from '../types/prefab/Prefab.type';
import { PrefabAssetDefinition, PrefabComponentDefinition, PrefabGameObjectDefinition, PrefabModuleDefinition } from '../types/prefab';
import { AssetLoader } from 'asset-loader';


 /**
  * Builds a GameObject from a prefab
  * @param {Object} prefabJson prefab to hydrate
  * @param {Object} options options Object
  * @returns {GameObject} hydrated GameObject
  */
export function buildGameObjectFromPrefab(prefabJson: Prefab, options: PrefabOptions) {

    // @TODO validate modules

    if (prefabJson.assets) {
        loadAssets(prefabJson.assets);
    }

    let root = buildGameObjectTree(prefabJson.root, prefabJson.scene, options);

    return root;
}

function buildGameObjectTree(rootJson: PrefabGameObjectDefinition, scene = false, options: PrefabOptions) {
    const BaseClass = scene ? Scene : GameObject;
    let toRet = new BaseClass({
        name: rootJson.name,
        group: rootJson.group,
        id: rootJson.id,
    });

    if (rootJson.children && rootJson.children.length) {
        for (const child of rootJson.children) {
            _buildGameObjectTreeHelper(child, toRet, options);
        }
    }

    if (rootJson.components && rootJson.components.length) {
        _buildGameObjectComponents(rootJson.components, toRet, options);
    }

    
    return toRet;
}

function _buildGameObjectTreeHelper(json: PrefabGameObjectDefinition, parent: GameObject | Scene, options: PrefabOptions) {
    let toRet = new GameObject({
        name: json.name,
        id: json.id,
        group: json.group,
        parent: parent
    });

    parent.attachGameObject(toRet);

    if (json.children && json.children.length) {
        for (const child of json.children) {
            _buildGameObjectTreeHelper(child, toRet, options);
        }
    }

    if (json.components && json.components.length) {
        _buildGameObjectComponents(json.components, toRet, options);
    }

    return toRet;
}

function _buildGameObjectComponents(componentJson: PrefabComponentDefinition[], gameObject: GameObject, options: PrefabOptions) {
    // @TODO this should go into the serialization part of the engine and build the components that are to be added
    if (componentJson && Array.isArray(componentJson)) {
        for (const compItem of componentJson) {
            try {
                const component = deserialize(compItem);
                gameObject.attachComponent(component);
            } catch (err) {
                console.error(err);
                if (!options.ignoreErrors) {
                    throw err;
                }
            }
        }
    }
}

function loadAssets(assetArr: PrefabAssetDefinition[]) {
    // @TODO should call out into the asset loader to load the assets used in this prefab if they are not already loaded
    if (assetArr && Array.isArray(assetArr)) {
        for (const assetItem of assetArr) {
            AssetLoader.load({...assetItem});
        }
    }
}

function _loadExtraData(extraJson: object, assets: PrefabAssetDefinition[], gameObjects: GameObject[]) {

}

function validateModules(moduleArr: PrefabModuleDefinition[]) {

}

