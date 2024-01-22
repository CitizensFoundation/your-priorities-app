precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Varying
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vNormal;

void main(void) {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;
    vUV = uv;
    vPosition = position;
    vNormal = normal;
}
