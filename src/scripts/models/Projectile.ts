import { Mesh } from "three";
import * as THREE from 'three';

//todo major refactor
/*
export default class Projectile extends Mesh {    
    direction: THREE.Vector3;
    speed: number;
    size: number;
    updatePosition: () => void;       

    constructor(
        position: THREE.Vector3, 
        direction: THREE.Vector3, 
        speed: number, 
        size: number, 
        ballColor: number
    ) {
        const geometry = new THREE.SphereGeometry(size * 100, 32, 16).toNonIndexed();
        const material = new THREE.MeshBasicMaterial({ color: ballColor });

        super(geometry, material);

        this.position.copy(position); // Set initial position using Vector3
        this.direction = direction;
        this.speed = speed;
        this.size = size;

        this.updatePosition = () => {
            if (this.position.y <= 0) {
                direction.reflect(new THREE.Vector3(0, 1, 0));
            }

            this.position.x += direction.x * speed * 100;
            this.position.y += direction.y * speed * 100;
            this.position.z += direction.z * speed * 100;

            if (speed > 0) {
                speed *= 0.999;
            }
        };
    }
}
    */


export default class Projectile {
    object: THREE.Object3D;
    direction: THREE.Vector3;
    speed: number;
  
    constructor(
      object: THREE.Object3D, 
      position: THREE.Vector3, 
      direction: THREE.Vector3, 
      speed: number
    ) {
      this.object = object;
      this.object.position.copy(position);
      this.direction = direction;
      this.speed = speed;
    }
  
    updatePosition(): void {
      // Default motion behavior: move the object in the given direction
      this.object.position.x += this.direction.x * this.speed;
      this.object.position.y += this.direction.y * this.speed;
      this.object.position.z += this.direction.z * this.speed;
  
      // Example: Bounce on the ground
      if (this.object.position.y <= 0) {
        this.direction.reflect(new THREE.Vector3(0, 1, 0));
      }
  
      // Apply drag to the speed
      if (this.speed > 0) {
        this.speed *= 0.999;
      }
    }
  }
  