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

let positionAttribute = sphere.geometry.getAttribute('position');
sphere.geometry.verticesNeedUpdate = true;
sphere.geometry.attributes.position.array[0] = 10;

camera.position.z = 10;

function animate() {
  //   sphere.rotation.z += 0.01;
  sphere.rotation.x += 0.01;
  //   sphere.rotation.y += 0.01;

  //   positionAttribute.setXYZ(index + 1, x, y, z);
  //   positionAttribute.setXYZ(index + 2, x, y, z);

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
