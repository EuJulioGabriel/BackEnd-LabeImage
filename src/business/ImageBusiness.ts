import moment from "moment"

import { IdGenerator } from "../services/IdGenerator";
import { AuthenticationData, Authenticator } from "../services/Authenticator";

import { ImageInputDTO, Image } from "../model/Image";

import { ImageDatabase } from "../data/ImageDatabase";

import { InvalidParameterError } from "../error/InvalidParameterError";

moment.locale('pt-BR')

export class ImageBusiness {
    constructor(
        private imageDatabase: ImageDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
     ){}

    async createImage(image: ImageInputDTO, token: string) {
        if (!image.file || !image.subtitle || !image.tags || !token) {
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
        )

        return id
    }

    async getAllImages(token: string) {
        if (!token) {
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const imagesFromDB: Image[] = await this.imageDatabase.getAllImages(author.id)

        return imagesFromDB
    }

    async getImageById(token: string, id: string) {
        if (!token || !id) {
            throw new InvalidParameterError("Missing input");
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const imagesFromDB: Image = await this.imageDatabase.getImageById(id, author.id)

        return imagesFromDB
    }

    async getImagesById(token: string, id: string) {
        if (!token || !id) {
            throw new InvalidParameterError("Missing input");
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const imagesFromDB: Image[] = await this.imageDatabase.getImagesById(id)

        return imagesFromDB
    }

    async getImagesByFilters(date: string, author: string, collection: string, tags: string, token: string ) {
        if (!token) {
            throw new InvalidParameterError("Missing input")
        }

        const user: AuthenticationData = this.authenticator.getData(token)

        if(date && author && collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateAuthorCollectionTags(
                user.id,
                date,
                author,
                collection,
                tags
            )

            return imagesFromDB
        } else if(date && author && collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateAuthorCollection(
                user.id,
                date,
                author,
                collection
            )

            return imagesFromDB
        } else if(date && author && !collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateAuthorTags(
                user.id,
                date,
                author,
                tags
            )

            return imagesFromDB
        } else if(date && author && !collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateAuthor(
                user.id,
                date,
                author
            )

            return imagesFromDB
        } else if(date && !author && collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateCollectionTags(
                user.id,
                date,
                collection,
                tags
            )

            return imagesFromDB
        } else if(date && !author && collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateCollection(
                user.id,
                date,
                collection,
            )

            return imagesFromDB
        } else if(date && !author && !collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDateTags(
                user.id,
                date,
                tags
            )

            return imagesFromDB
        } else if(date && !author && !collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByDate(
                user.id,
                date,
            )

            return imagesFromDB
        } else if(!date && author && collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByAuthorCollectionTags(
                user.id,
                author,
                collection,
                tags
            )

            return imagesFromDB
        } else if(!date && author && collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByAuthorCollection(
                user.id,
                author,
                collection
            )

            return imagesFromDB
        } else if(!date && author && !collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByAuthorTags(
                user.id,
                author,
                tags
            )

            return imagesFromDB
        } else if(!date && author && !collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByAuthor(
                user.id,
                author
            )

            return imagesFromDB
        } else if(!date && !author && collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByCollectionTags(
                user.id,
                collection,
                tags
            )

            return imagesFromDB
        } else if(!date && !author && collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByCollection(
                user.id,
                collection,
            )

            return imagesFromDB
        } else if(!date && !author && !collection && tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getFilterByTags(
                user.id,
                tags
            )

            return imagesFromDB
        } else if(!date && !author && !collection && !tags) {
            const imagesFromDB: Image[] = await this.imageDatabase.getAllImages(user.id)

            return imagesFromDB
        }
    }
}