import { Mesh } from "three";
import * as THREE from 'three';


export default class Projectile extends Mesh {    
    direction: any;
    speed: any;
    size: any;    
    updatePosition: () => void;        

    constructor(positionX: number, positionY: number, positionZ: number, direction: THREE.Vector3, speed: number, size: number, ballColor: number) 
    {            
        const geometry = new THREE.SphereGeometry(size * 100, 32, 16).toNonIndexed();
        const material = new THREE.MeshBasicMaterial({color: ballColor});

        super(geometry, material);    
        
        this.position.set(positionX, positionY, positionZ)        
        this.direction = direction;
        this.speed = speed;
        this.size = size;                 

        this.updatePosition = () => { 

            if(this.position.y <= 0)
            {
                direction.reflect(new THREE.Vector3(0 , 1 , 0));
            }
            
            this.position.x += direction.x * speed * 100;
            this.position.y += direction.y * speed * 100;;               
            this.position.z += direction.z * speed * 100;;     

            if(speed > 0)
            {                
                speed *= 0.999;
            }            
        }
      
    }    


  }