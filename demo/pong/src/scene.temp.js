/**
 * Temporary file currently being used to initialize the main scene until Level 2 prefabs are implemented
 */

import { define, load } from 'asset-loader';
import { Scene, GameObject } from 'jsge-core/src';

import { BallScript } from './game/Ball.script';
import { PlayerScript } from "./game/Player.script";
import { PongBar } from './game/PongBar.renderscript';
import { PongBall } from './game/PongBall.renderscript';

import { Transform } from 'jsge-module-graphics2d';


/**
 * Define all assets used in the game
 */
export function defineAssets() {

}

export async function loadTitleScene() {
    const scene = new Scene();

    
}

export async function loadGameScene() {
    const scene = new Scene();

    const leftPaddle = new GameObject();
    const lp_scr = new PlayerScript();
    const lp_bar = new PongBar();
    const lp_tr = new Transform();
    lp_tr.position.x = 5;
    lp_tr.position.y = 5;

    leftPaddle.attachComponent(lp_bar);
    leftPaddle.attachComponent(lp_scr);
    leftPaddle.attachComponent(lp_tr);

    scene.attachGameObject(leftPaddle);

    const rightPaddle = new GameObject();
    const rp_scr = new PlayerScript();
    const rp_bar = new PongBar();
    const rp_tr = new Transform();
    rp_tr.position.x = 45;
    rp_tr.position.x = 5;

    rightPaddle.attachComponent(rp_scr);
    rightPaddle.attachComponent(rp_bar);
    rightPaddle.attachComponent(rp_tr);

    scene.attachGameObject(rightPaddle);

    const ball = new GameObject();
    const b_scr = new BallScript();
    const b_cir = new PongBall();
    const b_tr = new Transform();
    b_tr.position.x = 95;
    b_tr.position.x = 5;

    ball.attachComponent(b_scr);
    ball.attachComponent(b_cir);
    ball.attachComponent(b_tr);

    scene.attachGameObject(ball);

    return scene;
}