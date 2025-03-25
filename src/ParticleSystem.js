import * as THREE from "three";


export class MeltingParticleSystem extends THREE.Group {
  constructor(options = {}) {
    super();
    this.options = {
      particleCount: 1000, // 初始粒子总数
      spawnHeight: 2, // 初始生成高度
      spawnRadius: 1, // 生成半径
      gravity: 2, // 重力加速度
      baseSize: 0.5, // 基础粒子尺寸
      color: 0x88ffff, // 冰蓝色
      floorY: 0, // 地面Y坐标
      fadeDuration: 1, // 消失淡出时间(秒)
      ...options,
    };

    // 状态管理
    this.activeParticles = new Map(); // Map<粒子索引, 生命周期>
    this.init();
  }

  init() {
     // 创建自定义材质
     this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        fadeDuration: { value: this.options.fadeDuration },
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        attribute float velocity;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          gl_PointSize = size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 color;
        
        void main() {
          gl_FragColor = vec4(0.53, 0.81, 0.98, vAlpha); // 冰蓝色
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }
  startMelting() {
    // 创建粒子几何体
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.options.particleCount * 3);
    const sizes = new Float32Array(this.options.particleCount);
    const alphas = new Float32Array(this.options.particleCount);
    const velocities = new Float32Array(this.options.particleCount);

    // 初始化粒子属性
    for (let i = 0; i < this.options.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * this.options.spawnRadius;

      positions[i * 3] = Math.cos(angle) * radius; // X
      positions[i * 3 + 1] = this.options.spawnHeight; // Y
      positions[i * 3 + 2] = Math.sin(angle) * radius; // Z

      sizes[i] = this.options.baseSize ;
      alphas[i] = 1.0;
      velocities[i] = 0;

      this.activeParticles.set(i, {
        alive: true,
        fadeStart: Infinity,
      });
    }

    // 设置几何体属性
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    this.geometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 1)
    );

    this.particles = new THREE.Points(this.geometry, this.material);
    this.add(this.particles);
    this.startTime = Date.now();
  }

  update(deltaTime) {
    if (!this.particles) return;
    const positions = this.geometry.attributes.position.array;
    const velocities = this.geometry.attributes.velocity.array;
    const alphas = this.geometry.attributes.alpha.array;
    const currentTime = Date.now() * 0.001;

    this.activeParticles.forEach((state, index) => {
      if (!state.alive) return;

      const i = index * 3;

      // 应用物理效果
      velocities[index] += this.options.gravity * deltaTime;
      positions[i + 1] -= velocities[index] * deltaTime;

      // 碰撞检测
      if (positions[i + 1] <= this.options.floorY) {
        this.fadeOutParticle(index, currentTime);
      }

      // 渐隐处理
      if (currentTime >= state.fadeStart) {
        const progress =
          (currentTime - state.fadeStart) / this.options.fadeDuration;
        alphas[index] = 1.0 - progress;

        if (progress >= 1.0) {
          this.destroyParticle(index);
        }
      }
    });

    // 标记属性需要更新
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.alpha.needsUpdate = true;
  }

  fadeOutParticle(index, currentTime) {
    this.activeParticles.get(index).fadeStart = currentTime;
  }

  destroyParticle(index) {
    // 标记粒子为不可见
    const i = index * 3;
    this.geometry.attributes.position.array[i + 1] = -1000; // 移到视野外
    this.activeParticles.delete(index);
  }
}
