// Mock chat thread store — read-only fixtures until backend (Ably / polling)
// is wired. Each message has a sender ('me' = current user, 'them' = counterparty)
// to match the bubble alignment convention.

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  sentAt: number;
}

export interface ChatHistory {
  threadId: string;
  messages: ChatMessage[];
}

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const HISTORIES: ChatHistory[] = [
  {
    threadId: 't-1',
    messages: [
      { id: 'm-1-1', sender: 'them', text: 'Hi! Got your job request. Want me to come measure tomorrow?', sentAt: NOW - 3 * HOUR },
      { id: 'm-1-2', sender: 'me', text: 'Yes, after 5pm works.', sentAt: NOW - 3 * HOUR + 5 * MIN },
      { id: 'm-1-3', sender: 'them', text: '5:30 OK?', sentAt: NOW - 3 * HOUR + 6 * MIN },
      { id: 'm-1-4', sender: 'me', text: 'Perfect.', sentAt: NOW - 3 * HOUR + 7 * MIN },
      { id: 'm-1-5', sender: 'them', text: 'Tile sample uploaded — take a look.', sentAt: NOW - 12 * MIN },
    ],
  },
  {
    threadId: 't-2',
    messages: [
      { id: 'm-2-1', sender: 'them', text: 'Sending materials list now.', sentAt: NOW - 2 * HOUR },
      { id: 'm-2-2', sender: 'them', text: 'Material list attached.', sentAt: NOW - HOUR },
    ],
  },
  {
    threadId: 't-3',
    messages: [
      { id: 'm-3-1', sender: 'me', text: 'How is the patch coming?', sentAt: NOW - DAY - HOUR },
      { id: 'm-3-2', sender: 'them', text: 'Wrapping up the last seam now.', sentAt: NOW - DAY },
      { id: 'm-3-3', sender: 'them', text: 'Done — proof photos in.', sentAt: NOW - DAY + 30 * MIN },
    ],
  },
];

export function getChatHistory(threadId: string): ChatHistory | null {
  return HISTORIES.find((h) => h.threadId === threadId) ?? null;
}
