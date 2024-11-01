import * as THREE from 'three';

export function sphericalArrangement(radius: number, elements: number, center: THREE.Vector3): THREE.Vector3[] {
    let outputArray: THREE.Vector3[] = [];
    let phi: number = Math.PI * (3. - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0; i < elements; i++) {
        let y: number = 1 - (i / (elements - 1)) * 2; // Correct distribution along y-axis
        let r: number = Math.sqrt(1 - y * y) * radius; // Use 'r' for radial distance on x-z plane

        let theta: number = phi * i;

        let x: number = Math.cos(theta) * r;
        let z: number = Math.sin(theta) * r;

        // Create new vector for point and add the center vector to it
        let point = new THREE.Vector3(x, y * radius, z).add(center);
        outputArray.push(point);
    }

    return outputArray;
}
