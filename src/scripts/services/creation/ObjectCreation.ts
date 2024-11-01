import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import * as SphericalArrangement from '../SphericalArrangement';

//This class is only responsible for creating and returning Meshes to be added to the scene. It is ok to set the positions of the Meshes as well.
//I will be experimenting with object groups here and refactoring some of the existing methods to be more configurable
//Debating on whether this class should have accesss to a scene object but leaning against it, it just means we have to iterate over everything we create twice to add it to the scene

//Consider using buffer geometries here

export function sphere(radius: number): THREE.Mesh
{
    let sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
    let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb, side: THREE.BackSide} );        
    let sphere : THREE.Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);    

    return sphere;
}

export function sphereWithOutline(radius: number): [THREE.Mesh, THREE.Mesh]
{
  let sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
  let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb, side: THREE.BackSide} );        
  let sphere : THREE.Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial); 

  let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x7F87F8, side: THREE.BackSide } );
  let outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial );    
        
  outlineMesh.position.set(sphere.position.x, sphere.position.y, sphere.position.z);       
  outlineMesh.scale.multiplyScalar(1.05);

  return [sphere, outlineMesh];
}

export function sphereWithOutline2(radius: number, position: THREE.Vector3): [THREE.Mesh, THREE.Mesh] {
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x27ccbb, side: THREE.BackSide });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x7F87F8, side: THREE.BackSide });
  const outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial);

  // Position the outline mesh at the same position as the sphere
  outlineMesh.position.copy(sphere.position);

  // Scale the outline mesh by 1.10
  outlineMesh.scale.multiplyScalar(1.10);

  return [sphere, outlineMesh];
}


export function createNestedSpheres(numSpheres: number, initialRadius: number, gap: number): THREE.Mesh[] {
  const spheres: THREE.Mesh[] = [];

  // Define color palette for the spheres
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];

  let radius = initialRadius;

  // Create and position spheres
  for (let i = 0; i < numSpheres; i++) {
      const sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.BackSide });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Position the sphere based on the index and gap
      const position = i * (radius + gap);
      sphere.position.set(position, position, position);

      spheres.push(sphere);

      // Increase the radius for the next sphere by the gap value
      radius += gap;
  }

  return spheres;
}



export function transparentSphere(radius: number): THREE.Mesh {
  
  const color = THREE.MathUtils.randInt(0, 0xffffff);

  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();      
  const sphereMaterial = new THREE.MeshBasicMaterial({
      color: color,          
      transparent: true, 
      opacity: 0.2, 
      wireframe: false, 
      side: THREE.BackSide
  }); 
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);    

  return sphere;
}

export function sphereWithOutlineAndText(radius: number, text: THREE.Sprite): [THREE.Mesh, THREE.Mesh, THREE.Sprite]
{  
  const [sphere, outlineMesh] = sphereWithOutline(radius);
  return [sphere, outlineMesh, text];
}

export function roundedBox(): THREE.Mesh
{
    const roundedBoxGeometry = new RoundedBoxGeometry(1,1,1,4, 0.1);
    const roundedBoxMaterial = new THREE.MeshNormalMaterial({wireframe: true});   
    
    const roundedBoxMesh = new THREE.Mesh(
      roundedBoxGeometry, 
      roundedBoxMaterial
    );
    roundedBoxMesh.position.x = 0;    
    roundedBoxMesh.position.y = 0.5;    
    roundedBoxMesh.position.z = 0;    

    return roundedBoxMesh;
}

//Can this be deleted
/**
export function createOrb(): void 
{
  let sphere : THREE.Mesh = ObjectCreation.sphere(10);     
  sphere.position.set(camera.position.x, camera.position.y, camera.position.z);        
      
  console.log(sphere.geometry);
  
  let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x7F87F8, side: THREE.BackSide } );
  let outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial );

     
  outlineMesh.position.set(sphere.position.x, sphere.position.y, sphere.position.z);     
  outlineMesh.scale.multiplyScalar(1.05);      

  let outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0xbabfff, side: THREE.BackSide } );
  let outlineMesh2 = new THREE.Mesh(sphere.geometry, outlineMaterial2 );
  outlineMesh2.position.set(sphere.position.x, sphere.position.y, sphere.position.z);     
  outlineMesh2.scale.multiplyScalar(1.10);

   
  scene.add(sphere); 
  scene.add(outlineMesh);     
  scene.add(outlineMesh2); 
}
 */

export function createOrbs(radius: number, scaleFactor: number, position: THREE.Vector3, colors: number[]): THREE.Object3D[] 
{

  const objects: THREE.Object3D[] = []; 

  // Create the initial sphere
  let sphereGeometry = new THREE.SphereGeometry(radius, 72, 64).toNonIndexed();
  
  // Create outline meshes with different colors and scaled outlines
  for (let i = 0; i < colors.length; i++) {

      // Calculate the scale factor based on the index
      let scale = 1 + i * scaleFactor;

      // Create outline material with the specified color
      let currentOutlineMaterial = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.BackSide });
      let currentOutlineMesh = new THREE.Mesh(sphereGeometry, currentOutlineMaterial);

      currentOutlineMesh.position.copy(position);      
      currentOutlineMesh.scale.multiplyScalar(scale); 
      objects.push(currentOutlineMesh);           
  }

  return objects;
}


//Moving over orignal world scene from entry.ts 

