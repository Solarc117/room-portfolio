import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Sizes from './utils/sizes'
import Camera from './camera'

const loader = new GLTFLoader()
console.log('loader:', loader)

export default class Experience {
  static instance: Experience

  canvas!: Element
  scene!: THREE.Scene
  sizes!: Sizes
  camera!: Camera

  constructor(canvas: Element) {
    if (Experience.instance) return Experience.instance

    Experience.instance = this
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.sizes = new Sizes()
    this.camera = new Camera()
  }
}
