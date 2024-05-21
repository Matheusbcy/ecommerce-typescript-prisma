import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import {PrismaClient} from "@prisma/client"

const app: Express = express();

app.use(express.json())

app.listen(PORT, () => {
  console.log("App working!");
});

export const prismaClient = new PrismaClient({
    log:['query']
})

app.use("/api", rootRouter)
