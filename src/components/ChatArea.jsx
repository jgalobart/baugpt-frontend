import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WebProjectButton from './WebProjectButton';

function ChatArea({ conversation, onMessageSent, readOnly = false }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message, images) => {
    if (!conversation || readOnly) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('conversationId', conversation.id);
      formData.append('message', message);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Reload the full conversation to get updated messages
      const convResponse = await fetch(`${apiUrl}/api/conversation/${conversation.id}`);
      const updatedConv = await convResponse.json();
      onMessageSent(updatedConv);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error enviant el missatge. Si us plau, torna-ho a intentar.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">BAUGPT</h2>
          <p>Selecciona o crea una conversa per començar</p>
        </div>
      </div>
    );
  }

  const lastMessage = conversation.messages.length > 0 
    ? conversation.messages[conversation.messages.length - 1] 
    : null;

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      {/* Botons flotants de projecte web */}
      <WebProjectButton 
        onSend={handleSendMessage} 
        disabled={isLoading || readOnly}
        lastMessage={lastMessage}
      />
      
      <MessageList messages={conversation.messages} isLoading={isLoading} />
      <MessageInput 
        onSend={handleSendMessage} 
        disabled={isLoading || readOnly}
        lastMessage={lastMessage}
      />
    </div>
  );
}

export default ChatArea;
