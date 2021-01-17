# Tiny Portal

A Web GL based rendering engine that support "portal" effects.

## Features

### Straight forward API

```javascript
 const canvas = document.querySelector('#canvas');
 const gl = canvas.getContext('webgl2', {stencil: true});
 const s = new RenderScene(gl);
 const mm = new PortalWASDMovement();
 s.registerAnimationManager(mm);
 const island1 = await loadObj("island1", "island1Color.png", 2);
 island1.translate(-5, 3, -3);
 s.addObject(island1);
 s.drawLoop();
```

### OBJ model import

```javascript
const island3 = await 
	loadObj("island3.obj", "island3Color.png", 2);//load obj with AJAX
s.addObject(island3);
```



![1](https://github.com/shsssc/TinyPortal/raw/main/images/1.gif?raw=true)



### "Portals"

![2](https://github.com/shsssc/TinyPortal/raw/main/images/2.gif?raw=true)

## Demo

The  [demo](https://shsssc.github.io/TinyPortal/dist/index.html) contains three islands inter-connected by portals. Click the screen to lock your mouse inside the browser and use "WASD" together with mouse to move in the scene.

Two visual effects implemented with portals are also demonstrated:

1. In the pink island, a tunnel through the mountain seems very long in the outside but is very short if travel from inside.
2. In the observatory island, inside the building, it seems that the square room is divided into four small rooms. However, moving inside, it will shows that there  are actually 8 rooms.

## Install

Run `npm install` to install dependencies.

## Usage

Please see "main.js" as an example of usage. The [demo](https://shsssc.github.io/TinyPortal/dist/index.html) shows the outcome of [main.js](https://github.com/shsssc/TinyPortal/blob/main/src/js/main.js). 

## License
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)

## Dependencies
- mat4.js library from: https://twgljs.org/docs/module-twgl_m4.html,
- dat.gui: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage

## Development Dependencies

- webpack: https://webpack.js.org/,
- Babel: https://babeljs.io/,
- ESLint: https://eslint.org/,
- webpack-webgl-boilerplate (toolchain template): https://github.com/obsoke/webpack-webgl-boilerplate

Note: there are also several citations in the code where we used sources.
