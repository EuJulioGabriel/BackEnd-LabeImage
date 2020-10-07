import { BaseDatabase } from "./BaseDatabase";
import { ImageOutputDTO } from "../model/Image";
import moment from 'moment'

export class ImageDatabase extends BaseDatabase {
  private static TABLE_NAME = "LABEIMAGE_IMAGES";

  public async createImage(
  id: string,
	subtitle: string,
	author: string,
	date: string,
	file: string,
	tags: string,
	collection: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
            id,
            subtitle,
            author_id: author,
            createdAt: date,
            file,
            tags,
            collection,
        })
        .into(ImageDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllImages(id: string): Promise<ImageOutputDTO[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.author_id, LI.collection, LI.subtitle, LI.id, LI.createdAt, LI.file, LI.tags, LI.collection, LU.name
        FROM LABEIMAGE_USERS LU
        JOIN LABEIMAGE_IMAGES LI
        ON "${id}" = LU.id
        WHERE author_id = "${id}"
        ORDER BY createdAt ASC;
      `);

      const images: ImageOutputDTO[] = []
      
      const data: any[] = result[0]

      data.forEach((image: any) => {
        const imageToModel: ImageOutputDTO = {
          author_id: image.author_id,
          collection: image.collection,
          subtitle: image.subtitle,
          id: image.id,
          createdAt: moment(image.createdAt).format("DD/MM/YYYY"),
          file: image.file,
          tags: image.tags,
          name: image.name
        }

        images.push(imageToModel)
      })

      return images
    } catch (error) {
      console.log(error)
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getImageById(idDaImagem: string, idDoUsuário: string): Promise<ImageOutputDTO> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.author_id, LI.collection, LI.subtitle, LI.id, LI.createdAt, LI.file, LI.tags, LI.collection, LU.name
        FROM LABEIMAGE_USERS LU
        JOIN LABEIMAGE_IMAGES LI
        ON "${idDoUsuário}" = LU.id
        WHERE LI.id = "${idDaImagem}" 
        ORDER BY createdAt ASC;
      `);

      const imageToModel: ImageOutputDTO = {
        author_id: result[0][0].author_id,
        collection: result[0][0].collection,
        subtitle: result[0][0].subtitle,
        id: result[0][0].id,
        createdAt: moment(result[0][0].createdAt).format("DD/MM/YYYY"),
        file: result[0][0].file,
        tags: result[0][0].tags,
        name: result[0][0].name,
      }

      return imageToModel
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }
}