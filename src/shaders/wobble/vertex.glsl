#include ../includes/simplexNoise4d.glsl

void main() {
    // csm_Position.y += sin(csm_Position.z * 3.0) * .5;
    float wobble = simplexNoise4d(vec4(csm_Position, 0.0));

    csm_Position += wobble * normal;

    //varying
    // vUv = uv;
}