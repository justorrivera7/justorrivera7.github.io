//import {VideoRenderer} from './Components/video'
const showcase = document.getElementById('showcase') as HTMLIFrameElement;
const key = 'd1g6pqm6q051szfq0h528gndd';


// declare this file is a module
export {};

// augment window with the MP_SDK property
declare global {
  interface Window {
    MP_SDK: any;
  }
}

showcase.addEventListener('load', async function() {
  let sdk;
  try {
    sdk = await showcase.contentWindow.MP_SDK.connect(showcase, key, '3.6');
  }
  catch(e) {
    console.error(e);
    return;
  }

  console.log('%c  Hello Bundle SDK! ', 'background: #333333; color: #00dd00');
  console.log(sdk);

  const [ sceneObject ] = await sdk.Scene.createObjects(1);
const lights = sceneObject.addNode();
lights.addComponent('mp.lights');
lights.start();
const modelNode = sceneObject.addNode();
let cameraPosition: any, cameraRotation: any;
sdk.Camera.pose.subscribe(function (pose: any) {
  // Changes to the Camera pose have occurred.
  cameraPosition = pose.position;
  cameraRotation = pose.rotation;
});
let rotationMultiplyer = 1;
// Store the fbx component since we will need to adjust it in the next step.
const fbxComponent = modelNode.addComponent(sdk.Scene.Component.FBX_LOADER, {
  url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/fbx/stanford-bunny.fbx',
});
fbxComponent.inputs.localScale = {
  x: 0.00002,
  y: 0.00002,
  z: 0.00002
};
fbxComponent.events = {
  // subscribe to click events
  ['INTERACTION.CLICK']: true,
}
fbxComponent.onEvent = (eventType: string) => {
  console.log('eventType!!!!!!!!!!!!!!!!!!!!!')
  console.log(eventType)
  rotationMultiplyer *= -1
  modelNode.obj3D.position.x += cameraPosition.x + 0.1
  modelNode.obj3D.position.y += cameraPosition.y + 0.1
  modelNode.obj3D.position.z += cameraPosition.z + 0.1
  cameraRotation = cameraRotation;
}
/*const modelNodeVideo = sceneObject.addNode();
const videorenderer = new VideoRenderer();
videorenderer.inputs.src = 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index.m3u8'
modelNodeVideo.addComponent(videorenderer)
modelNodeVideo.obj3D.position.set(0,-0.8,0)
modelNodeVideo.start()*/
modelNode.obj3D.position.set(0,-1,0);
modelNode.obj3D.castShadow = true;
const tick = function() {
  requestAnimationFrame(tick);
  modelNode.obj3D.rotation.y += rotationMultiplyer*0.02;
}
tick();
modelNode.start();
});