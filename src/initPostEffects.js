import { EffectComposer, ShaderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { CCTVShader } from "./shaders/customShaderPass";
import { Vector2 } from "three";

const bloomParams = {
    threshold: 0,
    strength: 0.2,
    radius: 0,
    exposure: 1
};

export default function initPostEffects(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), bloomParams.strength, bloomParams.radius, bloomParams.threshold)
    composer.addPass(bloomPass);

    const CCTVPass = new ShaderPass(CCTVShader);
    CCTVPass.uniforms.windowAspectRatio.value = window.innerWidth / window.innerHeight;
    composer.addPass(CCTVPass)

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    return { composer, CCTVPass, bloomPass }
}