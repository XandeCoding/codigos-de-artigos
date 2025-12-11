import type { RedisClient } from "bun";
import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase";
import type { SubscribeCallback } from "../types/websocketCommons";

class Subscriber {
  private database: ValueKeyDatabase;
  private subClient?: RedisClient;

  constructor(database: ValueKeyDatabase) {
    this.database = database;
  }

  public async initialize() {
    this.subClient = await this.database.client.duplicate();
  }

  public async subscribe(topic: string, callback: SubscribeCallback) {
    if (!this.subClient) throw TypeError("Subscribe must be not initialized");
    return this.subClient.subscribe(topic, callback);
  }
}

export default Subscriber;
