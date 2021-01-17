import {CameraMappedTexturedShape} from "./CameraMappedTexturedShape";
import {EYE, inverse, multiply} from "../m4";
import {RenderTargetTexture} from "../Texture/RenderTargetTexture";

export class Portal extends CameraMappedTexturedShape {

    /**
     *
     * @param s{RenderScene}
     * @param targetTransformationMatrix{Array}
     * @param textureScene {RenderScene||null}
     */
    constructor(s, targetTransformationMatrix, textureScene) {
        const texture = new RenderTargetTexture(textureScene || s);
        super(texture);
        this.textureScene = textureScene || s;
        this.texture = texture;
        targetTransformationMatrix = targetTransformationMatrix || EYE;
        this.vertices = new Float32Array([
            0, 0, 0,
            2, 0, 0,
            0, 2, 0,
            2, 2, 0,
            0, 2, 0,
            2, 0, 0,
        ]);
        this.targetLocation = (targetTransformationMatrix);
        this.forceRender = false;
        this.id = Math.floor(Math.random() * 100000);
    }

    /**
     *
     * @param scene {RenderScene}
     */
    init(scene) {
        super.init(scene);
    }

    /**
     *
     * @param scene {RenderScene}
     */
    draw(scene) {
        if (this.lock) return;
        renderCallStack.push(this.id);
        const gl = scene.gl;
        this.texture.cameraMatrix = multiply(multiply(scene.cameraMatrix, this.transformationMatrix), inverse(this.targetLocation));
        this.lock = true;
        //test code
        // Check query results here (will be from previous frame or earlier)
        const queryRecord = getQueryRecord(gl);
        let occluded = getQueryStatus(queryRecord, gl);
        if (!occluded || this.forceRender) {
            //console.log("portal is being updated: " + this.id );
            this.texture.bindFrameBuffer(scene);
            enableStencilWrite(gl);
            paintStencil(this, scene);
            useStencilMask(gl);
            this.texture.update();
            cleanUpStencil(gl);
            this.texture.unbindFrameBuffer(scene);
        }
        this.lock = false;

        if (!queryRecord.queryInProgress) {
            gl.beginQuery(gl.ANY_SAMPLES_PASSED, queryRecord.query);
            super.draw(scene);
            gl.endQuery(gl.ANY_SAMPLES_PASSED);
            queryRecord.queryInProgress = true;
        } else {
            super.draw(scene);
        }
        setBuffer(queryRecord);
        renderCallStack.pop();
    }


}

function enableStencilWrite(gl) {
    gl.clear(gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.STENCIL_TEST);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
    gl.stencilMask(0xFF);
}

function useStencilMask(gl) {
    gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    gl.stencilMask(0x00);
    //gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);//already done
    //use stack to mark that the parent render process IS using stencil to prevent child from ruining it
    stack.push(true)
}

function cleanUpStencil(gl) {
    gl.clear(gl.STENCIL_BUFFER_BIT);
    stack.pop();
    const flag = stack.pop();
    gl.disable(gl.STENCIL_TEST);
    if (flag) {
        gl.enable(gl.STENCIL_TEST);
    }
    stack.push(flag);
}

/**
 * get status of the query
 * @param buffer
 * @param gl {WebGL2RenderingContext}
 * @returns {boolean}
 */
function getQueryStatus(buffer, gl) {
    let occluded = true;
    if (buffer.queryInProgress && gl.getQueryParameter(buffer.query, gl.QUERY_RESULT_AVAILABLE)) {
        occluded = !gl.getQueryParameter(buffer.query, gl.QUERY_RESULT);
        buffer.queryInProgress = false;
    }
    return occluded;
}

/**
 * Paint portal to its texture scene stencil according to camera in scene
 * @param portal {Portal}
 * @param scene {RenderScene}
 */
function paintStencil(portal, scene) {
    const oldProjectionMatrix = portal.textureScene.projectionMatrix;
    portal.textureScene.projectionMatrix = scene.projectionMatrix;
    portal.textureScene.drawObject(portal);
    portal.textureScene.projectionMatrix = oldProjectionMatrix;
}

/**
 * lookup query record from queries.
 * @param gl {WebGL2RenderingContext}
 * @returns {{}|*}
 */
function getQueryRecord(gl) {
    const sum = renderCallStack.reduce((a, b) => 10*a + b, 0);
    if (queries[sum]) {
        return queries[sum];
    }
    const record = {};
    record.query = gl.createQuery();
    record.queryInProgress = false;
    //queries[sum] = record;
    return record;
}

function setBuffer(buffer) {
    const sum = renderCallStack.reduce((a, b) => 10 * a + b, 0);
    queries[sum] = buffer;
}

const stack = [];
const renderCallStack = [];
const queries = {};