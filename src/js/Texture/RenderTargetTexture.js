import {Texture} from "./Texture";
import {multiply} from "../m4";

export class RenderTargetTexture extends Texture {
    /**
     *
     * @param targetScene{RenderScene}
     */
    constructor(targetScene) {
        super();
        this.targetScene = targetScene;
        this.cameraMatrix = undefined;
        this.update = this.update.bind(this);
        this.bindFrameBuffer = this.bindFrameBuffer.bind(this);
        this.unbindFrameBuffer=this.unbindFrameBuffer.bind(this);
    }

    /**
     * buffer the texture in scene.
     * @param scene {RenderScene}
     */
    init(scene) {
        this.cameraMatrix = scene.cameraMatrix;
        // create to render to
        const gl = scene.gl;
        const targetTextureWidth = gl.canvas.width;
        const targetTextureHeight = gl.canvas.height;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);

        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            targetTextureWidth, targetTextureHeight, border,
            format, type, data);

        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Create and bind the framebuffer
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

        // create a depth renderbuffer
        const depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

        // make a depth buffer and the same size as the targetTexture
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, targetTextureWidth, targetTextureHeight);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
        scene.buffers.set(this, {texture: targetTexture, frameBuffer: fb, depthBuffer: depthBuffer});
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * enable texture in scene.
     * @param scene {RenderScene}
     */
    enable(scene) {
        if (this.lock) return;
        const buffers = scene.buffers.get(this);
        const gl = scene.gl;
        gl.bindTexture(gl.TEXTURE_2D, buffers.texture);
    }

    bindFrameBuffer(scene){
        const buffers = scene.buffers.get(this);
        const fb = buffers.frameBuffer;
        const gl = scene.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        stack.push(fb);
    }

    unbindFrameBuffer(scene){
        const gl = scene.gl;
        stack.pop();
        const old = stack.pop();
        gl.bindFramebuffer(gl.FRAMEBUFFER, old);
        stack.push(old);
    }

    /**
     * recursively draw what's seen in the portal.
     */
    update() {
        if (this.lock) return;
        this.lock = true;
        if (!this.cameraMatrix) {
            this.targetScene.draw();
        } else {
            const oldCamera = this.targetScene.cameraMatrix;
            const oldProjection = this.targetScene.projectionMatrix;
            this.targetScene.cameraMatrix = this.cameraMatrix;
            this.targetScene.projectionMatrix = multiply(this.targetScene.perspectiveMatrix, this.cameraMatrix);
            this.targetScene.draw();
            this.targetScene.cameraMatrix = oldCamera;
            this.targetScene.projectionMatrix = oldProjection;
        }
        this.lock = false;
    }
}

const stack = [];