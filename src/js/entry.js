import * as THREE from 'three';

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import Projectile from './Projectile';

let camera, scene, renderer, controls;

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const FOV = 75;
const arenaSize = 700;
const projectiles = [];

let prevTime = performance.now();

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();


init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.x = arenaSize / 2;
    camera.position.y = arenaSize / 2;
    camera.position.z = arenaSize / 2;


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 2000);

    controls = new PointerLockControls(camera, document.body);

    const color = 0xeeeeff;
    const intensity = 0.75;
    const light = new THREE.HemisphereLight(color, 0x777788, intensity);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);    

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

    const onKeyDown = function (event) {

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

    };

    const onKeyUp = function (event) {

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

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    const onClick = function (event) {

      if (controls.isLocked === true) {       
        
        let ball = new Projectile(
          camera.position.x, camera.position.y, camera.position.z,
          camera.getWorldDirection(), 10, 7, 0x27ccbb
          );       

        const sphereGeometry = new THREE.SphereGeometry(7, 32, 16).toNonIndexed();
        const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb});        
        const sphere  = new THREE.Mesh(sphereGeometry, sphereMaterial);              
        
        sphere.position.x = camera.position.x;
        sphere.position.y = camera.position.y;
        sphere.position.z = camera.position.z;

        projectiles.push(ball);

        scene.add(sphere);    
        
      }
    }
    document.addEventListener('click', onClick);   

    //walls
    /*

    let floorGeometry1 = new THREE.Plane(new THREE.Vector3(1, 0 ,0));
    let floorGeometry2 = new THREE.Plane(new THREE.Vector3(0, 1 ,0));
    let floorGeometry3 = new THREE.Plane(new THREE.Vector3(0, 0 ,1));

    let floorGeometry4 = new THREE.Plane(new THREE.Vector3(1, 0 ,0), arenaSize);
    let floorGeometry5 = new THREE.Plane(new THREE.Vector3(0, 1 ,0), arenaSize);
    let floorGeometry6 = new THREE.Plane(new THREE.Vector3(0, 0 ,1), arenaSize);

    const floorMaterial1 = new THREE.MeshBasicMaterial({ vertexColors: true });

    const floor1 = new THREE.Mesh(floorGeometry1, floorMaterial1);
    const floor2 = new THREE.Mesh(floorGeometry2, floorMaterial1);
    const floor3 = new THREE.Mesh(floorGeometry3, floorMaterial1);
    const floor4 = new THREE.Mesh(floorGeometry4, floorMaterial1);
    const floor5 = new THREE.Mesh(floorGeometry5, floorMaterial1);
    const floor6 = new THREE.Mesh(floorGeometry6, floorMaterial1);   
    

    scene.add(floor1);
    scene.add(floor2);
    scene.add(floor3);
    scene.add(floor4);
    scene.add(floor5);
    scene.add(floor6);
    */

    
    // objects         

    for (let i = 0; i < 100; i ++) {

        const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();
        const boxMaterial = new THREE.MeshBasicMaterial({color: 0x343aeb});        
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
                
        box.position.x = Math.floor(Math.random() * arenaSize);
        box.position.y = Math.floor(Math.random() * arenaSize);
        box.position.z = Math.floor(Math.random() * arenaSize);

        scene.add(box);        

    }

    
    

    
    
    

    console.log(mirroring(new THREE.Vector3((arenaSize / 2), (arenaSize / 2), (arenaSize / 2))));

    for (let i = 0; i < 7; i++) {      

      const arenaBoxGeometry = new THREE.BoxGeometry(arenaSize, arenaSize, arenaSize).toNonIndexed();
      const wireframe = new THREE.EdgesGeometry(arenaBoxGeometry);
      const arenaBoxMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 4});    
      const arenaBox = new THREE.LineSegments(wireframe, arenaBoxMaterial);  

      arenaBox.position.x = (arenaSize / 2);
      arenaBox.position.y = (arenaSize / 2);
      arenaBox.position.z = (arenaSize / 2);

      
      
      switch(i) {
        case 0:

          break;

        case 1:
          arenaBox.position.x = (arenaSize / 2) + arenaSize;
          break;

        case 2:
          arenaBox.position.x = (arenaSize / 2) - arenaSize;
          break;

        case 3:
          arenaBox.position.y = (arenaSize / 2) + arenaSize;
          break;

        case 4:
          arenaBox.position.y = (arenaSize / 2) - arenaSize;
          break;
        case 5:
          arenaBox.position.z = (arenaSize / 2) + arenaSize;
          break;
        case 6:
          arenaBox.position.z = (arenaSize / 2) - arenaSize;
          break;  
        
      }

      scene.add(arenaBox); 
      
    }  

    //

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);    
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function mirroring(inputVector)
{
  let position = new THREE.Vector3();
  position = inputVector;

  let xComp = 0;
  let yComp = 0;
  let zComp = 0;

  let returnCoords = [];
  for (let i = 0; i < 3; i++) {  

    switch(i) {
      case 0:
        //position.setX(position.x + arenaSize);
        xComp = 1;
        break;  

      case 0:        
        xComp = 0;
        break; 

      case 2:
        //position.setX(position.x - arenaSize);
        xComp = -1;
        break;       
    }

    for (let j = 0; j < 3; j++) { 

      switch(i) {
        case 0:
          //position.setY(position.y + arenaSize);
          yComp = 1;
          break;  

        case 0:        
          yComp = 0;
          break; 
        
        case 2:
          //position.setY(position.y - arenaSize);
          yComp = -1;
          break;       
      }
      

      for (let k = 0; k < 3; k++) {          

        switch(i) {
          case 0:
            //position.setZ(position.z + arenaSize);
            zComp = 1;
            break;

          case 0:        
            zComp = 0;
            break;

          case 2:
            //position.setZ(position.z - arenaSize);
            zComp = -1;
            break;       
        }

        if(!(i == 1 && j == 1 && k == 1))
        {
          returnCoords.push(new THREE.Vector3(            
            arenaSize * xComp + inputVector.x,
            arenaSize * yComp + inputVector.y,
            arenaSize * zComp + inputVector.z
            )); 
        }             
        //position.setZ(inputVector.z);

      }   
      //position.setY(inputVector.y);  

    }
    //position.setX(inputVector.x);

  }  

  return returnCoords;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {

    requestAnimationFrame(animate);

    const time = performance.now();

    if (controls.isLocked === true) {      

        const delta = (time - prevTime) / 500;

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
        
        
        if (controls.getObject().position.x < 0) controls.getObject().position.x = arenaSize;  
        if (controls.getObject().position.y < 0) controls.getObject().position.y = arenaSize;  
        if (controls.getObject().position.z < 0) controls.getObject().position.z = arenaSize;    

        if (controls.getObject().position.x > arenaSize) controls.getObject().position.x = 0;  
        if (controls.getObject().position.y > arenaSize) controls.getObject().position.y = 0;  
        if (controls.getObject().position.z > arenaSize) controls.getObject().position.z = 0; 
        
        /*
        for (let i = 0; i < projectiles.length; i++)
        {
          console.log(projectiles[i]);
        } 
        */ 

    }

    prevTime = time;
    renderer.render(scene, camera);

}