import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const world = {
  plane: {
    width: 10,
    height: 10, 
    widthSegments: 10,
    heightSegments: 10
  }
}
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane)

gui.add(world.plane, 'height', 1, 20).onChange(generatePlane)

gui.add(world.plane, 'heightSegments', 1, 20).onChange(generatePlane)

gui.add(world.plane, 'widthSegments', 1, 20).onChange(generatePlane)

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width, 
    world.plane.height, 
    world.plane.widthSegments,
    world.plane.heightSegments 
  )
  const {array} = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]

  array[i + 2] = z + Math.random()
  }
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  70, 
  innerWidth / innerHeight, 
  0.1, 
  1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

camera.position.z = 5

const plane = new THREE.PlaneGeometry(5, 5, 10, 10)
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xFF0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const planeMesh = new THREE.Mesh(plane, planeMaterial)
scene.add(planeMesh)

// console.log(planeMesh.geometry.attributes.position.array)

const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i += 3) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]

  array[i + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(1, 0, 0)
}

planeMesh.geometry.setAttribute('color', 
new THREE.BufferAttribute(
  new Float32Array(colors), 3)
)

const backlight = new THREE.DirectionalLight(0xffffff, 1)
backlight.position.set(0, 0, -1)
scene.add(backlight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)


// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// const mesh = new THREE.Mesh(boxGeometry, material)
// scene.add(mesh)

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const {color} = intersects[0].object.geometry.attributes

    // vertice 1
    color.setX(intersects[0].face.a, 0)
    color.setY(intersects[0].face.a, 0)
    color.setZ(intersects[0].face.a, 1)

    // vertice 2
    color.setX(intersects[0].face.b, 0)
    color.setY(intersects[0].face.b, 0)
    color.setZ(intersects[0].face.b, 1)

    // vertice 3
    color.setX(intersects[0].face.c, 0)
    color.setY(intersects[0].face.c, 0)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true
  }
  
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01
  // planeMesh.rotation.x += 0.01
}

animate()



addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1
  mouse.y = -(e.clientY / innerHeight) * 2 + 1
  // console.log(mouse)
})