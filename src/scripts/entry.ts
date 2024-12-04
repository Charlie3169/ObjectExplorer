import * as THREE from 'three';
import { Mesh, Sphere } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

import * as ObjectCreation from './services/creation/ObjectCreation';
import ChatWindow from './services/chatbox/ChatWindow';

import * as TextCreation from './services/creation/TextCreation';
import Projectile from './models/Projectile';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { getAllTextEntries, addText, updateText, deleteText, fetchEntries } from '../scripts/services/TestAPI';


import SceneManager from '../scripts/services/SceneManager';

// Initialize SceneManager
const sceneManager = SceneManager.getInstance();

//ThreeJS objects
let scene : THREE.Scene
let camera : THREE.PerspectiveCamera;
let renderer : THREE.WebGLRenderer;
let controls : PointerLockControls;

let composer : EffectComposer;
let renderPass : RenderPass;
let outlinePass : OutlinePass;

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

//Stats
//const stats : Stats = Stats();

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
let clickMode: AbilityMode = AbilityMode.InspectObject;
let currentObject : THREE.Object3D;

//Shooting stuff
const ballSpeed = 0.2;
const ballSize = 0.5;

let projectiles: Projectile[] = [];


const chat = new ChatWindow();


async function init() { 

    //CAMERA
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, nearPlane, farPlane);  
    camera.position.y++;

    //SCENE
    //scene = new THREE.Scene();
    scene = sceneManager.getScene();
    scene.background = new THREE.Color(0xefedfa); //0x7F87F8
    scene.fog = new THREE.Fog(0xffffff, 0, arenaSize * 30);    

    //RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio);    
    document.body.appendChild(renderer.domElement);

    //CONTROLS
    controls = new PointerLockControls(camera, document.body);
    clickEventControls();
    moveControls();

    //COMPOSER
    // Create the composer
    composer = new EffectComposer(renderer);

    // Create a render pass
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Create an OutlinePass
    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);    

    composer.addPass(outlinePass);


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
    //onDocumentMouseMove();    
    mouseWheelEvent();
      
            
    //ENVIRONMENT
    createWorldEnvironment()
      
    

    chat.addMessage("[Object Explorer Command Line]");
      
    createOrbButton();
    //callAPI();
    
    /* Need to figure out how to do this asynchronously
    try {
      console.log("Initialization started");

      // Run the functions concurrently
      await Promise.all([
          createAndAddText(),
          createAndAddText2()
      ]);

        console.log("Initialization complete");
    } catch (error) {
        console.error('Initialization error:', error);
    }
    */

    //Stats
    //initializeStats();    

}

function initializeStats(): void
{ 
  /// Show FPS, MS, and MB panels
  //stats.showPanel(0); // FPS
  //stats.showPanel(1); // MS
  //stats.showPanel(2); // MB  

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
        //console.log(currentObject);
      }
      
                       
    }
  });
}


function mouseWheelEvent(): void
{ 
  const numAbilities = Object.keys(AbilityMode).length / 2;   
  const tooltext = document.getElementById('tooltext');  

  // Variable to track whether a new wheel event has occurred
  let newWheelEvent = false;

  document.addEventListener( 'wheel', function(event : WheelEvent) {
    if (controls.isLocked === true) {      

      const delta = Math.sign(event.deltaY);  

      if(delta == -1 && clickMode == 0)
        clickMode = numAbilities;    

      clickMode = (clickMode + (delta * 1)) % numAbilities;      
      
      // Update tooltext content based on clickMode
      tooltext.textContent = AbilityMode[clickMode] + ' (' + clickMode + ')';

      // Reset the opacity to 1 immediately on a new wheel event
      if (!newWheelEvent) {
        tooltext.style.opacity = '1';
        newWheelEvent = true;
      }

      // Set opacity to 0 after a delay if a new wheel event has occurred
      setTimeout(() => {
        if (newWheelEvent) {
          tooltext.style.opacity = '0';
          newWheelEvent = false; // Reset the flag
        }
      }, 2000); // Adjust delay before fading here (milliseconds)

      // Unselect inspected object
      outlinePass.selectedObjects = [];
    }
  });  
}

