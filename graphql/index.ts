import "reflect-metadata";
require("dotenv").config();
import { GraphQLModule } from "@graphql-modules/core";
import { ApolloServer } from "apollo-server-azure-functions";
import LinkModule from "./link/link.module";

const modules = [LinkModule];

exports.graphqlHandler = (context: any, req: any) => {
  try {
    if (!process.env.endpoint || !process.env.masterKey) {
      throw new Error("Must have private keys to run");
    }
    const { schema } = new GraphQLModule({
      // join other sub-modules
      imports: modules,
    });
    const server = new ApolloServer({
      schema,
      // tracing: true,
      tracing: false,
      // cacheControl: true,
      formatError: (err) => {
        // Sentry.captureException(err);
        console.log(err?.extensions?.exception?.stacktrace?.join("\n"));
        return err?.message || err?.extensions?.code || "ERROR";
      },
      context: {
        // Secrets for CosmosDB
        secrets: {
          endpoint: process.env.endpoint,
          masterKey: process.env.masterKey,
        },
      },
    });
    return server.createHandler()(context, req);
  } catch (error) {
    console.log("ERROR", error);
  }
};
