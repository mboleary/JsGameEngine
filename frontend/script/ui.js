/**
 * This contains all code to initialize and manage the UI
 */

export const canvas = document.getElementById('canvas');
const overlay = document.getElementById('overlay');

let overlayVisible = false;

export function initUI() {
    resizeScreen();
    window.addEventListener("resize", resizeScreen);
    overlay.setAttribute("hidden", overlayVisible);
    console.log("UI Initialized");
}

function resizeScreen(e) {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth);
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight);
    console.log("Screen:", width, height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
}

export function toggleOverlay() {
    overlayVisible = !overlayVisible;
    overlay.setAttribute("hidden", overlayVisible);
}