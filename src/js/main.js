import * as THREE from 'three';
import {pingpong, randFloat, randFloatSpread, randInt} from "three/src/math/MathUtils.js";
import {AnimationMixer, VectorKeyframeTrack} from "three";
import * as TWEEN from '@tweenjs/tween.js'
import {BloomEffect, EffectComposer, EffectPass, OutlineEffect, RenderPass, SelectiveBloomEffect} from "postprocessing"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {MeshBasicMaterial, Object3D, Vector3} from "three";
import {radians, range, string} from "three/nodes";
import {Tween} from "@tweenjs/tween.js";
let mobile = false;

//Variables
const distance = 10; // Distance from the origi
const offsetY = 6; // Offset Y so the camera is above the origin
const dampening = 20; // Speed of the rotation
const targetAnim = {pos: 0.002, neg: -0.002 }; // Speed of the animation
let animSpeed = {pos: targetAnim.pos, neg: targetAnim.neg}// Speed of the animation
const rampSpeed = 0.00005
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 0.1, 1000 );
const cs = document.querySelector("#cs")
cs.addEventListener('mouseover', ()=>{
    highlightType("C#", cs.dataset.color)
})
cs.addEventListener('mouseout', ()=>{
    highlightType("C#", 0xffffff)
})
const unity = document.querySelector("#unity")
unity.addEventListener('mouseover', ()=>{
    highlightType("Unity", unity.dataset.color)
})
unity.addEventListener('mouseout', ()=>{
    highlightType("Unity", 0xffffff)
})
const js = document.querySelector("#js")
js.addEventListener('mouseover', ()=>{
    highlightType("JS", js.dataset.color)
})
js.addEventListener('mouseout', ()=>{
    highlightType("JS", 0xffffff)
})
const many = document.querySelector("#many")
many.addEventListener('mouseover', ()=>{
    highlightType("other", many.dataset.color)
})
many.addEventListener('mouseout', ()=>{
    highlightType("other", 0xffffff)
})
// Rendering
const canvas = document.getElementById("mainCanvas");
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio * 1.5);
var effects = []
renderer.setSize(window.innerWidth , window.innerHeight);
const renderScene = new RenderPass( scene, camera );
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Meshing
var loader = new GLTFLoader()
var tree;
const bloom  = new SelectiveBloomEffect(scene, camera, {luminanceThreshold: 0.1, intensity:0.8, mipmapBlur:true, radius:0.8, kernelSize: 1, levels:10  })
const outline = new OutlineEffect(scene, camera, {defaultThickness: 0.001, defaultColor: new THREE.Color(0xffffff), defaultAlpha: 0.8, defaultKeepAlive: true, defaultVisible: false, defaultSide: THREE.BackSide, defaultBlending: THREE.AdditiveBlending, ignoreMaterial: false, pulseSpeed: 0.0, visibleEdgeColor: new THREE.Color(0xffffff), hiddenEdgeColor: new THREE.Color(0x22090a), usePatternTexture: false, edgeThickness: 0.2, edgeStrength: 3.0, xRay: false, kernelSize: 2})

async function loadScene() {
        tree = await loader.loadAsync('/models/tree.glb',)
        tree = tree.scene.children[0]
        tree.rotation.set(0, 0, 0)
        tree.name = "tree"
        tree.material = new THREE.MeshBasicMaterial({color: 0x000000})
        scene.add(tree)

        // post processing
        outline.selection.add(tree)
        effects.push(outline)
        effects.push(bloom)
        const effectPass = new EffectPass(camera, ...effects);
        effectPass.renderToScreen=true;
        composer.addPass(effectPass)
        composer.addPass( renderScene );
        await addProjects();
        animate(); // stopped by default

}
loadScene()

// Generation
var projects = [];


async function addProjects() {
    projects = await fetch("/projects.json");
    projects = await projects.json();
    console.log(projects["Projects"]);
    tree.position.setY(-6)
    projects["Projects"].forEach((project) => {
        var proj;
        if (project.override_mesh.override === true){
            var loader = new FBXLoader();
            loader.load(project.override_mesh.mesh, function (object) {
                proj = object;
                proj.scale.set(project.override_mesh.scale.x, project.override_mesh.scale.y, project.override_mesh.scale.z);
                proj.rotation.set(project.override_mesh.rotation.x, project.override_mesh.rotation.y, project.override_mesh.rotation.z);
            })
        }else {
            proj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));
        }
        proj.position.set(project.position.x, project.position.y, project.position.z);
        tree.add(proj) // will rotate with tree
        proj.name = `${project.name_pub}:${project.id}`;
        bloom.selection.add(proj)
    })
    if(mobile){
        highlightType("C#", cs.dataset.color)
        highlightType("Unity", unity.dataset.color)
        highlightType("JS", js.dataset.color)
        highlightType("other", many.dataset.color)
    }
}



