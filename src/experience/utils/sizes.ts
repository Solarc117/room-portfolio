export default class Sizes {
  width: number
  height: number
  aspect: number
  pixelRatio: number

  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.aspect = this.width / this.height
    })
  }
}
