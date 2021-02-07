import { Field, ObjectType, InputType, Int } from "type-graphql";

@InputType({
  description: "Add Pagination to the Query",
})
export class Page {
  @Field((type) => Number, {
    nullable: true,
    description: "The number of records to skip",
    defaultValue: 0,
  })
  skip: number;

  @Field((type) => Number, {
    nullable: true,
    description: "The number of records to return in result",
    defaultValue: 10,
  })
  limit: number;
}

@InputType({
  description: "Add Sort to the Query",
})
export class Sort {
  @Field((type) => String, {
    nullable: true,
    description:
      "The string path to the attribute you want the results sorted by",
    defaultValue: "_ts",
  })
  key: string;

  @Field((type) => String, {
    nullable: true,
    description: "The direction of the sorting",
    defaultValue: "desc",
  })
  dir: "asc" | "desc";
}

@InputType()
export class EnumRequest {
  @Field((type) => String, {
    nullable: false,
  })
  path: string;
}

@ObjectType()
export class EnumValue {
  @Field((type) => String, {
    nullable: false,
  })
  path: string;

  @Field((type) => String, {
    nullable: true,
  })
  enum: string;

  @Field((type) => Number, {
    nullable: true,
  })
  count: number;
}
