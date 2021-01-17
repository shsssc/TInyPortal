import {Texture} from "./Texture";

export class GrayScaleTexture extends Texture{
    data = new Uint8Array([
        50,20,30,40,
        50,60,70,80,
        90,100,110,120,
        130,140,150,160,
        10,20,30,40,
        50,60,70,80,
        90,100,110,120,
        130,140,150,20,
    ]);
    width=4;
    height=8;

    constructor() {
        super();
    }

    /**
     * buffer the texture in scene.
     * @param scene {RenderScene}
     */
    init(scene){
        const gl = scene.gl;
        const texture = gl.createTexture();
        scene.buffers.set(this,texture);
        this.gl = gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.LUMINANCE;
        const border = 0;
        const format = gl.LUMINANCE;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, this.width, this.height, border,
            format, type, this.data);

        gl.generateMipmap(gl.TEXTURE_2D);
        // set the filtering so we don't need mips and it's not filtered
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    /**
     * enable texture in scene.
     * @param scene {RenderScene}
     */
    enable(scene) {
        scene.gl.bindTexture(scene.gl.TEXTURE_2D, scene.buffers.get(this));
    }
}