precision mediump float;

#define PI 3.1415926535897932384626433832795028842

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float intensity;
uniform float lightAngle;
uniform float radius;
uniform float scale;
uniform float spread;
uniform float spreadFuzz;
uniform vec2 center;
uniform vec3 color;

float square(float x) {
    return x * x;
}

void main(void)
{
    float r = scale * radius;
    vec2 offset = gl_FragCoord.xy - center;
    float offsetAngle = atan(offset.y, offset.x);
    float theta = abs(mod(lightAngle - offsetAngle + PI, 2.0 * PI) - PI);
    float fuzz = clamp((spread + spreadFuzz - theta) / (spreadFuzz), 0.0, 1.0);
    fuzz *= fuzz;
    float falloff = clamp(1.0 - length(offset) / r, 0.0, 1.0);
    falloff *= falloff;
    float brightness = clamp(fuzz * intensity * falloff, 0.0, 1.0);
    gl_FragColor.rgb = color * brightness;
}