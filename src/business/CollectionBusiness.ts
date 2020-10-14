import moment from "moment"

import { Collection, CollectionInputDTO } from "../model/Collection"

import { CollectionDatabase } from "../data/CollectionDatabase"

import { IdGenerator } from "../services/IdGenerator"
import { AuthenticationData, Authenticator } from "../services/Authenticator"

import { InvalidParameterError } from "../error/InvalidParameterError"

moment.locale('pt-BR')

export class CollectionBusiness {
    constructor(
        private collectionDatabase: CollectionDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
     ){}

    async createCollection(collection: CollectionInputDTO, token: string) {
        if (!collection.subtitle || !collection.title || !token) {
            throw new InvalidParameterError("Missing input")
        }

        const id: string = this.idGenerator.generateId()

        const author: AuthenticationData = this.authenticator.getData(token) 

        await this.collectionDatabase.createCollection(
            id,
            collection.title,
            collection.subtitle,
            collection.image,
            author.id
        )
    }

    async addImageToCollection(idImage: string, idCollection: string, token: string) {
        if (!idImage || !idCollection || !token) {
            throw new InvalidParameterError("Missing input")
        }

        const data: any[] = await this.collectionDatabase.getImageToCollection(idCollection, idImage)

        if(data.length > 0) {
            throw new InvalidParameterError("The image was already in the collection")
        }
        
        const date: string = moment().format("YYYY-MM-DD")

        await this.collectionDatabase.addImageToCollection(
            date, 
            idCollection,
            idImage
        )
    }

    async getAllCollections(token: string) {
        if (!token) {
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        const data: Collection[] = await this.collectionDatabase.getAllCollections(author.id)

        return data
    }
}