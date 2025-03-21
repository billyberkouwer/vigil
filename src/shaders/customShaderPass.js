import { DataTexture, FloatType, MathUtils, RedFormat } from "three";

    function generateHeightmap( dt_size ) {

        const data_arr = new Float32Array( dt_size * dt_size );
        const length = dt_size * dt_size;

        for ( let i = 0; i < length; i ++ ) {

            const val = MathUtils.randFloat( 0, 1 );
            data_arr[ i ] = val;

        }

        const texture = new DataTexture( data_arr, dt_size, dt_size, RedFormat, FloatType );
        texture.needsUpdate = true;
        return texture;

    }

const CCTVShader = {

    name: 'CopyShader',

    uniforms: {
        'tDiffuse': { value: null },
        'tDisp': {value: generateHeightmap( 128 ) },
        'opacity': { value: 1.0 },
        'time': { value: 0.0 },
        'windowAspectRatio': { value: 1.0 },
		'byp': { value: 1 }, //apply the glitch ?
		'amount': { value: 0.08 },
		'angle': { value: 0.02 },
		'seed': { value: 0.02 },
		'seed_x': { value: 0.02 }, //-1,1
		'seed_y': { value: 0.02 }, //-1,1
		'distortion_x': { value: 0.5 },
		'distortion_y': { value: 0.6 },
		'col_s': { value: 0.05 }
    },

    vertexShader: /* glsl */`
        uniform float windowAspectRatio;

        uniform float time;
		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */`

		uniform float opacity;
		uniform sampler2D tDisp;
        uniform float byp;
		uniform float seed;
		uniform float seed_x;
		uniform float seed_y;
		uniform float distortion_x;
		uniform float distortion_y;
		uniform float col_s;

        uniform float windowAspectRatio;

        uniform float time;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

        float whitenoise(float seed1,float seed2){
            return(
                fract(seed1+12.34567*
                fract(100.*(abs(seed1*0.91)+seed2+94.68)*
                fract((abs(seed2*0.41)+45.46)*
                fract((abs(seed2)+757.21)*
                fract(seed1*0.0171))))))
                * 1.0038 - 0.00185;
            }

            float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
            vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
            vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

            float genericnoise(vec3 p){
                vec3 a = floor(p);
                vec3 d = p - a;
                d = d * d * (3.0 - 2.0 * d);

                vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
                vec4 k1 = perm(b.xyxy);
                vec4 k2 = perm(k1.xyxy + b.zzww);

                vec4 c = k2 + a.zzzz;
                vec4 k3 = perm(c);
                vec4 k4 = perm(c + 1.0);

                vec4 o1 = fract(k3 * (1.0 / 41.0));
                vec4 o2 = fract(k4 * (1.0 / 41.0));

                vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
                vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

                return o4.y * d.y + o4.x * (1.0 - d.y);
            }

		void main() {
            vec2 p = vUv;
			float xs = floor(gl_FragCoord.x / 0.5);
			float ys = floor(gl_FragCoord.y / 0.5);
			float disp = texture2D(tDisp, p*seed*seed).r;
            
            if (byp > 0.) {
            	if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {
                    if(seed_x>0.){
                        p.y = 1. - (p.y + distortion_y);
                    }
                    else {
                        p.y = distortion_y;
                    }
                }
                if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {
                    if(seed_y>0.){
                        p.x=distortion_x;
                    }
                    else {
                        p.x = 1. - (p.x + distortion_x);
                    }
                }
                p.x+=disp*seed_x*(seed/5.);
                p.y+=disp*seed_y*(seed/5.);
            }

            vec4 texel = texture2D( tDiffuse, p );
            texel /= 1.2;
            texel.rgb -= vec3(0.2);
            texel.g += 0.3;
            vec2 window = vec2( vUv.x, vUv.y / windowAspectRatio );
            float noise = whitenoise(window.x + time, window.y + time);
            float x = window.x * 100.;
            float y = window.y * 100. * 2.;
            float noise2 = genericnoise(vec3(x, y, y + time * 100.));
            float bands = whitenoise(window.y + time, window.y + time) * noise2;
            texel.rg -= noise * 0.25;
            texel.b -= noise * 0.5;
            texel.rgb += bands / 4.;    
			gl_FragColor = opacity * texel;
		}`

};

export { CCTVShader };