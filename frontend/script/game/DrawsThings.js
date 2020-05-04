/**
 * This is a test of a Renderable GameObject with RenderScripts
 */

import { Renderable } from "../engine/Render.js";
import GameObject from "../engine/GameObject.js";
import DrawsThingsBehavior from "./DrawsThingsBehavior.js";

export default class DrawsThings extends Renderable(GameObject) {
    constructor() {
        super();
        this.name = "Draws Things using the Canvas";
        this.attachScript(new DrawsThingsBehavior());
    }
}