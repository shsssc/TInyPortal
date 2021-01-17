import {TriangleBasedShape} from "./TriangleBasedShape";

export class Cube extends TriangleBasedShape {
    constructor() {
        super();
        this.vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            1, 1, 0,
            0, 1, 0,
            1, 0, 0,
        ]);
        console.assert(this.vertices.length%3===0);
        this.colorAllFaces([1,0,1]);
    }
}