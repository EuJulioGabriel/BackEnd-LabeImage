import { Request, Response } from "express"

import { ImageInputDTO, Image } from "../model/Image"

import { ImageBusiness } from "../business/ImageBusiness"

import { BaseDatabase } from "../data/BaseDatabase"
import { ImageDatabase } from "../data/ImageDatabase"

import { IdGenerator } from "../services/IdGenerator"
import { Authenticator } from "../services/Authenticator"

export class ImageController {
    private static imageBusiness = new ImageBusiness(
        new ImageDatabase(),
        new IdGenerator(),
        new Authenticator()
    );

    async createImage(req: Request, res: Response) {
        try {
            const input: ImageInputDTO = {
                subtitle: req.body.subtitle as string,
                file: req.body.file as string,
                tags: req.body.tags as string,
            }

            const token: string = req.headers.authorization as string

            const id: string = await ImageController.imageBusiness.createImage(input, token)

            res.status(200).send({ message: id })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }  
    }

    async getAllImages(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string

            const images: Image[] = await ImageController.imageBusiness.getAllImages(token)

            res.status(200).send({ message: images })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }        
    }

    async getImageById(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string
            const id: string = req.params.id as string

            const image: Image = await ImageController.imageBusiness.getImageById(token, id)

            res.status(200).send({ message: image })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }        
    }

    async getImagesByFilters(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string
            const date: string = req.body.date as string
            const author: string = req.body.author as string
            const collection: string = req.body.collection as string
            const tags: string = req.body.tags as string

            const images: Image[] | undefined = await ImageController.imageBusiness.getImagesByFilters(
                date, 
                author, 
                collection, 
                tags, 
                token
            )

            res.status(200).send({ message: images })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        } finally {
            await BaseDatabase.destroyConnection()
        }        
    }
}