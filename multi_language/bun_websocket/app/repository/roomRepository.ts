import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase";

class RoomRepository {
  private namespace = 'ROOM'
  private database: ValueKeyDatabase

  constructor(database: ValueKeyDatabase){
    this.database = database
  }

  private transformKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  public async set(key: string, value: string) {
    return this.database.client.set(
      this.transformKey(key),
      value
    )
  }

}

export default RoomRepository
