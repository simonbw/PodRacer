precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float radius;
uniform float scale;
uniform float intensity;
uniform vec2 startPoint;
uniform vec2 endPoint;
uniform vec3 color;

/**
 * Return the distance from a point to a line segment.
 * @param {vec2} v - First endpoint of line segment
 * @param {vec2} w - First endpoint of line segment
 * @param {vec2} p - The other point
 */
float dist_point_to_segment(vec2 v, vec2 w, vec2 p) {
  // Return minimum distance between line segment vw and point p
  float segmentLength = distance(v, w);
  if (v == w) {
    return float(distance(v, p));
  }

  // Consider the line extending the segment, parameterized as v + t (w - v).
  // We find projection of point p onto the line.
  // It falls where t = [(p-v) . (w-v)] / |w-v|^2
  float t = dot(p - v, w - v) / (segmentLength * segmentLength);
  if (t < 0.0) { // Beyond the 'v' end of the segment
    return float(distance(p, v));
  } else if (t > 1.0) { // Beyond the 'w' end of the segment
    return float(distance(p, w));
  } // Projection falls on the segment
  return float(distance(p, v + t * (w - v)));
}

void main(void)
{
    float r = scale * radius;
    float d = dist_point_to_segment(startPoint, endPoint, gl_FragCoord.xy);
    d = d * d;
    float brightness = clamp(intensity * (1.0 - d / r), 0.0, 1.0);
    gl_FragColor.rgb = color * brightness;
}