import {FrameStyleShapes} from "./frameStyleShapes";

export class CubeFrame extends FrameStyleShapes {
    constructor() {
        super();
        this.vertices = new Float32Array([
            0, 0, 0,
            0, 1, 0,
            0, 0, 0,
            1, 0, 0,
            1, 1, 0,
            1, 0, 0,
            1, 1, 0,
            0, 1, 0,
        ]);
        //console.assert(this.vertices.length % 2 === 0);
        this.colorAllFaces([.1, 1, .1]);
    }

}