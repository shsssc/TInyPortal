import {EYE, inverse, multiply, transformVector, translate, xRotate, yRotate} from "../m4";
import {AnimationManager} from "./AnimationManager";

export class WASDMovementManager extends AnimationManager {
    cameraX = 0;
    cameraY = 1;
    cameraZ = 4;

    cameraYaw = 0;
    cameraPitch = 0;

    update(scene, time) {
        if (!this.oldTime) this.oldTime = 0;
        const timediff = time - this.oldTime;
        this.oldTime = time;
        const [mouseX, mouseY] = scene.input.readMouseMove();
        const keymap = scene.input.readKeymap();
        let zmove = 0, xmove = 0;
        if (keymap.w) {
            zmove -= timediff / 700;
        }
        if (keymap.s) {
            zmove += timediff / 700;
        }
        if (keymap.a) {
            xmove -= timediff / 700;
        }
        if (keymap.d) {
            xmove += timediff / 700;
        }

        const makeRadius = r => {
            if (r < -Math.PI) return r + 2 * Math.PI;
            if (r > Math.PI) return r - 2 * Math.PI;
            return r;
        }
        this.cameraYaw = makeRadius(this.cameraYaw - mouseX / 1200);
        this.cameraPitch = makeRadius(this.cameraPitch - mouseY / 1200);
        this.cameraPitch = this.cameraPitch > Math.PI / 2.2 ? Math.PI / 2.2 : this.cameraPitch;
        this.cameraPitch = this.cameraPitch < -Math.PI / 2.2 ? -Math.PI / 2.2 : this.cameraPitch;
        const resultMove = transformVector(xRotate(yRotate(EYE, this.cameraYaw), this.cameraPitch),
            [xmove, 0, zmove, 1]);
        this.cameraX += resultMove[0];
        this.cameraY += resultMove[1];
        this.cameraZ += resultMove[2];
        scene.cameraMatrix = inverse(
            multiply(
                translate(EYE, this.cameraX, this.cameraY, this.cameraZ),
                xRotate(yRotate(EYE, this.cameraYaw), this.cameraPitch)));
        return false;
    }
}
