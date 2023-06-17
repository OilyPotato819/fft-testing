document.getElementById('canvas').hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

let analyser, dataArray;
const audioElement = document.getElementById('audio');

let micAudio = false;
function webAudio(stream) {
  if (analyser) return;
  if (!micAudio) audioElement.play();
  console.log('now playing');

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  let source = micAudio ? audioCtx.createMediaStreamSource(stream) : audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  dataArray = new Uint8Array(analyser.frequencyBinCount);

  source.connect(analyser);

  animate();
}

if (micAudio) {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
    webAudio(stream);
  });
} else {
  document.addEventListener('click', () => {
    webAudio();
  });
}

// const coefficient = 1.3;
const width = 32;
const height = 16;

const maxHeight = 3;
const frequency = 0.08;
const detail = 11;
const radius = 5;
const colorMax = 1;
const colorMin = 0;
const orb = new THREE.SphereGeometry(radius, width, height);
const icoMaterial = new THREE.MeshBasicMaterial({ wireframe: true, vertexColors: true });
const icoMesh = new THREE.Mesh(orb, icoMaterial);
let posAttribute = orb.getAttribute('position');
// getVertexNum is bad
const vertexNum = getVertexNum();

deIndexGeometry(orb);
indexGeometry(orb);

// for (let i = 0; i < vertexNum; i++) {
//   movePoint(i, Math.random() * 2 * Math.sin(frequency), vertices);
// }

// posAttribute = orb.getAttribute('position');

movePoint(vertexNum - 2, 5, posAttribute.array);
console.log(posAttribute.array);

let hueArray = [];
for (let i = 0; i < posAttribute.count; i++) {
  const hue = i / posAttribute.count;
  hueArray.push(hue);
}

orb.setAttribute('color', new THREE.BufferAttribute(new Float32Array(posAttribute.count * 3), 3));
const colorAttribute = orb.getAttribute('color');

setColors();

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

function getVertexNum() {
  let vertices = [];
  for (let i = 0; i < posAttribute.count * 3; i += 3) {
    vertices.push(`${posAttribute.array[i]},${posAttribute.array[i + 1]},${posAttribute.array[i + 2]}`);
  }
  return new Set(vertices).size;
}

function deIndexGeometry(geometry) {
  const index = geometry.index;
  let vertices = new Float32Array(index.count * 3);

  for (let i = 0; i < index.count; i++) {
    const vertexI = index.array[i] * 3;
    for (let j = 0; j < 3; j++) {
      const value = posAttribute.array[vertexI + j];
      vertices[i * 3 + j] = value > 1e-10 || value < -1e-10 ? value : 0;
    }
  }

  geometry.setIndex(null);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  posAttribute = orb.getAttribute('position');
}

function indexGeometry(geometry) {
  let map = new Map();
  let indices = [];
  let vertices = new Float32Array(vertexNum * 3);

  for (let i = 0; i < posAttribute.array.length; i += 3) {
    const position = [posAttribute.array[i], posAttribute.array[i + 1], posAttribute.array[i + 2]];
    const key = `${position[0]},${position[1]},${position[2]}`;
    let index = map.get(key);

    if (index === undefined) {
      index = map.size;
      map.set(key, index);
      vertices.set(position, index * 3);
    }
    indices.push(index);
  }

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  posAttribute = orb.getAttribute('position');
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
  const currentDist = new THREE.Vector3(vertices[index], vertices[index + 1], vertices[index + 2]).distanceTo(new THREE.Vector3());
  const moveDist = dist + radius - currentDist;
  const point = new THREE.Vector3(vertices[index], vertices[index + 1], vertices[index + 2]);
  const direction = point.clone().normalize();
  const newPoint = point.clone().addScaledVector(direction, moveDist);

  vertices[index] = newPoint.x;
  vertices[index + 1] = newPoint.y;
  vertices[index + 2] = newPoint.z;
}

function setColors() {
  for (let i = 0; i < posAttribute.count; i++) {
    const hue = (colorMax - colorMin) * (1 - Math.abs((hueArray[i] % 2) - 1)) + colorMin;
    const color = hslToRgb(hue, 0.5, 0.5);
    colorAttribute.array.set(color, i * 3);
  }
  colorAttribute.needsUpdate = true;
}

function smoothData(windowSize) {
  const smoothedData = [];

  for (let i = 0; i < dataArray.length; i++) {
    const windowStart = Math.max(0, i - Math.floor(windowSize / 2));
    const windowEnd = Math.min(dataArray.length - 1, i + Math.ceil(windowSize / 2));
    let sum = 0;

    for (let j = windowStart; j <= windowEnd; j++) {
      sum += dataArray[j];
    }

    const average = sum / (windowEnd - windowStart + 1);
    smoothedData.push(average);
  }

  return smoothedData;
}

// for (let i = 0; i < 1 * 6; i++) {
//   movePoint(i, 1, posAttribute.array);
// }
// orb.verticesNeedUpdate = true;

icoMesh.rotation.x -= 0.5;

let frameCount = 1;
function animate() {
  frameCount++;

  analyser.getByteFrequencyData(dataArray);
  const smoothedData = smoothData(0);

  icoMesh.rotation.y -= 0.005;
  // icoMesh.rotation.z -= 0.005;

  // for (let i = 0; i < smoothedData.length; i++) {
  //   movePoint(i, (smoothedData[i] / 255) * maxHeight, posAttribute.array);
  // }
  // posAttribute.needsUpdate = true;

  // for (let i = 0; i < hueArray.length; i++) {
  //   hueArray[i] += 0.001;
  // }
  // setColors();

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
