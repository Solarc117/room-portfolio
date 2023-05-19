/// <reference types="vite/client" />
import WebGL from 'three/addons/capabilities/WebGL.js'
import './style.css'
const queryId = document.getElementById.bind(document)

;(async () => {
  if (!WebGL.isWebGLAvailable())
    return queryId('container')?.appendChild(WebGL.getWebGLErrorMessage())

  const THREE = await import('three'),
    { innerWidth: width, innerHeight: height } = window

  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, width / height),
    renderer = new THREE.WebGLRenderer()

  camera.rotateY(Math.PI / 2)
  camera.rotateX(-0.5)
  camera.position.y = 3
  camera.position.x = 5

  renderer.setSize(width, height)
  renderer.setClearColor(0xfae5b1, 1)
  document.body.appendChild(renderer.domElement)

  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'),
    { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'),
    gltfLoader = new GLTFLoader(),
    dracoLoader = new DRACOLoader()

  if (import.meta.env.MODE === 'development') {
    const { OrbitControls } = await import(
        'three/addons/controls/OrbitControls.js'
      ),
      controls = new OrbitControls(camera, renderer.domElement)

    controls.update()
  }

  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  gltfLoader.setDRACOLoader(dracoLoader)

  gltfLoader.load(
    '/models/final.glb',
    gltf => scene.add(gltf.scene),
    void 0,
    console.error
  )

  const atmosphere = new THREE.AmbientLight(0x404040, 10)
  scene.add(atmosphere)

  function animate() {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }
  animate()
})()
