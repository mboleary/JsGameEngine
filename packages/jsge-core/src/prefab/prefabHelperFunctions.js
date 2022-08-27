/**
 * Contians helper functions for reading and writing prefab JSON.
 * 
 * Is capable of reading version `0` of prefabJson
 */

import Scene from '../Scene';
import GameObject from '../GameObject';

 /**
  * Builds a GameObject from a prefab
  * @param {Object} prefabJson prefab to hydrate
  * @param {Object} options options Object
  * @returns {GameObject} hydrated GameObject
  */
export async function buildGameObjectFromPrefab(prefabJson, options) {

    // @TODO validate modules

    await loadAssets(prefabJson.assets);

    let root = buildGameObjectTree(prefabJson.root, prefabJson.scene);

    return root;
}

function buildGameObjectTree(rootJson, scene = false) {
    const BaseClass = scene ? Scene : GameObject;
    let toRet = new BaseClass({
        name: rootJson.name,
        group: rootJson.group,
        id: rootJson.id,
    });

    if (json.children) {
        toRet.children = _buildGameObjectTreeHelper(json.children, toRet);
    }

    if (json.components) {
        toRet.components = _buildGameObjectComponents(json.components, toRet);
    }

    
    return toRet;
}

function _buildGameObjectTreeHelper(json, parent) {
    let toRet = new GameObject({
        name: json.name,
        id: json.id,
        group: json.group,
        parent
    });

    if (json.children) {
        toRet.children = _buildGameObjectTreeHelper(json.children, toRet);
    }

    if (json.components) {
        toRet.components = _buildGameObjectComponents(json.components, toRet);
    }

    return toRet;
}

function _buildGameObjectComponents(componentJson, gameObject) {
    // @TODO this should go into the serialization part of the engine and build the components that are to be added
}

function loadAssets(assetArr) {
    // @TODO should call out into the asset loader to load the assets used in this prefab if they are not already loaded
}

function _loadExtraData(extraJson, assets, gameObjects) {

}

function validateModules(moduleArr) {

}

