import { AddressInfo } from 'net'
import { userRouter } from './routes/userRouter'
import { imageRouter } from './routes/imageRouter'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use("/user", userRouter)
app.use("/image", imageRouter)

const server = app.listen(3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`)
  } else {
    console.error(`Falha ao rodar o servidor.`)
  }
})