document.body.addEventListener('mousemove', onDocumentMouseMove, false);
document.body.addEventListener('touchmove', onDocumentTouchMove, false);

var spinObject = null;
var currentlyTweening = false;

function editDetails(proj) {
    const panel = document.getElementById("sidebar").children.namedItem('cont')
    console.log(panel)
    // Name link thing
    panel.children[0].children.namedItem("NameLink").setAttribute('href', proj.link)
    panel.children[0].children.namedItem("NameLink").innerText = "🔗 " + proj.name_pub;
    panel.children[0].children.namedItem("NameLink").cursor = "pointer"

    // Description things
    panel.children.namedItem('short').innerText = proj.short;
    panel.children.namedItem('descAccess').children.namedItem("Desc").innerText=proj.long;
    panel.children.namedItem('ver').innerHTML=proj.version;
    //Code
    panel.children.namedItem('code').innerHTML = ""
    if (mobile){
        document.querySelector("#sidebar").style.width = "92%"
        document.querySelector("#sidebar").style.left = "1rem"
        document.querySelector("#sidebar").style.right = "1rem"
    }
    var i = 0;
    proj.langs.forEach((lang) => {
        i++;
        var classlist = "text-center text-white inline-block changeToPercent"
        if(i === 1){
            classlist += " rounded-l-2xl"
        }if (i === proj.langs.length){
            classlist += " rounded-r-2xl"
        }
        if (parseFloat(lang.Percent.replace("%", "")) < 20){
            panel.children.namedItem('code').innerHTML += `<span class="${classlist}" style="--wid: ${lang.Percent};background: ${lang.Color};height: 16px;overflow: clip;">${lang.Name}</span>`
        }else{
            panel.children.namedItem('code').innerHTML += `<span class="${classlist}" style="--wid: ${lang.Percent};background: ${lang.Color};height: 16px;overflow: clip;">${lang.Percent} ${lang.Name}</span>`
        }

    })
    panel.children.namedItem("completed").innerText = "Completed On: " + proj.date_published
    panel.children.namedItem('updated').innerText = "Last Updated: " + (proj.date_updated ?? "Never")
    document.querySelector("#rep1").innerHTML = ""
    document.querySelector("#rep2").innerHTML= ""
    proj.images.forEach((image) => {
        document.querySelector("#rep1").innerHTML += `<li><img src="${image}"></li>`
        document.querySelector("#rep2").innerHTML += `<li><img src="${image}"></li>`

    })
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    var ray = new THREE.Raycaster()
    var pointer = new THREE.Vector2()
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    ray.setFromCamera(pointer, camera)
    var intersects = ray.intersectObjects(tree.children)[0];
    if (intersects && !currentlyTweening) {
        currentlyTweening = true;
        var swap = false;
        if(spinObject !== null){
            animRotate=false;
            swap = true;
            tree.attach(spinObject);
            new TWEEN.Tween(spinObject.rotation).to({x: 0, y: 0, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
                var proj = projects["Projects"].filter((r) => {return r.id == spinObject.name.split(':')[1]})[0]
                new TWEEN.Tween(spinObject.position).to({x: proj.position.x, y:proj.position.y,z:proj.position.z}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                    spinObject.rotation.set(0,0,0)
                    animRotate=true;
                    spinObject = null;
                });});
        }
        scene.attach(intersects.object);
        var proj = projects["Projects"].filter((r) => {return r.id == intersects.object.name.split(':')[1]})[0]
        var xtarg= -12.4;
        if (mobile){
            xtarg = 0;
        }
        var vector = new THREE.Vector3((document.querySelector("#sidebar").offsetLeft + document.querySelector("#sidebar").clientWidth/2)/10, (document.querySelector("#sidebar").offsetTop + document.querySelector("#sidebar").clientHeight + 20)/10, -1 ).unproject( camera );
        console.log((document.querySelector("#sidebar").offsetLeft + document.querySelector("#sidebar").clientWidth/2)/10, (document.querySelector("#sidebar").offsetTop + document.querySelector("#sidebar").clientHeight + 50)/10)
        xtarg = (-vector.y-vector.x)/2;
        new TWEEN.Tween(intersects.object.rotation).to({x: 4, y: 4, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
            new TWEEN.Tween(intersects.object.position).to({x: 0, y: -4, z: 3}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                console.log("pos",intersects.object.position)
                spinObject = intersects.object;
                editDetails(proj)
                currentlyTweening = false;
                var infoPanel = document.getElementById("sidebar");
                if(infoPanel.classList.contains("invisible")){
                    infoPanel.classList.remove("invisible"); // first time
                    infoPanel.getAnimations()[0].play();
                } else if (!swap){
                    infoPanel.getAnimations()[0].reverse()
                }
            });});

    } else if (ray.intersectObjects(scene.children).length > 0 &&!currentlyTweening) {
        if (ray.intersectObjects(scene.children)[0].object === spinObject) {
            currentlyTweening = true;
            animRotate=false;
            tree.attach(spinObject);
            var infoPanel = document.getElementById("sidebar");
            infoPanel.getAnimations()[0].reverse()
            new TWEEN.Tween(spinObject.rotation).to({x: 0, y: 0, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
                var pos = projects["Projects"].filter((r) => {return r.id == spinObject.name.split(':')[1]})[0].position
                new TWEEN.Tween(spinObject.position).to({x: pos.x, y:pos.y,z:pos.z}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                    spinObject.rotation.set(0,0,0)
                    spinObject = null;
                    currentlyTweening = false;
                    animRotate=true;
                    var infoPanel = document.getElementById("sidebar")
                });});
        }

    }
}