function displayObjectJson(): void {
  const jsonData = document.getElementById('jsonData');
  jsonData.textContent = ''; // Clear existing content

  const currentObjectData = currentObject.toJSON();

  // Create a list element to hold the JSON keys and values
  const list = document.createElement('ul');

  // Iterate over the keys of the JSON data
  Object.keys(currentObjectData).forEach(key => {
      // Create a list item for the key and its value
      const listItem = document.createElement('li');

      // Add the key to the list item
      const keyItem = document.createElement('span');
      keyItem.textContent = key + ': ';
      listItem.appendChild(keyItem);

      // Add the value of the key to the list item
      const valueItem = document.createElement('span');
      valueItem.textContent = JSON.stringify(currentObjectData[key]);
      listItem.appendChild(valueItem);

      // Add the main list item to the main list
      list.appendChild(listItem);
  });

  // Append the main list to the container element
  jsonData.appendChild(list);
}



function warpToPoint(): void
{

}


//Bad way to do this

let orbId: string = "2";

//This whole process needs to be made easier
function createOrbButton(){
  let location: THREE.Vector3 = new THREE.Vector3(-300, 150, -300)

    var stuff = ObjectCreation.sphereWithOutlineAndText( //todo make this more configurable
    40, 
    TextCreation.createTextSprite("Test API Button", 2, location)
    )
    
    for (let i = 0; i < stuff.length; i++) {      

      //console.log(stuff[i].uuid)
      

      // Clone the bundled object to avoid modifying the original
      const clonedObject = stuff[i].clone();
    
      // Set the position of the cloned object to the current point on the sphere
      clonedObject.position.copy(location);
      //console.log(clonedObject.uuid)

      if(i == 0) //This is ridiculous
      {
        orbId = clonedObject.uuid;          
      }

      
    
      // Add the cloned object to the scene
      scene.add(clonedObject);
    }
    
}

// Call the API functions
async function callAPI() {
  try {
      const texts = await fetchEntries();
      chat.addMessage( "Called API");
      chat.addMessage( texts);      

      //await addText('New text entry');
      //await updateText(1, 'Updated text entry');
      //await deleteText(1);

  } catch (error) {
      console.error('Error in API operations:', error);
  }
}

function createWorldEnvironment(): void 
{       
  scene.add(ObjectCreation.roundedBox()); 
  scene.add(ObjectCreation.createWorldFloor(arenaSize));        
  scene.add(ObjectCreation.createWorldAxis(20000, 20000, 1000))

  ObjectCreation.createRandomBoxes(100, arenaSize).forEach(box => {
    scene.add(box);
  });
  ObjectCreation.createTransparentSpheres(300, arenaSize).forEach(sphere => {
    scene.add(sphere);
  });    
  ObjectCreation.createOrbSphere(
    1000, 
    800, 
    new THREE.Vector3(0, 1100, 1000), 
    ObjectCreation.sphereWithOutlineAndText(15,TextCreation.createTextSprite("Test", 2))
    //ObjectCreation.createNestedSpheres(7, 5, 2)
  ).forEach(orb => {
    scene.add(orb);
  });

  scene.add(ObjectCreation.createRoundedRectangle(
    15000, 
    10000, 
    10000, 
    500, 
    0x6699CC, 
    new THREE.Vector3(-3000, 1000, 10000))
  );
  scene.add(ObjectCreation.createRoundedRectangle(
    9000, 
    7000, 
    7000, 
    500, 
    0x3320E3, 
    new THREE.Vector3(10000, 3000, -2000))
  );

  scene.add(
    TextCreation.createTextSprite("Object Explorer Prototype 3", 
      1, 
      new THREE.Vector3(-20, 20, 20)
    )
  ); 
  scene.add(ObjectCreation.createDatabaseSymbol(230, 250, 0x157be8, 0x125280, 2000, -2000))
}

