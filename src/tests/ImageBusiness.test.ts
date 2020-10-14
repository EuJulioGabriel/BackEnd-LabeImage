import { ImageBusiness } from "../business/ImageBusiness"
import { ImageInputDTO, ImageOutputDTO } from "../model/Image";
import { AuthenticationData } from '../services/Authenticator'

const imageDatabase = {
    createImage: jest.fn(
        async (
            id: string,
            subtitle: string,
            author: string,
            date: string,
            file: string,
            tags: string,
        ) => { }
    ),
    getAllImages: jest.fn( async (id: string) => { }),
    getImageById: jest.fn( async (id: string) => { }),
} as any

const idGenerator = {
   generateId: jest.fn(() => "id mock")
} as any

const data: AuthenticationData = {
    id: "idvalido",
} as any

const authenticator = {
   generateToken: jest.fn(
      (payload: { id: string }) => "token de mentirinha"
   ),
   getData: jest.fn((token: string) => data)
} as any

const imageBusiness: ImageBusiness = new ImageBusiness(
   imageDatabase,
   idGenerator,
   authenticator
)

describe("Testa o método de criação de imagem", () => {
    test("Deve retornar erro quando o subtitle não for passado", async () => {
        expect.assertions(2)

        try {
            const image: ImageInputDTO = {
                subtitle: "",
                file: "https://picsum.photos/200/300",
                tags: "Tag1, Tag2",               
            }

            const token: string = "tokenvalido"

            await imageBusiness.createImage(image, token)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
   })

   test("Deve retornar erro quando o file não for passado", async () => {
        expect.assertions(2)

        try {
            const image: ImageInputDTO = {
                subtitle: "Subtitle 1",
                file: "",
                tags: "Tag1, Tag2",               
            }

            const token: string = "tokenvalido"

            await imageBusiness.createImage(image, token)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
    })

    test("Deve retornar erro quando as tags não for passada", async () => {
        expect.assertions(2)

        try {
            const image: ImageInputDTO = {
                subtitle: "Subtitle 1",
                file: "https://picsum.photos/200/300",
                tags: "",               
            }

            const token: string = "tokenvalido"

            await imageBusiness.createImage(image, token)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
    })

    test("Deve retornar erro quando o token não for passado", async () => {
        expect.assertions(2)

        try {
            const image: ImageInputDTO = {
                subtitle: "Subtitle 1",
                file: "https://picsum.photos/200/300",
                tags: "Tag1, Tag2",             
            }

            const token: string = ""

            await imageBusiness.createImage(image, token)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
    })

    test("Deve retornar undefined quando o usuário for criado com sucesso", async () => {
        const image: ImageInputDTO = {
            subtitle: "Subtitle 1",
            file: "https://picsum.photos/200/300",
            tags: "Tag1, Tag2",         
        }

        const token: string = "tokendementirinha"

        const result = await imageBusiness.createImage(image, token)

        expect(result).toBe(undefined)
    })
})

describe("Testa o método de pegar todas as imagens", () => {
    test("Deve retornar erro quando o token não for passado", async () => {
        expect.assertions(2)

        try {
            const token: string = ""
            const id: string = "idvalido"

            await imageBusiness.getAllImages(token)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
    })

    test("Deve retornar um array com comprimento de 2", async () => {
            const token: string = "tokenvalido"

            const image1: ImageOutputDTO = {
                author_id: "idvalido",
                collection:"Colection 1",
                subtitle: "Subtitle 1",
                id: "idimage1",
                createdAt: "2020-10-06",
                file: "https://picsum.photos/200/300",
                tags: "Tag1, Tag2",
                name: "Autor 1",
            }

            const image2: ImageOutputDTO = {
                author_id: "idvalido",
                collection:"Colection 2",
                subtitle: "Subtitle 2",
                id: "idimage2",
                createdAt: "2020-10-06",
                file: "https://picsum.photos/200/300",
                tags: "Tag3, Tag4",
                name: "Autor 1"
            }

            const images: ImageOutputDTO[] = [image1, image2]

            imageDatabase.getAllImages = jest.fn( async (id: string) => images)

            const result = await imageBusiness.getAllImages(token)
            
            expect(result).toEqual([
                {
                    author_id: "idvalido",
                    collection:"Colection 1",
                    subtitle: "Subtitle 1",
                    id: "idimage1",
                    createdAt: "2020-10-06",
                    file: "https://picsum.photos/200/300",
                    tags: "Tag1, Tag2",
                    name: "Autor 1"
                },
                {
                    author_id: "idvalido",
                    collection:"Colection 2",
                    subtitle: "Subtitle 2",
                    id: "idimage2",
                    createdAt: "2020-10-06",
                    file: "https://picsum.photos/200/300",
                    tags: "Tag3, Tag4",
                    name: "Autor 1"
                }       
            ])
    })
})

describe("Testa o método de pegar todas as imagens", () => {
    test("Deve retornar erro quando o token não for passado", async () => {
        expect.assertions(2)

        try {
            const token: string = ""
            const id: string = "idvalido"

            await imageBusiness.getImageById(token, id)
        } catch (error) {
            expect(error.message).toBe("Missing input")
            expect(error.code).toBe(422)
        }
    })

    test("Deve retornar uma imagem com todas as suas informações", async () => {
        const token: string = "tokenvalido"
        const id: string = "idimage1"

        const image1: ImageOutputDTO = {
            author_id: "idvalido",
            collection:"Colection 1",
            subtitle: "Subtitle 1",
            id: "idimage1",
            createdAt: "2020-10-06",
            file: "https://picsum.photos/200/300",
            tags: "Tag1, Tag2",
            name: "Autor 1"
        }

        const image: ImageOutputDTO = image1

        imageDatabase.getImageById = jest.fn( async (id: string) => image)

        const result = await imageBusiness.getImageById(token, id)
            
        expect(result).toEqual({
            author_id: "idvalido",
            collection:"Colection 1",
            subtitle: "Subtitle 1",
            id: "idimage1",
            createdAt: "2020-10-06",
            file: "https://picsum.photos/200/300",
            tags: "Tag1, Tag2",
            name: "Autor 1"
        })
    })
})