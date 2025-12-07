import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase"

class Publisher {
  private database: ValueKeyDatabase

  constructor(database: ValueKeyDatabase) {
    this.database = database
  }

  public async publish(topic: string, message: string) {
    return this.database.client.publish(topic, message)
  }
}

export default Publisher
