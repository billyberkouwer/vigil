import { AmbientLight, DirectionalLight } from "three";

export default function initLights(scene) {
    const ambient = new AmbientLight()
    scene.add(ambient)

    const light = new DirectionalLight();
    light.intensity = 10
    light.position.set(1, 1, 1)
    let d = 80;
    let r = 2;
    let mapSize = 8192 / 2;
    light.castShadow = true;
    light.shadow.needsUpdate = false;
    light.shadow.radius = r;
    light.shadow.mapSize.width = mapSize;
    light.shadow.mapSize.height = mapSize;
    light.shadow.camera.top = light.shadow.camera.right = d;
    light.shadow.camera.bottom = light.shadow.camera.left = -d;
    light.shadow.camera.near = -80;
    light.shadow.camera.far = 80;
    scene.add(light);

    return { ambient, light }
}