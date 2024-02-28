import * as THREE from 'three';
import { Mesh, Sphere } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import * as ObjectCreation from './services/ObjectCreation';
import * as SphericalArrangement from './services/SphericalArrangement';
import Projectile from './models/Projectile';



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

let hyperspeed : boolean = false;
let doWorldFloor : boolean = true;

//Movement coefficients
let movementDrag : number = 8;
let movementSpeed : number = 16.0;

//Camera
const FOV : number = 75;
const nearPlane : number = 1;
const farPlane : number = 20000;

//Time delta
let prevTime : number = performance.now();

//Junk
const arenaSize : number = 700;

//Mouse stuff
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
enum AbilityMode {
  CreateOrb = 0,
  ShootProjectile = 1,
  DeleteObject = 2,
  CreateRay = 3,
  InspectObject = 4,
  MoveObject = 5,
  EnterOrb = 6,
}
let clickMode: AbilityMode = AbilityMode.ShootProjectile;
let currentObject : THREE.Object3D;

//Shooting stuff
const ballSpeed = 0.2;
const ballSize = 0.5;
const direction = new THREE.Vector3();

let projectiles: Projectile[] = [];

//Stats
const stats = Stats()

init();
animate();

function init() { 

    //CAMERA
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, nearPlane, farPlane);    

    //SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); //0x7F87F8
    scene.fog = new THREE.Fog(0x7F87F8, 0, arenaSize * 30);    

    //RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio);    
    document.body.appendChild(renderer.domElement);

    //CONTROLS
    controls = new PointerLockControls(camera, document.body);
    clickEventControls();
    moveControls();

    //LIGHTING
    const skyColor = 0x9da4f5;
    const groundColor = 0x7F87F8;
    const intensity = 1.00;
    const light = new THREE.HemisphereLight(skyColor, 0x9da4f5, intensity);    
    //var light2 = new THREE.PointLight(0xffffff);
	  //light2.position.set(0,250,0);
	  

    scene.add(light);    
      
    //EVENTS
    blocker();
    onWindowResize();
    onDocumentMouseMove();    
    mouseWheelEvent();
      
            
    //ENVIRONMENT
    populateSceneWithJunk();    
    scene.add(ObjectCreation.roundedBox());
    //buildSphere();
    

    //OUTLINE
    //let outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    //composer.addPass( outlinePass );


    //Text
    /*
    let sprite = new THREE.TextSprite( {
      text: 'Text must be rendered here...',
      alignment: 'center',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 28,
      color: '#ffffff' } );

    scene.add( sprite );
    */

    //Stats
    //document.body.appendChild(stats.dom);

}

function onDocumentMouseMove(): void
{  
  document.addEventListener( 'mousemove', function(event : MouseEvent) {
    if (controls.isLocked === true) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerWidth) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if(intersects.length > 0) {
        currentObject = intersects[0].object;
      }
      
                       
    }
  });
}

function mouseWheelEvent(): void
{ 
  const numAbilities = Object.keys(AbilityMode).length / 2;   
  document.addEventListener( 'wheel', function(event : WheelEvent) {
    if (controls.isLocked === true) {      

      const delta = Math.sign(event.deltaY);  

      if(delta == -1 && clickMode == 0)
        clickMode = numAbilities;    

      clickMode = (clickMode + (delta * 1)) % numAbilities;                 
    }
  });  
}

