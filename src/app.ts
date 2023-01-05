import express from "express"
import cors from 'cors'
import bodyParser from "body-parser"
import { logger } from "./logger"
import { errorMiddleware } from "./middleware/errorMiddleware"
import { IUser } from "./types"
import { currentUserMiddleware } from "./middleware/currentUserMiddleware"
import routes from './routes'

const app = express()

declare global {
  namespace Express {
    export interface Request {
      user?: IUser | null | undefined
    }
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(currentUserMiddleware)

app.use("/", routes)

app.use(errorMiddleware({ logger }))

export default app;
