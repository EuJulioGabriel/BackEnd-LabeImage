import { Request, Response } from "express";
import { ImageInputDTO, ImageOutputDTO } from "../model/Image";
import { ImageBusiness } from "../business/ImageBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { ImageDatabase } from "../data/ImageDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";

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
                collection: req.body.collection as string
            }

            const token: string = req.headers.authorization as string

            await ImageController.imageBusiness.createImage(input, token)

            res.status(200).send({ message: "Image saved successfully" });

        } catch (error) {
            res.status(error.code || 400).send({ error: error.message });
        }  
    }

    async getAllImages(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string

            const images: ImageOutputDTO[] = await ImageController.imageBusiness.getAllImages(token)

            res.status(200).send({ message: images });

        } catch (error) {
            res.status(error.code || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }        
    }

   async getImageById(req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization as string
            const id: string = req.params.id as string

            const image: ImageOutputDTO = await ImageController.imageBusiness.getImageById(token, id)

            res.status(200).send({ message: image });
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }        
    }
}