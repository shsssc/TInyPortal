import {TriangleBasedShape} from "./TriangleBasedShape";

export class TexturedShape extends TriangleBasedShape {
    textureMap = [];
    typeFlag=1;
    /**
     *
     * @param texture{Texture}
     */
    constructor(texture) {
        super();
        this.texture = texture;
    }

    /**
     * draw the object.
     * Note that we disallow recursive self draw.
     * @param scene
     */
    draw(scene) {
        if (this.lock) {
           return;
        }
        this.lock=true;
        const u =(scene.gl.getUniform(scene.defaultProgram, scene.textureFlagLocation));
        scene.gl.uniform1i(scene.textureFlagLocation, this.typeFlag);
        this.texture.enable(scene);
        scene.drawObject(this);
        scene.gl.uniform1i(scene.textureFlagLocation, u);
        this.lock=false;
        scene.gl.bindTexture(scene.gl.TEXTURE_2D, null);
    }

    init(scene) {
        super.init(scene);
        this.texture.init(scene);
    }
}