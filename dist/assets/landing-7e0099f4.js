import"./main-b6dcf2f8.js";import{S as B,P as O,W as P,R as I,E as C,G as T,a as M,b as L,V as v,T as s,c as a,L as z,M as w,d as A,u as W}from"./GLTFLoader-14dd2a21.js";const f=new z;f.onProgress=function(e,o,i){console.log(e,o,i)};f.onLoad=function(){console.log("Loading complete!"),setTimeout(()=>{document.querySelector("#loading").getAnimations()[0].play(),document.querySelector("#introContainer").classList.remove("invisible"),document.querySelector("#loading").getAnimations()[0].onfinish=()=>{document.querySelector("#loading").remove()},document.querySelectorAll(".randomizeIn").forEach(e=>{randomize(e)})},500)};const d=new B,l=new O(75,window.innerWidth/window.innerHeight,.1,1e3),S=document.getElementById("mainCanvas");console.log(S);const u=new P({canvas:S,antialias:!0});u.setPixelRatio(window.devicePixelRatio*1.5);let h=[];u.setSize(window.innerWidth,window.innerHeight);const j=new I(d,l),m=new C(u);m.addPass(new I(d,l));let p=new T(f);const y=new M(d,l,{luminanceThreshold:.1,intensity:.8,mipmapBlur:!0,radius:.8,kernelSize:1,levels:10});let t,n;async function k(){t=await p.loadAsync("/models/ProgrammingIcon.glb"),n=await p.loadAsync("/models/Icons.glb"),n=n.scene.children[0],t=t.scene.children[0],t.rotation.x=90,n.name="Photography",t.name="Programming",/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?(t.position.set(0,1,1),n.position.set(0,-.5,0)):(n.position.x=-2,t.position.x=2),console.log(t.material.color),t.material=new w({color:16777215}),n.material=new w({color:16777215}),console.log(t.material.color),y.selection.add(n),y.selection.add(t),h.push(y);const e=new A(l,...h);e.renderToScreen=!0,m.addPass(e),m.addPass(j),d.add(t),d.add(n),t.mesh=n.mesh,l.position.set(0,1,5),b()}k();function b(){n.rotation.y+=.01,t.rotation.y-=.01,W(),requestAnimationFrame(b),m.render()}document.addEventListener("mousemove",D,!1);document.addEventListener("mousedown",Y,!1);document.body.addEventListener("touchstart",q,!1);function q(e){e.preventDefault(),console.log(e.touches),x(e.touches[0].clientX,e.touches[0].clientY)}function Y(e){e.preventDefault(),x(e.clientX,e.clientY)}function D(e){let o=new L,i=new v;i.x=e.clientX/window.innerWidth*2-1,i.y=-(e.clientY/window.innerHeight)*2+1,o.setFromCamera(i,l),o.intersectObjects(d.children)[0]||o.intersectObjects(d.children).length>0&&o.intersectObjects(d.children)[0].object===spinObject?document.body.style.cursor="pointer":document.body.style.cursor="default"}function x(e,o){let i=new L,c=new v;c.x=e/window.innerWidth*2-1,c.y=-(o/window.innerHeight)*2+1,i.setFromCamera(c,l);let g=i.intersectObjects(d.children)[0];if(g){if(document.getElementById("businessCard").classList.contains("animate")){document.getElementById("businessCard").classList.remove("animate"),document.getElementById("businessCard").classList.remove("straightened"),document.getElementById("businessCard").offsetWidth,document.getElementById("businessCard").classList.add("exit");return}console.log(g),window.location.assign("pages/"+g.object.name+".html")}}let R=document.getElementById("age");R.innerText=F(new Date("September 2, 2005"));function F(e){let i=Math.floor((new Date-e)/1e3)/31536e3;if(i>1)return console.log(i+" year old"),Math.floor(i)+" year old"}document.querySelector("a#developer").addEventListener("mouseenter",()=>{new s(t.scale).to({x:1.2,y:1.2,z:1.2},200).easing(a.Sinusoidal.InOut).start(),new s(n.scale).to({x:.8,y:.8,z:.8},200).easing(a.Sinusoidal.InOut).start(),new s(t.material.color).to({r:1,g:.6,b:.9},200).easing(a.Sinusoidal.InOut).start()});document.querySelector("a#developer").addEventListener("mouseleave",()=>{new s(t.scale).to({x:1,y:1,z:1},200).easing(a.Sinusoidal.InOut).start(),new s(n.scale).to({x:1,y:1,z:1},200).easing(a.Sinusoidal.InOut).start(),new s(t.material.color).to({r:1,g:1,b:1},200).easing(a.Sinusoidal.InOut).start()});document.querySelector("a#photographer").addEventListener("mouseenter",()=>{new s(n.scale).to({x:1.2,y:1.2,z:1.2},200).easing(a.Sinusoidal.InOut).start(),new s(t.scale).to({x:.8,y:.8,z:.8},200).easing(a.Sinusoidal.InOut).start(),new s(n.material.color).to({r:1,g:.6,b:.9},200).easing(a.Sinusoidal.InOut).start()});document.querySelector("a#photographer").addEventListener("mouseleave",()=>{new s(n.scale).to({x:1,y:1,z:1},200).easing(a.Sinusoidal.InOut).start(),new s(t.scale).to({x:1,y:1,z:1},200).easing(a.Sinusoidal.InOut).start(),new s(n.material.color).to({r:1,g:1,b:1},200).easing(a.Sinusoidal.InOut).start()});window.addEventListener("resize",()=>{console.log("Resizing"),l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)});document.getElementById("cardSpin").addEventListener("click",function(){let e=document.getElementById("businessCard");if(e.classList.contains("straightened")&&e.classList.remove("straightened"),e.classList.contains("exit"))e.classList.remove("exit"),e.offsetWidth,e.classList.add("animate");else if(e.classList.contains("animate")){let o=(Math.random()>=.5?1:-1)*Math.round(Math.random()*18+6);e.style=`--deg: ${o}deg`,e.classList.remove("animate"),e.offsetWidth,e.classList.add("exit")}else{let o=(Math.random()>=.5?1:-1)*Math.round(Math.random()*18+6);e.style=`--deg: ${o}deg`,e.classList.add("animate")}});document.getElementById("straighten").addEventListener("click",function(){document.getElementById("businessCard").classList.toggle("straightened")});document.getElementById("flipper").addEventListener("click",function(){document.getElementById("cardFront").style.display=document.getElementById("cardFront").style.display==="none"?"block":"none",document.getElementById("cardBack").style.display=document.getElementById("cardBack").style.display==="none"?"block":"none"});let r=0,E;document.getElementById("mail").addEventListener("click",function(){r++,navigator.clipboard.writeText("juniper@circuit-cat.com"),r<10?document.getElementById("mail").innerText="Copied!":r<15?document.getElementById("mail").innerText="Overcopied!":r<23?document.getElementById("mail").innerText="Copytacular!":r<38?document.getElementById("mail").innerText="COPYTROCITY!!":r<56?document.getElementById("mail").innerText="COPYCATACLYSM!!!!":r<70?document.getElementById("mail").innerText="COPYPOCALYPSE!!!!!!":r<100?document.getElementById("mail").innerText="you can stop now :)":r>105&&(r=0),clearTimeout(E),E=setTimeout(()=>{document.getElementById("mail").innerText="juniper@circuit-cat.com"},1e3)});
