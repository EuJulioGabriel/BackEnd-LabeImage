import { Request, Response } from "express"

import { Collection, CollectionInputDTO } from "../model/Collection"

import { CollectionBusiness } from "../business/CollectionBusiness"

import { BaseDatabase } from "../data/BaseDatabase"
import { CollectionDatabase } from "../data/CollectionDatabase"

import { IdGenerator } from "../services/IdGenerator"
import { Authenticator } from "../services/Authenticator"

export class CollectionController {
    private static collectionBusiness = new CollectionBusiness(
        new CollectionDatabase(),
        new IdGenerator(),
        new Authenticator()
    );

    async createCollection(req: Request, res: Response) {
        try {
            const input: CollectionInputDTO = {
                title: req.body.title as string,
                subtitle: req.body.subtitle as string,
                image: req.body.image as string || undefined
            }

            const token: string = req.headers.authorization as string

            await CollectionController.collectionBusiness.createCollection(input, token)

            res.status(200).send({ message: "Collection created successfully" })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }  
    }

    async addImageToCollection(req: Request, res: Response) {
        try {
            const idImage: string = req.body.idImage as string
            const idCollection: string = req.body.idCollection as string

            const token: string = req.headers.authorization as string

            await CollectionController.collectionBusiness.addImageToCollection(idImage, idCollection, token)

            res.status(200).send({ message: "Add Image to collection successfully" })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }  
    }

    async getAllCollections(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string

            const collections: Collection[] = await CollectionController.collectionBusiness.getAllCollections(token)

            res.status(200).send({ message: collections })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }  
    }
}