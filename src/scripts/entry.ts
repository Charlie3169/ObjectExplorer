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

import * as TestAPI from '../scripts/services/TestAPI';


import SceneManager from './services/scene/SceneManager';
import * as Orb from './models/Orb';

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
const ballSpeed = 5;


// Global variables
let projectiles: Projectile[] = [];


const chat = new ChatWindow();


let apiButtonOrbId: string = "";
let languageOrbSizes = 100

//Orb presets - scale factor indicates a drop off rate
const OrbsConfig = {
  BLACKHOLE: {
      radius: 100,
      scaleFactor: 0.025,
      colors: [0x000000, 0x3333cc, 0x6666e6, 0x9999ff, 0xb3bdff, 0xccd9ff, 0xe6e6ff, 0xfafafa, 0xffffff],
      speed: 0
  },
  BLACKHOLE_ALT: {
      radius: 100,
      scaleFactor: 0.025,
      colors: [0x27ccbb, 0x2d6af7, 0x7F87F8, 0xbabfff, 0xd7d9f7],
  },
  CLASSIC: {
    radius: 40,
    scaleFactor: 0.05,
    colors: [0x27ccbb, 0x7F87F8],
  },
  TEST_NEST: {
    radius: 40,
    scaleFactor: 0.05,
    colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff]
  },
  RAINDOW_NEST: {
    radius: 50,
    scaleFactor: 0.2,
    colors: [
      0xff0000, // Red
      0xff2000, // Red-Orange
      0xff4000, // Reddish-Orange
      0xff6000, // Deep Orange
      0xff8000, // Orange
      0xffa000, // Yellow-Orange
      0xffbf00, // Yellowish-Orange
      0xffdf00, // Golden Yellow
      0xffff00, // Yellow
      0xdfff00, // Yellow-Green
      0xbfff00, // Lime Green
      0x9fff00, // Yellowish-Green
      0x80ff00, // Green
      0x60ff20, // Bright Green
      0x40ff40, // Green-Cyan
      0x20ff60, // Cyan-Green
      0x00ff80, // Cyan
      0x00ffa0, // Light Cyan
      0x00ffbf, // Sky Blue
      0x00ffdf, // Bluish-Cyan
      0x00ffff, // Light Blue
      0x00dfff, // Cyan-Blue
      0x00bfff, // Blue
      0x009fff, // Deep Blue
      0x0080ff, // Indigo
      0x0060ff, // Violet-Blue
      0x0040ff, // Violet
      0x4020ff, // Purple-Violet
      0x8000ff, // Purple
      0xbf00ff, // Deep Purple
      0xdf00ff, // Magenta-Purple
      0xff00ff, // Magenta
      0xff00df, // Pinkish-Magenta
      0xff00bf, // Hot Pink
      0xff009f, // Bright Pink
      0xff0080, // Deep Pink
      0xff0060, // Pink-Red
      0xff0040, // Red-Pink
      0xff2020, // Reddish-Red
      0xff0000  // Red (closes the loop)
    ]
  },
  TEST_ORB: {
      radius: 5,
      scaleFactor: 1.5,
      colors: [0x000000, 0x444444, 0x888888],
  },
  TEST_PROJECTILE: {
      radius: 4,
      scaleFactor: 0.8,
      colors: [0x333333, 0xFFFFFF],
  },
  API_ORB: {
    radius: 40,
    scaleFactor: 0.08,
    colors: [0x27ccbb, 0x7F87F8],
  },
  SPHERE_ORB: {
    radius: 15,
    scaleFactor: 0.08,
    colors: [0x27ccbb, 0x7F87F8],
  },


  //Code language orbs
  BASH_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x89e051, 0xf0f0f0], // Bash green center, light gray outline
  },
  JAVA_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xf49518, 0x04748c], // Java brown center, light gray outline
  },
  PYTHON_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x32d190, 0x5FB43A], // Python blue center, light gray outline
  },
  POWERSHELL_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x477CDA, 0x2AAACD], // PowerShell dark blue center, light gray outline
  },
  GO_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x00ADD8, 0xf0f0f0], // Go cyan center, light gray outline
  },
  RUST_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xDD3515, 0xEF4A00], // Rust orange center, light gray outline
  },
  JAVASCRIPT_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x3178C6, 0xf0f0f0],
  },
  TYPESCRIPT_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x3178C6, 0xf0f0f0], // TypeScript blue center, light gray outline
  },
  ANSIBLE_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xCC0000, 0xf0f0f0],
  },


  // Other important types
  MATH_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xdee0ff, 0xf0f0f0],
  },
  DESMOS_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x0BA020, 0xf0f0f0],
  },  
  GITHUB_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x7C33A4, 0xf04c34],
  },
  DOCKER_CONTAINER_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x1D63ED, 0xf0f0f0],
  },
  KUBERNETES_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xFCC41C, 0x3069de],
  },
  COMPUTER_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x2d3ec3, 0xc1c6d3],
  },
  PROMPT_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x18ed86, 0xf0f0f0],
  },
  PROMPT_RESPONSE_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xFF00FF, 0xf0f0f0],
  },
  AI_AGENT_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x2596BE, 0xf0f0f0],
  },
  SYSTEM_WILL_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0xf5ff00, 0xfab500, 0xf1840b],
  },
  TEXT_INFO_ORB: {
    radius: languageOrbSizes,
    scaleFactor: 0.08,
    colors: [0x27ccbb, 0x7F87F8],
  }

};
Object.freeze(OrbsConfig); // Optional: Prevents modification of the object






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
    //generateSystemOrbsTest();
    await generateCodeOrbs();

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




