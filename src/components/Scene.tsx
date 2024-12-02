import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Glitch, ChromaticAberration } from '@react-three/postprocessing';
import { Character } from './Character';
import { MatrixBackground } from './MatrixBackground';
import { ChatOverlay } from './ChatOverlay';
import { Suspense } from 'react';

export function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 15]} />
        
        <Suspense fallback={null}>
          <Character />
          <MatrixBackground />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />
          
          <Environment preset="night" />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
          
          <EffectComposer>
            <Glitch
              delay={[1.5, 3.5]}
              duration={[0.2, 0.4]}
              strength={[0.2, 0.4]}
            />
            <ChromaticAberration
              offset={[0.002, 0.002]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <ChatOverlay />
    </div>
  );
}