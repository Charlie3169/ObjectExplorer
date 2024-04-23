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
  GenerateSphericalArrangement = 7
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

function buildSphere(): void {
  let coords: THREE.Vector3[] = SphericalArrangement.sphere(1200, 2000, camera.position); // Adjust radius and number of elements as needed
  console.log(coords);
  coords.forEach(point => {
      let [sphere, outlineMesh] = ObjectCreation.sphereWithOutline(25, point); 
      
      scene.add(sphere);
      scene.add(outlineMesh);

      // Create a text sprite and position it
      let textSprite = createTextSprite("Test");
      textSprite.position.set(point.x, point.y, point.z);
      scene.add(textSprite);
  });
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

    let xCoord = Math.floor((Math.random() - 0.5) * sizeFactor)
    let yCoord = randomRadiusSize + Math.floor(Math.random() * sizeFactor)
    let zCoord = Math.floor((Math.random() - 0.5) * sizeFactor)

    sphere.position.set(
      xCoord, 
      yCoord, 
      zCoord
    );     

    scene.add(sphere);   

    let textSprite = createTextSprite("Test");
    textSprite.position.set(xCoord, yCoord, zCoord); // Position in front of the camera
    scene.add(textSprite);
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


function createTextSprite(message: string): THREE.Sprite {
  const font = '48px Arial'; // Set a larger font size for higher resolution
  const color = 'rgba(255, 0, 255, 1.0)'; // Set the color of the text
  const outlineColor = 'rgba(0, 0, 0, 1.0)'; // Set the outline color

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const scale = window.devicePixelRatio * 2; // Increase scale factor for better definition

  context.font = font;
  let metrics = context.measureText(message);
  const width = metrics.width + 20;
  const height = parseInt(font, 10) + 10; // Adjust height based on font size

  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.scale(scale, scale);

  context.clearRect(0, 0, width * scale, height * scale); // Ensure the background is clear

  context.font = font;
  context.textBaseline = 'top';
  context.strokeStyle = outlineColor;
  context.lineWidth = 4;
  context.strokeText(message, 10, 5);
  context.fillStyle = color;
  context.fillText(message, 10, 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  // Adjust material properties for better depth and transparency handling
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation, // Default blend equation
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.1 * width, 0.1 * height, 1);

  return sprite;
}

// Test
function inspectObject(): void {
  // Create a raycaster to cast a ray from the camera's position in the direction it's facing
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(); // Placeholder for mouse coordinates (not used in this example)

  // Set raycaster properties based on the camera's position and direction
  raycaster.setFromCamera(mouse, camera);

  // Perform raycasting to check for intersections with objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true); // Assuming 'scene' is your THREE.Scene

  // Check if any objects were intersected
  if (intersects.length > 0) {
      // Get the first intersected object
      const intersectedObject = intersects[0].object;

      // Highlight the intersected object with a glowing white outline (if possible)
      // Example: outlinePass.selectedObjects = [intersectedObject];

      // Save the intersected object for further manipulation
      currentObject = intersectedObject;

      console.log('Object: ', currentObject);
  }
}



function clickEventControls(): void
{
  document.addEventListener('click', function(event : MouseEvent) {
    
    if (controls.isLocked === false) {  //Need to rename this variable
      return;
    }    

    let abilityName = AbilityMode[clickMode];
    console.log(abilityName + '(' + clickMode + ')');
    
    // Remove existing sprite if it exists
    //if (textSprite) {
    //    scene.remove(textSprite);
    //}

    // Create new text sprite and add to scene
    let textSprite = createTextSprite(abilityName + ' (' + clickMode + ')');
    textSprite.position.set(camera.position.x, camera.position.y, camera.position.z); // Position in front of the camera
    scene.add(textSprite);
    
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
          inspectObject(); // Should create a visible line (or visible ray) in the direction the camera is facing. When the line hits an object it should stop (or not, it doesn't matter too much), and the object that was hit should be given a glowing white outline (only give it an outline for the 2D silhouette). The object that was hit should be saved in the currentObject variable
          console.log('Object: ' + currentObject);
          break;      
        
        case AbilityMode.GenerateSphericalArrangement:
          buildSphere();
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