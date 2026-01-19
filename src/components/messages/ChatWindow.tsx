import React, { useRef, useEffect, useState } from 'react';
import { Conversation, ChatMessage } from '@/types';
import { CURRENT_CHAT_USER } from '@/constants';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onSendMessage, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages, isTyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative">
      
      {/* Header */}
      <div className="h-20 px-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between shrink-0 bg-white dark:bg-slate-800 z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{conversation.partner.name}</h2>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                conversation.status === 'Confirmed' 
                  ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                  : conversation.status === 'Inquiry'
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                  : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600'
              }`}>
                {conversation.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversation.propertyName} • {conversation.propertyDates}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img 
            src={conversation.propertyImageUrl} 
            alt="Property" 
            className="w-12 h-9 rounded-md object-cover border border-gray-200 dark:border-slate-600 shadow-sm hidden sm:block"
          />
          <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300">
            View Details
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-slate-900">
        {conversation.messages.map((msg, index) => {
          const isMe = msg.senderId === CURRENT_CHAT_USER.id;
          const showAvatar = !isMe && (index === 0 || conversation.messages[index - 1].senderId !== msg.senderId);

          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex flex-col items-center my-6">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full mb-4">
                  {msg.timestamp}
                </span>
                <div className="w-full max-w-2xl border border-gray-200 dark:border-slate-700 rounded-2xl p-6 flex items-start gap-4 shadow-sm bg-white dark:bg-slate-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0 text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{msg.systemMeta?.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{msg.systemMeta?.description}</p>
                    {msg.systemMeta?.actionText && (
                      <button className="mt-2 text-primary text-sm font-semibold hover:underline">
                        {msg.systemMeta.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-2`}>
              {!isMe && (
                <div className="w-10 shrink-0 mr-3">
                  {showAvatar ? (
                    <img 
                      src={conversation.partner.avatarUrl} 
                      alt={conversation.partner.name}
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : <div className="w-8" />}
                </div>
              )}
              
              <div className="flex flex-col max-w-[70%]">
                {!isMe && showAvatar && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 mb-1">{conversation.partner.name} • {msg.timestamp}</span>
                )}
                
                <div 
                  className={`
                    relative px-5 py-3 text-[15px] leading-relaxed shadow-sm
                    ${isMe 
                      ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none'}
                  `}
                >
                  {msg.type === 'image' && msg.imageUrl ? (
                    <img 
                      src={msg.imageUrl} 
                      alt="attachment" 
                      className="rounded-lg mb-2 max-w-full h-auto"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {isMe && (
                  <div className="flex items-center justify-end gap-1 mt-1 mr-1">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{msg.timestamp}</span>
                    {msg.isRead && (
                      <div className="flex text-gray-400 dark:text-gray-500 items-center">
                        <span className="material-symbols-outlined !text-[12px]">done_all</span>
                        <span className="text-[10px] ml-1">Read</span>
                      </div>
                    )}
                    <img src={CURRENT_CHAT_USER.avatarUrl} className="w-4 h-4 rounded-full ml-1 opacity-80" alt="me" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="w-10 shrink-0 mr-3">
              <img 
                src={conversation.partner.avatarUrl} 
                alt={conversation.partner.name}
                className="w-8 h-8 rounded-full object-cover" 
              />
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shrink-0">
        <div className="relative flex items-end gap-3 p-2 border border-gray-300 dark:border-slate-600 rounded-3xl bg-gray-50 dark:bg-slate-700 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all shadow-sm">
          
          <div className="flex gap-1 pb-2 pl-2">
            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
              <span className="material-symbols-outlined !text-[20px]">add</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
              <span className="material-symbols-outlined !text-[20px]">image</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none py-3"
            style={{ minHeight: '44px' }}
          />

          <div className="pb-1 pr-1">
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`
                p-3 rounded-full flex items-center justify-center transition-all
                ${inputText.trim() 
                  ? 'bg-primary text-white shadow-md hover:bg-primary/90 transform hover:scale-105' 
                  : 'bg-gray-200 dark:bg-slate-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
              `}
            >
              <span className="material-symbols-outlined !text-[18px]">send</span>
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">Enter to send. Shift + Enter for new line.</span>
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;

