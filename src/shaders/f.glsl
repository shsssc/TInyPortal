// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

uniform int u_useTexture;
uniform sampler2D u_texture;

varying vec4 v_color;
varying vec4 v_position;
varying vec2 v_texcoord;
void main() {
    if (u_useTexture==0){
        gl_FragColor = v_color;
    }else if (u_useTexture==1){
        gl_FragColor = texture2D(u_texture, v_texcoord);
    }else{
        gl_FragColor =0.0*vec4(.15,.0,.0,.0)+texture2D(u_texture, 0.5*(v_position.xy/v_position.w)+0.5);
    }
}