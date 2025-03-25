import * as THREE from "three";

export class Cat extends THREE.Group {
  constructor(modelLoader) {
    super();
    this.modelLoader = modelLoader;
    this.init();
  }

  async init() {
    try {
      const catGltf = await this.modelLoader.loadModel("/models/cat.glb");
      this.model = catGltf.scene;
      if (catGltf?.animations?.length) {
        this.setModelAnimation(this.model, catGltf.animations);
      }
      // 调整模型比例和位置
      this.model.scale.set(1, 1, 1);
      this.model.position.y = 0.5;
      this.model.position.x = -4;
      // 添加模型到组
      this.add(this.model);

      // 设置初始动画状态
      this.model.rotation.y = Math.PI / 2; // 让猫咪面向正面
    } catch (error) {
      console.error("加载猫咪模型失败:", error);
    }
  }

  setModelAnimation(model, animations) {
    this.mixer = new THREE.AnimationMixer(model);
    const actions = {
      idle: this.mixer.clipAction(animations[0]),
      run: this.mixer.clipAction(animations[1]),
      sad: this.mixer.clipAction(animations[2]),
    };
    this.actions = actions;
    Object.values(actions).forEach((action) => {
      action.enabled = true;
      action.setEffectiveTimeScale(1);
    });
    // 默认播放空闲动画
    this.currentAction = this.actions["idle"];
    this.currentAction.play();
  }

  playAnimation(name, fadeDuration = 0.2) {
    const newAction = this.actions?.[name];
    if (!newAction || this.currentAction === newAction) {
      return;
    }
    const oldAction = this.currentAction;
    newAction.reset();
    newAction.play();
    newAction.setEffectiveWeight(1);
    newAction.crossFadeFrom(oldAction, fadeDuration, true);

    this.currentAction = newAction;
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }
}
