import * as THREE from "three";
import { gsap } from "gsap";
import { Scene } from "./Scene";
import { Cat } from "./Cat";
import { Shrimp } from "./Shrimp";
import { MeltingParticleSystem } from "./ParticleSystem";
import { Environment } from "./Environment";
import { ModelLoader } from "./ModelLoader";

class App {
  constructor() {
    this.scene = new Scene();
    this.modelLoader = new ModelLoader();
    this.cat = new Cat(this.modelLoader);
    this.shrimp = new Shrimp(this.modelLoader);
    this.particles = new MeltingParticleSystem();
    this.environment = new Environment();
    this.clock = new THREE.Clock();

    this.init();
    this.setupStory();
  }

  init() {
    // 添加场景元素
    this.scene.add(this.environment);
    this.scene.add(this.cat);
    this.scene.add(this.shrimp);
    this.scene.add(this.particles);

    // 初始化相机位置
    this.scene.camera.position.set(0, 2, 5);
    this.scene.camera.lookAt(0, 0, 0);

    // 开始渲染循环
    this.animate();
  }

  setupStory() {
    const storyText = document.getElementById("story-text");
    const steps = [
      { text: "小喵咪在发呆", delay: 0 },
      { text: "小喵咪看到好大的冻虾,飞奔过去!", delay: 3 },
      { text: "哇！~真开心", delay: 6 },
      { text: "咦...冰化了，虾怎么变这么小了？😫", delay: 9 },
    ];

    let timeline = gsap.timeline();
    timeline.to(
      {},
      {
        duration: 3,
        delay: 1,
        onStart: () => {
          // 切换到普通猫咪模型
          this.cat.playAnimation("idle");
        },
      }
    );

    // 第一幕：猫咪走路
    timeline.to(this.cat.position, {
      x: 2.5,
      duration: 2,
      ease: "power1.inOut",
      onStart: () => {
        // 切换到普通猫咪模型
        this.cat.playAnimation("walk");
      },
    });

    // 第二幕：发现大虾
    timeline.to(this.shrimp.position, {
      x: 0,
      duration: 2,
      delay: 1,
      onStart: () => {
        // 切换到冰冻虾子模型
        this.shrimp.showFrozenShrimp();
      },
    });

    // 第三幕：虾子融化
    timeline.to(
      {},
      {
        duration: 3,
        delay: 1,
        onStart: () => {
          this.particles.startMelting();
          // 切换回普通虾子模型
          this.shrimp.showNormalShrimp();
          this.cat.playAnimation("sad");
        },
      }
    );

    // 文字动画
    steps.forEach(({ text, delay }) => {
      timeline.add(() => {
        storyText.style.opacity = 0;
        setTimeout(() => {
          storyText.textContent = text;
          storyText.style.opacity = 1;
        }, 500);
      }, delay);
    });
  }

  animate() {
    const delta = this.clock.getDelta(); // 需要定义clock
    requestAnimationFrame(() => this.animate());

    this.particles.update(delta);
    this.cat.update(delta);
    this.scene.render();
  }
}

// 启动应用
window.addEventListener("DOMContentLoaded", () => {
  new App();
});