//This whole process needs to be made easier
function createOrbButton(){

  

  const apiOrbSphere = OrbsConfig.API_ORB;

  const orbButton = ObjectCreation.createOrb(
    apiOrbSphere.radius,
    apiOrbSphere.scaleFactor, 
    new THREE.Vector3(-300, 150, -300),
    apiOrbSphere.colors,   
    TextCreation.createTextSprite("Test API Button", 2, undefined, undefined, undefined)
  );

  console.log(`Orb button: ${orbButton.uuid}` )

  apiButtonOrbId = orbButton.uuid;

  scene.add(orbButton);  
  
    
}



async function sprayOrbs(
  startPosition: THREE.Vector3,
  baseDirection: THREE.Vector3,
  sprayCoefficient: number,
  objects: THREE.Object3D[],
  timeGap: number
): Promise<void> {
  for (const object of objects) {
    // Randomize the direction within the spray coefficient bounds
    const randomizedDirection = baseDirection.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * sprayCoefficient,
      (Math.random()) * sprayCoefficient,
      (Math.random() - 0.5) * sprayCoefficient
    )).normalize();

    // Trigger the shoot event for the current object
    const projectile = new Projectile(
      object,
      startPosition.clone(), // Ensure independent position
      randomizedDirection,
      ballSpeed * (Math.random() + 0.2)
    );

    projectiles.push(projectile);
    scene.add(object);

    // Wait for the specified time gap before shooting the next object
    await new Promise(resolve => setTimeout(resolve, timeGap));
  }
}


async function generateCodeOrbs(): Promise<void> {
  try {
    // Fetch entries from the API
    const entries = await TestAPI.fetchEntries();   

    //Todo review this

    // Create orbs based on the fullName field in the returned JSON
    let orbs: THREE.Object3D[] = entries.map((entry: any) => {
      const jsonObject = JSON.parse(entry);
      const fullName = jsonObject.name || "No name";
      const language = jsonObject.language || "No language";
      
      
      let orbType;
      // Select orb type and colors based on language
      switch (language.toLowerCase()) {
        case "typescript":
          orbType = OrbsConfig.TYPESCRIPT_ORB;
          break;
        case "javascript":
          orbType = OrbsConfig.CLASSIC;
          break;
        case "python":
          orbType = OrbsConfig.PYTHON_ORB;
          break;
        case "bash":
          orbType = OrbsConfig.BASH_ORB;
          break;
        case "java":
          orbType = OrbsConfig.JAVA_ORB;
          break;
        case "c":
        case "c++":
          orbType = OrbsConfig.CLASSIC; // Adjust as needed for C/C++
          break;
        case "go":
          orbType = OrbsConfig.GO_ORB;
          break;
        case "rust":
          orbType = OrbsConfig.RUST_ORB;
          break;
        case "powershell":
          orbType = OrbsConfig.POWERSHELL_ORB;
          break;
        default:
          orbType = OrbsConfig.API_ORB; // Default orb configuration
          break;
      }

      //console.log(orbType)
      
      return ObjectCreation.createOrb(
        orbType.radius,
        orbType.scaleFactor,
        new THREE.Vector3(),
        orbType.colors,
        TextCreation.createTextSprite(fullName, 3, undefined, 10, undefined, '#f0f0f0', '#f0f0f0') 
      );
    });

    //Add in other orb types to test
    // Generate orbs for all important orb types
    const importantOrbTypes = getImportantOrbTypes();
    const additionalOrbs = importantOrbTypes.map(({ name, config }) => {
      return ObjectCreation.createOrb(
        config.radius,
        config.scaleFactor,
        new THREE.Vector3(),
        config.colors,
        TextCreation.createTextSprite(name, 3, undefined, 10, undefined, '#f0f0f0', '#f0f0f0') 
      );
    });
    
    // Add additional orbs to the main collection
    orbs = orbs.concat(additionalOrbs);



    //Section to add in various orbs about system info
    const github = await TestAPI.getGithubRepos();
    chat.addMessage( "Local Github Repos");
    chat.addMessage( github);  

    const docker = await TestAPI.getDockerContainers();
    chat.addMessage( "Local Docker");
    chat.addMessage( docker);  

    const kubernetes = await TestAPI.getKubernetesInfo();
    chat.addMessage( "Local Kubernetes");
    chat.addMessage( kubernetes);  


    
    orbs = orbs.concat(github);
    orbs = orbs.concat(docker);
    orbs = orbs.concat(kubernetes);


    // Define spray parameters
    const startPosition = new THREE.Vector3(2000, 1000, -2000);
    const baseDirection = new THREE.Vector3(0, 1, 0);
    const sprayCoefficient = 1000; // Adjust for more/less spread
    const timeGap = 300; // Milliseconds

    // Spray the generated orbs
    await sprayOrbs(startPosition, baseDirection, sprayCoefficient, orbs, timeGap);

  } catch (error) {
    console.error("Error generating code orbs:", error);
  }
}

