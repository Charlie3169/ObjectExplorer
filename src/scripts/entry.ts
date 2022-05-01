import * as THREE from 'three';
import { Sphere } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import * as ObjectCreation from '../scripts/ObjectCreation';
import * as SphericalArrangement from '../scripts/SphericalArrangement';


//ThreeJS objects
let camera : THREE.PerspectiveCamera;
let scene : THREE.Scene
let renderer : THREE.WebGLRenderer;
let controls : PointerLockControls;

//Movement switches
const movementInputDirection : THREE.Vector3 = new THREE.Vector3();
const velocity : THREE.Vector3 = new THREE.Vector3();

let moveForward : boolean = false;
let moveBackward : boolean = false;
let moveLeft : boolean = false;
let moveRight : boolean = false;
let moveUp : boolean = false;
let moveDown : boolean = false;

//Movement coefficients
let movementDrag : number = 8;
let movementSpeed : number = 16.0;

//Camera
const FOV : number = 75;
const nearPlane : number = 1;
const farPlane : number = 5000;

//Time delta
let prevTime : number = performance.now();

//Junk
const arenaSize : number = 700;


init();
animate();

function init() { 

    //CAMERA
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, nearPlane, farPlane);    

    //SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); //0x7F87F8
    scene.fog = new THREE.Fog(0x7F87F8, 0, 2000);    

    //RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);    
    document.body.appendChild(renderer.domElement);

    //CONTROLS
    controls = new PointerLockControls(camera, document.body);
    clickEventControls();
    moveControls();

    //LIGHTING
    const skyColor = 0xfffff;
    const groundColor = 0x7F87F8;
    const intensity = 1.00;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);    
    scene.add(light);    
      
    //EVENTS
    blocker();
    onWindowResize();
      
            
    //ENVIRONMENT
    populateSceneWithJunk();
    //startingCircle();
    scene.add(ObjectCreation.roundedBox());
    buildSphere();
    


}

function buildSphere()
{
  console.log('test');
  let coords : THREE.Vector3[] = SphericalArrangement.sphere(1, 10);
  coords.forEach(point => {
      let sphere = ObjectCreation.sphere(10);
      sphere.position.x = point.x;
      sphere.position.y = point.y;
      sphere.position.z = point.z;
      scene.add(sphere);
  });
}

function getSphericalCoords()
{


}

function getCurrentDirection()
{  
  return camera.getWorldDirection;
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

  const blocker : HTMLElement = document.getElementById('blocker');
  const instructions : HTMLElement = document.getElementById('instructions');

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

function mouseOverEvent()
{
  document.addEventListener('click', function(event) {
    if (controls.isLocked === true) {
        //If detector == true
          //call methods on object

    }
  });
}

function clickEventControls()
{
  document.addEventListener('click', function(event) {

    if (controls.isLocked === true) {        

      let sphere : THREE.Mesh = ObjectCreation.sphere(10);            
      
      console.log(sphere.geometry);
      
      var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x7F87F8, side: THREE.BackSide } );
	    var outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial );
    
      
      sphere.position.x = camera.position.x;
      sphere.position.y = camera.position.y;
      sphere.position.z = camera.position.z;

      outlineMesh.position.x = sphere.position.x;
      outlineMesh.position.y = sphere.position.y;
      outlineMesh.position.z = sphere.position.z;

	    outlineMesh.scale.multiplyScalar(1.05);
	    scene.add(outlineMesh);      

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

function update() 
{

  const time = performance.now();
  if (controls.isLocked === true) 
  {      

      const delta = (time - prevTime) / 200;     

      //Deacceleration 
      velocity.x -= velocity.x * movementDrag * delta;
      velocity.z -= velocity.z * movementDrag * delta;
      velocity.y -= velocity.y * movementDrag * delta;

      movementInputDirection.z = Number(moveForward) - Number(moveBackward);
      movementInputDirection.x = Number(moveRight) - Number(moveLeft);
      movementInputDirection.y = Number(moveDown) - Number(moveUp);
      movementInputDirection.normalize(); // this ensures consistent movements in all directions      

      if (moveForward || moveBackward) velocity.z -= movementInputDirection.z * movementSpeed * delta;
      if (moveLeft || moveRight) velocity.x -= movementInputDirection.x * movementSpeed * delta;
      if (moveUp || moveDown) velocity.y -= movementInputDirection.y * movementSpeed * delta;
      
      
      controls.moveRight(- velocity.x * delta);
      controls.moveForward(- velocity.z * delta);        

      controls.getObject().position.y += (velocity.y * delta); // new behavior               
  }
  
  prevTime = time;

}

function render() {
    renderer.render(scene, camera);
}