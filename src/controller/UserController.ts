import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO} from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

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

            res.status(200).send({ token });

        } catch (error) {
            res.status(error.code || 400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    async login(req: Request, res: Response) {
        try {
            const loginData: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            };

            const token = await UserController.userBusiness.getUserByEmail(loginData);

            res.status(200).send({ token });
        } catch (error) {
            res.status(error.code || 400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }
}