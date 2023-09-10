/**
 * Thoughts on how to build the 3D Set System
 * Use 1D Nonlinear functions from [0,1] or [-1,0,-1] to create a 3D environment 
 * that morphs in response the the location of the player point of view
 * 
 * 
 * double sphereRadius
 * 
 * Points should be far away initially and then smoothly accelerate towards them
 * 
 * Buttons to switch from looking outward from the current location (subset direction) and inward from the current location (superset direction)
 * -It could be flipped around, it has many food iterpretions 
 * 
 * Relative scale is based on how close the player direction is to the target direction (aka you can finely move towards specfic points)
 * 
 * 
 */




export default class SetContext {



    private subsetOf = new Set(); //The objects that completely encapsulate you
    private intersectsWith = new Set(); //The possibilities of being from your current location
    private supersetOf = new Set(); //The objects that you completely encapsulate

    constructor() {
        
    }

    addIntersection(){

    }

    removeIntersection(){
        
    }

}