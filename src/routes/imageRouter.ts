import express from "express"

import { ImageController } from "../controller/ImageController"

export const imageRouter = express.Router()

const imageController = new ImageController()

imageRouter.post("/createimage", imageController.createImage)
imageRouter.get("/image", imageController.getAllImages)
imageRouter.get("/image/:id", imageController.getImageById)
imageRouter.get("/filters", imageController.getImagesByFilters)
imageRouter.get("/collection/:id", imageController.getImagesById)
imageRouter.get("/feed", imageController.getFeed)