// Function to return a collection of all orb types related to non code things
function getImportantOrbTypes(): { name: string; config: any }[] {
  return [

    { name: "Bash Orb", config: OrbsConfig.BASH_ORB },
    { name: "Java Orb", config: OrbsConfig.JAVA_ORB },
    { name: "Python Orb", config: OrbsConfig.PYTHON_ORB },
    { name: "Powershell Orb", config: OrbsConfig.POWERSHELL_ORB },
    { name: "Go Orb", config: OrbsConfig.GO_ORB },
    { name: "Rust Orb", config: OrbsConfig.RUST_ORB },
    { name: "JavaScript Orb", config: OrbsConfig.JAVASCRIPT_ORB },
    { name: "TypeScript Orb", config: OrbsConfig.TYPESCRIPT_ORB },
    { name: "Ansible Orb", config: OrbsConfig.ANSIBLE_ORB },


    { name: "Math Orb", config: OrbsConfig.MATH_ORB },
    { name: "Desmos Orb", config: OrbsConfig.DESMOS_ORB },
    { name: "Github Orb", config: OrbsConfig.GITHUB_ORB },
    { name: "Docker Container Orb", config: OrbsConfig.DOCKER_CONTAINER_ORB },
    { name: "Kubernetes Orb", config: OrbsConfig.KUBERNETES_ORB },
    { name: "Computer Orb", config: OrbsConfig.COMPUTER_ORB },
    { name: "Prompt Orb", config: OrbsConfig.PROMPT_ORB },
    { name: "Prompt Response Orb", config: OrbsConfig.PROMPT_RESPONSE_ORB },
    { name: "AI Agent Orb", config: OrbsConfig.AI_AGENT_ORB },
    { name: "System Will Orb", config: OrbsConfig.SYSTEM_WILL_ORB },
    { name: "Text Information Orb", config: OrbsConfig.TEXT_INFO_ORB },
  ];
}


