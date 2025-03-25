import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.loadingManager = new THREE.LoadingManager();
    this.setupLoadingManager();
  }

  setupLoadingManager() {
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      document.getElementById("loading").style.display = "block";
    };

    this.loadingManager.onLoad = () => {
      document.getElementById("loading").style.display = "none";
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = ((itemsLoaded / itemsTotal) * 100).toFixed(2);
      document.getElementById("loading").textContent = `加载中... ${progress}%`;
    };

    this.loadingManager.onError = (url) => {
      console.error("模型加载失败:", url);
    };

    this.loader.manager = this.loadingManager;
  }

  async loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          resolve(gltf);
        },
        (xhr) => {},
        (error) => {
          console.error("模型加载错误:", error);
          reject(error);
        }
      );
    });
  }
}
