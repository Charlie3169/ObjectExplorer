// init.ts
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { SceneManager } from './SceneManager';
import { ControlsManager } from './ControlsManager';

let sceneManager: SceneManager;
let controlsManager: ControlsManager;

export function initialize() {
    // Initialize Three.js components
    sceneManager = new SceneManager();
    controlsManager = new ControlsManager();

    // Other initialization logic...
}

export function animate() {

    requestAnimationFrame(animate);
    sceneManager.update();
    controlsManager.update();
    // Other animation logic...
}
