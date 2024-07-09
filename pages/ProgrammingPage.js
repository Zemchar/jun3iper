import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import {EffectComposer, EffectPass, OutlineEffect, RenderPass, SelectiveBloomEffect} from "postprocessing"
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshBasicMaterial} from "three";
import {color} from "three/nodes";
import colors from "tailwindcss/colors.js";

let mobile = false;

const manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
}
const cs = document.querySelector("#cs")
const unity = document.querySelector("#unity")
const js = document.querySelector("#js")
const many = document.querySelector("#many")

let profile;
fetch("/profile.json").then((r) => {r.json().then((r) => {profile = r})}) // this is stupid why is it like this javascript i hate you
manager.onLoad = function () {
    console.log('Loading complete!');
    console.log(profile)
    setTimeout(() => {
        cs.addEventListener('mouseover', () => {
            highlightType("C#", cs.dataset.color, false, 1500)
        })
        cs.addEventListener('mouseout', () => {
            highlightType("C#", "#ffffff", true, 1500, )
        })
        unity.addEventListener('mouseover', () => {
            highlightType("Unity", unity.dataset.color)
        })
        unity.addEventListener('mouseout', () => {
            highlightType("Unity", "#ffffff", true, 1500)
        })
        js.addEventListener('mouseover', () => {
            highlightType("JS", js.dataset.color)
        })
        js.addEventListener('mouseout', () => {
            highlightType("JS", "#ffffff", true, 1500)
        })
        many.addEventListener('mouseover', () => {
            highlightType("other", many.dataset.color)
        })
        many.addEventListener('mouseout', () => {
            highlightType("other", "#ffffff", true, 1500)
        })
        document.querySelector("#loading").getAnimations()[0].play()
        document.querySelector("#nameContainer").classList.remove("invisible")
        document.querySelector("#loading").getAnimations()[0].onfinish = () => {
            document.querySelector("#loading").remove();
        }
        document.querySelectorAll(".randomizeIn").forEach((el) => {
            randomize(el)
        })

    }, 500) // I worked HARD on that loading screen
}
manager.onError = function (url) {
    console.log('There was an error loading ' + url);
    location.reload();  // reloads the page if there is an error
}


//Variables
const distance = 10; // Distance from the origin
const offsetY = 6; // Offset Y so the camera is above the origin
const dampening = 20; // Speed of the rotation
const targetAnim = {pos: 0.002, neg: -0.002}; // Speed of the animation
let animSpeed = {pos: targetAnim.pos, neg: targetAnim.neg}// Speed of the animation
const rampSpeed = 0.00005
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

// Meshing
let loader = new GLTFLoader(manager)
let tree;

// Post Processing And shaders
const bloom = new SelectiveBloomEffect(scene, camera, {
    luminanceThreshold: 0.1,
    intensity: 0.8,
    mipmapBlur: true,
    radius: 0.8,
    kernelSize: 1,
    levels: 10
})
const outline = new OutlineEffect(scene, camera, {
    defaultThickness: 0.001,
    defaultColor: new THREE.Color(0xffffff),
    defaultAlpha: 0.8,
    defaultKeepAlive: true,
    defaultVisible: false,
    defaultSide: THREE.BackSide,
    defaultBlending: THREE.AdditiveBlending,
    ignoreMaterial: false,
    pulseSpeed: 0.0,
    visibleEdgeColor: new THREE.Color(0xffffff),
    hiddenEdgeColor: new THREE.Color(0x22090a),
    usePatternTexture: false,
    edgeThickness: 0.2,
    edgeStrength: 3.0,
    xRay: false,
    kernelSize: 2
})

async function loadScene() {
    tree = new  THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0x000000}))
    // tree = tree.scene.children[0]
    tree.rotation.set(0, 0, 0)
    tree.name = "tree"
    scene.add(tree)
    console.log(tree.scale, tree.position)

    // post processing
    outline.selection.add(tree)
    // effects.push(outline)
    effects.push(bloom)
    const effectPass = new EffectPass(camera, ...effects);
    effectPass.renderToScreen = true;
    composer.addPass(effectPass)
    composer.addPass(renderScene);
    await addProjects();
    animate(); // stopped by default

}

loadScene()

// Generation
/**
 * the main projects dictionary file
 */
