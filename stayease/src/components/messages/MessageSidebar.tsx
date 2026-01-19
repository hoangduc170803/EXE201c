import React from 'react';
import { Conversation } from '@/types';

interface MessageSidebarProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const MessageSidebar: React.FC<MessageSidebarProps> = ({ conversations, selectedId, onSelect }) => {
  return (
    <aside className="w-full md:w-96 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-4 flex gap-2">
        <button className="px-4 py-1.5 bg-gray-900 dark:bg-primary text-white rounded-full text-sm font-medium">All</button>
        <button className="px-4 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-sm font-medium">Unread</button>
        <button className="px-4 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-sm font-medium">Archived</button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const isSelected = conv.id === selectedId;
          return (
            <div 
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`
                group px-5 py-4 cursor-pointer transition-colors relative flex gap-4
                ${isSelected ? 'bg-blue-50 dark:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}
              `}
            >
              {/* Active Indicator Line */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img 
                  src={conv.partner.avatarUrl} 
                  alt={conv.partner.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                )}
                {conv.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
                    {conv.unreadCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                    {conv.partner.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                    {conv.lastMessageTime}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                  {conv.propertyName} • {conv.propertyDates}
                </div>

                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {conv.lastMessageSnippet}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default MessageSidebar;

