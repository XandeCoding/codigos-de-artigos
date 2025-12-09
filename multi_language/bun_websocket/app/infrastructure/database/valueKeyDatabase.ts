import { RedisClient } from "bun";

class ValueKeyDatabase {
  private _client: RedisClient;

  constructor() {
    // TODO: COLOCAR PARA LER DE ENV
    this._client = new RedisClient();
  }

  get client(): RedisClient {
    return this._client as RedisClient;
  }
}

export default ValueKeyDatabase;
