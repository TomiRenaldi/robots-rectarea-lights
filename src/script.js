import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
RectAreaLightUniformsLib.init()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 5, - 30)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Lights
const rectAreaLights = new THREE.RectAreaLight('#ff00cc', 50, 4, 10)
rectAreaLights.position.set(- 5, 5, 5)
scene.add(rectAreaLights)

const rectAreaLights1 = new THREE.RectAreaLight('#ff00cc', 50, 4, 10)
rectAreaLights1.position.set(0, 5, 5)
scene.add(rectAreaLights1)

const rectAreaLights2 = new THREE.RectAreaLight('#ff00cc', 50, 4, 10)
rectAreaLights2.position.set(5, 5, 5)
scene.add(rectAreaLights2)

scene.add(new RectAreaLightHelper(rectAreaLights))
scene.add(new RectAreaLightHelper(rectAreaLights1))
scene.add(new RectAreaLightHelper(rectAreaLights2))

/**
 * Robots
 */
const robots = {}

robots.geometry = new THREE.BoxGeometry(100, 0.1, 100)

robots.material = new THREE.MeshStandardMaterial({ 
    color: 0x080808,
    metalness: 0
})

robots.mesh = new THREE.Mesh(robots.geometry, robots.material)
robots.mesh.receiveShadow = true
scene.add(robots.mesh)

robots.loader = new GLTFLoader()
robots.loader.load('Soldier.glb', (gltf) => {
    const model = gltf.scene
    scene.add(model)
    gltf.scene.traverse((child) => {
        if(child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()