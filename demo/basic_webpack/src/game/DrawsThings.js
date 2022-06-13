/**
 * This is a test of a Renderable GameObject with RenderScripts
 */

import GameObject from "jsge-core/src/GameObject.js";

import DrawsThingsBehavior from "./DrawsThingsBehavior.js";

export default function drawsThingsFactory() {
    let toRet = new GameObject({
        name: "Draws Things using the Canvas"
    });

    toRet.attachComponent(new DrawsThingsBehavior());

    return toRet;
}