// Call the API functions
async function callAPI() {
  try {
      const texts = await TestAPI.fetchEntries();
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

  scene.add(
    TextCreation.createTextSprite(
      "Object Explorer Prototype 10", 
      1, 
      new THREE.Vector3(-20, 20, 20), 
      undefined, 
      undefined
    )
  ); 

  
  
  
  scene.add(ObjectCreation.roundedBox()); 
  scene.add(ObjectCreation.createWorldFloor(arenaSize));        
  scene.add(ObjectCreation.createWorldAxis(20000, 20000, 1000))

  ObjectCreation.createRandomBoxes(100, arenaSize)
  .forEach(box => {
    scene.add(box);
  });

  ObjectCreation.createTransparentSpheres(300, arenaSize)
  .forEach(sphere => {
    scene.add(sphere);
  });    

  ObjectCreation.createOrbSphericalArrangement(
    1000, 
    800, 
    new THREE.Vector3(0, 1100, 1000), 
    ObjectCreation.createOrb(
      OrbsConfig.SPHERE_ORB.radius, 
      OrbsConfig.SPHERE_ORB.scaleFactor,
      new THREE.Vector3(),
      OrbsConfig.SPHERE_ORB.colors,
      TextCreation.createTextSprite(
        "Test", 
        2, 
        undefined, 
        undefined, 
        undefined)
    )    
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

  
  scene.add(ObjectCreation.createDatabaseSymbol(230, 250, 0x157be8, 0x125280, 2000, -2000))



  //Test         

  const rainbowNestedSpheres = ObjectCreation.createOrb(
    OrbsConfig.RAINDOW_NEST.radius,
    OrbsConfig.RAINDOW_NEST.scaleFactor, 
    new THREE.Vector3(-10000, 3000, 3000),
    OrbsConfig.RAINDOW_NEST.colors,   
    TextCreation.createTextSprite("This is a test", 2, undefined, undefined, undefined)
  );
  scene.add(rainbowNestedSpheres);




  const rainbowNestedSpheres2 = ObjectCreation.createOrb(
    OrbsConfig.RAINDOW_NEST.radius,
    OrbsConfig.RAINDOW_NEST.scaleFactor, 
    new THREE.Vector3(-10000, 2000, 3000), 
    OrbsConfig.RAINDOW_NEST.colors.reverse(),   
    TextCreation.createTextSprite("This is a test too", 0.4, undefined, undefined, undefined)
  );
  scene.add(rainbowNestedSpheres2);


}

//Test async
/*
async function createAndAddText() {
  try {
      let text: string = `long string of text here`;


      const textMesh1 = await TextCreation.createTextWithPanel(text, 10, new THREE.Vector3(1000, 600, -1000));
      scene.add(textMesh1);
  } catch (error) {
      console.error('Failed to create text:', error);
  }
}

async function createAndAddText2() {
  try {
      let text: string = `long text 2`;


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

  //console.log('ParentId: ',currentObject.parent.uuid)
  //console.log('ObjectID: ', currentObject.uuid);
  //console.log('Object: ', currentObject);

  //chat.addMessage(apiButtonOrbId)

  
 
  
  if(currentObject.parent.uuid == apiButtonOrbId)
  {
    chat.addMessage("Button Clicked");
    callAPI();
  }


  //todo implement
  const orbManager = Orb.OrbManager.getInstance();

  orbManager.handleOrbClick(currentObject)
  //if(currentObject.parent.uuid)
  
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
          
          const bSphere = OrbsConfig.BLACKHOLE;

          const blackHoleSphere = ObjectCreation.createOrb(
            bSphere.radius, 
            bSphere.scaleFactor,  
            camera.position.clone(),
            bSphere.colors             
          );
          scene.add(blackHoleSphere);
          
          /*
          ObjectCreation.createOrb(
            bSphere.radius, 
            bSphere.scaleFactor,  
            camera.position, 
            bSphere.colors
          ).forEach(bundledObject => {   
            scene.add(bundledObject);
          });
          */
                                
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
          /*
          ObjectCreation.createOrbSphericalArrangement(
            1000, 
            800, 
            camera.position,  
            ObjectCreation.sphereWithOutlineAndText(
              15, 
              new THREE.Vector3(),
              TextCreation.createTextSprite("∞", 2)
            )
          ).forEach(orb => {
            scene.add(orb);
          });
          */

          ObjectCreation.createOrbSphericalArrangement(
            1000, 
            800, 
            camera.position.clone(), 
            ObjectCreation.createOrb(
              OrbsConfig.SPHERE_ORB.radius, 
              OrbsConfig.SPHERE_ORB.scaleFactor,
              new THREE.Vector3(),
              OrbsConfig.SPHERE_ORB.colors,
              TextCreation.createTextSprite("∞", 2, undefined, undefined, undefined)
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

//todo move
/*
function shootEvent(): void
{  
  let projectile: Projectile = new Projectile(
    camera.position,    
    camera.getWorldDirection(new THREE.Vector3()),
    ballSpeed,
    ballSize, 
    0x5B1FDE
  );    
  
  projectiles.push(projectile);  
  scene.add(projectile);  
}
  */


function shootEvent(): void {

  const currentPosition = new THREE.Vector3();
  camera.getWorldPosition(currentPosition);

  const direction = camera.getWorldDirection(new THREE.Vector3());
  let shootOrb = ObjectCreation.createOrb(
    20,
    0.02,
    currentPosition.clone(), // Ensure fully independent position,
    OrbsConfig.CLASSIC.colors,
    TextCreation.createTextSprite("Orb Projectile", 1, undefined, undefined, undefined)
  );

  let projectile = new Projectile(shootOrb, currentPosition, direction, ballSpeed);
  projectiles.push(projectile);
  scene.add(shootOrb);
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
      //updateProjectiles();
      
      //Stats
      //stats.update();
  }
  
  prevTime = time;

}

init();
animate();