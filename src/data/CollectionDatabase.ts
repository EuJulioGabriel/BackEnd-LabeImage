import { BaseDatabase } from "./BaseDatabase";
import { Collection, CollectionOutputDTO } from "../model/Collection"

export class CollectionDatabase extends BaseDatabase {
  private static TABLE_NAME = "LABEIMAGE_COLLECTIONS"
  private static TABLE_NAMETWO = "LABEIMAGE_COLLECTIONIMAGES"

  public async createCollection(
    id: string,
    title: string,
    subtitle: string,
    image: string | undefined,
    user_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
            id,
            title,
            subtitle,
            image,
            user_id,
        })
        .into(CollectionDatabase.TABLE_NAME)
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getImageToCollection(
    collection_id: string,
    image_id: string
  ): Promise<any[]> {
    try {
      const result = await this.getConnection().raw(`
        SELECT * FROM LABEIMAGE_COLLECTIONIMAGES
        WHERE collection_id = "${collection_id}" AND image_id = "${image_id}"
      `)

      return result[0]
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async addImageToCollection(
    addedAt: string,
    collection_id: string,
    image_id: string,
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
            addedAt,
            collection_id,
            image_id,
        })
        .into(CollectionDatabase.TABLE_NAMETWO)
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getAllCollections(userId: string): Promise<Collection[]> {
    try {
      const result = await this.getConnection().raw(`
        SELECT * FROM LABEIMAGE_COLLECTIONS
        WHERE user_id = "58ed5f21-772b-4161-b483-2b176b0652af";
      `)

      const data: any[] = result[0]

      const collections: Collection[] = []

      data.forEach((collection: any) => {
        const newCollection: Collection = Collection.toUserModel(collection)

        collections.push(newCollection)
      })

      return collections
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }
}