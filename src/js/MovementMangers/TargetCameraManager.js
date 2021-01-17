import {AnimationManager} from "./AnimationManager";
import dat from "dat.gui";
import {inverse, lookAt} from "../m4";

export class TargetCameraManager extends AnimationManager{
    cameraX=1;
    cameraY=1;
    cameraZ=3;
    targetX=0;
    targetY=0;
    targetZ=0;
    constructor() {
        super();
        setupGUI(this);
    }
    update(scene) {
        scene.cameraMatrix=inverse(lookAt([this.cameraX,this.cameraY,this.cameraZ],[this.targetX,this.targetY,this.targetZ],[0,1,0]));
    }
}
function setupGUI(s) {
    const gui = new dat.GUI();
    gui.add(s, 'cameraX', -10, 10);
    gui.add(s, 'cameraY', -10, 10);
    gui.add(s, 'cameraZ', -10, 10);
    gui.add(s, 'targetX', -3, 3);
    gui.add(s, 'targetY', -3, 3);
    gui.add(s, 'targetZ', -3, 3);
}
