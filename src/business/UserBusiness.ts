import { UserInputDTO, LoginInputDTO, FollowingOutputDTO } from "../model/User"

import { UserDatabase } from "../data/UserDatabase"

import { IdGenerator } from "../services/IdGenerator"
import { HashManager } from "../services/HashManager"
import { AuthenticationData, Authenticator } from "../services/Authenticator";

import { InvalidParameterError } from "../error/InvalidParameterError"
import { NotFoundError } from "../error/NotFoundError"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager ,
        private authenticator: Authenticator
     ){}

    async createUser(user: UserInputDTO) {
        if (!user.name || !user.email || !user.nickname || !user.password) {
            throw new InvalidParameterError("Missing input")
        }

        if (user.email.indexOf("@") === -1) {
            throw new InvalidParameterError("Invalid email")
        }

        if (user.password.length < 6) {
            throw new InvalidParameterError("Invalid password")
        }

        const id = this.idGenerator.generateId()

        const hashPassword = await this.hashManager.hash(user.password)

        await this.userDatabase.createUser(id, user.name, user.email, user.nickname, hashPassword)

        const accessToken = this.authenticator.generateToken({ id })

        return accessToken
    }

    async getUserByEmail(user: LoginInputDTO) {
        if (!user.email || !user.password) {
            throw new InvalidParameterError("Missing input")
        }

        if (user.email.indexOf("@") === -1) {
            throw new InvalidParameterError("Invalid email")
        }

        if (user.password.length < 6) {
            throw new InvalidParameterError("Invalid password")
        }

        const userFromDB = await this.userDatabase.getUserByEmail(user.email)

        if (!userFromDB) {
            throw new NotFoundError("User not found")
        }

        const hashCompare = await this.hashManager.compare(user.password, userFromDB.getPassword())

        if (!hashCompare) {
            throw new InvalidParameterError("Invalid Password!")
        }

        const accessToken = this.authenticator.generateToken({ id: userFromDB.getId() })

        return accessToken
    }

    async getUsersByName(name: string, token: string) {
        if (!token ) {
            throw new InvalidParameterError("Missing input")
        }

        const usersFromDB = await this.userDatabase.getUsersByName(name)

        return usersFromDB
    }

    async createFollow(token: string, idFollowed: string) {
        if (!idFollowed || !token) {
            console.log("Entrei 1")
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        if (idFollowed === author.id) {
            console.log("Entrei 2")
            throw new InvalidParameterError("You can't follow yourself")
        }

        const follow = await this.userDatabase.getFollower(author.id, idFollowed)

        if(follow.length > 0) {
            console.log("Entrei 3")
            throw new InvalidParameterError("You already follow this user")
        }

        await this.userDatabase.createFollow(author.id, idFollowed)
    }

    async deleteFollow(token: string, idFollowed: string) {
        if (!idFollowed || !token) {
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        if (idFollowed === author.id) {
            throw new InvalidParameterError("You can't unfollow yourself")
        }

        const follow = await this.userDatabase.getFollower(author.id, idFollowed)

        if(follow.length === 0) {
            throw new InvalidParameterError("You can’t stop following a user you don’t follow")
        }

        await this.userDatabase.deleteFollow(author.id, idFollowed)
    }

    async getFollower(token: string, idFollowed: string) {
        if (!idFollowed || !token) {
            throw new InvalidParameterError("Missing input")
        }

        const author: AuthenticationData = this.authenticator.getData(token)

        if (idFollowed === author.id) {
            throw new InvalidParameterError("You can't unfollow yourself")
        }

        const follow: FollowingOutputDTO[] = await this.userDatabase.getFollower(author.id, idFollowed)

        return follow
    }
}