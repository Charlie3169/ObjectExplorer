import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'


export function sphere(radius : number) : THREE.Mesh
{
    let sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
    let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb, side: THREE.BackSide} );        
    let sphere : THREE.Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);    

    return sphere;
}

export function sphereWithOutline(radius : number, location : THREE.Vector3) : [THREE.Mesh, THREE.Mesh]
{
  let sphereGeometry = new THREE.SphereGeometry(radius, 32, 16).toNonIndexed();
  let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x27ccbb, side: THREE.BackSide} );        
  let sphere : THREE.Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial); 

  let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x7F87F8, side: THREE.BackSide } );
  let outlineMesh = new THREE.Mesh(sphere.geometry, outlineMaterial );
    
  sphere.position.set(location.x, location.y, location.z);      
  outlineMesh.position.set(sphere.position.x, sphere.position.y, sphere.position.z);       
  outlineMesh.scale.multiplyScalar(1.05);

  return [sphere, outlineMesh];

}

export function roundedBox() : THREE.Mesh
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

