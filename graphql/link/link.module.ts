import { GraphQLModule } from "@graphql-modules/core";
import { buildSchemaSync } from "type-graphql";
import { LinkResolver, LinkService } from "./index";

const resolvers = [LinkResolver] as const;

// @ts-ignore
const LinkModule = new GraphQLModule({
  providers: [LinkService, ...resolvers],
  extraSchemas: [
    buildSchemaSync({
      resolvers,
      container: ({ context }) =>
        LinkModule.injector.getSessionInjector(context),
      skipCheck: false,
    }),
  ],
});

export default LinkModule;
