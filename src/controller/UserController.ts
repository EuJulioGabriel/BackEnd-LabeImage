import { Request, Response } from "express"

import { UserInputDTO, LoginInputDTO, FollowingOutputDTO} from "../model/User"

import { UserBusiness } from "../business/UserBusiness"

import { BaseDatabase } from "../data/BaseDatabase"
import { UserDatabase } from "../data/UserDatabase"

import { IdGenerator } from "../services/IdGenerator"
import { HashManager } from "../services/HashManager"
import { Authenticator } from "../services/Authenticator"

export class UserController {
    private static userBusiness = new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new HashManager(),
        new Authenticator()
    );

    async signup(req: Request, res: Response) {
        try {
            const input: UserInputDTO = {
                name: req.body.name,
                email: req.body.email,
                nickname: req.body.nickname,
                password: req.body.password,
            }

            const token = await UserController.userBusiness.createUser(input)

            res.status(200).send({ token })

        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }

        await BaseDatabase.destroyConnection()
    }

    async login(req: Request, res: Response) {
        try {
            const loginData: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const token = await UserController.userBusiness.getUserByEmail(loginData)

            res.status(200).send({ token })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }

        await BaseDatabase.destroyConnection()
    }

    async getUsersByName(req: Request, res: Response) {
        try {
            const name: string = req.query.name as string
            const token: string = req.headers.authorization as string

            const users = await UserController.userBusiness.getUsersByName(name, token)

            res.status(200).send({ message: users })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }
    }

    async createFollow(req: Request, res: Response) {
        try {
            const idFollowed: string = req.body.idFollowed as string
            const token: string = req.headers.authorization as string

            await UserController.userBusiness.createFollow(token, idFollowed)

            res.status(200).send({ message: "The user has been successfully followed" })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }
    }

    async deleteFollow(req: Request, res: Response) {
        try {
            const idFollowed: string = req.params.id as string
            const token: string = req.headers.authorization as string

            console.log(token)
            console.log(idFollowed)

            await UserController.userBusiness.deleteFollow(token, idFollowed)

            res.status(200).send({ message: "You have successfully followed the user" })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }
    }

    async getFollow(req: Request, res: Response) {
        try {
            const idFollowed: string = req.query.idFollowed as string
            const token: string = req.headers.authorization as string

            const follow: FollowingOutputDTO[] = await UserController.userBusiness.getFollower(token, idFollowed)

            res.status(200).send({ message: follow })
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message })
        }
    }
}