import { Object3D } from "three";
import * as THREE from 'three';


export default class DataObject3D extends Object3D {    
    jsonData: JSON;

    constructor(jsonData: any, object: THREE.Object3D) {
        super();
        this.jsonData = jsonData;
        this.add(object);
    }
}

/**
//Approach 2
export default class DataObject3D extends Object3D {    
    jsonId: string;


    constructor(jsonId: string, object: THREE.Object3D) {
        super();
        this.jsonId = jsonId;
        this.add(object);
    }
}

let jsonDataMap = new Map<string, JSON>();


//Approach 3
let object3DMap = new Map<THREE.Object3D.uuid, jsonId>(); or new Map<THREE.Object3D.uuid, jsonData>();
Map object IDs in your scene to JSON data: This is similar to the previous approach, but it doesn’t require extending Object3D. It might be easier to implement if you’re dealing with objects that aren’t all of the same type or if you want to avoid modifying the Object3D class




// Different approach 4
If you want to have an Object3D with an extra field and without the parent-child relationship, you can directly extend the THREE.Mesh class instead of THREE.Object3D. Here’s how you can do it:

export default class DataMesh extends THREE.Mesh {
    jsonData: any; // or id

    constructor(geometry: THREE.Geometry | THREE.BufferGeometry, material: THREE.Material | THREE.Material[], jsonData: any) {
        super(geometry, material);
        this.jsonData = jsonData;
    }
}

*/

