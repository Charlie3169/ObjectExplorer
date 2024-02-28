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

    //Be able to invert the view between the two as you traverse infinity
    //At any level, your pov exists within a sphere containing other spheres. Some of these spheres may be completely contained by the outer one (subsets - moving further into specificity) or they may be completely containing your outer sphere (supersets - defining your current ontology). 
    //You can choose to look up(?) and move towards the formless (eventually reaching the empty set) or you can choose to look down towards the infinite expressions of form.

    //Objects are categorized by their nature and relationships to other objects and concepts. When every instance of a class of objects is contained by another, it would be a proper super/subset. An example would be if you were in the animal set, you would see every animal existing as child nodes.

    //If two sets had intersecting objects by were did not complete contain one another, this represents a kind of laterality. 
    //Going from animal -> cow represents a vertical move for example but going from horse -> unicorn is more like moving from side to side.

    //If two sets (A and B) have intersections, B would present from the view of A as a subset but after going within B, A would present as a subset of B, leading back to A.

    //To capture a specific relationship, such as cat [eats] mouse, it might look like a circle [eats] being viewable from with cat that leads to a collection of [eaten] objects which would contain mouse. If in the mouse node, you would see a circle [eaten by] leading to anything that would eat it.
    

    //Basically, there will be a few different modes of movement. One is movement between related objects, which may share intersections or commonalities ... (this is hard to pin down)

    //-vertical movement, locking in or removing concrete attributes (direction toggleable)
    //-horizontal movement, moving between possibilites and relationships (sort of like tangential thinking)
    //-complement movement, completeley flipping the world from everything that is to everything that isnt (should take on a different effect via vertical orientation)

    //Through combinations of movement styles, a user should be able to traverse the space of forms effortlessly to reach any point of possiblity


    constructor() {
        
    }

    addIntersection(){

    }

    removeIntersection(){
        
    }

}