import * as THREE from 'three';
import * as _ from 'lodash';

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


//Had to make type any to be able to access Object3D methods
let camera;
let scene;
let renderer;
let controls;

let moveForward : boolean = false;
let moveBackward : boolean = false;
let moveLeft : boolean = false;
let moveRight : boolean = false;
let moveUp : boolean = false;
let moveDown : boolean = false;

const FOV : number = 75;
const arenaSize : number = 700;

let prevTime : number = performance.now();

const velocity : THREE.Vector3 = new THREE.Vector3();
const direction : THREE.Vector3 = new THREE.Vector3();


init();
animate();



function init() {

    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 1500);    


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 2000);    

    controls = new PointerLockControls(camera, document.body);

    const color = 0xeeeeff;
    const intensity = 0.75;
    const light = new THREE.HemisphereLight(color, 0x777788, intensity);    
    scene.add(light);    


    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);    
    document.body.appendChild(renderer.domElement);
    

    

    blocker();
    onWindowResize();
    moveControls();    
    clickControls();
        
    //Environment
    populateSceneWithJunk();
    startingCircle();

    

}


function getSphericalCoords()
{


}



function startingCircle()
{
      const sphereGeometry = new THREE.SphereGeometry(500, 32, 16).toNonIndexed();      
      const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb});      
      sphereMaterial.side = THREE.DoubleSide;  
      let sphere : any = new THREE.Mesh(sphereGeometry, sphereMaterial);              
      
      sphere.position.x = 0;
      sphere.position.y = 0;
      sphere.position.z = 0;

      scene.add(sphere);   

}

function populateSceneWithJunk() {


  for (let i = 0; i < 100; i ++) {

    const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x343aeb});        
    let box : any = new THREE.Mesh(boxGeometry, boxMaterial);
            
    box.position.x = Math.floor(Math.random() * arenaSize);
    box.position.y = Math.floor(Math.random() * arenaSize);
    box.position.z = Math.floor(Math.random() * arenaSize);

    scene.add(box);        

  }

}

function blocker() {

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', function () {        

      controls.lock();
  });

  controls.addEventListener('lock', function () {

      instructions.style.display = 'none';
      blocker.style.display = 'none';

  });

  controls.addEventListener('unlock', function () {

      blocker.style.display = 'block';
      instructions.style.display = '';

  });

  scene.add(controls.getObject());

}

function clickControls()
{
  document.addEventListener('click', function(event) {

    if (controls.isLocked === true) {        

      const sphereGeometry = new THREE.SphereGeometry(7, 32, 16).toNonIndexed();
      const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb});        
      let sphere : any = new THREE.Mesh(sphereGeometry, sphereMaterial);              
      
      sphere.position.x = camera.position.x;
      sphere.position.y = camera.position.y;
      sphere.position.z = camera.position.z;
      

      scene.add(sphere);          
    }

    
  });  
}

function moveControls() {
  
  document.addEventListener('keydown', function(event) {

    switch (event.code) {
            
      case 'KeyW':
          moveForward = true;
          break;
      
      case 'KeyA':
          moveLeft = true;
          break;
      
      case 'KeyS':
          moveBackward = true;
          break;
      
      case 'KeyD':
          moveRight = true;
          break;

      case 'Space':                
          moveUp = true;
          break;

      case 'ShiftLeft':                
          moveDown = true;
          break;

    }

  });


  document.addEventListener('keyup', function(event) {
    
    switch (event.code) {
            
      case 'KeyW':
          moveForward = false;
          break;
      
      case 'KeyA':
          moveLeft = false;
          break;
      
      case 'KeyS':
          moveBackward = false;
          break;
      
      case 'KeyD':
          moveRight = false;
          break;

      case 'Space':                
          moveUp = false;
          break;

      case 'ShiftLeft':                
          moveDown = false;
          break;

    }

  });

  
}


function onWindowResize() {

  window.addEventListener('resize', function() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  });   

}



function animate() {

    requestAnimationFrame(animate);    
    render();
    update();

}

function update() {

  const time = performance.now();
  if (controls.isLocked === true) {      

      const delta = (time - prevTime) / 200;

      velocity.x -= velocity.x * 3.5 * delta;
      velocity.z -= velocity.z * 3.5 * delta;
      velocity.y -= velocity.y * 3.5 * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.y = Number(moveDown) - Number(moveUp);
      direction.normalize(); // this ensures consistent movements in all directions

      if (moveForward || moveBackward) velocity.z -= direction.z * 600.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 600.0 * delta;
      if (moveUp || moveDown) velocity.y -= direction.y * 600.0 * delta;
      
      
      controls.moveRight(- velocity.x * delta);
      controls.moveForward(- velocity.z * delta);        

      controls.getObject().position.y += (velocity.y * delta); // new behavior               
  }
  
  prevTime = time;

}

function render() {
    renderer.render(scene, camera);
}