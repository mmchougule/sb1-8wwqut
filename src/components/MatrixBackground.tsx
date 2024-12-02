import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MatrixBackground() {
  const planeRef = useRef();
  const materialRef = useRef();

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 st = vUv;
      float r = random(st + time);
      
      vec3 color = vec3(0.0, r * 0.5, 0.0);
      if (r > 0.98) color = vec3(0.0, 1.0, 0.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 }
  };

  useFrame((state) => {
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={planeRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}