let projects = [];
async function addProjects() {
    projects = await fetch("/projects.json");
    projects = await projects.json();
    console.log(projects["Projects"]);
    tree.position.setY(-6)
    for (const project of projects["Projects"]) {
        let proj;
        if (project.override_mesh.override === true) {
            console.log(project.override_mesh.path);
            proj = await loader.loadAsync(project.override_mesh.path)
            proj = proj.scene.children[0]
            console.log(proj)
            proj.scale.set(project.override_mesh.scale.x +0.2, project.override_mesh.scale.y+0.2, project.override_mesh.scale.z+0.2);
            proj.rotation.set((project.override_mesh.rotation.x === -1) ? Math.random()*180 : project.override_mesh.rotation.x
                ,(project.override_mesh.rotation.y === -1) ? Math.random()*180 : project.override_mesh.rotation.y
                ,(project.override_mesh.rotation.z === -1   ) ? Math.random()*180 : project.override_mesh.rotation.z);
            proj.material = new THREE.MeshBasicMaterial({color: 0xffffff})
        } else {
            proj = await loader.loadAsync("/models/ProgrammingIcon.glb")
            proj = proj.scene.children[0]
            proj.rotation.set(90, Math.random()*180, Math.random()*180)
            proj.scale.set(proj.scale.x+0.4, proj.scale.y+0.4, proj.scale.z+0.4)
            proj.material = new THREE.MeshBasicMaterial({color: 0xffffff})

        }
        proj.position.set(project.position.x, project.position.y, project.position.z);
        tree.add(proj) // will rotate with tree
        proj.name = `${project.name_pub}:${project.id}`;
        bloom.selection.add(proj)
    }
    if (mobile) {
        highlightType("C#", cs.dataset.color)
        highlightType("Unity", unity.dataset.color)
        highlightType("JS", js.dataset.color)
        highlightType("other", many.dataset.color)
    }
}

// Use an object to store animation state

let spinObject = null;
let currentlyTweening = false;


function embedPhoto(proj) {
    window.location.href = `${window.location.origin}/photostrips/${proj.embed_path}`; // TODO: Embed Own PhotoSystem
        // photoActive=true;
    // if(document.getElementById("photoembed").classList.contains("invisible")){
    //     document.getElementById("photoembed").classList.remove("invisible")
    // }
    // document.getElementById("photoembed").src = `${window.location.origin}/photostrips/${proj.embed_path}`
}

function editDetails(proj) {
    if(proj.name_pub === "Juniper" && spinObject !== "Juniper" && spinObject !== null){
        return; // dont break\
    }else if(proj.langident === "photo"){
        embedPhoto(proj);
        return;
    }
    const panel = document.getElementById("sidebar").children.namedItem('cont')
    // Name link thing
    panel.children[0].children.namedItem("NameLink").setAttribute('href', proj.link)
    panel.children[0].children.namedItem("NameLink").innerText = "🔗 " + proj.name_pub;
    panel.children[0].children.namedItem("NameLink").cursor = "pointer"

    // Description things
    panel.children.namedItem('short').innerHTML = proj.short;
    panel.children.namedItem('descAccess').children.namedItem("Desc").innerHTML = proj.long;
    panel.children.namedItem('ver').innerHTML = proj.version;
    //Code
    panel.children.namedItem('codeBar').innerHTML = ""
    panel.children.namedItem("circles").innerHTML = ""
    if (mobile) {
        document.querySelector("#sidebar").style.width = "92%"
        document.querySelector("#sidebar").style.left = "1rem"
        document.querySelector("#sidebar").style.right = "1rem"
    }
    let i = 0;
    proj["langs"].forEach((lang) => {
        i++;
        let classlist = "text-center text-white inline-block changeToPercent"
        if (i === 1) { // first element in code bar
            classlist += " rounded-l-2xl" //only round the left
        }
        if (i === proj.langs.length) { // last element in the code bar
            classlist += " rounded-r-2xl"
        }
        panel.children.namedItem('codeBar').innerHTML += `<span class="${classlist}" style="--wid: ${lang.Percent};background: ${lang.Color};height: 16px;overflow: clip;"></span>`
        panel.children.namedItem("circles").innerHTML += `<div><div class="codeCircle" style="--bgc: ${lang.Color}"></div><span>${lang.Name}  <a> ${lang.Percent}</a></span></div>`

    })
    panel.children.namedItem("completed").innerText = "Completed On: " + proj.date_published
    panel.children.namedItem('updated').innerText = "Last Updated: " + (proj.date_updated ?? "Never")
    document.querySelector("#rep1").innerHTML = ""
    document.querySelector("#rep2").innerHTML = ""
    proj.images.forEach((image) => {
        document.querySelector("#rep1").innerHTML += `<li><img src="${image}"></li>`
        document.querySelector("#rep2").innerHTML += `<li><img src="${image}"></li>`

    })
    if (proj.name_pub === "Juniper") { // special case for personal profile
        let infoPanel = document.getElementById("sidebar");
        if (infoPanel.classList.contains("invisible")) {
            infoPanel.classList.remove("invisible"); // first time
            infoPanel.getAnimations()[0].play();
            spinObject = "Juniper";
        } else {
            spinObject = (spinObject === "Juniper") ? null : "Juniper";
            infoPanel.getAnimations()[0].reverse()
        }
    }
}


