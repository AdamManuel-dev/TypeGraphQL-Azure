import { Injectable } from "@graphql-modules/di";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
  FieldResolver,
  Root,
  ResolverInterface,
  Ctx,
} from "type-graphql";
import LinkService from "./link.service";
import { Link, LinkUpdate } from "./link.type";

@Injectable()
@Resolver((of) => Link)
export default class LinkResolver implements ResolverInterface<Link> {
  constructor(private readonly linkService: LinkService) {}

  // [Query]
  @Query((returns) => Link, {
    description: "Get a residence by ID",
    nullable: true,
  })
  async residence(@Arg("id") LinkID: string) {
    return {
      id: LinkID,
      url: LinkID,
    };
  }

  @FieldResolver((returns) => Link, {
    description: "Get a residence by ID",
    nullable: true,
  })
  async url(@Root() link: Link) {
    return link.id;
  }
}
