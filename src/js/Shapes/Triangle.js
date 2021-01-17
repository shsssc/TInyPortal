import {TriangleBasedShape} from "./TriangleBasedShape";

export class Triangle extends TriangleBasedShape {
    constructor() {
        super();
        this.vertices = new Float32Array([
            1, 1, 0,
            3, 0, 1,
            0, 3, 1,
        ]);
        console.assert(this.vertices.length % 3 === 0);
        this.colorAllFaces([1, 0, 1]);
    }
}