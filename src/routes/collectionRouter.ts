import express from "express"

import { CollectionController } from "../controller/CollectionController"

export const collectionRouter = express.Router()

const collectionController = new CollectionController()

collectionRouter.put("/createcollection", collectionController.createCollection)
collectionRouter.put("/updatecollectioncover", collectionController.updateCollectionCover)
collectionRouter.put("/addimagetocollection", collectionController.addImageToCollection)
collectionRouter.get("/getallcollections", collectionController.getAllCollections)