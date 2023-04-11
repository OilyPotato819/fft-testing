// let cnv = document.getElementById('canvas');
// let ctx = cnv.getContext('2d');

// cnv.width = window.innerWidth - 30;
// cnv.height = window.innerHeight - 25;

// const fftData = fetch('http://localhost:3000/getData')
//    .then((response) => response.json())
//    .then((data) => graphData(data));

// function graphData(data) {
//    ctx.beginPath();
//    ctx.moveTo(data[0].frequency, cnv.height / 2 - data[0].magnitude * 0.1);

//    for (point of data) {
//       const coords = { x: point.frequency * 0.1, y: cnv.height / 2 - point.magnitude * 0.1 };

//       ctx.lineTo(coords.x, coords.y);
//    }
//    ctx.stroke();

//    for (point of data) {
//       const coords = { x: point.frequency * 0.1, y: cnv.height / 2 - point.magnitude * 0.1 };

//       ctx.beginPath();
//       ctx.arc(coords.x, coords.y, 2, 0, 2 * Math.PI);
//       ctx.fill();
//    }
// }

// const cnv = document.getElementById('canvas');
// const ctx = cnv.getContext('2d');

// cnv.width = window.innerWidth - 20;
// cnv.height = window.innerHeight - 60;

// let analyser, dataArray, bufferLength;

// navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
//    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//    let source = audioCtx.createMediaStreamSource(stream);

//    analyser = audioCtx.createAnalyser();
//    analyser.fftSize = 2048;

//    bufferLength = analyser.frequencyBinCount;
//    dataArray = new Uint8Array(bufferLength);

//    source.connect(analyser);

//    draw();
// });

// function draw() {
//    ctx.clearRect(0, 0, cnv.width, cnv.height);

//    analyser.getByteFrequencyData(dataArray);
//    cnv.width = window.innerWidth - 20;
//    cnv.height = window.innerHeight - 60;

//    drawCircle();
//    drawGraph();

//    requestAnimationFrame(draw);
// }

// function drawCircle() {
//    const circle = { x: cnv.width / 2, y: cnv.height / 2, r: 100, spikyness: 0.3 };
//    let angle = 0;
//    let start = {};
//    const pieceNum = 10;
//    const remove = 500;

//    let grd = ctx.createRadialGradient(circle.x, circle.y, circle.r - 20, circle.x, circle.y, circle.r + 50);
//    grd.addColorStop(1 / 7, 'red');
//    grd.addColorStop(2 / 7, 'orange');
//    grd.addColorStop(3 / 7, 'yellow');
//    grd.addColorStop(4 / 7, 'green');
//    grd.addColorStop(5 / 7, 'blue');
//    grd.addColorStop(6 / 7, 'indigo');
//    grd.addColorStop(7 / 7, 'violet');

//    ctx.fillStyle = grd;

//    ctx.beginPath();
//    for (let i = 0; i < pieceNum; i++) {
//       circlePiece(1 - (i % 2), i);
//    }
//    ctx.fill();

//    function circlePiece(clockwise, pieceI) {
//       let angleChange = (2 * Math.PI) / pieceNum / (bufferLength - remove);
//       let i, iStart, iExp, iAdd;

//       if (clockwise) {
//          iStart = 0;
//          iExp = function () {
//             return i < bufferLength - remove;
//          };
//          iAdd = 1;
//       } else {
//          iStart = bufferLength - remove;
//          iExp = function () {
//             return i > 0;
//          };
//          iAdd = -1;
//       }

//       for (i = iStart; iExp(); i += iAdd) {
//          dist = circle.r + dataArray[i] * circle.spikyness;

//          let x = circle.x + dist * Math.sin(angle);
//          let y = circle.y + dist * Math.cos(angle);

//          if (i == 1 && pieceI == 0) {
//             ctx.moveTo(x, y);
//             start.x = x;
//             start.y = y;
//          } else {
//             ctx.lineTo(x, y);
//          }

//          angle += angleChange;
//       }
//    }
// }

// function drawGraph() {
//    let pos = {};
//    let start = {};

//    ctx.beginPath();

//    for (let i = 0; i <= bufferLength; i++) {
//       pos.x = dataArray[i];

//       if (i == 0) {
//          pos.y = 0;

//          ctx.moveTo(0, cnv.height);
//          ctx.lineTo(0, 0);
//       }

//       ctx.lineTo(pos.x, pos.y);

//       pos.y += cnv.height / bufferLength;
//    }

//    ctx.fill();
// }

document.getElementById('canvas').hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

let spike = 0;
const geometry = new THREE.SphereGeometry(1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);
geometry.attributes.position.set([2], 10);
sphere.geometry.attributes.position.needsUpdate = true;
console.log(geometry.attributes.position);

camera.position.z = 5;

function animate() {
   sphere.rotation.z += 0.01;

   geometry.attributes.position.set([spike], 0);
   spike += 1;

   requestAnimationFrame(animate);

   renderer.render(scene, camera);
}

animate();
