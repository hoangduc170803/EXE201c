import React, { useEffect, useRef, useState } from 'react';

type Speaker = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  speaker: Speaker;
  text: string;
};

const initialMessages: ChatMessage[] = [
  { id: 'msg-1', speaker: 'assistant', text: 'Xin chào! Mình là bot HolaRent, mình có thể giúp bạn gì?' },
  { id: 'msg-2', speaker: 'user', text: 'Tìm phòng trọ 2 phòng ngủ ở Hà Nội.' },
  { id: 'msg-3', speaker: 'assistant', text: 'Mình đã ghi nhận yêu cầu. Bạn ưu tiên dài hạn hay ngắn hạn?' },
];

const ChatbotLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      speaker: 'user',
      text: trimmed,
    };

    const botReply: ChatMessage = {
      id: `msg-bot-${Date.now() + 1}`,
      speaker: 'assistant',
      text: 'Cảm ơn bạn! Mình đang kiểm tra dữ liệu và sẽ phản hồi ngay lập tức.',
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInputValue('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[340px] rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between rounded-[26px] bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 px-4 py-3 text-white shadow-inner">
            <div>
              <p className="text-sm font-semibold">HolaRent Assistant</p>
              <p className="text-[11px] text-slate-200/80">Trợ lý nhanh & chính xác</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/30 px-2 py-1 text-xs font-semibold uppercase tracking-wider transition hover:border-white/60"
              aria-label="Đóng chat"
            >
              X
            </button>
          </div>
          <div
            ref={messageAreaRef}
            className="max-h-[320px] space-y-3 overflow-y-auto px-4 py-3 text-sm"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  message.speaker === 'assistant'
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'self-end bg-sky-600 text-white'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {message.speaker === 'assistant' ? 'StayEase Bot' : 'Bạn'}
                </span>
                <p className="mt-1 whitespace-pre-line leading-relaxed">{message.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-2 dark:border-slate-800">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleSend}
              className="rounded-2xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary/90"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Thu nhỏ chatbot' : 'Mở chatbot'}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-[0_20px_90px_rgba(15,118,255,0.45)] transition hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 rounded-full bg-white/10 blur-[1px]" aria-hidden="true" />
        <span className="absolute -bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" aria-hidden="true" />
        <span className="material-symbols-outlined text-3xl leading-none">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>
    </div>
  );
};

export default ChatbotLauncher;

