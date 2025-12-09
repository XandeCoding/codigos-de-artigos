import type { RedisClient, ServerWebSocket } from "bun";
import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase";
import Logger from "../infrastructure/log/logger";
import type { Room, WebSocketData } from "../types/websocketCommons";

type SubscribeCallback = (message: string, channel: string) => void;

class Subscriber {
  private database: ValueKeyDatabase;
  private subClient?: RedisClient;
  private connections: Record<string, ServerWebSocket<WebSocketData>>;

  constructor(database: ValueKeyDatabase) {
    this.database = database;
    this.connections = {};
  }

  public async initialize(rooms: Room[]) {
    this.subClient = await this.database.client.duplicate();
    rooms.forEach((room) => {
      this.subscribe(room.id);
    });
  }

  public async subscribe(topic: string) {
    if (!this.subClient) throw TypeError("Subscribe must be not initialized");
    return this.subClient.subscribe(topic, this.subscriptionCallback());
  }

  public addConnection(
    ticket: string,
    connection: ServerWebSocket<WebSocketData>,
  ) {
    this.connections[ticket] = connection;
  }

  public removeConnection(ticket: string) {
    delete this.connections[ticket];
  }

  private subscriptionCallback(): SubscribeCallback {
    return (message, channel) => {
      Logger.debug`subscribe data - channel: ${channel} message ${message}`;

      Object.values(this.connections).forEach((connection) => {
        connection.send(message);
      });
    };
  }
}

export default Subscriber;
