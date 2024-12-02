import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  reaction?: 'excited' | 'thoughtful' | 'surprised';
}

export function ChatOverlay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerReaction = useStore(state => state.triggerReaction);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response with reaction
      const reactions: Array<'excited' | 'thoughtful' | 'surprised'> = ['excited', 'thoughtful', 'surprised'];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: generateResponse(input),
        type: 'assistant',
        reaction: randomReaction
      };

      setMessages(prev => [...prev, aiMessage]);
      triggerReaction(randomReaction);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-x-0 top-0 mx-auto max-w-2xl p-4 pointer-events-auto">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-[#00ff88]/20">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'px-4 py-2 rounded-lg animate-fade-in',
                message.type === 'user' ? 'bg-blue-500/20 ml-auto max-w-[80%]' : 'bg-[#00ff88]/10 mr-auto max-w-[80%]'
              )}
            >
              <p className={clsx(
                'font-mono',
                message.type === 'user' ? 'text-blue-300' : 'text-[#00ff88]',
                message.type === 'assistant' && 'animate-glitch'
              )}>
                {message.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your message..."
            className="flex-1 bg-black/50 border border-[#00ff88]/20 rounded-lg px-4 py-2 text-[#00ff88] placeholder-[#00ff88]/50 font-mono focus:outline-none focus:border-[#00ff88]/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] rounded-lg px-4 py-2 font-mono transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Temporary response generator until OpenAI integration
function generateResponse(input: string): string {
  const responses = [
    "The digital realm whispers secrets through the code...",
    "Reality bends at the edges of our perception...",
    "In the matrix of consciousness, every thought creates ripples...",
    "The boundaries between real and virtual blur with each passing moment...",
    "Through the looking glass of technology, we glimpse infinite possibilities..."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}