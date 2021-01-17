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
	loadObj("island3.obj", "island3Color.png", 2);//load obj by AJAX
s.addObject(island3);
```



![1](images\1.gif)



### "Portals"



## Install

Run `npm install` to install dependencies.

## Usage

Please see "main.js" as an example of usage. The demo is also hosted at ...

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
