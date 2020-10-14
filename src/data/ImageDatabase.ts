import { BaseDatabase } from "./BaseDatabase"
import { Image } from "../model/Image"

export class ImageDatabase extends BaseDatabase {
  private static TABLE_NAME = "LABEIMAGE_IMAGES"

  public async createImage(
    id: string,
    subtitle: string,
    author: string,
    date: string,
    file: string,
    tags: string,
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
        })
        .into(ImageDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getAllImages(id: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.author_id, LI.subtitle, LI.id, LI.createdAt, LI.file, LI.tags, LU.name
        FROM LABEIMAGE_USERS LU
        JOIN LABEIMAGE_IMAGES LI
        ON "${id}" = LU.id
        WHERE author_id = "${id}"
        ORDER BY createdAt ASC;
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getImageById(idImage: string, idUser: string): Promise<Image> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.author_id, LI.subtitle, LI.id, LI.createdAt, LI.file, LI.tags, LU.name
        FROM LABEIMAGE_USERS LU
        JOIN LABEIMAGE_IMAGES LI
        ON "${idUser}" = LU.id
        WHERE LI.id = "${idImage}" 
        ORDER BY createdAt ASC;
      `)

      const data: any[] = result[0][0]

      const image: Image = Image.toUserModel(data)

      return image
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getImagesById(idCollection: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LI.id = LCI.image_id
        JOIN LABEIMAGE_USERS LU
        ON author_id = LU.id 
        WHERE  LCI.collection_id = "${idCollection}"
        ORDER BY subtitle ASC;
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateAuthorCollectionTags(
    userId: string,
    date: string, 
    author: string, 
    collection: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND 
        LU.name = "${author}" AND 
        LC.title = "${collection}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateAuthorCollection(
    userId: string,
    date: string, 
    author: string, 
    collection: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND 
        LU.name = "${author}" AND 
        LC.title = "${collection}";       
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }
  
  public async getFilterByDateAuthorTags(
    userId: string,
    date: string, 
    author: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND 
        LU.name = "${author}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateAuthor(
    userId: string,
    date: string, 
    author: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND 
        LU.name = "${author}";       
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateCollectionTags(
    userId: string,
    date: string,  
    collection: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND
        LC.title = "${collection}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateCollection(
    userId: string,
    date: string,  
    collection: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND  
        LC.title = "${collection}";    
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDateTags(
    userId: string,
    date: string,  
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByDate(
    userId: string,
    date: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND 
        LI.createdAt = "${date}";        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByAuthorCollectionTags(
    userId: string,
    author: string, 
    collection: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LU.name = "${author}" AND 
        LC.title = "${collection}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByAuthorCollection(
    userId: string,
    author: string, 
    collection: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND  
        LU.name = "${author}" AND 
        LC.title = "${collection}";        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByAuthorTags(
    userId: string,
    author: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND  
        LU.name = "${author}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByAuthor(
    userId: string,
    author: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND 
        LU.name = "${author}";        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByCollectionTags(
    userId: string, 
    collection: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND 
        LC.title = "${collection}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByCollection(
    userId: string, 
    collection: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name, 
        LCI.addedAt, LCI.collection_id , 
        LC.title
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        JOIN LABEIMAGE_COLLECTIONIMAGES LCI
        ON LCI.image_id = LI.id
        JOIN LABEIMAGE_COLLECTIONS LC
        ON LCI.collection_id = LC.id
        WHERE 
        author_id = "${userId}" AND  
        LC.title = "${collection}";        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async getFilterByTags(
    userId: string, 
    tags: string): Promise<Image[]> {
    try {
      const result = await super.getConnection().raw(`
        SELECT LI.id, LI.subtitle, LI.author_id, LI.createdAt, LI.file, LI.tags, 
        LU.name
        FROM LABEIMAGE_IMAGES LI
        JOIN LABEIMAGE_USERS LU
        ON LI.author_id = LU.id
        WHERE 
        author_id = "${userId}" AND
        LI.tags LIKE '%${tags}%';        
      `)

      const data: any[] = result[0]

      const images: Image[] = []

      data.forEach((image: any) => {
        const newImage: Image = Image.toUserModel(image)

        images.push(newImage)
      })

      return images
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }
}