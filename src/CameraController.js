import { Vector3 } from "three";
import Hammer from "hammerjs";

class CameraController {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.delta = 0.1;
        this.currentKey = undefined;
        this.touchDirection = undefined;
        this.touchZoomDirection = undefined;
        this.yVector = new Vector3(0, 1, 0)
    }

    listen() {
        document.addEventListener('keydown', (e) => {
            this.currentKey = e.code;
        }, true)
        document.addEventListener('keyup', (e) => {
            console.log(e.code)
            if (this.currentKey === e.code) {
                this.currentKey = undefined;
            }
        }, true)
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const x = (touch.clientX / window.innerWidth) * 2 - 1;
            const y = -(touch.clientY / window.innerHeight) * 2 + 1;
            const xAbs = Math.abs(x)
            const yAbs = Math.abs(y)

            if (x < 0 && xAbs > yAbs) {
                this.touchDirection = 'left';
            } else if (xAbs > yAbs) {
                this.touchDirection = 'right';
            }
            if (y < 0 && xAbs < yAbs) {
                this.touchDirection = 'down';
            } else if (xAbs < yAbs) {
                this.touchDirection = 'up';
            }
            console.log(this.touchDirection)

        })

        this.canvas.addEventListener('touchend', () => {
            this.touchDirection = undefined;
        })

        const hammer = new Hammer(this.canvas, {});
        hammer.get('pinch').set({ enable: true })
        hammer.on('pinchin', (e) => {
            console.log(e)
            this.touchDirection = undefined;
            this.touchZoomDirection = 'out';
        })
        hammer.on('pinchout', (e) => {
            this.touchDirection = undefined;
            this.touchZoomDirection = 'in';
        })
        hammer.on('pinchend', (e) => {
            this.touchZoomDirection = undefined;
        })
    }

    rotateLeft() {
        this.camera.rotateOnWorldAxis(this.yVector, this.delta);

    }

    rotateRight() {
        this.camera.rotateOnWorldAxis(this.yVector, -this.delta);
    }
    rotateUp() {
        this.camera.rotateX(this.delta);
    }
    rotateDown() {
        this.camera.rotateX(-this.delta);
    }

    zoomIn() {
        if (this.camera.fov > 15) {
            this.camera.fov -= 100 * this.delta;
            this.camera.updateProjectionMatrix();
        }
    }

    zoomOut() {
        if (this.camera.fov < 90) {
            this.camera.fov += 100 * this.delta;
            this.camera.updateProjectionMatrix();
        }
    }
}

export { CameraController };