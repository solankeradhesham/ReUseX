import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MessageSquare, Send, X } from 'lucide-react';
import { Conversation } from '../types';
import { formatINR } from '../utils/formatters';

interface ChatModalProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentUserId: string;
  isLoading: boolean;
  onSelectConversation: (id: string | null) => void;
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
  onClose: () => void;
}

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export const ChatModal: React.FC<ChatModalProps> = ({
  conversations,
  activeConversationId,
  currentUserId,
  isLoading,
  onSelectConversation,
  onSendMessage,
  onClose
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!activeConversation || !text || isSending) return;

    setError('');
    setIsSending(true);
    try {
      await onSendMessage(activeConversation.id, text);
      setMessageText('');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send the message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <section className="bg-white w-full max-w-5xl h-[min(88vh,760px)] rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col" aria-label="Messages">
        <header className="px-4 py-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-300" />
            <h2 className="font-bold text-sm sm:text-base">Messages</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800" aria-label="Close messages">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${activeConversation ? 'hidden sm:flex' : 'flex'} min-h-0 flex-col border-r border-slate-200 bg-slate-50`}>
            <div className="px-4 py-3 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              Conversations ({conversations.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-3 text-left flex gap-3 hover:bg-white ${activeConversationId === conversation.id ? 'bg-white border-l-4 border-teal-700' : ''}`}
                >
                  <span className="w-10 h-10 shrink-0 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                    {conversation.otherUser.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900 truncate">{conversation.otherUser.name}</span>
                    <span className="block text-xs text-slate-500 truncate">{conversation.adTitle}</span>
                    <span className="block text-xs text-slate-400 truncate">{conversation.lastMessage || 'No messages yet'}</span>
                  </span>
                </button>
              ))}
              {!isLoading && conversations.length === 0 && (
                <p className="p-5 text-xs leading-relaxed text-slate-500">No conversations yet. Open a listing and select Message Seller to start one.</p>
              )}
              {isLoading && <p className="p-5 text-xs text-slate-500">Loading conversations...</p>}
            </div>
          </aside>

          <div className={`${activeConversation ? 'flex' : 'hidden sm:flex'} min-h-0 flex-col`}>
            {activeConversation ? (
              <>
                <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                  <button className="sm:hidden p-1 text-slate-600" onClick={() => onSelectConversation('')} aria-label="Back to conversations">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{activeConversation.otherUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{activeConversation.adTitle} · {formatINR(activeConversation.adPrice)}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
                  {activeConversation.messages.map((message) => {
                    const isMine = message.senderId === currentUserId;
                    return (
                      <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl ${isMine ? 'bg-teal-800 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
                          {!isMine && <p className="text-[10px] font-bold mb-1 opacity-70">{message.senderName}</p>}
                          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                          <time className={`block mt-1 text-[10px] ${isMine ? 'text-teal-100' : 'text-slate-400'}`} dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
                        </div>
                      </div>
                    );
                  })}
                  {activeConversation.messages.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-8">Start the conversation with {activeConversation.otherUser.name}.</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {error && <p role="alert" className="px-4 pt-2 text-xs font-semibold text-rose-700">{error}</p>}
                <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 flex items-end gap-2">
                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value.slice(0, 2000))}
                    placeholder="Write a message..."
                    rows={2}
                    maxLength={2000}
                    className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
                    aria-label="Message"
                  />
                  <button type="submit" disabled={!messageText.trim() || isSending} className="p-3 rounded-lg bg-teal-800 text-white disabled:opacity-50" aria-label="Send message">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="hidden sm:flex flex-col items-center justify-center text-center text-slate-500 p-8">
                <MessageSquare className="w-9 h-9 mb-3 text-slate-300" />
                <p className="text-sm font-semibold">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
