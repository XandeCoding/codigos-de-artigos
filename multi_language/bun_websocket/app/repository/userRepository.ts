import type ValueKeyDatabase from "../infrastructure/database/valueKeyDatabase";
import type { User } from "../types/user";
import BaseRepository from "./baseRepository";

class UserRepository extends BaseRepository {
  constructor(database: ValueKeyDatabase) {
    super(database, "USER");
  }

  public async save(roomId: string, username: string, value: User) {
    return super.set(
      this.transformKey(roomId, username),
      JSON.stringify(value),
    );
  }

  public async read(roomId: string, username: string): Promise<null | User> {
    const data = await super.get(this.transformKey(roomId, username));

    if (data === null) return data;

    return JSON.parse(data) as User;
  }

  public async remove(roomId: string, username: string): Promise<number> {
    return super.delete(this.transformKey(roomId, username));
  }
}

export default UserRepository;
