export interface Message {
  content: string;
  type: 'user' | 'assistant';
  audioUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  localName: string;
}