export class User{
    constructor(
    private id: string,
    private name: string,
    private email: string,
    private nickname: string,
    private password: string,
    ){}

    getId(){
        return this.id
    }

    getName(){
        return this.name
    }

    getEmail(){
        return this.email
    }

    getPassword(){
        return this.password
    }

    getNickname(){
        return this.nickname
    }

    setId(id: string){
        this.id = id
    }

    setName(name: string){
        this.name = name
    }

    setEmail(email: string){
        this.email = email
    }

    setPassword(password: string){
        this.password = password
    }

    setNickname(nickname: string){
        this.nickname = nickname
    }

    static toUserModel(user: any): User {
        return new User(user.id, user.name, user.email, user.nickname, user.password)
    }
}

export interface UserInputDTO{    
    name: string;
    email: string;
    nickname: string;
    password: string;
}

export interface LoginInputDTO{
    email: string
    password: string
}