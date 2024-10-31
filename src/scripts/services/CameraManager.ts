// camera.ts
import * as THREE from 'three';

export class CameraManager {
    camera: THREE.PerspectiveCamera;
    // Other camera-related properties...

    constructor() {
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(/* parameters */);
        // Set up additional camera configurations...
    }

    // Methods for managing camera settings, switching between cameras, etc.
}



/*
import {Inject, Singleton} from 'typescript-ioc';
import {CameraComponent} from './camera.component';
import {CoreControllerComponent} from '../controller/core-controller.component';
import {CoreCameraControllerComponent} from '../controller/core-camera-controller.component';
import {MovementComponent} from '../controller/movement-component';
import {TimerComponent} from '../timer/timer.component';

@Singleton
export class CameraManager {
   constructor(
      @Inject private readonly component: CameraComponent,
      @Inject private readonly controller: CoreControllerComponent,
      @Inject private readonly cameraController: CoreCameraControllerComponent,
      @Inject private readonly timer: TimerComponent,
      @Inject private readonly movement: MovementComponent,
   ) {
      controller.resize$.subscribe((size) => component.setAspectRatio(size.x / size.y));
      cameraController.quaternion$.subscribe((quaternion) => component.setQuaternion(quaternion));
      movement.position$.subscribe((position) => component.setPosition(position));
   }
}
*/