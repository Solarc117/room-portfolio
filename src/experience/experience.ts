import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Sizes from './utils/sizes'

const loader = new GLTFLoader()
console.log('loader:', loader)

export default class Experience {
  static instance: Experience
  canvas?: Element

  constructor(canvas: Element) {
    if (Experience.instance) return Experience.instance

    Experience.instance = this
    this.canvas = canvas

    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1),
      material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5
    ;(function animate() {
      requestAnimationFrame(animate)

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    })()
  }
}
