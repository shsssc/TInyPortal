import {EYE, multiply, scale3D, translate, xRotate, yRotate, zRotate} from "../m4";

export class Shape {
    vertices = [];
    colors = [];
    textureMap = [];
    transformationMatrix = EYE;
    drawMode = "unknown";
    typeFlag = 0;

    constructor() {
        this.colorAllFaces = this.colorAllFaces.bind(this);
        this.draw = this.draw.bind(this);
        this.init = this.init.bind(this);
        this.translate = this.translate.bind(this);
        this.rotateX = this.rotateX.bind(this);
        this.rotateY = this.rotateY.bind(this);
        this.rotateZ = this.rotateZ.bind(this);
        this.scale=this.scale.bind(this);
    }

    /**
     *  give each vertex a color.
     * @param color
     */
    colorAllFaces(color) {
        this.colors = [];
        for (let i = 0; i < this.vertices.length; i++) {
            this.colors = this.colors.concat(color);
        }
        this.colors = new Float32Array(this.colors);
    }

    /**
     *
     * @param scene{RenderScene}
     */
    draw(scene) {
        scene.drawObject(this);
    }

    /**
     *
     * @param scene {RenderScene}
     */
    init(scene) {
        const gl = scene.gl;
        const result = {};
        result.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, result.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        result.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, result.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
        result.textureMapBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, result.textureMapBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureMap, gl.STATIC_DRAW);
        scene.buffers.set(this, result);
    }

    translate(x, y, z) {
        this.transformationMatrix = multiply(translate(EYE, x, y, z), this.transformationMatrix);
    }

    rotateX(angle) {
        this.transformationMatrix = multiply(xRotate(EYE, angle), this.transformationMatrix);
    }

    rotateY(angle) {
        this.transformationMatrix = multiply(yRotate(EYE, angle), this.transformationMatrix);
    }

    rotateZ(angle) {
        this.transformationMatrix = multiply(zRotate(EYE, angle), this.transformationMatrix);
    }

    scale(x, y, z) {
        this.transformationMatrix = multiply(scale3D(EYE, x, y, z), this.transformationMatrix);
    }

}