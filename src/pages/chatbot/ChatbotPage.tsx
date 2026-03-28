import React, { useRef, useState } from 'react';

type Speaker = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  speaker: Speaker;
  text: string;
};

type QuickPrompt = {
  label: string;
  userMessage: string;
  botReply: string;
  hint?: string;
};

const baseMessages: ChatMessage[] = [
  {
    id: 'intro-1',
    speaker: 'assistant',
    text: 'Xin chào! Mình là trợ lý StayEase, mình có thể giúp gì cho bạn hôm nay?',
  },
  {
    id: 'intro-2',
    speaker: 'user',
    text: 'Mình cần tìm phòng trọ 2 phòng ngủ ở Hà Nội.',
  },
  {
    id: 'intro-3',
    speaker: 'assistant',
    text: 'Mình đang kiểm tra cho bạn. Có thể cho mình biết bạn ưu tiên dài hạn hay ngắn hạn?',
  },
];

const demoPrompts: QuickPrompt[] = [
  {
    label: 'Giới thiệu StayEase',
    hint: 'Nền tảng & hỗ trợ',
    userMessage: 'StayEase là gì?',
    botReply: 'StayEase là nền tảng đặt phòng & quản lý bất động sản tất cả trong một dành cho khách lẫn chủ nhà.',
  },
  {
    label: 'Tìm phòng 2 phòng ngủ',
    hint: 'Tùy chọn long/short-term',
    userMessage: 'Tìm phòng 2 phòng ngủ có ban công ở Hà Nội.',
    botReply: 'Mình vừa tìm được 5 căn phù hợp. Bạn muốn xem giá theo tháng hay theo đêm?',
  },
  {
    label: 'Quy trình đặt phòng',
    hint: 'Các bước & hoàn tất',
    userMessage: 'Tôi cần biết cách đặt phòng.',
    botReply: 'Chỉ cần chọn phòng, bổ sung thông tin cá nhân, nạp cọc online là xong. Mình có gửi link thanh toán luôn nhé.',
  },
  {
    label: 'Hỗ trợ thanh toán',
    hint: 'Cổng thanh toán & hoàn tiền',
    userMessage: 'Thanh toán như thế nào?',
    botReply: 'Bạn có thể thanh toán bằng thẻ nội địa, chuyển khoản hoặc ví điện tử. Mình đang đẩy link an toàn về inbox.',
  },
];

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(baseMessages);
  const nextId = useRef(baseMessages.length + 1);

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setMessages((prev) => {
      const userMessage: ChatMessage = {
        id: `msg-${nextId.current++}`,
        speaker: 'user',
        text: prompt.userMessage,
      };
      const botMessage: ChatMessage = {
        id: `msg-${nextId.current++}`,
        speaker: 'assistant',
        text: prompt.botReply,
      };
      return [...prev, userMessage, botMessage];
    });
  };

  const resetConversation = () => {
    nextId.current = baseMessages.length + 1;
    setMessages(baseMessages);
  };

  return (
    <div className="page-transition">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">chatbot demo</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Trò chuyện với StayEase Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Giao diện demo để minh họa cách robot trả lời các câu hỏi phổ biến. Nhấn vào ô gợi ý để nạp lời nhắn và xem phản hồi ngay lập tức.
          </p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_15px_60px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">Cuộc trò chuyện</p>
              <p className="text-xs text-slate-400">Không cần kết nối API thật, chỉ để demo giao diện.</p>
            </div>
            <button
              type="button"
              onClick={resetConversation}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
            >
              Làm mới
            </button>
          </div>

          <div className="mt-6 space-y-4 overflow-hidden rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <div className="flex max-h-[460px] flex-col gap-4 overflow-y-auto pr-2">
              {messages.map((message) => {
                const isBot = message.speaker === 'assistant';
                return (
                  <div key={message.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                        isBot
                          ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white'
                          : 'bg-blue-600 text-white shadow-lg'
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {isBot ? 'StayEase Bot' : 'Bạn'}
                      </span>
                      <p className="mt-1 whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">Câu hỏi mẫu</p>
              <p className="text-xs text-slate-400">Nhấn để nạp tin nhắn</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {demoPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{prompt.hint}</span>
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

