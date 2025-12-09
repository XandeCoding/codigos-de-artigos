type Room = {
  id: string;
  name: string;
};

type Message = {
  username: string;
  text: string;
  roomId: string;
};

type WebSocketData = {
  createdAt: number;
  instance: string;
  origin: string;
  ticket?: string;
  username?: string;
  roomId?: string;
};

export type { Room, Message, WebSocketData };
