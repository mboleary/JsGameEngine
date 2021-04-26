/**
 * Adds some 2d utilities to use when rendering
 */

import { deg2rad } from "../Render.js";

let canvas = null;
let context = null;

function initTempCanvas() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
}

function