import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import * as SphericalArrangement from '../SphericalArrangement';

//This class is only responsible for creating and returning Meshes to be added to the scene. It is ok to set the positions of the Meshes as well.
//I will be experimenting with object groups here and refactoring some of the existing methods to be more configurable
//Debating on whether this class should have accesss to a scene object but leaning against it, it just means we have to iterate over everything we create twice to add it to the scene

//Consider using buffer geometries here


/** This was not being used, original sphere test
export function sphere(radius: number): THREE.Mesh
{
    let sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
    let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb, side: THREE.BackSide} );        
    let sphere : THREE.Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);    

    return sphere;
}
*/

//  Made obsolete by create orbs
/** 
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

export function sphereWithOutlineAndText(radius: number, text: THREE.Sprite): [THREE.Mesh, THREE.Mesh, THREE.Sprite]
{  
  const [sphere, outlineMesh] = sphereWithOutline(radius, new THREE.Vector3());
  return [sphere, outlineMesh, text];
}

export function sphereWithOutlineAndText(
  radius: number, 
  position: THREE.Vector3,
  text: THREE.Sprite
): [THREE.Mesh, THREE.Mesh, THREE.Sprite] {

  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x27ccbb, side: THREE.BackSide });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x7F87F8, side: THREE.BackSide });
  const outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial);

  // Position the outline mesh at the same position as the sphere
  outlineMesh.position.copy(sphere.position);

  // Scale the outline mesh by 1.10
  outlineMesh.scale.multiplyScalar(1.05);

  return [sphere, outlineMesh, text];
}





// This might be distinct from createOrbs and uses a different outline method
//Create orb with a large center and smaller, linearly decreasing outlines
export function createRainbowNestedSpheresLinearDropoff(
  numSpheres: number, 
  position : THREE.Vector3, 
  initialRadius: number, 
  colors: number[],
  gap: number): THREE.Mesh[] {

  const spheres: THREE.Mesh[] = [];  
  

  let radius = initialRadius;

  // Create and position spheres
  for (let i = 0; i < numSpheres; i++) {
      const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64).toNonIndexed();
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.BackSide });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Position the sphere based on the index and gap      
      sphere.position.set(position.x, position.y, position.z);

      spheres.push(sphere);

      // Increase the radius for the next sphere by the gap value
      radius += gap;
  }

  return spheres;
}


// We need to make it so this function generalizes all the previous ones
export function createOrbsOld(radius: number, scaleFactor: number, position: THREE.Vector3, colors: number[]): THREE.Object3D[] 
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




//Valid   
  
ObjectCreation.createRainbowNestedSpheresLinearDropoff(
  37, 
  new THREE.Vector3(1000, 2000, 3000),
  5, 
  OrbsConfig.RAINDOW_NEST.colors, 
  2
).forEach(orb => {
  scene.add(orb);
});

let out : any = ObjectCreation.sphereWithOutlineAndText(40, camera.position, TextCreation.createTextSprite("This is a test", 2))
scene.add(out[0], out[1], out[2])

let out : any = ObjectCreation.sphereWithOutline(400)
scene.add(out[0], out[1])

const classicSphere = OrbsConfig.CLASSIC;

ObjectCreation.createOrbs(
  classicSphere.radius, 
  classicSphere.scaleFactor,  
  camera.position, 
  classicSphere.colors
).forEach(bundledObject => {   
  scene.add(bundledObject);
});
  

*/









export function createOrb(radius: number, scaleFactor: number, position: THREE.Vector3, colors: number[], text?: THREE.Sprite | null ): THREE.Group {

  // Create a group to hold all elements of the orb
  const group = new THREE.Group();
 
  // Create the initial sphere
  let sphereGeometry = new THREE.SphereGeometry(radius, 72, 64).toNonIndexed();
  group.uuid = sphereGeometry.uuid;
  console.log(group.userData.id)

  // Create outline meshes with different colors and scaled outlines
  for (let i = 0; i < colors.length; i++) {

    const scale = 1 + i * scaleFactor; // Calculate the scale factor based on the index

    const outlineMaterial = new THREE.MeshBasicMaterial({ color: colors[i], side: THREE.BackSide });
    const outlineMesh = new THREE.Mesh(sphereGeometry, outlineMaterial);

    outlineMesh.position.copy(position.clone());
    outlineMesh.scale.multiplyScalar(scale);
    
    group.add(outlineMesh);
  }

  // Add the text sprite
  if (text) {
    text.position.copy(position);
    group.add(text);
  }
    

  return group;
}







export function transparentSphere(radius: number): THREE.Mesh {
  
  const color = THREE.MathUtils.randInt(0, 0xffffff);

  const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64).toNonIndexed();      
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
    
    const sizeFactor = arenaSize * 25;

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
export function createOrbSphericalArrangementOld(outerRadius: number, numElements: number, centerCoords: THREE.Vector3, bundledObjects: THREE.Object3D[]): THREE.Object3D[]
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


