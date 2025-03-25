import * as THREE from "three";

export class Shrimp extends THREE.Group {
  constructor(modelLoader) {
    super();
    this.modelLoader = modelLoader;
    this.normalModel = null;
    this.frozenModel = null;
    this.currentModel = null;
    this.init();
  }

  async init() {
    try {
      // 加载普通虾子模型
      const normalGltf = await this.modelLoader.loadModel("/models/shrimp.glb");
      this.normalModel = normalGltf.scene;
      // 加载冰冻虾子模型
      const frozenGltf = await this.modelLoader.loadModel(
        "/models/frozen_shrimp.glb"
      );
      this.frozenModel = frozenGltf.scene;

      if (!this.normalModel || !this.frozenModel) {
        throw new Error("虾子模型加载失败");
      }

      this.frozenModel.scale.set(3, 3, 3);
      this.frozenModel.position.y = 1;
      this.frozenModel.visible = false;
      this.normalModel.scale.set(0.4, 0.4, 0.4);
      this.normalModel.position.y = 0.3;
      this.normalModel.visible = false;

      // 添加模型到组
      this.add(this.normalModel);
      this.add(this.frozenModel);
      this.showFrozenShrimp();
    } catch (error) {
      console.error("加载虾子模型失败:", error);
    }
  }

  showNormalShrimp() {
    if (this.normalModel && this.frozenModel) {
      this.normalModel.visible = true;
      this.frozenModel.visible = false;
      this.currentModel = this.normalModel;
    }
  }

  showFrozenShrimp() {
    if (this.normalModel && this.frozenModel) {
      this.normalModel.visible = false;
      this.frozenModel.visible = true;
      this.currentModel = this.frozenModel;
    }
  }

  // 获取当前显示的模型
  getCurrentModel() {
    return this.currentModel;
  }
}
