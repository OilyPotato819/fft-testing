document.getElementById('canvas').hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.SphereGeometry(1);
// const material = new THREE.MeshBasicMaterial({ color: 0x0059ff, wireframe: true });
// const sphere = new THREE.Mesh(geometry, material);

// scene.add(sphere);

// let position = sphere.geometry.getAttribute('position');
// sphere.geometry.verticesNeedUpdate = true;
// let normals = sphere.geometry.getAttribute('normal').array;
// console.log(normals);

// const sphere = new THREE.BufferGeometry();
// const numPoints = 1000;
// let vertices = new Float32Array(numPoints * 3);
// for (let i = 0; i < numPoints; i++) {
//   const pos = fibonacciSphere(numPoints, i);
//   vertices[i * 3] = pos.x;
//   vertices[i * 3 + 1] = pos.y;
//   vertices[i * 3 + 2] = pos.z;
// }
// sphere.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
// const mesh = new THREE.Mesh(sphere, material);

// const particlesMaterial = new THREE.PointsMaterial({ size: 0.02 });
// const particles = new THREE.Points(sphere, particlesMaterial);

// scene.add(particles);

const radius = 1;
const numPoints = 1000;

const geometry = new THREE.SphereGeometry(radius, numPoints, numPoints);

const vertices = geometry.getAttribute('position').array;
for (let i = 0; i < vertices.length; i++) {
  const { x, y, z } = fibonacciSphere(numPoints, i);
  vertices[i * 3] = x;
  vertices[i * 3 + 1] = y;
  vertices[i * 3 + 2] = z;
}

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

camera.position.z = 5;

function fibonacciSphere(numPoints, point) {
  const rnd = 1;
  const offset = 2 / numPoints;
  const increment = Math.PI * (3 - Math.sqrt(5));

  const y = point * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - Math.pow(y, 2));

  const phi = ((point + rnd) % numPoints) * increment;

  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;

  return { x: x, y: y, z: z };
}

function animate() {
  // particles.rotation.x += 0.01;
  // particles.rotation.y += 0.01;
  // particles.rotation.z += 0.005;

  //   positionAttribute.setXYZ(index + 1, x, y, z);
  //   positionAttribute.setXYZ(index + 2, x, y, z);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
