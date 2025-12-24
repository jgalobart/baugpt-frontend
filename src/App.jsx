import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import WelcomeModal from './components/WelcomeModal';

function App() {
  const [studentName, setStudentName] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (storedName) {
      setStudentName(storedName);
      loadConversations(storedName);
    }
  }, []);

  const loadConversations = async (name) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/conversations/${encodeURIComponent(name)}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('Error loading conversations:', data);
        setConversations([]);
        return;
      }

      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    }
  };

  const handleNameSubmit = (name) => {
    setStudentName(name);
    localStorage.setItem('studentName', name);
    loadConversations(name);
  };

  const handleNewConversation = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName })
      });
      const newConv = await response.json();

      if (!response.ok) {
        console.error('Error creating conversation:', newConv);
        return;
      }

      setConversations((prev) => [newConv, ...(Array.isArray(prev) ? prev : [])]);
      setCurrentConversationId(newConv.id);
      setCurrentConversation(newConv);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/conversation/${id}`);
      const conv = await response.json();
      setCurrentConversationId(id);
      setCurrentConversation(conv);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/conversation/${id}`, { method: 'DELETE' });
      setConversations((prev) => (Array.isArray(prev) ? prev.filter(c => c.id !== id) : []));
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setCurrentConversation(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleMessageSent = (updatedConversation) => {
    setCurrentConversation(updatedConversation);
    // Update conversations list
    setConversations((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.map(c => 
        c.id === updatedConversation.id 
          ? { ...c, title: updatedConversation.title, updatedAt: updatedConversation.updatedAt }
          : c
      );
    });
  };

  if (!studentName) {
    return <WelcomeModal onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="flex h-screen bg-chat-bg text-white">
      <Sidebar
        studentName={studentName}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <ChatArea
        conversation={currentConversation}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}

export default App;
