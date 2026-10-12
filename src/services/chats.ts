import { Conversation } from '../types';

interface ChatResponse {
  conversations?: Conversation[];
  conversation?: Conversation;
  error?: string;
}

async function request(path: string, method = 'GET', body?: Record<string, string>) {
  const response = await fetch(`/api/chats${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const result = (await response.json()) as ChatResponse;
  if (!response.ok) throw new Error(result.error || 'Could not load messages.');
  return result;
}

export async function getConversations() {
  const result = await request('');
  return result.conversations ?? [];
}

export async function openConversation(adId: string) {
  const result = await request('', 'POST', { adId });
  if (!result.conversation) throw new Error('Could not start the conversation.');
  return result.conversation;
}

export async function sendChatMessage(conversationId: string, text: string) {
  const result = await request(`/${encodeURIComponent(conversationId)}/messages`, 'POST', { text });
  if (!result.conversation) throw new Error('Could not send the message.');
  return result.conversation;
}