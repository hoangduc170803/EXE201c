import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageSidebar from '@/components/messages/MessageSidebar';
import ChatWindow from '@/components/messages/ChatWindow';
import { MOCK_CONVERSATIONS, CURRENT_CHAT_USER } from '@/constants';
import { Conversation, ChatMessage } from '@/types';

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setMobileShowChat(true);
    // Mark as read
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_CHAT_USER.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    // Update conversation with new message
    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessageSnippet: text,
          lastMessageTime: 'Just now'
        };
      }
      return c;
    }));

    // Simulate typing response
    setIsTyping(true);
    
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConversation.partner.id,
        text: getAutoReply(text, selectedConversation),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      setIsTyping(false);
      
      setConversations(prev => prev.map(c => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [...c.messages, replyMessage],
            lastMessageSnippet: replyMessage.text,
            lastMessageTime: 'Just now'
          };
        }
        return c;
      }));
    }, 1500);
  };

  // Simple auto-reply function
  const getAutoReply = (userMessage: string, conv: Conversation): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('check-in') || lowerMsg.includes('check in')) {
      return `Check-in is at 3:00 PM. I'll send you detailed instructions the day before your arrival!`;
    }
    if (lowerMsg.includes('wifi') || lowerMsg.includes('internet')) {
      return `Yes, we have high-speed WiFi! The password will be in the welcome guide at the property.`;
    }
    if (lowerMsg.includes('parking')) {
      return `Yes, free parking is available on-site. You'll have a dedicated spot.`;
    }
    if (lowerMsg.includes('thank')) {
      return `You're welcome! Feel free to reach out if you have any other questions. 😊`;
    }
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return `Hi there! How can I help you with your upcoming stay at ${conv.propertyName}?`;
    }
    
    return `Thanks for your message! I'll get back to you shortly with more details.`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900 font-sans text-gray-900 dark:text-white">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">apartment</span>
            <h1 className="text-xl font-bold hidden sm:block">StayEase</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/profile" 
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Profile
          </Link>
          <Link 
            to="/" 
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Explore
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - Hidden on mobile when chat is open */}
        <div className={`${mobileShowChat ? 'hidden md:flex' : 'flex'} w-full md:w-auto`}>
          <MessageSidebar 
            conversations={conversations} 
            selectedId={selectedId} 
            onSelect={handleSelectConversation} 
          />
        </div>

        {/* Chat Window - Hidden on mobile when sidebar is shown */}
        <div className={`${mobileShowChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {/* Mobile Back Button */}
          <div className="md:hidden p-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <button 
              onClick={() => setMobileShowChat(false)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Back to messages</span>
            </button>
          </div>
          
          <ChatWindow 
            conversation={selectedConversation} 
            onSendMessage={handleSendMessage} 
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

