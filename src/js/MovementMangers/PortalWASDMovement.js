import {EYE, inverse, multiply, transformVector, translate, xRotate, yRotate} from "../m4";
import {AnimationManager} from "./AnimationManager";

export class PortalWASDMovement extends AnimationManager {
    cameraX = 0;
    cameraY = 1;
    cameraZ = 4;

    cameraYaw = 0;
    cameraPitch = 0;

    movementSpeed = 1.9;
    portals = null;

    update(scene, time) {
        const portals = scene.objects.filter(o => o.targetLocation);
        //here we find all candidates that we may pass
        const candidates = portals.filter(p => {
            const tform = inverse(p.transformationMatrix);
            const newPoint = transformVector(tform, [this.cameraX, this.cameraY, this.cameraZ, 1]);
            return nearPortal(newPoint) && newPoint[2] >= 0;
        })

        if (!this.oldTime) this.oldTime = 0;
        const timediff = time - this.oldTime;
        this.oldTime = time;

        scene.objects.map(obj=>obj.update&&obj.update(time,timediff));

        const [mouseX, mouseY] = scene.input.readMouseMove();
        const keymap = scene.input.readKeymap();
        let zmove = 0, xmove = 0;
        if (keymap.w) {
            zmove -= timediff / 1000 * this.movementSpeed;
        }
        if (keymap.s) {
            zmove += timediff / 1000 * this.movementSpeed;
        }
        if (keymap.a) {
            xmove -= timediff / 1000 * this.movementSpeed;
        }
        if (keymap.d) {
            xmove += timediff / 1000 * this.movementSpeed;
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
        //console.log(this.cameraX,this.cameraZ);
        for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            const tform = inverse(c.transformationMatrix);
            const newPoint = transformVector(tform, [this.cameraX, this.cameraY, this.cameraZ, 1]);

            if (nearPortal(newPoint) && newPoint[2] < 0) {
                [this.cameraX, this.cameraY, this.cameraZ] = transformVector(multiply(c.targetLocation, tform), [this.cameraX, this.cameraY, this.cameraZ, 1]);
                // eslint-disable-next-line no-unused-vars
                const [x, _, z] = transformVector(multiply(c.targetLocation, tform), [0, 0, 1, 0]);
                this.cameraYaw += Math.atan2(x, z);
                //todo pitch support not ready
                break;
            }
        }

        scene.cameraMatrix = inverse(
            multiply(
                translate(EYE, this.cameraX, this.cameraY, this.cameraZ),
                xRotate(yRotate(EYE, this.cameraYaw), this.cameraPitch)));
        return false;
    }
}

/**
 *
 * @param p{Number[]}
 */
function nearPortal(p) {
    return p[0] >= 0 && p[0] <= 2 && p[1] >= 0 && p[1] <= 2 && p[2] <= 0.2;
}