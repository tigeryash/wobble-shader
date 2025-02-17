//uniforms
uniform vec3 uColorA;
uniform vec3 uColorB;

// varying vec2 vUv;
 varying float vWobble;

void main() {
    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    // csm_Metalness = step(.0, sin(vUv.x * 100.0 + .5));
     csm_Roughness = 1.0 - colorMix;
    // csm_DiffuseColor.rgb = vec3(1.0, .5, .1);
}