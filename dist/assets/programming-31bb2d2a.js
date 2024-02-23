import"./main-b6dcf2f8.js";import{S as Z,P as ee,W as te,R as Y,E as ne,G as oe,a as ie,O as se,C as j,B as ae,A as re,T as y,c as w,M,L as le,d as de,u as ce,b as J,V as R}from"./GLTFLoader-14dd2a21.js";let k=!1;const P=new le;P.onProgress=function(e,t,n){console.log(e,t,n)};const T=document.querySelector("#cs"),B=document.querySelector("#unity"),C=document.querySelector("#js"),S=document.querySelector("#many");let X;fetch("/profile.json").then(e=>{e.json().then(t=>{X=t})});P.onLoad=function(){console.log("Loading complete!"),console.log(X),setTimeout(()=>{T.addEventListener("mouseover",()=>{d("C#",T.dataset.color,!1,1500)}),T.addEventListener("mouseout",()=>{d("C#","#ffffff",!0,1500)}),B.addEventListener("mouseover",()=>{d("Unity",B.dataset.color)}),B.addEventListener("mouseout",()=>{d("Unity","#ffffff",!0,1500)}),C.addEventListener("mouseover",()=>{d("JS",C.dataset.color)}),C.addEventListener("mouseout",()=>{d("JS","#ffffff",!0,1500)}),S.addEventListener("mouseover",()=>{d("other",S.dataset.color,!0,1500)}),S.addEventListener("mouseout",()=>{d("other","#ffffff",!0,1500)}),document.querySelector("#loading").getAnimations()[0].play(),document.querySelector("#nameContainer").classList.remove("invisible"),document.querySelector("#loading").getAnimations()[0].onfinish=()=>{document.querySelector("#loading").remove()},document.querySelectorAll(".randomizeIn").forEach(e=>{xe(e)})},500)};P.onError=function(e){console.log("There was an error loading "+e),location.reload()};const me=10,ue=6,N=20,E={pos:.002,neg:-.002};let g={pos:E.pos,neg:E.neg};const H=5e-5,u=new Z;let fe=!1;const c=new ee(75,window.innerWidth/window.innerHeight,.1,1e3),F=document.getElementById("mainCanvas");console.log(F);const A=new te({canvas:F,antialias:!0});A.setPixelRatio(window.devicePixelRatio*1.5);let z=[];A.setSize(window.innerWidth,window.innerHeight);const ge=new Y(u,c),v=new ne(A);v.addPass(new Y(u,c));let O=new oe(P),s;const U=new ie(u,c,{luminanceThreshold:.1,intensity:.8,mipmapBlur:!0,radius:.8,kernelSize:1,levels:10}),q=new se(u,c,{defaultThickness:.001,defaultColor:new j(16777215),defaultAlpha:.8,defaultKeepAlive:!0,defaultVisible:!1,defaultSide:ae,defaultBlending:re,ignoreMaterial:!1,pulseSpeed:0,visibleEdgeColor:new j(16777215),hiddenEdgeColor:new j(2230538),usePatternTexture:!1,edgeThickness:.2,edgeStrength:3,xRay:!1,kernelSize:2});async function he(){s=await O.loadAsync("/models/tree.glb"),s=s.scene.children[0],s.rotation.set(0,0,0),s.name="tree",s.material=new M({color:0}),u.add(s),console.log(s.scale,s.position),q.selection.add(s),z.push(q),z.push(U);const e=new de(c,...z);e.renderToScreen=!0,v.addPass(e),v.addPass(ge),await pe(),G()}he();let p=[];async function pe(){p=await fetch("/projects.json"),p=await p.json(),console.log(p.Projects),s.position.setY(-6);for(const e of p.Projects){let t;e.override_mesh.override===!0?(console.log(e.override_mesh.path),t=await O.loadAsync(e.override_mesh.path),t=t.scene.children[0],console.log(t),t.scale.set(e.override_mesh.scale.x+.2,e.override_mesh.scale.y+.2,e.override_mesh.scale.z+.2),t.rotation.set(e.override_mesh.rotation.x===-1?Math.random()*180:e.override_mesh.rotation.x,e.override_mesh.rotation.y===-1?Math.random()*180:e.override_mesh.rotation.y,e.override_mesh.rotation.z===-1?Math.random()*180:e.override_mesh.rotation.z),t.material=new M({color:16777215})):(t=await O.loadAsync("/models/ProgrammingIcon.glb"),t=t.scene.children[0],t.rotation.set(90,Math.random()*180,Math.random()*180),t.scale.set(t.scale.x+.4,t.scale.y+.4,t.scale.z+.4),t.material=new M({color:16777215})),t.position.set(e.position.x,e.position.y,e.position.z),s.add(t),t.name=`${e.name_pub}:${e.id}`,U.selection.add(t)}k&&(d("C#",T.dataset.color),d("Unity",B.dataset.color),d("JS",C.dataset.color),d("other",S.dataset.color))}let o=null,b=!1;function ye(e){window.location.href=`${window.location.origin}/photostrips/${e.embed_path}`}function we(e){if(e.name_pub==="Juniper"&&o!=="Juniper"&&o!==null)return;if(e.langident==="photo"){ye(e);return}const t=document.getElementById("sidebar").children.namedItem("cont");console.log(t),console.log(e),t.children[0].children.namedItem("NameLink").setAttribute("href",e.link),t.children[0].children.namedItem("NameLink").innerText="🔗 "+e.name_pub,t.children[0].children.namedItem("NameLink").cursor="pointer",t.children.namedItem("short").innerHTML=e.short,t.children.namedItem("descAccess").children.namedItem("Desc").innerHTML=e.long,t.children.namedItem("ver").innerHTML=e.version,t.children.namedItem("codeBar").innerHTML="",t.children.namedItem("circles").innerHTML="",k&&(document.querySelector("#sidebar").style.width="92%",document.querySelector("#sidebar").style.left="1rem",document.querySelector("#sidebar").style.right="1rem");let n=0;if(e.langs.forEach(i=>{n++;let a="text-center text-white inline-block changeToPercent";n===1&&(a+=" rounded-l-2xl"),n===e.langs.length&&(a+=" rounded-r-2xl"),t.children.namedItem("codeBar").innerHTML+=`<span class="${a}" style="--wid: ${i.Percent};background: ${i.Color};height: 16px;overflow: clip;"></span>`,t.children.namedItem("circles").innerHTML+=`<div><div class="codeCircle" style="--bgc: ${i.Color}"></div><span>${i.Name}  <a> ${i.Percent}</a></span></div>`}),t.children.namedItem("completed").innerText="Completed On: "+e.date_published,t.children.namedItem("updated").innerText="Last Updated: "+(e.date_updated??"Never"),document.querySelector("#rep1").innerHTML="",document.querySelector("#rep2").innerHTML="",e.images.forEach(i=>{document.querySelector("#rep1").innerHTML+=`<li><img src="${i}"></li>`,document.querySelector("#rep2").innerHTML+=`<li><img src="${i}"></li>`}),e.name_pub==="Juniper"){let i=document.getElementById("sidebar");i.classList.contains("invisible")?(i.classList.remove("invisible"),i.getAnimations()[0].play(),o="Juniper"):(o=o==="Juniper"?null:"Juniper",i.getAnimations()[0].reverse())}}c.position.z=5;c.position.set(0,ue,me);c.lookAt(0,0,0);let h=!1,L="pos",x=!1;function G(){o&&o!=="Juniper"&&(o.rotation.x+=.01),h&&(L==="pos"?(x&&(g.pos>=E.pos&&(g.pos=E.pos,x=!1),g.pos+=H),s.rotation.y+=g.pos):L==="neg"&&(x&&(g.neg<=E.neg&&(g.neg=E.neg,x=!1),g.neg-=H),s.rotation.y+=g.neg)),ce(),requestAnimationFrame(G),v.render()}function V(e,t,n){return(e-t)/(n-t)}let I;function d(e,t,n=!1,i=1e3){p.Projects.forEach(a=>{if(a.langident===e){let m=u.getObjectByName(`${a.name_pub}:${a.id}`);if(n){let r=ve(t);new y(m.material.color).to({r:r.r,g:r.g,b:r.b},i).easing(w.Exponential.InOut).start().onComplete(()=>{})}else m.material=new M({color:t})}})}function _(){h=!0,I=void 0,g.neg=0,g.pos=0,x=!0}function ve(e){let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}function be(e){let t=new J,n=new R;if(n.x=e.clientX/window.innerWidth*2-1,n.y=-(e.clientY/window.innerHeight)*2+1,t.setFromCamera(n,c),t.intersectObjects(s.children)[0]||t.intersectObjects(u.children).length>0&&t.intersectObjects(u.children)[0].object===o?document.body.style.cursor="pointer":document.body.style.cursor="default",e.buttons>0){h=!1;const a=e.movementX*V(N,0,window.outerWidth);e.movementX>0?L="pos":e.movementY<0&&(L="neg"),s.rotation.y+=a,v.render(),!h&&!I&&(I=setTimeout(()=>{_()},3e3))}v.render()}let $=0;function Ee(e){if(e.preventDefault(),e.touches.length>0){h=!1;const t=e.touches[0].pageX-$;$=e.touches[0].pageX,t>0?L="pos":t<0&&(L="neg"),s.rotation.y+=t*V(N,0,window.outerWidth),v.render(),!h&&!I&&(I=setTimeout(()=>{_()},3e3))}}function K(e,t){let n=new J,i=new R;i.x=e/window.innerWidth*2-1,i.y=-(t/window.innerHeight)*2+1,n.setFromCamera(i,c);let a=n.intersectObjects(s.children)[0];if(a&&!b){document.getElementById("businessCard").classList.contains("animate")&&(document.getElementById("businessCard").classList.remove("animate"),document.getElementById("businessCard").classList.remove("straightened"),document.getElementById("businessCard").offsetWidth,document.getElementById("businessCard").classList.add("exit")),b=!0;let m=!1;e:if(o!==null){if(o==="Juniper"){m=!0;break e}h=!1,m=!0,s.attach(o),new y(o.rotation).to({x:0,y:0,z:0},200).easing(w.Linear.None).start().onComplete(()=>{let l=p.Projects.filter(Q=>Q.id==o.name.split(":")[1])[0];new y(o.position).to({x:l.position.x,y:l.position.y,z:l.position.z},1e3).easing(w.Elastic.InOut).start().onComplete(()=>{o.rotation.set(0,0,0),h=!0,o=null})})}u.attach(a.object);let r=p.Projects.filter(l=>l.id==a.object.name.split(":")[1])[0];new y(a.object.rotation).to({x:4,y:4,z:0},200).easing(w.Linear.None).start().onComplete(()=>{new y(a.object.position).to({x:0,y:-3,z:3},1e3).easing(w.Elastic.InOut).start().onComplete(()=>{o=a.object,we(r),b=!1;let l=document.getElementById("sidebar");l.classList.contains("invisible")&&!fe?(l.classList.remove("invisible"),l.getAnimations()[0].play()):m||l.getAnimations()[0].reverse()})})}else n.intersectObjects(u.children).length>0&&!b&&n.intersectObjects(u.children)[0].object===o&&(b=!0,h=!1,s.attach(o),document.getElementById("sidebar").getAnimations()[0].reverse(),new y(o.rotation).to({x:0,y:0,z:0},200).easing(w.Linear.None).start().onComplete(()=>{let r=p.Projects.filter(l=>l.id==o.name.split(":")[1])[0].position;new y(o.position).to({x:r.x,y:r.y,z:r.z},1e3).easing(w.Elastic.InOut).start().onComplete(()=>{o.rotation.set(0,0,0),o=null,b=!1,h=!0})}))}function Le(e){e.preventDefault(),console.log(e.touches),K(e.touches[0].clientX,e.touches[0].clientY)}document.body.addEventListener("touchstart",Le,!1);function Ie(e){e.preventDefault(),K(e.clientX,e.clientY)}document.body.addEventListener("mousedown",Ie,!1);document.body.addEventListener("mousemove",be,!1);document.body.addEventListener("touchmove",Ee,!1);let D;function xe(e,t=null){let n;t===null?n=e.innerText:n=t;let i=0;const a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";D=setInterval(()=>{i+=1;let m=[];[...n].forEach(r=>{n.indexOf(r)<=i?m.push(r):m.push(a[Math.floor(Math.random()*a.length)])}),e.innerHTML=m.join(""),i>=n.length&&clearInterval(D)},45)}window.addEventListener("load",()=>{I=setTimeout(()=>{_()},1e3),/Android|iPhone|iPad/i.test(navigator.userAgent)&&(k=!0)});window.addEventListener("resize",()=>{console.log("Resizing"),c.aspect=window.innerWidth/window.innerHeight,c.updateProjectionMatrix(),A.setSize(window.innerWidth,window.innerHeight)});let Te=document.getElementById("age");Te.innerText=Be(new Date("September 2, 2005"));function Be(e){let n=Math.floor((new Date-e)/1e3)/31536e3;if(n>1)return console.log(n+" year old"),Math.floor(n)+" year old"}document.getElementById("cardSpin").addEventListener("click",function(){let e=document.getElementById("businessCard");if(e.classList.contains("straightened")&&e.classList.remove("straightened"),e.classList.contains("exit"))e.classList.remove("exit"),e.offsetWidth,e.classList.add("animate");else if(e.classList.contains("animate")){let t=(Math.random()>=.5?1:-1)*Math.round(Math.random()*18+6);e.style=`--deg: ${t}deg`,e.classList.remove("animate"),e.offsetWidth,e.classList.add("exit")}else{let t=(Math.random()>=.5?1:-1)*Math.round(Math.random()*18+6);e.style=`--deg: ${t}deg`,e.classList.add("animate")}});document.getElementById("straighten").addEventListener("click",function(){document.getElementById("businessCard").classList.toggle("straightened")});document.getElementById("flipper").addEventListener("click",function(){document.getElementById("cardFront").style.display=document.getElementById("cardFront").style.display==="none"?"block":"none",document.getElementById("cardBack").style.display=document.getElementById("cardBack").style.display==="none"?"block":"none"});let f=0,W;document.getElementById("mail").addEventListener("click",function(){f++,navigator.clipboard.writeText("juniper@circuit-cat.com"),f<10?document.getElementById("mail").innerText="Copied!":f<15?document.getElementById("mail").innerText="Overcopied!":f<23?document.getElementById("mail").innerText="Copytacular!":f<38?document.getElementById("mail").innerText="COPYTROCITY!!":f<56?document.getElementById("mail").innerText="COPYCATACLYSM!!!!":f<70?document.getElementById("mail").innerText="COPYPOCALYPSE!!!!!!":f<100?document.getElementById("mail").innerText="you can stop now :)":f>105&&(f=0),clearTimeout(W),W=setTimeout(()=>{document.getElementById("mail").innerText="juniper@circuit-cat.com"},1e3)});
