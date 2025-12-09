import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase";

class BaseRepository {
  private namespace: string
  private defaultTTL: number
  private database: ValueKeyDatabase

  constructor(database: ValueKeyDatabase, namespace: Uppercase<string> = "DEFAULT", defaultTTL: number = 3600){
    this.database = database
    this.namespace = namespace
    this.defaultTTL = defaultTTL
  }

  protected transformKey(...values: string[]): string {
    return `${this.namespace}:${values.join(':')}`
  }

  protected async set(key: string, value: string, ttl?: number) {
    return this.database.client.set(
      key,
      value,
      "EX",
      ttl ?? this.defaultTTL 
    )
  }

  protected async get(key: string): Promise<null | string> {
    return this.database.client.get(key)
  }

  protected async delete(key: string): Promise<number> {
    return this.database.client.del(key)
  }
}

export default BaseRepository
