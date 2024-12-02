import { create } from 'zustand';

interface State {
  isWalking: boolean;
  currentAnimation: 'idle' | 'walking' | 'excited' | 'thoughtful' | 'surprised';
  reactionTimeout: NodeJS.Timeout | null;
  toggleWalking: () => void;
  triggerReaction: (type: 'excited' | 'thoughtful' | 'surprised') => void;
}

export const useStore = create<State>((set, get) => ({
  isWalking: false,
  currentAnimation: 'idle',
  reactionTimeout: null,
  
  toggleWalking: () => set((state) => ({ 
    isWalking: !state.isWalking,
    currentAnimation: !state.isWalking ? 'walking' : 'idle'
  })),
  
  triggerReaction: (type) => {
    const state = get();
    // Clear existing timeout if any
    if (state.reactionTimeout) {
      clearTimeout(state.reactionTimeout);
    }
    
    // Set new animation
    set({ currentAnimation: type });
    
    // Reset to previous state after animation
    const timeout = setTimeout(() => {
      set((state) => ({
        currentAnimation: state.isWalking ? 'walking' : 'idle'
      }));
    }, 2000);
    
    set({ reactionTimeout: timeout });
  }
}));