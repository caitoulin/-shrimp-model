import * as THREE from 'three';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    this.init();
    this.setupLights();
    this.setupEventListeners();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    // 设置背景色
    this.scene.background = new THREE.Color(0x87CEEB);
    
    // 添加雾效
    this.scene.fog = new THREE.Fog(0x87CEEB, 1, 50);

    // 开启物理光照
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
  }

  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 主方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    // 补光
    const fillLight = new THREE.DirectionalLight(0x9090ff, 0.4);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  add(object) {
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
