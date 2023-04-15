precision highp float;

// Varying
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vNormal;

// Gradient texture
uniform sampler2D gradientTexture;

void main(void) {
    // Calculate height-based color from the gradient texture
    // Adjust the range of the height values by scaling and biasing vPosition.y
    float scaledHeight = (vPosition.y + 25.0) / 50.0;
    vec4 color = texture2D(gradientTexture, vec2(scaledHeight, 0.5));

    // Set the final fragment color
    gl_FragColor = color;
}
