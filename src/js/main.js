/* eslint-disable no-unused-vars */
import {EYE, multiply, scale3D, translate, yRotate,} from './m4';
import {RenderScene} from "./RenderScene";
import {ObjFileShape} from "./Shapes/ObjFileShape";
import {URLTexture} from "./Texture/URLTexture";
import {Portal} from "./Shapes/Portal";
import {PortalWASDMovement} from "./MovementMangers/PortalWASDMovement";

async function main() {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl2', {stencil: true});

    const s = new RenderScene(gl);
    const s1 = new RenderScene(gl, s);
    const s2 = new RenderScene(gl, s);


    const mm = new PortalWASDMovement();
    s.registerAnimationManager(mm);

    const island3 = await loadObj("island3.obj", "island3Color.png", 2);
    s.addObject(island3);
    s1.addObject(island3);
    island3.translate(10, -3, 3);

    const island2 = await loadObj("island2.obj", "island2Color.png", 2.5);
    s.addObject(island2);
    island2.translate(0, 0, 0);

    const inside = await loadObj("insideIsland2.obj", "island2Color.png", 2.5);
    s1.addObject(inside);
    inside.translate(0, 0, 0);

    const island1 = await loadObj("island1", "island1Color.png", 2);
    island1.translate(-5, 3, -3);
    s.addObject(island1);
    s1.addObject(island1);

    const room1 = await loadObj("rooms.obj", "roomColor.png", .5);
    s.addObject(room1);
    s1.addObject(room1);
    const star1 = await loadObj("star1.obj", "star1.png", .5);
    s.addObject(star1);
    s1.addObject(star1);
    star1.translate(0, 50, 0);
    room1.translate(0, 50, 0);

    const room2 = await loadObj("rooms.obj", "roomColor.png", .5);
    s.addObject(room2);
    s2.addObject(room2);
    const star2 = await loadObj("star2.obj", "star2.png", .5);
    s.addObject(star2);
    s2.addObject(star2);
    star2.translate(0, -50, 0);
    room2.translate(0, -50, 0);

    s.drawLoop();//this will start the render loop!
    const scale = .83;
    const scale1 = 1.47;
    const scale2 = .2;
    addPortalPair(s, scale3D(translate(EYE, .398, -.01, 4.62), -.25, .3, -.25), s, scale3D(translate(EYE, -4.95, 3, -3), .25 * scale, .3 * scale, .25 * scale), s, s);
    addPortalPair(s1, scale3D(translate(EYE, .398, -.01, 4.62), -.25, .3, -.25), s1, scale3D(translate(EYE, -4.95, 3, -3), .25 * scale, .3 * scale, .25 * scale), s1, s1);
    addPortalPair(s, scale3D(translate(EYE, 0, 0, -.4), .265, .265, .265), s, scale3D(translate(EYE, 0, 0, -4.344), .265, .265, .265), s1, s1);
    addPortalPair(s, scale3D(translate(EYE, .398, -0.02, -5.22), -.25, .25, -.25), s, scale3D(translate(EYE, 10.055, -3.02, 3.03), .25 * scale1, .25 * scale1, .25 * scale1), s, s1);

    addPortalPair(s, scale3D(translate(EYE, 9.25, -3, -3.035), scale2, scale2 * .7, scale2), s, scale3D(translate(EYE, -1, 50, 1), .5, .5 * .7, .5), s1, s1);

    addPortalPair(s,
        scale3D(translate(EYE, 0, 50, 0), .5, .5, .5),
        s,
        scale3D(translate(EYE, 0, -50, -0.0), .5, .5, .5),
        s2,
        s1);


    addPortalPair(s,
        scale3D(translate(EYE, 0, -50, 0.0), .5, .5, .5),
        s,
        scale3D(translate(EYE, 0, 50, 0.0), .5, .5, .5),
        s1,
        s2);

}


function addPortalPair(scene1, location1, scene2, location2, texScene1, texScene2) {
    texScene1 = texScene1 || scene1;
    texScene2 = texScene2 || scene2;
    const flipPortal = translate(yRotate(EYE, Math.PI), -2, 0, 0);
    const portal = new Portal(texScene1, location2);
    portal.transformationMatrix = location1;
    const portal2 = new Portal(texScene2, multiply(location1, flipPortal));
    portal2.transformationMatrix = multiply(location2, flipPortal);
    scene1.addObject(portal);
    scene2.addObject(portal2);
    if (texScene1) texScene1.addObject(portal);
    if (texScene2) texScene2.addObject(portal2);
    return [portal, portal2];
}

async function loadObj(model, texture, resizeFactor) {
    resizeFactor = resizeFactor || 1;
    const ut1 = new URLTexture("textures/" + texture);//texture
    return fetch('objs/' + model)
        .then(response => response.text()).then(House => {
            const fileShape1 = new ObjFileShape(House, ut1, resizeFactor);
            return fileShape1;
        });
}

main();