export function createOrbSphericalArrangement(outerRadius: number, numElements: number, centerCoords: THREE.Vector3, objectGroup: THREE.Group): THREE.Object3D[]
{
  const positionedObjects: THREE.Object3D[] = [];
  const coords: THREE.Vector3[] = SphericalArrangement.sphericalArrangement(outerRadius, numElements, centerCoords);

  coords.forEach(point => {   
      
      const clonedObject = objectGroup.clone();
      clonedObject.position.copy(point);      
      positionedObjects.push(clonedObject);    
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


export function createCylinder(radius = 40, height = 200, cylinderColor = 0x0069f2, position = new THREE.Vector3(1000, 100, -1000)) {
  // Create the cylinder geometry
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 64);
  
  // Create a Phong material for a less flat look
  const material = new THREE.MeshBasicMaterial({ //Could also be MeshPhongMaterial
    color: cylinderColor,
    //shininess: 1,  // Higher shininess for a glossy look
    //specular: 0x555555,  // Specular color for highlights
    side: THREE.DoubleSide
  });

  // Create the mesh with the geometry and material
  const cylinder = new THREE.Mesh(geometry, material);

  // Set the position using the position vector
  cylinder.position.copy(position);

  return cylinder;
}

//Needs work
export function createRoundedCylinder(radius = 40, height = 200, cylinderColor = 0x0069f2, position = new THREE.Vector3(1000, 100, -1000), bevelRadius = 10) {
  // Create the main cylinder geometry with rounded edges
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
  
  // Apply a bevel to the top edge of the cylinder
  const topGeometry = new THREE.CylinderGeometry(radius - bevelRadius / 2, radius, bevelRadius, 64, 1);
  topGeometry.translate(0, height / 2, 0); // Position top bevel correctly

  const bottomGeometry = new THREE.CylinderGeometry(radius - bevelRadius / 2, radius, bevelRadius, 64, 1);
  bottomGeometry.translate(0, -height / 2, 0); // Position bottom bevel correctly

  // Create the material for the cylinder
  const material = new THREE.MeshPhongMaterial({
    color: cylinderColor,
    shininess: 100,  // Higher shininess for a glossy look
    specular: 0x555555,  // Specular color for highlights
    side: THREE.DoubleSide
  });

  // Create the mesh for the main cylinder and the beveled tops
  const cylinder = new THREE.Mesh(geometry, material);
  const topCap = new THREE.Mesh(topGeometry, material);
  const bottomCap = new THREE.Mesh(bottomGeometry, material);

  // Combine the cylinder and caps into a single group
  const group = new THREE.Group();
  group.add(cylinder);
  group.add(topCap);
  group.add(bottomCap);

  // Set the position of the group
  group.position.copy(position);

  return group; // Return the combined group
}






export function createDatabaseSymbol(radius = 40, height = 50, cylinderColor = 0x0069f2, innerCylinderColor = 0x125280, xPos: number, zPos: number) {
  const group = new THREE.Group();

  const yLevel = 0

  // Divide the first height by 2 and adjust for world floor at y = 0
  const baseHeight = yLevel + height / 2; 
  const layerSpacing = height / 8;

  // Create and position three cylinders in a stack
  const bottomCylinder = createCylinder(radius, height, cylinderColor, new THREE.Vector3(xPos, baseHeight, zPos));
  const middleCylinder = createCylinder(radius, height, cylinderColor, new THREE.Vector3(xPos, baseHeight + layerSpacing + height, zPos));
  const topCylinder = createCylinder(radius, height, cylinderColor, new THREE.Vector3(xPos, baseHeight + 2 * (layerSpacing + height), zPos));

  // Create smaller cylinders for the gaps
  const smallerCylinderRadius = radius * 0.9; // Adjust size of smaller cylinders  
  const smallerCylinderColor = innerCylinderColor; // Different color for smaller cylinders

  // Position smaller cylinders in the gaps
  const gapY = layerSpacing / 2; // Y position for smaller cylinders

  const smallerBottomCylinder = createCylinder(
    smallerCylinderRadius, 
    layerSpacing, 
    smallerCylinderColor, 
    new THREE.Vector3(xPos, baseHeight + (1 / 2) * (height + layerSpacing), zPos)
  );

  const smallerTopCylinder = createCylinder(
    smallerCylinderRadius, 
    layerSpacing, 
    smallerCylinderColor, 
    new THREE.Vector3(xPos, baseHeight + (3 / 2) * (height + layerSpacing), zPos)
  );

  // Add all cylinders to the group
  group.add(bottomCylinder);
  group.add(middleCylinder);
  group.add(topCylinder);
  group.add(smallerBottomCylinder);
  
  group.add(smallerTopCylinder);

  return group;
}
