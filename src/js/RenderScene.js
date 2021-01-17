import {createProgram, createShader, resizeCanvasToDisplaySize} from "./utils";
import vertexShaderSource from "shaders/v.glsl";
import fragmentShaderSource from "shaders/f.glsl";
import {multiply, perspective, transformVector} from "./m4";
import {UserInput} from "./UserInput";

export class RenderScene {
    objects = [];
    farCutoff = 30;
    /**
     *
     * @type {AnimationManager}
     */
    animationManager = null;
    /**
     *
     * @type {WeakMap<(Shape|Texture), any>}
     */
    buffers = new WeakMap();
    cameraMatrix;

    /**
     *
     * @param gl {WebGL2RenderingContext}
     */
    constructor(gl, secondaryScene) {
        this.draw = this.draw.bind(this);
        this.drawLoop = this.drawLoop.bind(this);
        this.drawObject = this.drawObject.bind(this);
        this.addObject = this.addObject.bind(this);
        this.gl = gl;
        if (!secondaryScene) {
            this.input = new UserInput(gl.canvas);
            resizeCanvasToDisplaySize(gl.canvas, 2);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            this.defaultProgram = createProgram(gl, vertexShader, fragmentShader);
            gl.useProgram(this.defaultProgram);
        } else {
            this.input = secondaryScene.input;
            this.defaultProgram = secondaryScene.defaultProgram;
        }

        this.matrixLocation = gl.getUniformLocation(this.defaultProgram, 'u_matrix');
        this.textureLocation = gl.getUniformLocation(this.defaultProgram, 'u_texture');
        this.textureFlagLocation = gl.getUniformLocation(this.defaultProgram, 'u_useTexture');
        this.positionLocation = gl.getAttribLocation(this.defaultProgram, 'a_position');
        this.colorLocation = gl.getAttribLocation(this.defaultProgram, 'a_color');
        this.textureMapLocation = gl.getAttribLocation(this.defaultProgram, 'a_texcoord');
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        this.perspectiveMatrix = perspective(Math.PI / 4, aspect, 0.0005, this.farCutoff);
    }

    /**
     *
     * @param obj{Shape}
     */
    addObject(obj) {
        obj.init(this);
        this.objects.push(obj);
    }

    drawLoop(time) {
        if (this.animationManager) {
            const shouldStop = this.animationManager.update(this, time);
            if (shouldStop) return;
        }


        this.draw()
        requestAnimationFrame(this.drawLoop);
    }

    draw() {
        this.projectionMatrix = multiply(this.perspectiveMatrix, this.cameraMatrix);
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < this.objects.length; i++) {
            const c = this.objects[i];
            c.draw(this);
        }
    }

    /**
     * draw one simple object in the scene
     * @param c {Shape}
     */
    drawObject(c) {
        const gl = this.gl;
        //const program = this.defaultProgram;
        const buffers = this.buffers.get(c);
        if(this.cameraMatrix){
            const vector = transformVector(this.cameraMatrix,[c.transformationMatrix[12],c.transformationMatrix[13],c.transformationMatrix[14],1]);
            //console.log(vector);
            if(vector[0]*vector[0]+vector[1]*vector[1]+vector[3]*vector[3]>this.farCutoff**2){
                return;
            }
        }
        const matrix = multiply(this.projectionMatrix, c.transformationMatrix);
        //const textureFlag = c.textureMap && c.textureMap.length > 0;

        gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
        //gl.uniform1i(this.textureFlagLocation, textureFlag);
        gl.uniform1i(this.textureLocation, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureMapBuffer);
        gl.enableVertexAttribArray(this.textureMapLocation);
        gl.vertexAttribPointer(this.textureMapLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl[c.drawMode], 0, c.vertices.length);
    }

    /**
     *
     * @param mm{AnimationManager}
     */
    registerAnimationManager(mm) {
        this.animationManager = mm;
        mm.init(this);
    }
}