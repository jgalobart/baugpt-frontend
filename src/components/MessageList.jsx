import { useEffect, useRef } from 'react';
import Message from './Message';
import { Loader2 } from 'lucide-react';

function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="text-[20rem] font-bold text-gray-800/5 tracking-wider">
          BAUGPT
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <h3 className="text-xl mb-2">Comença una conversa</h3>
            <p className="text-sm">Escriu un missatge o puja imatges per començar</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 py-4">
            <Loader2 className="animate-spin" size={20} />
            <span>Pensant...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageList;
