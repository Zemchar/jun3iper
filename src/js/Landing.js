//LANDING PAGE SCRIPTING

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import {EffectComposer, EffectPass, OutlineEffect, RenderPass, SelectiveBloomEffect} from "postprocessing"
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// import {MeshBasicMaterial} from "three";
// import scene from "three/addons/offscreen/scene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
}
manager.onLoad = function () {
    console.log('Loading complete!');
    setTimeout(() => {
        document.querySelector("#loading").getAnimations()[0].play()
        document.querySelector("#introContainer").classList.remove("invisible")
        document.querySelector("#loading").getAnimations()[0].onfinish = () => {
            document.querySelector("#loading").remove();
        }
        document.querySelectorAll(".randomizeIn").forEach((el) => {
            randomize(el)
        })

    }, 500)
}


const targetAnim = {pos: 0.002, neg: -0.002}; // Speed of the animation

const scene = new THREE.Scene();
let photoActive = false;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Rendering
const canvas = document.getElementById("mainCanvas");
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio * 1.5);
let effects = []
renderer.setSize(window.innerWidth, window.innerHeight);
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
let loader = new GLTFLoader(manager)





// Post Processing And shaders
const bloom = new SelectiveBloomEffect(scene, camera, {
    luminanceThreshold: 0.1,
    intensity: 0.8,
    mipmapBlur: true,
    radius: 0.8,
    kernelSize: 1,
    levels: 10
})

let programming;
let photo;
// SETUP //
async function loadModels(){
    programming = await loader.loadAsync("/models/ProgrammingIcon.glb", )
    photo = await loader.loadAsync("/models/Icons.glb")
    photo = photo.scene.children[0]
    programming = programming.scene.children[0]
    programming.rotation.x = 90
    photo.name = "Photography"
    programming.name="Programming"
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        programming.position.set(0, 1, 1)
        photo.position.set(0, -0.5, 0);
    }else{
        photo.position.x = -2; // left
        programming.position.x = 2;
    }
    console.log(programming.material.color);
    programming.material = new THREE.MeshBasicMaterial({color: 0xffffff})
    photo.material = new THREE.MeshBasicMaterial({color: 0xffffff})

    console.log(programming.material.color);

    bloom.selection.add(photo)
    bloom.selection.add(programming)
    effects.push(bloom)
    const effectPass = new EffectPass(camera, ...effects);
    effectPass.renderToScreen = true;
    composer.addPass(effectPass)
    composer.addPass(renderScene);
    scene.add(programming)
    scene.add(photo)
    programming.mesh = photo.mesh
    camera.position.set(0, 1, 5)
    animate()

}

loadModels()


function animate() {
    photo.rotation.y += 0.01;
    programming.rotation.y -= 0.01;
    TWEEN.update()
    requestAnimationFrame(animate);
    composer.render()
}



document.addEventListener('mousemove', onDocumentMouseMove, false)
document.addEventListener('mousedown', onDocumentMouseDown, false)

document.body.addEventListener('touchstart', onDocumentTouch, false);
function onDocumentTouch(event) {
    event.preventDefault();
    console.log(event.touches)
    selectorLogic(event.touches[0].clientX, event.touches[0].clientY)
}
function onDocumentMouseDown(event) {
    event.preventDefault();
    selectorLogic(event.clientX, event.clientY)
}
function onDocumentMouseMove(event) {
    let ray = new THREE.Raycaster()
    let pointer = new THREE.Vector2()
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    ray.setFromCamera(pointer, camera)
    let intersects = ray.intersectObjects(scene.children)[0];
    if (intersects) {
        document.body.style.cursor = "pointer";
    } else if (ray.intersectObjects(scene.children).length > 0 && ray.intersectObjects(scene.children)[0].object === spinObject) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

function selectorLogic(xpoint, ypoint) {
    let ray = new THREE.Raycaster()
    let pointer = new THREE.Vector2()
    pointer.x = (xpoint / window.innerWidth) * 2 - 1;
    pointer.y = -(ypoint / window.innerHeight) * 2 + 1;
    // Find intersections with raycaster
    ray.setFromCamera(pointer, camera)
    let intersects = ray.intersectObjects(scene.children)[0];
    if (intersects) {
        if(document.getElementById("businessCard").classList.contains("animate")) {// If the business card is shown
            document.getElementById("businessCard").classList.remove("animate")
            document.getElementById("businessCard").classList.remove("straightened")
            void document.getElementById("businessCard").offsetWidth; // trigger a reflow
            document.getElementById("businessCard").classList.add("exit")
            return;
        }
        console.log(intersects)
        window.location.assign("pages/" +intersects.object.name + ".html")
    }
}

// Vite you force my hand
let age = document.getElementById("age");
age.innerText = timeSince(new Date("September 2, 2005"));
function timeSince(date) {

    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        console.log(interval + " year old");
        return Math.floor(interval) + " year old";
    }
}


document.querySelector("a#developer").addEventListener("mouseenter", () => {
    new TWEEN.Tween(programming.scale).to({x: 1.2, y: 1.2, z: 1.2}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(photo.scale).to({x: 0.8, y: 0.8, z: 0.8}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(programming.material.color).to({r: 1, g: 0.6, b: 0.9}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
});
document.querySelector("a#developer").addEventListener("mouseleave", () => {
    new TWEEN.Tween(programming.scale).to({x: 1, y: 1, z: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(photo.scale).to({x: 1, y: 1, z: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(programming.material.color).to({r: 1, g: 1, b: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
});

document.querySelector("a#photographer").addEventListener("mouseenter", () => {
    new TWEEN.Tween(photo.scale).to({x: 1.2, y: 1.2, z: 1.2}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(programming.scale).to({x: 0.8, y: 0.8, z: 0.8}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(photo.material.color).to({r: 1, g: 0.6, b: 0.9}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
});

document.querySelector("a#photographer").addEventListener("mouseleave", () => {
    new TWEEN.Tween(photo.scale).to({x: 1, y: 1, z: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(programming.scale).to({x: 1, y: 1, z: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
    new TWEEN.Tween(photo.material.color).to({r: 1, g: 1, b: 1}, 200).easing(TWEEN.Easing.Sinusoidal.InOut).start()
});
window.addEventListener("resize", () => {
    console.log("Resizing")
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

