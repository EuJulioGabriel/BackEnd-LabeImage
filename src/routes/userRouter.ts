import express from "express"

import { UserController } from "../controller/UserController"

export const userRouter = express.Router()

const userController = new UserController()

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.get("/search", userController.getUsersByName)
userRouter.put("/follow", userController.createFollow)
userRouter.delete("/unfollow/:id", userController.deleteFollow)
userRouter.get("/getfollow", userController.getFollow)