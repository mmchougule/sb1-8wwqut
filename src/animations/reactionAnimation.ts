import { Group } from 'three';

export function reactionAnimation(group: Group, time: number, reactionType: 'excited' | 'thoughtful' | 'surprised') {
  if (!group) return;
  
  switch (reactionType) {
    case 'excited':
      // Jumping and spinning
      group.position.y = Math.sin(time * 8) * 0.2 + 1.2;
      group.rotation.y += 0.1;
      break;
      
    case 'thoughtful':
      // Slow head tilt and floating
      group.rotation.z = Math.sin(time * 2) * 0.1;
      group.position.y = Math.sin(time * 0.5) * 0.05 + 1;
      break;
      
    case 'surprised':
      // Quick backward step and scale pulse
      group.position.z = Math.sin(time * 10) * 0.1;
      group.scale.x = group.scale.y = group.scale.z = 1 + Math.sin(time * 8) * 0.1;
      break;
  }
}