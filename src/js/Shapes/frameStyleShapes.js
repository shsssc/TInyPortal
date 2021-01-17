import {Shape} from "./Shape";

export class FrameStyleShapes extends Shape {
    drawMode="LINES";
    constructor() {
        super();
    }

    /**
     *
     * @param scene{RenderScene}
     */
    draw(scene) {
        const u =(scene.gl.getUniform(scene.defaultProgram, scene.textureFlagLocation));
        scene.gl.uniform1i(scene.textureFlagLocation, 0);
        scene.drawObject(this);
        scene.gl.uniform1i(scene.textureFlagLocation, u);
    }
}