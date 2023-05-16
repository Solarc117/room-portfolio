import Experience from './experience'
import Sizes from './utils/sizes'
const query = document.querySelector.bind(document),
  canvas = query('canvas')

export default class Camera {
  experience!: Experience
  sizes!: Sizes
  scene!: THREE.Scene
  canvas!: Element

  constructor() {
    if (!canvas) return

    this.experience = new Experience(canvas)
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

  }
}