camera.position.z = 5;

camera.position.set(0, offsetY, distance);
camera.lookAt(0, 0, 0);

let animRotate = false;
let animDirection = "pos";
let ramping = false;

function animate() {
    if (spinObject && spinObject !== "Juniper") {
        spinObject.rotation.x += 0.01;
    }
    if (animRotate) {
        if (animDirection === "pos") {
            if (ramping) {
                if (animSpeed.pos >= targetAnim.pos) {
                    animSpeed.pos = targetAnim.pos
                    ramping = false;
                }
                animSpeed.pos += rampSpeed;

            }
            tree.rotation.y += animSpeed.pos;
        } else if (animDirection === "neg") {
            if (ramping) {
                if (animSpeed.neg <= targetAnim.neg) {
                    animSpeed.neg = targetAnim.neg //clamp
                    ramping = false;
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
    return (value - min) / (max - min);
}

let timeout;

function highlightType(name, color, fade = false, fadedir = 1000, directName = false) {
    //filter for name tag in main-lang attribute
    if(directName){
        let obj = scene.getObjectByName(`${name}`)
        if (fade) {
            let rgb = hexToRgb(color)
            console.log(`Fading to ${color}`)
            new TWEEN.Tween(obj.material.color).to({
                r: rgb.r,
                g: rgb.g,
                b: rgb.b
            }, fadedir).easing(TWEEN.Easing.Exponential.InOut).start()
        } else {
            obj.material = new MeshBasicMaterial({color: color})
        }
    }

    projects["Projects"].forEach((proj) => {
        if (proj.langident === name || name === "ALL") {
            let obj = scene.getObjectByName(`${proj.name_pub}:${proj.id}`)
            if (fade) {
                let rgb = hexToRgb(color)
                console.log(`Fading to ${color}`)
                new TWEEN.Tween(obj.material.color).to({
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b
                }, fadedir).easing(TWEEN.Easing.Exponential.InOut).start()
            } else {
                obj.material = new MeshBasicMaterial({color: color})
            }
        }
    })
}



function autoSpin() {
    animRotate = true;
    timeout = undefined;
    animSpeed.neg = 0;

    animSpeed.pos = 0;
    ramping = true
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
// Small optimization to not constantly re-fade the objects if one hasnt been passed over
let needsToFade = false
function onDocumentMouseMove(event) {
    let ray = new THREE.Raycaster()
    let pointer = new THREE.Vector2()
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    ray.setFromCamera(pointer, camera)
    let intersects = ray.intersectObjects(tree.children)[0];
    if (intersects) {
        document.body.style.cursor = "pointer";
        let color = projects["Projects"].filter(element => element.id == intersects.object.name.split(":")[1])
        switch (color[0].langident) {
            case "Unity":
                color = unity.dataset.color;
                break;
            case "C#":
                color = cs.dataset.color;
                break;
            case "JS":
                color = js.dataset.color;
                break;
            default:
                color = many.dataset.color;
                break;
        }
        highlightType(intersects.object.name, color, false, 1500, true)
        needsToFade = true
    } else if (ray.intersectObjects(scene.children).length > 0 && ray.intersectObjects(scene.children)[0].object === spinObject) {
        document.body.style.cursor = "pointer";
        let color = projects["Projects"].filter(element => element.id == ray.intersectObjects(scene.children)[0].object.name.split(":")[1])
        switch (color[0].langident) {
            case "Unity":
                color = unity.dataset.color;
                break;
            case "C#":
                color = cs.dataset.color;
                break;
            case "JS":
                color = js.dataset.color;
                break;
            default:
                color = many.dataset.color;
                break;
        }
        highlightType(ray.intersectObjects(scene.children)[0].object.name, color, false, 1500, true)
        needsToFade = true
    } else {
        document.body.style.cursor = "default";
        if(needsToFade) {
            highlightType("ALL", "#ffffff", true, 1500, false)
            needsToFade = false;
        }
    }
    if (event.buttons > 0) { // if mouse down
        animRotate = false;
        const deltaX = event.movementX * normalize(dampening, 0, window.outerWidth);
        if (event.movementX > 0) {
            animDirection = "pos";
        } else if (event.movementY < 0) {
            animDirection = "neg";
        }
        tree.rotation.y += deltaX;
        composer.render()
        if (!animRotate && !timeout) {
            timeout = setTimeout(() => {
                autoSpin()
            }, 3000); // wait 1 second before starting rotation after last mouse movement
        }
    }
    composer.render()

}



let prevX = 0;

function onDocumentTouchMove(event) {
    event.preventDefault();
    if (event.touches.length > 0) { // if mouse down
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
            timeout = setTimeout(() => {
                autoSpin()
            }, 3000); // wait 1 second before starting rotation after last mouse movement
        }
    }

}

function selectorLogic(xpoint, ypoint) {
    let ray = new THREE.Raycaster()
    let pointer = new THREE.Vector2()
    pointer.x = (xpoint/ window.innerWidth) * 2 - 1;
    pointer.y = -(ypoint / window.innerHeight) * 2 + 1;
    // Find intersections with raycaster
    ray.setFromCamera(pointer, camera)
    let intersects = ray.intersectObjects(tree.children)[0];
    if (intersects && !currentlyTweening) {
        if(document.getElementById("businessCard").classList.contains("animate")) {// If the business card is shown
            document.getElementById("businessCard").classList.remove("animate")
            document.getElementById("businessCard").classList.remove("straightened")
            void document.getElementById("businessCard").offsetWidth; // trigger a reflow
            document.getElementById("businessCard").classList.add("exit")
        }
        // Move intersected object to center
        currentlyTweening = true;
        let swap = false;
        let randRot ={x: (Math.random()*180)/100, y:(Math.random()*180)/100, z:(Math.random()*180)/100}

        breakjuniper: if (spinObject !== null ) {
            if (spinObject === "Juniper") {swap = true; break breakjuniper;} // THIS IS SO COOL
            // Swap: Another object is already selected
            animRotate = false;
            swap = true;
            tree.attach(spinObject);
            new TWEEN.Tween(spinObject.rotation).to({
                x: 0,
                y: 0,
                z: 0
            }, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(function() {
                let proj = projects["Projects"].filter((r) => {
                    return r.id == spinObject.name.split(':')[1]
                })[0]
                new TWEEN.Tween(spinObject.position).to({
                    x: proj.position.x,
                    y: proj.position.y,
                    z: proj.position.z
                }, 1000).easing(TWEEN.Easing.Elastic.InOut).onStart(()=>{
                    new TWEEN.Tween(spinObject.rotation).to({...randRot}, 1000).easing(TWEEN.Easing.Elastic.InOut).start();
                }).start().onComplete(() => {
                    animRotate = true;
                    spinObject = null;

                });
            });
        }

        // selected object: send to center
        scene.attach(intersects.object);
        let proj = projects["Projects"].filter((r) => {
            return r.id == intersects.object.name.split(':')[1]
        })[0]

        new TWEEN.Tween(intersects.object.rotation).to({
            x: 4,
            y: 4,
            z: 0
        }, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
            new TWEEN.Tween(intersects.object.position).to({
                x: 0,
                y: -3,
                z: 3
            }, 1000).easing(TWEEN.Easing.Elastic.InOut).start().onComplete(() => {
                spinObject = intersects.object;
                editDetails(proj)
                currentlyTweening = false;
                let infoPanel = document.getElementById("sidebar");
                if (infoPanel.classList.contains("invisible") && !photoActive) {
                    infoPanel.classList.remove("invisible"); // first time
                    infoPanel.getAnimations()[0].play();
                } else if (!swap) {
                    infoPanel.getAnimations()[0].reverse()
                }
            });
        });

    } else if (ray.intersectObjects(scene.children).length > 0 && !currentlyTweening && ray.intersectObjects(scene.children)[0].object === spinObject) {
        currentlyTweening = true;
        animRotate = false;
        let randRot ={x: (Math.random()*180)/100, y:(Math.random()*180)/100, z:(Math.random()*180)/100}

        tree.attach(spinObject);
        let infoPanel = document.getElementById("sidebar");
        infoPanel.getAnimations()[0].reverse()
        new TWEEN.Tween(spinObject.rotation).to({
            x: 0,
            y: 0,
            z: 0
        }, 200).easing(TWEEN.Easing.Linear.None).start().onComplete(() => {
            let pos = projects["Projects"].filter((r) => {
                return r.id == spinObject.name.split(':')[1] // type conversion because sometimes id tags can get fucky
            })[0].position
            new TWEEN.Tween(spinObject.position).to({
                x: pos.x,
                y: pos.y,
                z: pos.z
            }, 1000).easing(TWEEN.Easing.Elastic.InOut).onStart(()=>{
                new TWEEN.Tween(spinObject.rotation).to({...randRot}, 1000).easing(TWEEN.Easing.Elastic.InOut).start();
            }).start().onComplete(() => {
                spinObject = null;
                currentlyTweening = false;
                animRotate = true;
            });
        });
    }
}

// Movement Handlers
function onDocumentTouch(event) {
    event.preventDefault();
    console.log(event.touches)
    selectorLogic(event.touches[0].clientX, event.touches[0].clientY)
}

document.body.addEventListener('touchstart', onDocumentTouch, false);

function onDocumentMouseDown(event) {
    event.preventDefault();
    selectorLogic(event.clientX, event.clientY)
}

document.body.addEventListener('mousedown', onDocumentMouseDown, false);


document.body.addEventListener('mousemove', onDocumentMouseMove, false);
document.body.addEventListener('touchmove', onDocumentTouchMove, false);

function bioWrapper() {
    editDetails(profile)
}
// document.querySelector("#more").addEventListener('click', bioWrapper);
let randomTimeout;

function randomize(el, target = null) {
    //Randomize the text of an element
    let initial;
    if (target === null) {
        initial = el.innerText
    } else {
        initial = target
    }
    let i = 0;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    randomTimeout = setInterval(() => {
        i += 1;
        let letters = [];
        [...initial].forEach((letter) => {
            if (initial.indexOf(letter) <= i) {
                letters.push(letter)
            } else {
                letters.push(alphabet[Math.floor(Math.random() * alphabet.length)])
            }
        })
        el.innerHTML = letters.join("")
        if (i >= initial.length) {
            clearInterval(randomTimeout)
        }
    }, 45)

}

window.addEventListener('load', () => {
    timeout = setTimeout(() => {
        autoSpin()
    }, 1000);
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        mobile = true;
        // Goes to load projects, and then highlights the languages
    }
})
window.addEventListener("resize", () => {
    console.log("Resizing")
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})


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

/*****************************************
 UNIVERSAL FUNCTIONS
 *****************************************/
document.getElementById('cardSpin').addEventListener('click', function() {
    let card = document.getElementById('businessCard');
    // document.getElementById('cardSpin').innerText = (card.classList.contains('animate'))? 'Let me give you my card' :'I do need that back...';
    if(card.classList.contains('straightened')) {
        card.classList.remove('straightened');
    }
    if(card.classList.contains('exit')) {
        card.classList.remove('exit'); // remove the class before adding it again
        void card.offsetWidth; // trigger a reflow
        card.classList.add('animate');
    } else if (card.classList.contains('animate')) {
        let random = ((Math.random() >=0.5)? 1: -1)* Math.round(Math.random() * 18 +6)
        card.style = `--deg: ${random}deg`;
        card.classList.remove('animate'); // remove the class before adding it again
        void card.offsetWidth; // trigger a reflow
        card.classList.add('exit');
    } else {
        let random = ((Math.random() >= 0.5)? 1: -1)* Math.round(Math.random() * 18 +6)
        card.style = `--deg: ${random}deg`;
        card.classList.add('animate');
    }
});

document.getElementById('straighten').addEventListener('click', function() {
    document.getElementById('businessCard').classList.toggle('straightened');
})

document.getElementById('flipper').addEventListener('click', function() {
    document.getElementById('cardFront').style.display = (document.getElementById('cardFront').style.display === 'none')? 'block': 'none';
    document.getElementById('cardBack').style.display = (document.getElementById('cardBack').style.display === 'none')? 'block': 'none';

})

let copycounter =0;
let timeout2;
document.getElementById('mail').addEventListener('click', function() {
    copycounter++;
    navigator.clipboard.writeText('juniper@circuit-cat.com');
    if(copycounter < 10) {
        document.getElementById('mail').innerText = 'Copied!';
    } else if (copycounter < 15) {
        document.getElementById('mail').innerText = 'Overcopied!';
    } else if (copycounter < 23) {
        document.getElementById('mail').innerText = 'Copytacular!';
    } else if (copycounter < 38) {
        document.getElementById('mail').innerText = 'COPYTROCITY!!';
    } else if(copycounter < 56) {
        document.getElementById('mail').innerText = 'COPYCATACLYSM!!!!';
    } else if(copycounter < 70) {
        document.getElementById('mail').innerText = 'COPYPOCALYPSE!!!!!!';
    } else if (copycounter < 100) {
        document.getElementById('mail').innerText = 'you can stop now :)';
    } else if (copycounter > 105){
        copycounter = 0;
    }
    clearTimeout(timeout2);
    timeout2 = setTimeout(() => {
        document.getElementById('mail').innerText = 'juniper@circuit-cat.com';
    }, 1000);
})