//Test async
/*
async function createAndAddText() {
  try {
      let text: string = `
      # Master To Do List
      
      ## Initial Setup Tasks
      - [X] Setup static ip
      - [X] SSH
      - [ ] VPN
      - [X] Xrdp
      - [ ] Port documents
        - [X] Phone photos
        - [X] Discord notes/photos
        - [ ] Add all math content from math notes, and Desmos files
      - [X] GitHub repo for home directory, configs
          - [X] Added projects within as submodules
      - [X] Port GitHub projects
        - [X] Unified GitHub project structure for all applications using submodules
        - [ ] Fix Java Akasha project and port
      - [X] GitHub Token
      - [ ] Auto build and deploy from GitHub commits
      - [ ] Secure password setup
      - [ ] CLI Improvements setup
          - [ ] Zsh
          - [ ] Mosh
          - [ ] Tmux
          - [ ] Starship
      - [ ] Dockerfile of system setup
      
      ## Raspberry pi projects
      - [X] Pi-hole DNS server
        - Currently offline, will resume with router upgrade
        - Need to add more DOH blockers and block outgoing port 53
        - Upgrade router
      - [ ] Minecraft server
      - [ ] Selenium web-scraper platform
          - [ ] Collect useful external API calls
          - [ ] Create interface used by main program to allow for easy chatbot swapping
        - [ ] AutoGPT/AgentGPT
      - [ ] NAS/Media player
      - [ ] 3D Printer setup
      - [ ] Personal Algo-trader	
          - [X] Project setup
      - [ ] Permanent web server for Object Explorer project, using TextRepository as database
      - [ ] Math identity explorer
        - [ ] Python latex engine
      - [ ] DomainExpansion.sh
      - [ ] Discord bot that send various updates to my phone
        - [x] Project setup
      - [ ] ChatGPT file targeted script generation
      
      ## Small scripts and functions
      - [X] Upgrade alias command
      - [x] Output system/network statistics
          - [ ] Add hardware temperatures
      - [X] Output versions of programs
      - [ ] Create install script based on command history
      - [X] Day score file and updater script
      - [X] Function to upgrade touch command for creating scripts
        - [ ] Add Python logic
      - [X] CLI Navigation menu in a similar style to the one from 'gh auth login'
        - [ ] Implemented with fzf, port to a function?
      - [X] Script management & navigation controls
        - [ ] Added fzf menus to open and run scripts`;


      const textMesh1 = await TextCreation.createTextWithPanel(text, 10, new THREE.Vector3(1000, 600, -1000));
      scene.add(textMesh1);
  } catch (error) {
      console.error('Failed to create text:', error);
  }
}

async function createAndAddText2() {
  try {
      let text: string = `
      # TextRepository
      A project to store and manipulate all of my textual information
      
      I would like to combine of all everything that I have written regarding math, programming, and various ideas/interests and place them into one central location that lends itself to text processing, manipulation, combination, transformation, and storage. I want to be able to treat sentences, paragraphs, blurbs, and essays along with functions and programs as items that act in concert with one another.
      
      In addition to being a central location for various writings and media I would like to have a collection of scripts to manipulate them en mass.
      
      ## Manipulation scripts:
      - [ ] Migration to markdown	
        - [X] Made a command to convert all docx to md using pandoc
         - [ ] Need to convert remaining txt to consistent markdown format
      - [ ] Parse text into blocks
        - [X] Added function displayFiles which combines all files of a type to an organized document
         - [X] Combine like file types into singular documents, such as .txt, .md, .py, .java, .js, .sh
            - Should be idempotent 	
        - [ ] Preserve source document and neighboring/related text through tags and id pointers
        - [ ] Should have (possible) sections for 
              - id
              - title 
              - content
              - contentType (coding language, fileType, markdown, latex, noteText, math, class, script, function, promptText...)
              - contentDescription
              - descriptionTags[]
              - searchKeywords[]
              - originalFileSource
              - relatedNodeIds[],
              - previousNode
              - nextNode
              - imageRefs[]
              - generatedContentHistory[]
              - desmosLink
              - codeDocumentation
         - [ ] Need to be able to update all nodes at once as structure changes
         - [ ] The nodes should always be flat-packed, meaning it is easy to add or remvoe sections based off the use case, such as a math node having sections for latex and desmos while a code section wanting documentation and coding language tags
         - [ ] There should be a defined span of options for all of the sections and their possible values
         - [ ] In the case of markdown notes, previous and next node denotes the sections of text (which should also be nodes) that originally surrounded it
         - [ ] It should be possible to search through all the nodes by any of these to quickly locate the node associated with a given form
              
              
      - [ ] Knowledge nodes through JSON file structure for text, images, code, tags, latex, related nodes, generated content & prompt data
        - [ ] Should allow for multimedia data aggretation per concept
        - [ ] Add option to create new files rather than replace
      - [ ] Aggregation of functions
        - [ ] Extract just functions from code into combined files to allow for the total functionality span to constantly increase via work across all projects
              - [ ] Convert laterally between functions of different languages through GPTs
        - [ ] Translate a function in one language to another, store on same node	
      - [ ] GPT node search through simlarity
        - [ ] Be able to have an AI tell which node would be the best place for new data or generate new one
             
      ## Generation scripts:
      - [ ] Collection of GPT crawlers that convert text into actionable, ordered, and priortized tasks
        - [ ] Be able to have GPT's process source data, compile it into nodes idempotently
        - [ ] Rank and order nodes along different qualities
      - [ ] Set up a structured way for GPT's to iterate and build out various ideas/features
        - [ ] ChatGPT file targeted script generation
          - [ ] Should take file path pointer and a prompt
            - If the file does not exist create it
          - [ ] Read the file contents and pass to a IGenerativeApi member
          - [ ] Create a unique session per file to leverage history
          - [ ] GPT should output a script based on the prompt to the file directly
          - [ ] Option to only edit a function/part of a document
          - [ ] Append usual commentary as comments at the bottom of the file, showing prompt/version history
      - [ ] Wordcloud generator
      - [ ] Read and parse Desmos account
      - [ ] AI Image text/latex extractor for math
        - [ ] Pass in an image, extract text and latex symbols, create output file with the same name, display both and prompt user to approve
        - [ ] Would also want interoperability betweem Sympy latex and Desmos latex
      `;


      const textMesh1 = await TextCreation.createTextWithPanel(text, 10, new THREE.Vector3(1500, 700, -1000));
      scene.add(textMesh1);
  } catch (error) {
      console.error('Failed to create text:', error);
  }
}
*/


