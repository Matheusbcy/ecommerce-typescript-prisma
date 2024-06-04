import express, { Express } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";

const app: Express = express();

app.use(express.json());

// Rotas principais
app.use("/api", rootRouter);

// Middleware de tratamento de erros
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App working!");
});

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress:{
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
        }
      }
    }
  }
})
