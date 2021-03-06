import { BaseDatabase } from "./BaseDatabase";
import { User, FollowingOutputDTO } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static TABLE_NAME = "LABEIMAGE_USERS";
  private static TABLETWO_NAME = "LABEIMAGE_FOLLOWING"

  private toModel(dbModel?: any): User | undefined {
    return (
      dbModel &&
      new User(
        dbModel.id,
        dbModel.name,
        dbModel.email,
        dbModel.nickname,
        dbModel.password,
      )
    )
  }

  public async createUser(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          email,
          name,
          nickname,
          password,
        })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await super.getConnection().raw(`
        SELECT * from ${UserDatabase.TABLE_NAME} WHERE email = '${email}'
      `);
      return this.toModel(result[0][0])
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getUsersByName(name: string): Promise<User[] | undefined> {
    try {
      const result = await super.getConnection().raw(`
        SELECT * FROM ${UserDatabase.TABLE_NAME} LU
        WHERE LU.name LIKE '%${name}%';
      `)

      const data: any[] = result[0]

      const users: User[] = []

      data.forEach((user: any) => {
        const newUser: User = User.toUserModel(user)

        users.push(newUser)
      })

      return users
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getUserById(id: string): Promise<User[] | undefined> {
    try {
      const result = await super.getConnection().raw(`
        SELECT * from ${UserDatabase.TABLE_NAME} WHERE id = '${id}'
      `);

      const data: any[] = result[0][0]

      return data
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFollower(idFollower: string, idFollowed: string): Promise<FollowingOutputDTO[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT * FROM ${UserDatabase.TABLETWO_NAME} LU
        WHERE LU.follower_id= "${idFollower}" AND LU.followed_id= "${idFollowed}" ;
      `)

      const data: any[] = result[0]
      const follower: FollowingOutputDTO[] = []

      data.forEach((following) => {
        const newFollowing: FollowingOutputDTO = {
          follower_id: following.follower_id,
          followed_id: following.followed_id
        }

        follower.push(newFollowing)
      })

      return follower
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async createFollow(idFollower: string, idFollowed: string): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          follower_id: idFollower,
          followed_id: idFollowed,
        })
        .into(UserDatabase.TABLETWO_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async deleteFollow(idFollower: string, idFollowed: string): Promise<void> {
    try {
      await super.getConnection().raw(`
        DELETE FROM ${UserDatabase.TABLETWO_NAME}
        WHERE follower_id= "${idFollower}" AND followed_id= "${idFollowed}";
      `)
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }
}