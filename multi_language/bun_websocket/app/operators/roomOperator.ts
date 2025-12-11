import type { ServerWebSocket } from "bun";
import type { Room, RoomConnections } from "../types/room";
import type { SubscribeCallback, WebSocketData } from "../types/websocketCommons";
import Logger from "../infrastructure/log/logger";

class RoomOperator {
  public readonly id: string
  public readonly name: string
  private connections: RoomConnections

  constructor({ id, name }: Room) {
    this.id = id
    this.name = name
    this.connections = {}
  }

  public addConnection(
    connection: ServerWebSocket<WebSocketData>,
    username: string,
  ) {
    this.connections[username] = connection;
  }

  public removeConnection(username: string) {
    delete this.connections[username];
  }

  public subscriptionCallback(): SubscribeCallback {
    return (message, channel) => {
      Logger.debug`subscribe data - channel: ${channel} message ${message}`;

      Object.values(this.connections).forEach((connection) => {
        connection.send(message);
      });
    };
  }

}

export default RoomOperator
