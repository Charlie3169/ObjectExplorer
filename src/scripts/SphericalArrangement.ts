import * as THREE from 'three';

export function sphere(radius : number, elements : number) : THREE.Vector3[]
{
    let outputArray : THREE.Vector3[] = [];
    let phi : number = Math.PI * (3. - Math.sqrt(5)) //Golden angle in radians
    
    for(let i = 0; i < elements; i++)
    {
        let y : number  = 1 - (i / elements - 1) * 2 
        radius = Math.sqrt(1 - y * y)

        let theta : number = phi * i 

        let x : number = Math.cos(theta) * radius
        let z : number = Math.sin(theta) * radius

        outputArray.push((new THREE.Vector3(x, y, z)));

        return outputArray;
        
    }    
}