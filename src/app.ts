import express, { Application } from "express";
import { json } from "body-parser";
import mongoose ,{ connect, ConnectOptions } from "mongoose";
import { executableSchema as schema } from "./graphql/schema";
import authenticate from "./utils/middlewares/authenticate";
import { ApolloServer } from "apollo-server-express";

export default class App {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.connectToMongo();
    this.initializeMiddlewares();
    this.initializeApollo();
  }

  private connectToMongo() {
    mongoose.set("strictQuery", true);
    const DB_url = process.env.DATABASE_URL;
    connect(DB_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as ConnectOptions)
      .then(() => {
        console.log("Connected to MongoDB...");
      })
      .catch((e) => {
        console.error("There was an error connecting to MongoDB:");
        console.error(e);
      });
  }

  private initializeMiddlewares() {
    this.app.use(json());
    this.app.use(authenticate);
  }

  private async initializeApollo() {
    const server = new ApolloServer({
      schema,
      context: (req) => ({
        req: req.req,
        res: req.res,
      }),
    });

    this.app.get("/", (_, res) => {
      res.status(200).send("OK");
    });
    await server.start();

    server.applyMiddleware({ app: this.app });
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
