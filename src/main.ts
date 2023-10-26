/// <reference types="vite/client" />
import WebGL from 'three/addons/capabilities/WebGL.js'
import { gsap } from 'gsap'
import { Mesh, Object3D } from 'three'
import './style.css'
const queryId = document.getElementById.bind(document),
  { innerWidth: width, innerHeight: height } = window

;(async function init() {
  const THREE = await import('three')

  if (!WebGL.isWebGLAvailable())
    return queryId('container')?.appendChild(WebGL.getWebGLErrorMessage())

  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, width / height),
    renderer = new THREE.WebGLRenderer()

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const initialCameraPosition = [5, 3, 0]
  camera.rotateY(Math.PI / 2)
  camera.rotateX(-0.5)
  // @ts-ignore
  camera.position.set(...initialCameraPosition)
  renderer.setSize(width, height)
  renderer.setClearColor(0x212121, 1)
  document.body.appendChild(renderer.domElement)

  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'),
    { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'),
    gltfLoader = new GLTFLoader(),
    dracoLoader = new DRACOLoader()

  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  gltfLoader.setDRACOLoader(dracoLoader)

  const dayLight = new THREE.DirectionalLight(0xffffff, 0.3),
    nightLight = new THREE.PointLight(0xfff0a6, 0.5)

  dayLight.castShadow = true
  dayLight.position.set(5, 5, 2)
  dayLight.shadow.mapSize.set(2048, 2048)
  dayLight.shadow.normalBias = 0.05

  nightLight.castShadow = true
  nightLight.position.set(-1.7, 1.4, -1)
  nightLight.shadow.mapSize.set(2048, 2048)
  nightLight.shadow.normalBias = 0.05

  scene.add(nightLight)
  scene.add(dayLight)

  const atmosphere = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(atmosphere)

  gltfLoader.load(
    '/models/code.glb',
    gltf => {
      let bulb: Mesh | Object3D,
        title: Mesh | Object3D,
        projects: Mesh | Object3D,
        interests: Mesh | Object3D,
        screen: Mesh | Object3D

      function setShadows(model: Mesh | Object3D): void {
        if (model.name.match(/screen/i)) {
          console.log('model:', model)
          console.count('screen')
        }

        model.castShadow = true
        model.receiveShadow = true

        if (!bulb && model.name === 'Sphere') bulb = model
        if (!title && model.name === 'Title') title = model
        if (!projects && model.name === 'Projects') projects = model
        if (!interests && model.name === 'Interests') interests = model
        if (!screen && model.name.match(/screen/i)) screen = model

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
        half = 4_350,
        tableAction = mixer.clipAction(tableClip),
        laptopAction = mixer.clipAction(laptopClip)

      tableAction.timeScale = 0.0005
      tableAction.paused = true
      tableAction.play()
      laptopAction.timeScale = 0.0005
      laptopAction.paused = true
      laptopAction.play()

      function toggle(object: 'table' | 'laptop'): void {
        if (object === 'table') {
          tableAction.paused = false
          setTimeout(() => (tableAction.paused = true), half)
          return
        }

        laptopAction.paused = false
        setTimeout(() => (laptopAction.paused = true), half)
      }

      const video = document.createElement('video')
      video.src = 'textures/azula-zuko.mp4'
      // video.autoplay = true
      // video.defaultMuted = true
      video.loop = true
      video.playsInline = true

      // const texture = new THREE.VideoTexture(video)
      // texture.minFilter = THREE.NearestFilter
      // texture.magFilter = THREE.NearestFilter
      // texture.generateMipmaps = false

      // const material = new THREE.MeshStandardMaterial({
      //   map: texture,
      //   side: THREE.BackSide,
      // })

      // screen.material = material

      const raycaster = new THREE.Raycaster(),
        pointer = new THREE.Vector2()

      function calculateIntersects({ clientX, clientY }: PointerEvent): void {
        pointer.x = (clientX / window.innerWidth) * 2 - 1
        pointer.y = -(clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(scene.children),
          object = intersects[0]?.object

        console.log('object.name:', object.name)

        switch (object?.name) {
          case 'Title':
            object.material.color.setHex(0x5394ae)
            document.body.style.cursor = 'pointer'
            console.log('Title hover')
            break
          case 'Projects':
            object.material.color.setHex(0x5394ae)
            document.body.style.cursor = 'pointer'
            console.log('Projects')
            break
          case 'Interests':
            object.material.color.setHex(0x5394ae)
            document.body.style.cursor = 'pointer'
            console.log('object.material:', object.material)
            break

          default:
            document.body.style.cursor = 'auto'
            title.material.color.setHex(0xffffff)
            projects.material.color.setHex(0xffffff)
            interests.material.color.setHex(0xffffff)
        }
      }
      window.addEventListener('pointermove', calculateIntersects)

      window.addEventListener('dblclick', setCameraToLaptop)

      console.log(camera.position)
      const raisedLaptopCameraPosition = new THREE.Vector3(-1.5, 2, 0)
      function setCameraToLaptop() {
        gsap.to(camera.position, {
          duration: half / 1_000,
          ...raisedLaptopCameraPosition,
        })
        toggle('table')
        toggle('laptop')
        // setTimeout(() => video.play(), half)
      }

      function animate() {
        requestAnimationFrame(animate)

        // if ()
        // const time = clock.getElapsedTime(),
        //   loop = 20,
        //   t = (time % loop) / loop,
        //   t2 = ((time + 0.1) % loop) / loop

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