function blocker(): void 
{  
  //Maybe add something to this to halt processing when blocked

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


function applyOutlineToObject(object : THREE.Object3D) {
  // Clear the previously selected objects
  outlinePass.selectedObjects = [];
    
  // Add the newly selected object to the array
  outlinePass.selectedObjects.push(object);

  // Update the outline effect parameters
  outlinePass.visibleEdgeColor.set('#ffffff'); // Set color to black
  outlinePass.hiddenEdgeColor.set('#ffffff'); // Set color to white
  outlinePass.edgeThickness = 2; // Set thickness of the dark outline
  outlinePass.edgeStrength = 100; // Set strength of the dark outline effect
  
}

//Depends on camera and scene
function getClosestObject(): THREE.Object3D {

  // Create a raycaster to cast a ray from the camera's position in the direction it's facing
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(); // Placeholder for mouse coordinates (not used in this example)

  // Set raycaster properties based on the camera's position and direction
  raycaster.setFromCamera(mouse, camera);

  // Perform raycasting to check for intersections with objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true); // Assuming 'scene' is your THREE.Scene

  if(intersects.length > 0)
  {
    return intersects[0].object;
  }
  else 
  {
    return null;
  }
  
}


function setSelectedObject(): void 
{
  
  const intersectedObject: THREE.Object3D | null = getClosestObject();

  // Check if any objects were intersected
  if (intersectedObject === null) {
    console.log('Nothing clicked');
    return;
  }      
 
  currentObject = intersectedObject;     

  console.log('ObjectID: ', currentObject.uuid);
  //console.log('Object: ', currentObject);

  //chat.addMessage(orbId)
  //chat.addMessage(currentObject.uuid);
  if(currentObject.uuid == orbId)
  {
    chat.addMessage("Button Clicked");
    callAPI();
  }
  
}

function deleteSelectedObject(): void
{
  const objectToDelete: THREE.Object3D | null = getClosestObject();

  // Check if any objects were intersected
  if (objectToDelete === null) {
    console.log('Nothing clicked');
    return;
  }      

  scene.remove(objectToDelete);

  // Dispose of any associated resources (e.g., geometry, material)
  if ('geometry' in objectToDelete) {
    (objectToDelete as THREE.Mesh).geometry.dispose();
  }
  if ('material' in objectToDelete) {
      const material = (objectToDelete as THREE.Mesh).material;
      if (material instanceof THREE.Material) {
          material.dispose();
      }
  }

  // Optionally, dispose of any other resources specific to your application

  // Remove any references to the object
  // (This step may not be necessary in all cases, depending on your application's logic)
  objectToDelete.parent?.remove(objectToDelete);

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
    //let textSprite = TextCreation.createTextSprite(abilityName + ' (' + clickMode + ')', 1 );
    //textSprite.position.copy(camera.position); // Position in front of the camera
    //scene.add(textSprite);
    
    switch(clickMode)
    {
        case AbilityMode.CreateOrb:
          
          let colors: number[] = [
            0x000000,
            0x3333cc,
            0x6666e6,
            0x9999ff,
            0xb3bdff,
            0xccd9ff,
            0xe6e6ff,           
            0xfafafa,
            0xffffff
          ];

          //let colors2: number[] = [0x27ccbb, 0x2d6af7, 0x7F87F8, 0xbabfff, 0xd7d9f7];

          ObjectCreation.createOrbs(100, 0.025,  camera.position, colors).forEach(bundledObject => {   
            scene.add(bundledObject);
          });
                                
          break;

        case AbilityMode.ShootProjectile:        
          shootEvent();          
          break;

        case AbilityMode.DeleteObject:
          deleteSelectedObject();
          
          break;
        case AbilityMode.CreateRay:
          
          break;
        case AbilityMode.InspectObject:
          setSelectedObject();
          applyOutlineToObject(currentObject);
          //displayObjectJson();         
          break;      

        case AbilityMode.EnterOrb:
          setSelectedObject();
          applyOutlineToObject(currentObject);     
          break;
        
        case AbilityMode.GenerateSphericalArrangement:   
          ObjectCreation.createOrbSphere(
            1000, 
            800, 
            camera.position,  
            ObjectCreation.sphereWithOutlineAndText(
              15, 
              TextCreation.createTextSprite("∞", 2)
            )
          ).forEach(orb => {
            scene.add(orb);
          });
          break;
          
    }          
  });  
  

}

