document.getElementById('canvas').hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

// const sphere = new THREE.BufferGeometry();
// const numPoints = 100;

// let vertices = new Float32Array(numPoints * 3);
// let colors = new Float32Array(numPoints * 3);
// for (let i = 0; i < numPoints; i++) {
//   const pos = fibonacciSphere(numPoints, i);
//   vertices[i * 3] = pos.x;
//   vertices[i * 3 + 1] = pos.y;
//   vertices[i * 3 + 2] = pos.z;

//   if (i % 3 === 0) {
//     randNum = Math.random();
//   }
//   const color = hslToRgb(randNum, 0.5, 0.5);
//   console.log(color);
//   colors[i * 3] = color[0] / 255;
//   colors[i * 3 + 1] = color[1] / 255;
//   colors[i * 3 + 2] = color[2] / 255;
// }

// sphere.setAttribute('color', new THREE.BufferAttribute(colors, 3));
// sphere.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// const position = sphere.getAttribute('position');
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(sphere, material);

// const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, vertexColors: true });
// const particles = new THREE.Points(sphere, particlesMaterial);

const radius = 5;
const icosahedron = new THREE.IcosahedronGeometry(radius, 20);
const icoMaterial = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true });
const icoMesh = new THREE.Mesh(icosahedron, icoMaterial);
const position = icosahedron.getAttribute('position');

const colorArray = new Float32Array(position.count * 3);
for (let i = 0; i < colorArray.length; i += 3) {
  const color = hslToRgb((position.array[i] + radius) / (2 * radius), 0.5, 0.5);
  colorArray[i] = color[0] / 255;
  colorArray[i + 1] = color[1] / 255;
  colorArray[i + 2] = color[2] / 255;
}
icosahedron.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

const pointsMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
const points = new THREE.Points(icosahedron, pointsMaterial);

scene.add(points);
// scene.add(icoMesh);

camera.position.z = 10;

function fibonacciSphere(numPoints, point) {
  const rnd = 1;
  const offset = 2 / numPoints;
  const increment = Math.PI * (3 - Math.sqrt(5));

  const y = point * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - Math.pow(y, 2));

  const phi = ((point + rnd) % numPoints) * increment;

  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;

  return { x: x, y: y, z: z, phi: phi };
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function movePoint(i, dist, vertices) {
  const index = i * 3;
  const point = new THREE.Vector3(vertices[index], vertices[index + 1], vertices[index + 2]);
  const direction = point.clone().normalize();
  const newPoint = point.clone().addScaledVector(direction, dist);

  vertices[index] = newPoint.x;
  vertices[index + 1] = newPoint.y;
  vertices[index + 2] = newPoint.z;
}

// for (let i = 0; i < 10 * 3; i++) {
//   movePoint(i, 0.2, position.array);
// }

function animate() {
  icoMesh.rotation.x += 0.005;
  icoMesh.rotation.y += 0.005;
  icoMesh.rotation.z += 0.005;

  points.rotation.x += 0.005;
  points.rotation.y += 0.005;
  points.rotation.z += 0.005;

  //   positionAttribute.setXYZ(index + 1, x, y, z);
  //   positionAttribute.setXYZ(index + 2, x, y, z);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
