import * as THREE from "three";

export class Environment extends THREE.Group {
  constructor() {
    super();
    this.init();
  }

  init() {
    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.add(ground);
  }
}