function updateObjectCountDisplay()
{
  // Get a reference to the object count element
  const objectCountElement = document.getElementById('objectCount');  
  const objectCount = scene.children.length;
  objectCountElement.textContent = `Objects in scene: ${objectCount}`;
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



//todo fix
function moveControls(): void {
  document.addEventListener('keydown', function(event) {
    // Only toggle chat window if not already open
    if (!chat.isOpenWindow()) {
      if (event.code === 'Slash' || event.code === 'KeyT') {
        // Open the chat window with appropriate input
        chat.open();
        chat.inputText = event.code === 'Slash' ? '/' : '';
        event.preventDefault();
        return;
      }
    }

    // Handle additional '/' when chat is open and Slash is pressed
    if (chat.isOpenWindow()) {
      if (event.code === 'Slash') {
        chat.inputText += '/';
        event.preventDefault();
        return;
      }
      
      // Close chat with Escape key without affecting other app elements
      if (event.code === 'Backquote') {
        chat.close();
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }
      
      // When chat is open, ignore other key events to allow free typing
      return;
    }

    // Chat is closed: handle other movement controls
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
    // If chat is open, skip movement control handling
    if (chat.isOpenWindow()) return;

    // Handle movement control release
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
    movementSpeed = 800.0;
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

    // Update composer size
    composer.setSize(window.innerWidth, window.innerHeight);

  });   

}

function animate(): void  
{
    requestAnimationFrame(animate);    
    render();
    update();
}

function render(): void  
{
    // Render the scene normally
    //renderer.render(scene, camera);

    // Render the outline pass on top of the scene
    composer.render();
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
      
      updateObjectCountDisplay();
      
      if(doWorldFloor == true && (controls.getObject().position.y < 1.5)) {
        controls.getObject().position.y = 1.5    
      }
            
      projectiles.forEach((e: any) => e.updatePosition());     
      
      
      //Stats
      //stats.update();
  }
  
  prevTime = time;

}

init();
animate();