document.body.addEventListener('mousedown', onDocumentMouseDown, false);

camera.position.z = 5;

camera.position.set(0, offsetY, distance);
camera.lookAt(0, 0, 0);

let animRotate = false;
let animDirection = "pos";
let ramping = false;
function animate() {
    if(spinObject) {
        spinObject.rotation.x += 0.01;
    }
    if(animRotate) {
        if(animDirection === "pos") {
            if (ramping) {
                if(animSpeed.pos >= targetAnim.pos) {
                    animSpeed.pos = targetAnim.pos
                    ramping = false;
                }
                animSpeed.pos += rampSpeed;

            }
            tree.rotation.y += animSpeed.pos;
        }
        else if(animDirection === "neg") {
            if (ramping) {
                if (animSpeed.neg <= targetAnim.neg){
                    animSpeed.neg = targetAnim.neg //clamp
                    ramping=false;
                }
                animSpeed.neg -= rampSpeed;

            }
            tree.rotation.y += animSpeed.neg;
        }
    }
    TWEEN.update()
    requestAnimationFrame(animate);
    composer.render()
}
// animRotate = true;

function normalize(value, min, max) {
    console.log((value - min) / (max - min))
    return (value - min) / (max - min);

}

var timeout;

function highlightType(name, color){
    //filter for name tag in main-lang attribute
    projects["Projects"].forEach((proj) => {
        if(proj.langident === name){
            console.log(proj.id)
            var obj = scene.getObjectByName(`${proj.name_pub}:${proj.id}`)
            obj.material = new MeshBasicMaterial({color: color})
        }
    })
}


function onDocumentMouseMove(event) {
    var ray = new THREE.Raycaster()
    var pointer = new THREE.Vector2()
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    ray.setFromCamera(pointer, camera)
    var intersects = ray.intersectObjects(tree.children)[0];
    if (intersects) {
        document.body.style.cursor = "pointer";
    }else if (ray.intersectObjects(scene.children).length > 0 && ray.intersectObjects(scene.children)[0].object === spinObject) {
        document.body.style.cursor = "pointer";
    }else {
        document.body.style.cursor = "default";
    }
    if(event.buttons > 0) { // if mouse down
        animRotate = false;
        const deltaX = event.movementX * normalize(dampening, 0, window.outerWidth);
        if (event.movementX > 0) {
            animDirection = "pos";
        }else if (event.movementY < 0) {
            animDirection = "neg";
        }
        tree.rotation.y += deltaX;
        composer.render()
        if (!animRotate && !timeout){
            timeout = setTimeout(()=> {autoSpin()}, 3000); // wait 1 second before starting rotation after last mouse movement
        }
    }
    composer.render()

}

