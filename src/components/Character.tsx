import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Box } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';

export function Character() {
  const group = useRef<THREE.Group>();
  const { currentAnimation } = useStore();
  
  // Load the GLB models with error handling
  const loadModel = (path: string) => {
    try {
      return useGLTF(path);
    } catch (error) {
      console.warn(`Model ${path} not loaded yet`);
      return null;
    }
  };

  const idleModel = loadModel('/models/zara-idle.glb');
  const walkModel = loadModel('/models/zara-walk.glb');
  const speakModel = loadModel('/models/zara-speak.glb');
  
  // Set up animation controls if models are loaded
  const idleActions = idleModel ? useAnimations(idleModel.animations, idleModel.scene).actions : {};
  const walkActions = walkModel ? useAnimations(walkModel.animations, walkModel.scene).actions : {};
  const speakActions = speakModel ? useAnimations(speakModel.animations, speakModel.scene).actions : {};
  
  // Handle animation transitions
  useEffect(() => {
    if (!group.current) return;

    // Stop all animations first
    Object.values(idleActions).forEach(action => action?.stop());
    Object.values(walkActions).forEach(action => action?.stop());
    Object.values(speakActions).forEach(action => action?.stop());
    
    let currentModel;
    let currentAction;
    
    switch (currentAnimation) {
      case 'idle':
        currentModel = idleModel?.scene;
        currentAction = Object.values(idleActions)[0];
        break;
      case 'walking':
        currentModel = walkModel?.scene;
        currentAction = Object.values(walkActions)[0];
        break;
      case 'excited':
      case 'thoughtful':
      case 'surprised':
        currentModel = speakModel?.scene;
        currentAction = Object.values(speakActions)[0];
        break;
    }
    
    // Clear existing model
    while (group.current.children.length) {
      group.current.remove(group.current.children[0]);
    }
    
    // Add new model or fallback
    if (currentModel) {
      group.current.add(currentModel.clone());
    } else {
      // Add placeholder box if model isn't loaded
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 1),
        new THREE.MeshStandardMaterial({ color: '#00ff88', wireframe: true })
      );
      group.current.add(box);
    }
    
    // Play new animation with crossfade if available
    if (currentAction) {
      currentAction.reset().fadeIn(0.5).play();
    }
    
    return () => {
      if (currentAction) {
        currentAction.fadeOut(0.5);
      }
    };
  }, [currentAnimation, idleModel, walkModel, speakModel, idleActions, walkActions, speakActions]);
  
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Add subtle floating motion for all states
    group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + 1;
    
    // Add walking movement when in walking state
    if (currentAnimation === 'walking') {
      group.current.position.z = (state.clock.elapsedTime * 0.5) % 5;
    }
  });

  return (
    <group 
      ref={group} 
      position={[0, 0, 0]} 
      scale={[0.01, 0.01, 0.01]}
      onClick={() => useStore.getState().toggleWalking()}
    />
  );
}