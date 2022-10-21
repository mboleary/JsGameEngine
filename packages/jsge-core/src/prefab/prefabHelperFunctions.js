/**
 * Contians helper functions for reading and writing prefab JSON.
 * 
 * Is capable of reading version `0` of prefabJson
 */

import Scene from '../Scene';
import GameObject from '../GameObject';
import { deserialize } from '../serialization';
import {define} from "asset-loader/src/AssetLoader.js";

 /**
  * Builds a GameObject from a prefab
  * @param {Object} prefabJson prefab to hydrate
  * @param {Object} options options Object
  * @returns {GameObject} hydrated GameObject
  */
export function buildGameObjectFromPrefab(prefabJson, options) {

    // @TODO validate modules

    loadAssets(prefabJson.assets);

    let root = buildGameObjectTree(prefabJson.root, prefabJson.scene, options);

    return root;
}

function buildGameObjectTree(rootJson, scene = false, options) {
    const BaseClass = scene ? Scene : GameObject;
    let toRet = new BaseClass({
        name: rootJson.name,
        group: rootJson.group,
        id: rootJson.id,
    });

    if (rootJson.children && rootJson.children.length) {
        _buildGameObjectTreeHelper(rootJson.children, toRet, options);
    }

    if (rootJson.components && rootJson.components.length) {
        _buildGameObjectComponents(rootJson.components, toRet, options);
    }

    
    return toRet;
}

function _buildGameObjectTreeHelper(json, parent, options) {
    let toRet = new GameObject({
        name: json.name,
        id: json.id,
        group: json.group,
        parent
    });

    parent.attachGameObject(toRet);

    if (json.children && json.children.length) {
        _buildGameObjectTreeHelper(json.children, toRet, options);
    }

    if (json.components && json.components.length) {
        _buildGameObjectComponents(json.components, toRet, options);
    }

    return toRet;
}

function _buildGameObjectComponents(componentJson, gameObject, options) {
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

function loadAssets(assetArr) {
    // @TODO should call out into the asset loader to load the assets used in this prefab if they are not already loaded
    if (assetArr && Array.isArray(assetArr)) {
        for (const assetItem of assetArr) {
            define({...assetItem});
        }
    }
}

function _loadExtraData(extraJson, assets, gameObjects) {

}

function validateModules(moduleArr) {

}

