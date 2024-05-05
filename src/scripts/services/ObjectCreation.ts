import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'

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


export function nestedSpheres(numSpheres: number, initialRadius: number, gap: number): THREE.Mesh[] {
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

  let objects: THREE.Object3D[] = []; 

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

