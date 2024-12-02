import { Group } from 'three';

export function walkAnimation(group: Group, time: number, delta: number) {
  if (!group) return;
  
  // Forward movement
  group.position.z += delta * 0.5;
  
  // Bobbing motion
  group.position.y = Math.sin(time * 5) * 0.1 + 1;
  
  // Natural walking rotation
  group.rotation.y = Math.sin(time * 2) * 0.1;
  
  // Leg movement simulation through body tilt
  group.rotation.x = Math.sin(time * 5) * 0.05;
}