import * as THREE from 'three';

// Interfaces for extendable functionalities
interface GraphNode {
  dependentOrbs: Set<string>;
  dependencyOrbs: Set<string>;
}

interface Movable {
  velocity: THREE.Vector3;
  applyTransformation(func: (position: THREE.Vector3) => THREE.Vector3): void;
  updatePosition(): void;
}

export class Orb implements GraphNode, Movable {
  group: THREE.Group;
  text: THREE.Sprite | null;
  jsonData: Record<string, any>;
  dependentOrbs: Set<string>;
  dependencyOrbs: Set<string>;
  velocity: THREE.Vector3;

  static readonly VELOCITY_EPSILON = 1e-6;

  constructor(
    radius: number,
    scaleFactor: number,
    position: THREE.Vector3,
    colors: number[],
    text: THREE.Sprite | null = null,
    jsonData: Record<string, any> | null = {}
  ) {
    this.group = new THREE.Group();
    this.group.uuid = THREE.MathUtils.generateUUID();
    this.text = text;
    this.jsonData = jsonData;
    this.dependentOrbs = new Set();
    this.dependencyOrbs = new Set();
    this.velocity = new THREE.Vector3(0, 0, 0);    

    // Create the orb geometry and outlines
    const sphereGeometry = new THREE.SphereGeometry(radius, 72, 64).toNonIndexed();
    
    for (let i = 0; i < colors.length; i++) {
      const scale = 1 + i * scaleFactor;
      const material = new THREE.MeshBasicMaterial(
        { 
          color: colors[i], 
          side: THREE.BackSide 
        });
      const outline = new THREE.Mesh(sphereGeometry, material);
      
      outline.position.copy(position);
      outline.scale.multiplyScalar(scale);
      this.group.add(outline);
    }    

    // Add text if provided
    if (text) {
      text.position.copy(position);
      this.group.add(text);
    }
  }

  // Update text displayed on the orb
  updateText(newText: THREE.Sprite): void {
    if (this.text) {
      this.group.remove(this.text);
    }
    this.text = newText;
    this.group.add(newText);
  }

  // Add a dependency relationship
  addDependency(orbId: string): void {
    this.dependencyOrbs.add(orbId);
  }

  // Add a dependent relationship
  addDependent(orbId: string): void {
    this.dependentOrbs.add(orbId);
  }

  // Display JSON data to console
  displayJson(): void {
    console.log(JSON.stringify(this.jsonData, null, 2));
  }

  // Apply a mathematical transformation to the position
  applyTransformation(func: (position: THREE.Vector3) => THREE.Vector3): void {
    this.group.position.copy(func(this.group.position));
  }

  // Update position based on velocity
  updatePosition(): void {
    if (this.velocity.lengthSq() < Orb.VELOCITY_EPSILON ** 2) {
      this.velocity.set(0, 0, 0);
      return;
    }

    this.group.position.add(this.velocity);

    // Example: Bounce on the ground
    if (this.group.position.y <= 0) {
      this.velocity.reflect(new THREE.Vector3(0, 1, 0));
    }

    // Apply drag to the velocity
    this.velocity.multiplyScalar(0.999);
  }

  // Add velocity to the orb
  addVelocity(velocity: THREE.Vector3): void {
    this.velocity.add(velocity);
  }  
}

// Separate global manager class
export class OrbManager {
  private static instance: OrbManager;
  private orbs: Record<string, Orb> = {};
  private projectiles: Orb[] = [];

  private constructor() {} // Make constructor private to prevent direct instantiation

  static getInstance(): OrbManager {
    if (!OrbManager.instance) {
      OrbManager.instance = new OrbManager();
    }
    return OrbManager.instance;
  }

  addOrb(orb: Orb): void {
    this.orbs[orb.group.uuid] = orb;
  }

  getOrb(uuid: string): Orb | undefined {
    return this.orbs[uuid];
  }

  addProjectile(projectile: Orb): void {
    this.projectiles.push(projectile);
  }

  updateProjectiles(): void {
    this.projectiles.forEach(projectile => projectile.updatePosition());
  }

  // change this to check if in list of globally know orb uuids, the n get fro mthe sense its if found
  handleOrbClick(clickedObject: THREE.Object3D): void {
    const parentGroup = clickedObject.parent;
    if (!parentGroup) {
      console.log('No parent group found for clicked object.');
      return;
    }

    const orb = this.getOrb(parentGroup.uuid);
    if (orb) {
      console.log('Orb clicked:', parentGroup.uuid);
      orb.displayJson();
      //chat.addMessage("Button Clicked");
    } else {
      console.log('No orb found for UUID:', parentGroup.uuid);
    }
  }
}

// Instantiate global manager
//export const globalOrbManager = new OrbManager();

// Example of creating an orb and adding it to the global manager
/*
const newOrb = new Orb(
  20,
  0.02,
  new THREE.Vector3(0, 0, 0),
  [0xff0000, 0x00ff00, 0x0000ff],
  null,
  { type: 'example', metadata: 'test orb' }
);
globalOrbManager.addOrb(newOrb);
*/