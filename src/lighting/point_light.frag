precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float radius;
uniform float scale;
uniform float intensity;
uniform vec2 center;
uniform vec3 color;

float square(float x) {
    return x * x;
}

void main(void)
{
    float r = scale * radius;
    vec2 offset = gl_FragCoord.xy - center;
    float falloff = square(clamp(1.0 - length(offset) / r, 0.0, 1.0));
    float brightness = clamp(intensity * falloff, 0.0, 1.0);
    gl_FragColor.rgb = color * brightness;
}