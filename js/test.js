document.getElementById('canvas').hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

const frequency = 0.08;
const detail = 0;
const radius = 5;
const colorMax = 0.8;
const colorMin = 0.5;
const icosphere = new THREE.IcosahedronGeometry(radius, detail);
const icoMaterial = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true });
const icoMesh = new THREE.Mesh(icosphere, icoMaterial);
let posAttribute = icosphere.getAttribute('position');

const vertexNum = icosphere.getAttribute('normal').count / 6 + 2;
let map = new Map();
let indices = [new Float32Array(vertexNum * 3)];
let vertices = new Float32Array(vertexNum * 3);
for (let i = 0; i < posAttribute.array.length; i += 3) {
  const position = [posAttribute.array[i], posAttribute.array[i + 1], posAttribute.array[i + 2]];
  let index = map.get(JSON.stringify(position));
  if (index === undefined) {
    index = map.size;
    map.set(JSON.stringify(position), index);
    vertices.set(position, index * 3);
  }
  indices[i / 3] = index;
}

for (let i = 0; i < vertexNum; i++) {
  movePoint(i, Math.random() * 2 * Math.sin(frequency), vertices);
}

icosphere.setIndex(indices);
icosphere.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

posAttribute = icosphere.getAttribute('position');

let hueArray = [];
for (let i = 0; i < vertexNum * 3; i += 3) {
  const hue = ((posAttribute.array[i] + radius) * colorMax) / (2 * radius) + colorMin;
  hueArray.push(hue);
}

icosphere.setAttribute('color', new THREE.BufferAttribute(new Float32Array(posAttribute.count * 3), 3));
const colorAttribute = icosphere.getAttribute('color');

setColors();

const pointsMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
const points = new THREE.Points(icosphere, pointsMaterial);

// scene.add(points);
scene.add(icoMesh);

camera.position.z = 15;

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

  return [r, g, b];
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

function setColors() {
  for (let i = 0; i < vertexNum; i++) {
    const P = 0;
    const hue = ((colorMin - colorMax) / P) * (P - Math.abs());
    // y=\frac{H-L}{P}\left(P-\left|\operatorname{mod}\left(x,2P\right)-P\right|\right)+L
    const color = hslToRgb(hueArray[i], 0.5, 0.5);
    colorAttribute.array.set(color, i * 3);
  }
  colorAttribute.needsUpdate = true;
}

// for (let i = 0; i < 1 * 6; i++) {
//   movePoint(i, 1, posAttribute.array);
// }
// icosphere.verticesNeedUpdate = true;

let frameCount = 1;
function animate() {
  frameCount++;
  icoMesh.rotation.y -= 0.005;
  icoMesh.rotation.z -= 0.005;
  //icoMesh.rotation.x += 0.005;

  //   posAttribute.setXYZ(index + 1, x, y, z);
  //   posAttribute.setXYZ(index + 2, x, y, z);

  for (let i = 0; i < vertexNum; i++) {
    const dist =
      new THREE.Vector3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]).distanceTo(new THREE.Vector3()) -
      radius;
    const amplitude = dist / Math.sin(frequency * frameCount);
    const good = Math.abs(amplitude * Math.sin(frequency * (frameCount + 1)));
    movePoint(i, good - dist, posAttribute.array);
  }
  posAttribute.needsUpdate = true;

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
