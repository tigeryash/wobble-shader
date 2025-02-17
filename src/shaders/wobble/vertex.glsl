uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position){//this function is used to get the wobble value for the vertex meaning the vertex will move in the direction of the normal
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(position*uWarpPositionFrequency, uTime*uWarpTimeFrequency)) *uWarpStrength;
    
    return simplexNoise4d(vec4(warpedPosition * uPositionFrequency, uTime * uTimeFrequency))* uStrength;
}

void main() {//this shader is moving the vertex in the direction of the normal, tangent and biTangent
    vec3 biTangent = cross(normal, tangent.xyz);//biTangent is the cross product of the normal and the tangent

    //neightbouring vertices
    float shift = .01; //this is the distance between the neighbouring vertices
    //this is the position of the neighbouring vertices
    vec3 positionA = csm_Position + tangent.xyz * shift; //we are moving the vertex in the direction of the tangent
    vec3 positionB = csm_Position + biTangent * shift; //we are moving the vertex in the direction of the biTangent

    // csm_Position.y += sin(csm_Position.z * 3.0) * .5;
    float wobble = getWobble(csm_Position); //this is the wobble value for the current vertex
    csm_Position += wobble * normal; //we are moving the vertex in the direction of the normal
    positionA += getWobble(positionA) * normal; //we are moving the neighbouring vertex in the direction of the normal
    positionB += getWobble(positionB) * normal;

    //cmompute normal
    vec3 toA = normalize(positionA - csm_Position);//this is the direction from the current vertex to the neighbouring vertex
    vec3 toB = normalize(positionB - csm_Position);//we're normalizing the direction from the current vertex to the neighbouring vertex
    csm_Normal = cross(toA, toB);//we're computing the normal by taking the cross product of the direction from the current vertex to the neighbouring vertices
    //varyings
    // vUv = uv;
    vWobble = wobble /uStrength;

}