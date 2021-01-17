import {TexturedShape} from "./TexturedShape";

export class ObjFileShape extends TexturedShape {
    constructor(objfile, texture,resizeFactor) {
        super(texture);
        resizeFactor=resizeFactor||0.001;
        [this.vertices, this.textureMap] = parseObjFile(objfile,resizeFactor);
        this.vertices = new Float32Array(this.vertices);
        this.textureMap = new Float32Array(this.textureMap);
    }
}


/**
 * parse obj file content
 * @param objFile {String}
 * @param resizeFactor {number}
 */
function parseObjFile(objFile,resizeFactor) {
    const lines = objFile.split("\n");
    let i = 0;
    const vertices = [];
    const texCoo = [];
    let vertexArr = [];
    let texMapArr = [];
    while (lines[i].substr(0, 2) !== "v ") i++;
    while (lines[i].substr(0, 2) === "v ") {
        vertices.push(lines[i].substr(2).split(" ").map((s) => parseFloat(s) * resizeFactor));
        i++;
    }
    while (lines[i].substr(0, 3) !== "vt ") i++;
    while (lines[i].substr(0, 3) === "vt ") {
        const tex=lines[i].substr(3).split(" ").map((s) => parseFloat(s)).slice(0, 2);
        const tex0=tex[0];
        const tex1=1-tex[1];
        texCoo.push([tex0,tex1]);
        i++;
    }
    while (lines[i].substr(0, 2) !== "f ") i++;
    while (lines[i].substr(0, 2) === "f ") {
        const line = lines[i].substr(2).split(" ").map(d => d.split("/"));
        const vertex = [line[0][0], line[1][0], line[2][0]].map(d => vertices[parseInt(d) - 1]).flat();
        const texture = [line[0][1], line[1][1], line[2][1]].map(d => texCoo[parseInt(d) - 1]).flat();
        vertex.map(d => vertexArr.push(d))
        texture.map(d => texMapArr.push(d))
        i++;
    }
    return [vertexArr, texMapArr];
}