export function createWorldFloor(arenaSize: number): THREE.Mesh
{  
  const planeGeometry = new THREE.PlaneGeometry(arenaSize * 1000, arenaSize * 1000).toNonIndexed();
  planeGeometry.rotateX(-Math.PI * 0.5);
  const planeMaterial = new THREE.MeshBasicMaterial({color: 0x2ca3e8, side: THREE.DoubleSide, transparent: true, opacity: 0.2});   
  let plane : THREE.Mesh = new THREE.Mesh(planeGeometry, planeMaterial);  

  return plane
}

export function createWorldAxis(axisSize: number, tickSize: number, tickDistance: number): THREE.LineSegments {  

  // Create material for the axis lines
  const material = new THREE.LineBasicMaterial({ color: 0xc1c8f7 });
  let verticalOffset: number = 0.01

  // Create geometry for the axis lines
  const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10000, verticalOffset, 0),
      new THREE.Vector3(10000, verticalOffset, 0), // X-axis endpoints      
      new THREE.Vector3(0, verticalOffset, -10000),
      new THREE.Vector3(0, verticalOffset, 10000) // Z-axis endpoints
  ]);

  // Create axis lines
  const axisLines = new THREE.LineSegments(geometry, material);  
  
  // Create notches for X-axis
  for (let i = -axisSize; i <= axisSize; i += tickDistance) {
      const notchGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i, verticalOffset, tickSize),
          new THREE.Vector3(i, verticalOffset, -tickSize) // Adjust the height of the notch
      ]);
      const notchLine = new THREE.Line(notchGeometry, material);
      axisLines.add(notchLine);
  } 

  // Create notches for Z-axis
  for (let i = -axisSize; i <= axisSize; i += tickDistance) {
      const notchGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(tickSize, verticalOffset, i),
          new THREE.Vector3(-tickSize, verticalOffset, i) // Adjust the height of the notch
      ]);
      const notchLine = new THREE.Line(notchGeometry, material);
      axisLines.add(notchLine);
  }

  return axisLines;
}

export function createRandomBoxes(numBoxes: number, arenaSize: number): THREE.Mesh[]
{
  const boxes : THREE.Mesh[] = [];
  for (let i = 0; i < numBoxes; i ++) 
  {
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x343aeb});        
    let box : any = new THREE.Mesh(boxGeometry, boxMaterial);
    
    box.position.set(
      Math.floor(Math.random() * arenaSize), 
      Math.floor(Math.random() * arenaSize), 
      Math.floor(Math.random() * arenaSize)
    );    

    boxes.push(box);        
  }

  return boxes;
}

export function createTransparentSpheres(numSpheres: number, arenaSize: number): THREE.Mesh[] 
{ 
  const transparentSpheres : THREE.Mesh[] = [];
  for (let i = 0; i < numSpheres; i ++) 
  {
    const randomRadiusSize = Math.floor(Math.random() * 600);

    let sphere = transparentSphere(randomRadiusSize)
    
    const sizeFactor = arenaSize * 20;

    const xCoord = Math.floor((Math.random() - 0.5) * sizeFactor);
    const yCoord = randomRadiusSize + Math.floor(Math.random() * sizeFactor);
    const zCoord = Math.floor((Math.random() - 0.5) * sizeFactor);     

    sphere.position.set(
      xCoord, 
      yCoord, 
      zCoord
    );  

    transparentSpheres.push(sphere);         
  }

  return transparentSpheres;    
}

//todo potentially refactor to use groups
export function createOrbSphere(outerRadius: number, numElements: number, centerCoords: THREE.Vector3, bundledObjects: THREE.Object3D[]): THREE.Object3D[]
{
  const positionedObjects: THREE.Object3D[] = [];
  const coords: THREE.Vector3[] = SphericalArrangement.sphericalArrangement(outerRadius, numElements, centerCoords);

  coords.forEach(point => {
    bundledObjects.forEach(bundledObject => {
      // Clone the bundled object to avoid modifying the original
      const clonedObject = bundledObject.clone();

      // Set the position of the cloned object to the current point on the sphere
      clonedObject.position.copy(point);

      // Add the cloned object to the collection
      positionedObjects.push(clonedObject);
    });
  });

  return positionedObjects;
}

export function createRoundedRectangle(length: number, width: number, height: number, radius: number, rectColor: number, rectPostion: THREE.Vector3): THREE.Mesh 
{  
  // Create the geometry for the rounded rectangle
  const shape = new THREE.Shape();
  shape.moveTo(0, radius);
  shape.lineTo(0, height - radius);
  shape.quadraticCurveTo(0, height, radius, height);
  shape.lineTo(length - radius, height);
  shape.quadraticCurveTo(length, height, length, height - radius);
  shape.lineTo(length, radius);
  shape.quadraticCurveTo(length, 0, length - radius, 0);
  shape.lineTo(radius, 0);
  shape.quadraticCurveTo(0, 0, 0, radius);

  // Extrude the shape to give it depth
  const extrudeSettings = {
      steps: 2,
      depth: width,
      bevelEnabled: true,
      bevelThickness: radius,
      bevelSize: radius,
      bevelOffset: 0,
      bevelSegments: 16
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Create the material for the rectangle
  const material = new THREE.MeshBasicMaterial({ color: rectColor, side: THREE.DoubleSide });

  // Create the mesh using the geometry and material
  const rectangle = new THREE.Mesh(geometry, material);

  // Set the position of the rectangle
  rectangle.position.copy(rectPostion);
  
  // Return the created rectangle mesh
  return rectangle;
}