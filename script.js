const doorScene = document.getElementById("sceneDoor");
const actualScene = document.getElementById("sceneActual");
const thanksScene = document.getElementById("sceneThanks");
const doorStage = document.getElementById("doorStage");
const openDoorsButton = document.getElementById("openDoors");
const invitationReveal = document.getElementById("invitationReveal");
const toThanksButton = document.getElementById("toThanks");
const replayButton = document.getElementById("replay");
let busy = false;
let door3D = null;

function showScene(next) {
  [doorScene, actualScene, thanksScene].forEach(scene => scene.classList.remove("active"));
  next.classList.add("active");
  window.scrollTo({top:0,behavior:"instant"});
}
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));

async function openDoorsAndRevealInvitation() {
  if (busy) return;
  busy = true;
  openDoorsButton.disabled = true;
  invitationReveal.classList.remove("settled");
  doorStage.classList.add("opening");
  door3D?.open();

  // Door rotation and invitation emergence run together as one continuous transition.
  await delay(2550);
  invitationReveal.classList.add("settled");
  busy = false;
  openDoorsButton.disabled = false;
}

invitationReveal.addEventListener("click", () => {
  if (!invitationReveal.classList.contains("settled")) return;
  invitationReveal.classList.remove("settled");
  invitationReveal.classList.add("leaving");
  invitationReveal.style.transition = "transform .85s cubic-bezier(.2,.8,.2,1), opacity .7s ease";
  invitationReveal.style.transform = "translate(-50%,-50%) scale(1.13)";
  invitationReveal.style.opacity = "0";
  setTimeout(() => {
    invitationReveal.style.transition = "";
    invitationReveal.style.transform = "";
    invitationReveal.style.opacity = "";
    invitationReveal.classList.remove("leaving");
    showScene(actualScene);
  },760);
});

function replay() {
  busy = false;
  doorStage.classList.remove("opening");
  invitationReveal.classList.remove("settled","leaving");
  invitationReveal.style.transition = "";
  invitationReveal.style.transform = "";
  invitationReveal.style.opacity = "";
  openDoorsButton.disabled = false;
  door3D?.reset();
  showScene(doorScene);
}
openDoorsButton.addEventListener("click",openDoorsAndRevealInvitation);
toThanksButton.addEventListener("click",()=>showScene(thanksScene));
replayButton.addEventListener("click",replay);

// Three.js door leaves are separate thick meshes with independent hinge pivots.
// If WebGL/CDN is unavailable, the CSS hinged panels remain as a fallback.
(async function enhanceWithThree(){
  const host=document.getElementById("threeDoorHost");
  try{
    const THREE=await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));
    renderer.setSize(host.clientWidth,host.clientHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.domElement.style.cssText="width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(38,host.clientWidth/host.clientHeight,.1,50);
    camera.position.set(0,0,10.8);
    scene.add(new THREE.AmbientLight(0xffd9a0,1.5));
    const warm=new THREE.PointLight(0xffb45c,2.1,18);warm.position.set(0,1,3);scene.add(warm);
    const loader=new THREE.TextureLoader();
    const [lt,rt]=await Promise.all([loader.loadAsync("assets/left-door.jpg"),loader.loadAsync("assets/right-door.jpg")]);
    [lt,rt].forEach(t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy()});
    const width=.90,height=3.27,depth=.13;
    const lp=new THREE.Group(),rp=new THREE.Group();
    lp.position.set(-width, -.50, 0);rp.position.set(width,-.50,0);scene.add(lp,rp);
    const brass=new THREE.MeshStandardMaterial({color:0xc99a4c,metalness:.78,roughness:.28});
    function makeDoor(pivot,texture,side){
      const body=new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),new THREE.MeshStandardMaterial({color:0x57301c,roughness:.72,metalness:.08}));
      body.position.x=side*width/2;body.castShadow=true;pivot.add(body);
      const face=new THREE.Mesh(new THREE.PlaneGeometry(width-.02,height-.02),new THREE.MeshStandardMaterial({map:texture,roughness:.72}));
      face.position.set(side*width/2,0,depth/2+.004);pivot.add(face);
      for(const y of [-1.1,0,1.1]){
        const hinge=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.18,12),brass);
        hinge.rotation.z=Math.PI/2;hinge.position.set(side===1?0:side*width,y,.09);pivot.add(hinge);
      }
      const pull=new THREE.Mesh(new THREE.TorusGeometry(.075,.014,8,24),brass);
      pull.position.set(side*width*.83,-.2,.12);pivot.add(pull);
    }
    makeDoor(lp,lt,1);makeDoor(rp,rt,-1);
    let frame;
    function render(){renderer.render(scene,camera);frame=requestAnimationFrame(render)}render();
    function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
    addEventListener("resize",resize);
    door3D={
      open(){
        const start=performance.now(),duration=2350,fromL=lp.rotation.y,fromR=rp.rotation.y;
        function tick(now){const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,4);lp.rotation.y=fromL-1.72*e;rp.rotation.y=fromR+1.72*e;if(p<1)requestAnimationFrame(tick)}
        requestAnimationFrame(tick);
      },
      reset(){lp.rotation.y=0;rp.rotation.y=0;}
    };
    host.querySelectorAll(".door-fallback").forEach(el=>el.style.display="none");
  }catch(error){console.warn("Three.js unavailable; using CSS door panels.",error)}
})();