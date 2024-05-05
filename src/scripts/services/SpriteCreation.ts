import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';


export function createTextSprite(
  message: string, 
  textScale: number,
  canvasScale: number = 5,
  font: string = '48px Arial', 
  color: string = 'rgba(142, 71, 255, 1.0)',
  outlineColor: string = 'rgba(25, 29, 250, 1.0)'
  ): THREE.Sprite {   
  
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const scale = window.devicePixelRatio * canvasScale; // Increase scale factor for better definition
  
    context.font = font;
    let metrics = context.measureText(message);
    const width = metrics.width + 20;
    const height = parseInt(font, 10) + 10; // Adjust height based on font size
  
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  
    context.scale(scale, scale);
  
    context.clearRect(0, 0, width * scale, height * scale); // Ensure the background is clear
  
    context.font = font;
    context.textBaseline = 'top';
    context.strokeStyle = outlineColor;
    context.lineWidth = 4;
    context.strokeText(message, 10, 5);
    context.fillStyle = color;
    context.fillText(message, 10, 5);
  
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  
    // Adjust material properties for better depth and transparency handling
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation, // Default blend equation
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor
    });
  
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.1 * width * textScale, 0.1 * height * textScale, 1);
  
    return sprite;
}

/**
export function createTextSpriteMultiline(
  message: string[],
  textScale: number,
  fontUrl: string = 'fonts/helvetiker_bold.typeface.json',
  color: number = 0xffffff
): THREE.Mesh {
  
  const loader = new FontLoader();
  const font = loader.load(fontUrl);
  
  const textGeometry = new TextGeometry(message.join('\n'), {
      font: font,
      size: 1, // Size of the text (will be scaled by textScale)
      height: 0.1, // Depth of the text
      curveSegments: 12,
      bevelEnabled: false,
  });

  textGeometry.computeBoundingBox();
  const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
  const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;

  const textMaterial = new THREE.MeshBasicMaterial({ color: color });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Center the text horizontally
  textMesh.position.x = -textWidth / 2;
  // Center the text vertically
  textMesh.position.y = -textHeight / 2;

  // Scale the text according to the desired size
  textMesh.scale.set(textScale, textScale, textScale);

  return textMesh;
}
 */




