import { ImageInputDTO, ImageOutputDTO } from "../model/Image";
import { ImageDatabase } from "../data/ImageDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { AuthenticationData, Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import moment from "moment";

moment.locale('pt-BR')

export class ImageBusiness {
    constructor(
        private imageDatabase: ImageDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
     ){}

    async createImage(image: ImageInputDTO, token: string) {
        if (!image.collection || !image.file || !image.subtitle || !image.tags || !token) {
            throw new InvalidParameterError("Missing input")
        }

        const id: string = this.idGenerator.generateId()

        const author: AuthenticationData = this.authenticator.getData(token) 
        
        const date: string = moment().format("YYYY-MM-DD")

        await this.imageDatabase.createImage(
            id,
            image.subtitle,
            author.id,
            date,
            image.file,
            image.tags,
            image.collection
        )
    }

    async getAllImages(token: string) {
        if (!token) {
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const imagesFromDB: ImageOutputDTO[] = await this.imageDatabase.getAllImages(author.id)

        return imagesFromDB
    }

    async getImageById(token: string, id: string) {
        if (!token || !id) {
            throw new InvalidParameterError("Missing input");
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const imagesFromDB: ImageOutputDTO = await this.imageDatabase.getImageById(id, author.id)

        return imagesFromDB
    }
}