import { Plus, MessageSquare, Trash2, User } from 'lucide-react';

function Sidebar({ 
  studentName, 
  conversations, 
  currentConversationId, 
  onNewConversation, 
  onSelectConversation,
  onDeleteConversation 
}) {
  return (
    <div className="w-64 bg-sidebar-bg flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-4 py-3 bg-chat-bg hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Nova conversa</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-gray-500 text-center mt-8 px-4 text-sm">
            No hi ha converses. Crea'n una nova!
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-3 py-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conv.id
                  ? 'bg-chat-bg'
                  : 'hover:bg-gray-800'
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <MessageSquare size={16} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{conv.title}</div>
                <div className="text-xs text-gray-500">
                  {conv.messageCount} missatges
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <User size={18} />
          <span className="truncate">{studentName}</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
