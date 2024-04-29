import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'


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
    roundedBoxMesh.position.x = -1;    

    return roundedBoxMesh;
}

