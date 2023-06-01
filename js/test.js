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

// document.getElementById('canvas').hidden = true;

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
// document.body.appendChild(renderer.domElement);

// let spike = 0;
// const geometry = new THREE.SphereGeometry(1);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const sphere = new THREE.Mesh(geometry, material);

// scene.add(sphere);
// geometry.attributes.position.set([2], 10);
// sphere.geometry.attributes.position.needsUpdate = true;
// console.log(geometry.attributes.position);

// camera.position.z = 5;

// function animate() {
//    sphere.rotation.z += 0.01;

//    geometry.attributes.position.set([spike], 0);
//    spike += 1;

//    requestAnimationFrame(animate);

//    renderer.render(scene, camera);
// }

// animate();
