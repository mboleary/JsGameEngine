/**
 * This contains all code to initialize and manage the UI
 */

import { initializeWith2dContext, setCanvas } from './engine/Render.js';

export const canvas = document.getElementById('canvas');
export const overlay = document.getElementById('overlay');

let overlayVisible = false;

export function initUI() {
    setCanvas(canvas);
    resizeScreen();
    window.addEventListener("resize", resizeScreen);
    if (!overlayVisible) {
        overlay.setAttribute("hidden", "");
    } else {
        overlay.removeAttribute("hidden");
    }
    console.log("UI Initialized");
}

function resizeScreen(e) {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth);
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight);
    console.log("Screen:", width, height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    initializeWith2dContext();
}

export function toggleOverlay() {
    overlayVisible = !overlayVisible;
    if (!overlayVisible) {
        overlay.setAttribute("hidden", "");
    } else {
        overlay.removeAttribute("hidden");
    }
}