function autoSpin(){
    animRotate = true;
    timeout = undefined;
    animSpeed.neg = 0;

    animSpeed.pos = 0;
    ramping=true
}
var prevX = 0;
function onDocumentTouchMove(event) {
    event.preventDefault();
    if(event.touches.length > 0) { // if mouse down
        animRotate = false;
        const deltaX = event.touches[0].pageX - prevX;
        prevX = event.touches[0].pageX;
        if (deltaX > 0) {
            animDirection = "pos";
        } else if (deltaX < 0) {
            animDirection = "neg";
        }
        tree.rotation.y += deltaX * normalize(dampening, 0, window.outerWidth);
        composer.render()
        if (!animRotate && !timeout) {
            timeout = setTimeout(() => {autoSpin()}, 3000); // wait 1 second before starting rotation after last mouse movement
        }
    }

}
function onDocumentTouch(event) {
    event.preventDefault();
    var ray = new THREE.Raycaster()
    var pointer = new THREE.Vector2()
    pointer.x = (event.touches[0].x / window.innerWidth) * 2 - 1;
    pointer.y = -(event.touches[0].y / window.innerHeight) * 2 + 1;
    ray.setFromCamera(pointer, camera)
    var intersects = ray.intersectObjects(tree.children)[0];
    console.log(intersects)
    if (intersects && !currentlyTweening) {
        currentlyTweening = true;
        var swap = false;
        if(spinObject !== null){
            animRotate=false;
            swap = true;
            tree.attach(spinObject);
            new TWEEN.Tween(spinObject.rotation).to({x: 0, y: 0, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
                var proj = projects["Projects"].filter((r) => {return r.id == spinObject.name.split(':')[1]})[0]
                new TWEEN.Tween(spinObject.position).to({x: proj.position.x, y:proj.position.y,z:proj.position.z}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                    spinObject.rotation.set(0,0,0)
                    animRotate=true;
                    spinObject = null;
                });});
        }
        scene.attach(intersects.object);
        var proj = projects["Projects"].filter((r) => {return r.id == intersects.object.name.split(':')[1]})[0]
        let target = new THREE.Vector2();
        target.y = document.querySelector("#sidebar").offsetTop + document.querySelector("#sidebar").height + 10;
        target.x = document.querySelector("#sidebar").innerWidth / 2
        ay.setFromCamera(target, camera)

        new TWEEN.Tween(intersects.object.rotation).to({x: 4, y: 4, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
            new TWEEN.Tween(intersects.object.position).to({x: middle, y: 2, z: 3}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                spinObject = intersects.object;
                editDetails(proj)
                currentlyTweening = false;
                var infoPanel = document.getElementById("sidebar");
                if(infoPanel.classList.contains("invisible")){
                    infoPanel.classList.remove("invisible"); // first time
                    infoPanel.getAnimations()[0].play();
                } else if (!swap){
                    infoPanel.getAnimations()[0].reverse()
                }
            });});

    } else if (ray.intersectObjects(scene.children).length > 0 &&!currentlyTweening) {
        if (ray.intersectObjects(scene.children)[0].object === spinObject) {
            currentlyTweening = true;
            animRotate=false;
            tree.attach(spinObject);
            var infoPanel = document.getElementById("sidebar");
            infoPanel.getAnimations()[0].reverse()
            new TWEEN.Tween(spinObject.rotation).to({x: 0, y: 0, z: 0}, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
                var pos = projects["Projects"].filter((r) => {return r.id == spinObject.name.split(':')[1]})[0].position
                new TWEEN.Tween(spinObject.position).to({x: pos.x, y:pos.y,z:pos.z}, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(()=>{
                    spinObject.rotation.set(0,0,0)
                    spinObject = null;
                    currentlyTweening = false;
                    animRotate=true;
                    var infoPanel = document.getElementById("sidebar")
                });});
        }

    }
}
document.body.addEventListener('touchstart', onDocumentTouch, false);
var randomTimeout;
function randomize(el, target = null) {
    var inital;
    if(target === null) { inital = el.innerText }
    else { inital = target }
    var i = 0;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    randomTimeout =setInterval(() => {
        i += 1;
        var letters = [];
        [...inital].forEach((letter) => {
            if(inital.indexOf(letter) <= i) {
                letters.push(letter)
            }
            else {
                letters.push(alphabet[Math.floor(Math.random() * alphabet.length)])
            }})
        el.innerHTML = letters.join("")
        if(i >= inital.length) {
            clearInterval(randomTimeout)
        }
    }, 45)

}

window.addEventListener('load', () =>{
    timeout = setTimeout(() => {autoSpin()}, 1000);
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        mobile = true;
        // Goes to load projects, and then highlights the languages
    }
    document.querySelectorAll(".randomizeIn").forEach((el) => {
        randomize(el)
    })
})

var mail = document.getElementById("mail")
mail.addEventListener('mouseenter', () => {
    if(randomTimeout) clearInterval(randomTimeout)
    randomize(mail, "juniper@circuit-cat.com")
    mail.addEventListener('click', (event) => {
        event.preventDefault();
        navigator.clipboard.writeText("juniper@circuit-cat.com")
        mail.innerText = "Copied!"
    })
})
mail.addEventListener('mouseleave', () => {
    if(randomTimeout) clearInterval(randomTimeout)
    randomize(mail, "Email")
});

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
