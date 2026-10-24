
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  ERROR = 'error',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}
