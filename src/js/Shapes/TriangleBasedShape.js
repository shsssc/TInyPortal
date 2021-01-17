import {Shape} from "./Shape";

export class TriangleBasedShape extends Shape {
    drawMode="TRIANGLES";
    constructor() {
        super();
    }
    draw(scene) {
        const u =(scene.gl.getUniform(scene.defaultProgram, scene.textureFlagLocation));
        scene.gl.uniform1i(scene.textureFlagLocation, this.typeFlag);
        scene.drawObject(this);
        scene.gl.uniform1i(scene.textureFlagLocation, u);
    }
}