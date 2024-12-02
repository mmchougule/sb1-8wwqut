import { Group } from 'three';

export function idleAnimation(group: Group, time: number) {
  if (!group) return;
  
  // Subtle floating motion
  group.position.y = Math.sin(time) * 0.1 + 1;
  
  // Gentle swaying
  group.rotation.y = Math.sin(time * 0.5) * 0.05;
  
  // Breathing effect on the body
  const body = group.children.find(child => child.name === 'body');
  if (body) {
    body.scale.y = 1 + Math.sin(time * 2) * 0.02;
  }
}