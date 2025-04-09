import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


@Component({
  selector: 'app-bottle3d-black',
  imports: [],
  templateUrl: './bottle3d-black.component.html',
  styleUrl: './bottle3d-black.component.css'
})
export class Bottle3dBlackComponent implements OnInit {
  @ViewChild('bottleblack', { static: true }) canvasRef!: ElementRef;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  loader!: GLTFLoader;

  ngOnInit() {
    this.initScene();
    this.loadModel();
    this.animate();
  }

   initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = null;
    
      this.camera = new THREE.PerspectiveCamera(55, 1, 0.01, 100); 
      this.camera.position.set(0, 20, 50);
    
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvasRef.nativeElement,
        alpha: true 
      });
    
      const renderWidth = 300; 
      const renderHeight = 400; 
      this.renderer.setSize(renderWidth, renderHeight);
    
      this.canvasRef.nativeElement.style.width = `${renderWidth}px`;
      this.canvasRef.nativeElement.style.height = `${renderHeight}px`;
    
      const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
      this.scene.add(light);
    }

  loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load('bottle-black.glb', (gltf: any) => {
      const model = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
  
      model.traverse((child: any) => {
        if (child.isMesh) {
          const material = child.material;
          if (material) {
            material.metalness = -1.5; 
            material.roughness = 1;
            material.emissive = new THREE.Color(0x3333333);
          }
        }
      });

      model.rotation.y = Math.PI / 0.75;
  
      this.camera.position.set(center.x, center.y, size * 1.5);
      this.camera.lookAt(center);
  
      this.scene.add(model);
    });
  }
  
  

  animate() {
    requestAnimationFrame(() => this.animate());
  
    this.scene.children.forEach((child) => {
      if(child.isObject3D){
        child.rotation.y -= 0.01;
      }
    })

    this.renderer.render(this.scene, this.camera);
  }  
}
