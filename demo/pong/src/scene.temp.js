/**
 * Temporary file currently being used to initialize the main scene until Level 2 prefabs are implemented
 */

import { Scene, GameObject } from 'jsge-core';

import { BallScript } from './game/Ball.script';
import { PlayerScript } from "./game/Player.script";
import { PongBar } from './game/PongBar.renderscript';
import { PongBall } from './game/PongBall.renderscript';

import { TransformComponent, CameraViewportComponent } from 'jsge-module-graphics2d';
import { randInt } from './util';


/**
 * Define all assets used in the game
 */
export function defineAssets() {

}

export async function loadTitleScene() {
    const scene = new Scene();

    
}

export function loadGameScene() {
    const scene = new Scene();

    const leftPaddle = new GameObject();
    leftPaddle.name = "Left Paddle";
    const lp_scr = new PlayerScript();
    const lp_bar = new PongBar();
    const lp_tr = new TransformComponent();
    lp_tr.value.position.x = 5;
    lp_tr.value.position.y = 5;

    leftPaddle.attachComponent(lp_bar);
    leftPaddle.attachComponent(lp_scr);
    leftPaddle.attachComponent(lp_tr);

    scene.attachGameObject(leftPaddle);

    const rightPaddle = new GameObject();
    rightPaddle.name = "Right Paddle";
    // const rp_scr = new PlayerScript();
    const rp_bar = new PongBar();
    const rp_tr = new TransformComponent();
    rp_tr.value.position.x = 45;
    rp_tr.value.position.y = 5;

    // rightPaddle.attachComponent(rp_scr);
    rightPaddle.attachComponent(rp_bar);
    rightPaddle.attachComponent(rp_tr);

    scene.attachGameObject(rightPaddle);

    const ball = new GameObject();
    ball.name = "Ball";
    const b_scr = new BallScript();
    b_scr.speed = 5;
    const b_cir = new PongBall();
    b_cir.size = 50;
    b_cir.name = "ball_render";
    b_cir.trail = false;
    const b_tr = new TransformComponent();
    b_tr.value.position.x = 100;
    b_tr.value.position.y = 400;

    ball.attachComponent(b_scr);
    ball.attachComponent(b_cir);
    ball.attachComponent(b_tr);

    scene.attachGameObject(ball);

    const camera = new GameObject();
    camera.name = "camera";

    const c_cam = new CameraViewportComponent();
    camera.attachComponent(c_cam);

    const c_tr = new TransformComponent();
    camera.attachComponent(c_tr);

    scene.attachGameObject(camera);

    return scene;
}