function buildSphere(): void
{  
  let coords : THREE.Vector3[] = SphericalArrangement.sphere(10, 10);
  console.log(coords);
  coords.forEach(point => {
      let sphere = ObjectCreation.sphere(10);
      sphere.position.set(point.x,point.y,point.z);      
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

function worldFloor(): void
{  
  const planeGeometry = new THREE.PlaneGeometry(arenaSize * 1000, arenaSize * 1000).toNonIndexed();
  planeGeometry.rotateX(-Math.PI * 0.5);
  const planeMaterial = new THREE.MeshBasicMaterial({color: 0x9dc9f5, side: THREE.DoubleSide, transparent: true, opacity: 0.2});   
  let plane : Mesh = new THREE.Mesh(planeGeometry, planeMaterial);  

  scene.add(plane);
}

function startingCircles(): void 
{
  for (let i = 0; i < 300; i ++) 
  {
    const randomRadiusSize = Math.floor(Math.random() * 600);
    const color = THREE.MathUtils.randInt(0, 0xffffff);

    const sphereGeometry = new THREE.SphereGeometry(randomRadiusSize, 32, 16).toNonIndexed();      
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: color,          
      transparent: true, 
      opacity: 0.2, 
      wireframe: false, 
      side: THREE.BackSide
    }); 
    let sphere : any = new THREE.Mesh(sphereGeometry, sphereMaterial);         
             
    let sizeFactor = arenaSize * 20;
    sphere.position.set(
      Math.floor((Math.random() - 0.5) * sizeFactor), 
      randomRadiusSize + Math.floor(Math.random() * sizeFactor), 
      Math.floor((Math.random() - 0.5) * sizeFactor)
    );     

    scene.add(sphere);   
  }
}

function randomBoxes():void
{
  for (let i = 0; i < 100; i ++) 
  {
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x343aeb});        
    let box : any = new THREE.Mesh(boxGeometry, boxMaterial);
    
    box.position.set(Math.floor(Math.random() * arenaSize), Math.floor(Math.random() * arenaSize), Math.floor(Math.random() * arenaSize));    

    scene.add(box);        
  }

}


function populateSceneWithJunk(): void 
{ 
  randomBoxes(); 
  startingCircles();
  worldFloor();
}

function blocker(): void 
{  

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


function clickEventControls(): void
{
  document.addEventListener('click', function(event : MouseEvent) {
    
    if (controls.isLocked === false) {  //Need to rename this variable
      return;
    }    

    let abilityName = AbilityMode[clickMode];
    console.log(abilityName + '(' + clickMode + ')');
    
    switch(clickMode)
    {
        case AbilityMode.CreateOrb:
          createOrb();                   
          break;

        case AbilityMode.ShootProjectile:        
          shootEvent();          
          break;

        case AbilityMode.DeleteObject:
          
          break;
        case AbilityMode.CreateRay:
          
          break;
        case AbilityMode.InspectObject:
          console.log('Object: ' + currentObject);
          break;      
          
    }          
  });  
}

function shootEvent(): void
{  
  let projectile: Projectile = new Projectile(
    camera.position.x,
    camera.position.y,
    camera.position.z,
    camera.getWorldDirection(new THREE.Vector3()),
    ballSpeed,
    ballSize, 
    0x5B1FDE
  );    
  
  projectiles.push(projectile);  
  scene.add(projectile);  
}

function createOrb(): void 
{
  let sphere : THREE.Mesh = ObjectCreation.sphere(10);          
      
  console.log(sphere.geometry);
  
  let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x7F87F8, side: THREE.BackSide } );
  let outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial );

  sphere.position.set(camera.position.x, camera.position.y, camera.position.z);      
  outlineMesh.position.set(sphere.position.x, sphere.position.y, sphere.position.z);     
  outlineMesh.scale.multiplyScalar(1.05);

  scene.add(outlineMesh);      
  scene.add(sphere);     
}

function moveControls(): void  
{  
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
      case 'KeyC':
        hyperspeed = !hyperspeed;
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

function hyperspeedSwitch(): void 
{
  if(hyperspeed) {
    movementDrag = 4;
    movementSpeed = 400.0;
  }
  else {
    movementDrag = 8;
    movementSpeed = 16.0;
  }

}

function onWindowResize(): void  
{

  window.addEventListener('resize', function() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  });   

}



function animate(): void  
{
    requestAnimationFrame(animate);    
    render();
    update();
}

function update(): void  
{

  const time = performance.now();
  if (controls.isLocked === true) 
  {      
      hyperspeedSwitch();

      const delta = (time - prevTime) / 200;     

      //Deacceleration 
      velocity.x -= velocity.x * movementDrag * delta;
      velocity.z -= velocity.z * movementDrag * delta;
      velocity.y -= velocity.y * movementDrag * delta;

      //Movement switches
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
      
      
      if(doWorldFloor == true && (controls.getObject().position.y < 1)) {
        controls.getObject().position.y = 1    
      }
            
      projectiles.forEach((e: any) => e.updatePosition());     
      
      
      //Stats
      stats.update();
  }
  
  prevTime = time;

}

function render(): void  
{
    renderer.render(scene, camera);
}