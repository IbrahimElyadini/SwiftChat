export interface Conversation {
  conversation_id: number;
  name: string;
  created_at?: string;
  other_user?: {
    user_id: number;
    name: string;
    avatar: string;
  };
}
