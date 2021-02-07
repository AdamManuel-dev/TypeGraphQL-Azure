import { ObjectType, Field, InputType } from "type-graphql";

@ObjectType({
  description: "Lead Reference",
})
export class Link {
  @Field((type) => String, {
    nullable: false,
  })
  id: string;

  @Field((type) => String, {
    nullable: false,
  })
  url: string;
}

@InputType({
  description: "Lead Reference",
})
export class LinkUpdate {
  @Field((type) => String, {
    nullable: false,
  })
  id: string;

  @Field((type) => String, {
    nullable: false,
  })
  url: string;
}
