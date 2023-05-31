/// <reference types="vite/client" />
import WebGL from 'three/addons/capabilities/WebGL.js'
import './style.css'
import { Mesh, Object3D } from 'three'
const queryId = document.getElementById.bind(document)

;(async () => {
  if (!WebGL.isWebGLAvailable())
    return queryId('container')?.appendChild(WebGL.getWebGLErrorMessage())

  const THREE = await import('three'),
    { innerWidth: width, innerHeight: height } = window

  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, width / height),
    renderer = new THREE.WebGLRenderer()

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  camera.rotateY(Math.PI / 2)
  camera.rotateX(-0.5)
  camera.position.y = 3
  camera.position.x = 5

  renderer.setSize(width, height)
  renderer.setClearColor(0x212121, 1)
  document.body.appendChild(renderer.domElement)

  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'),
    { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'),
    gltfLoader = new GLTFLoader(),
    dracoLoader = new DRACOLoader()

  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  gltfLoader.setDRACOLoader(dracoLoader)

  const dayLight = new THREE.DirectionalLight(0xffffff, 1),
    nightLight = new THREE.PointLight(0xfff0a6, 0.5)

  if (import.meta.env.MODE === 'development') {
    const { OrbitControls } = await import(
        'three/addons/controls/OrbitControls.js'
      ),
      controls = new OrbitControls(camera, renderer.domElement)

    controls.update()

    // Helpers.
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const size = 10,
      divisions = 10,
      gridHelper = new THREE.GridHelper(size, divisions)
    scene.add(gridHelper)

    const helper = new THREE.PointLightHelper(nightLight, 0.3)
    scene.add(helper)
  }

  dayLight.castShadow = true
  dayLight.position.set(5, 5, 2)
  dayLight.shadow.mapSize.set(2048, 2048)
  dayLight.shadow.normalBias = 0.05

  nightLight.castShadow = true
  nightLight.position.set(-1.7, 1.4, -1)
  nightLight.shadow.mapSize.set(2048, 2048)
  nightLight.shadow.normalBias = 0.05

  scene.add(nightLight)
  // scene.add(dayLight)

  const atmosphere = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(atmosphere)

  gltfLoader.load(
    '/models/room.glb',
    gltf => {
      let bulb: Mesh | Object3D
      function setShadows(model: Mesh | Object3D): void {
        model.castShadow = true
        model.receiveShadow = true

        if (!bulb && model.name === 'Sphere') bulb = model

        if (model.children.length > 0)
          for (const child of model.children) setShadows(child)
      }
      for (const child of gltf.scene.children) setShadows(child)
      scene.add(gltf.scene)

      // Animation.
      const mixer = new THREE.AnimationMixer(gltf.scene),
        animations = gltf.animations.filter(
          animation => animation.duration > 1
        ),
        tableClip = THREE.AnimationClip.findByName(
          animations,
          'CubeAction.004'
        ),
        laptopClip = THREE.AnimationClip.findByName(
          animations,
          'Cube.186Action'
        ),
        tableAction = mixer.clipAction(tableClip),
        laptopAction = mixer.clipAction(laptopClip)

      laptopAction.timeScale = 0.0005
      tableAction.timeScale = 0.0005
      tableAction.play()
      laptopAction.play()

      const raycaster = new THREE.Raycaster(),
        pointer = new THREE.Vector2()

      function calculateIntersects({ clientX, clientY }: PointerEvent): void {
        pointer.x = (clientX / window.innerWidth) * 2 - 1
        pointer.y = -(clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children)
        for (const { object } of intersects) {
          console.log('object.name:', object.name)
          switch (object.name) {
            case 'Title':
              object.material.color.setHex(0xffffff)
              console.log('Title hover')
              break
            case 'Projects':
              object.material.color.setHex(0xffffff)
              console.log('Projects')
              break
            case 'Interests':
              object.material.color.setHex(0xffffff)
              console.log('object.material:', object.material)
              break
          }
        }
      }
      window.addEventListener('pointermove', calculateIntersects)

      function animate() {
        requestAnimationFrame(animate)

        const bulbVector = new THREE.Vector3()
        bulb.getWorldPosition(bulbVector)
        nightLight.position.lerp(bulbVector, 0.1)
        mixer.update(16)
        renderer.render(scene, camera)
      }
      animate()
    },
    void 0,
    console.error
  )

  // const { CSS3DRenderer } = await import(
  //     'three/addons/renderers/CSS3DRenderer.js'
  //   ),
  //   textRenderer = new CSS3DRenderer({
  //     element: queryId('container') || void 0,
  //   })
  // textRenderer.setSize(width, height)
})()
