import * as THREE from 'three';

// Add support here for mutliple sceneses

// Define a type for metadata
type Metadata = { [key: string]: any };

class SceneManager {
    private static instance: SceneManager;
    private scene: THREE.Scene;
    
    private metadataMap: Map<string, Metadata>;

    private constructor() {
        this.scene = new THREE.Scene();
        this.metadataMap = new Map<string, Metadata>();
    }

    // Method to get the singleton instance
    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    // Add an object to the scene and store metadata
    public addObject(object: THREE.Object3D, metadata: Metadata = {}): void {
        this.scene.add(object);
        this.metadataMap.set(object.uuid, metadata);
    }

    // Remove an object from the scene and clear its metadata
    public removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
        this.metadataMap.delete(object.uuid);
    }

    // Get metadata for an object
    public getMetadata(object: THREE.Object3D): Metadata | undefined {
        return this.metadataMap.get(object.uuid);
    }

    // Set metadata for an object
    public setMetadata(object: THREE.Object3D, metadata: Metadata): void {
        if (this.metadataMap.has(object.uuid)) {
            this.metadataMap.set(object.uuid, metadata);
        }
    }

    // Getter for the scene
    public getScene(): THREE.Scene {
        return this.scene;
    }
}

export default SceneManager;
