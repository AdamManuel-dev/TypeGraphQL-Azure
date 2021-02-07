import { Injectable } from "@graphql-modules/di";
import { Dao } from "../shared";

@Injectable()
export default class LinkService {
  DAO: Dao;

  constructor() {
    this.DAO = new Dao({
      secrets: {
        endpoint: process.env.endpoint as any,
        masterKey: process.env.masterKey as any,
      },
      containerId: "items",
      databaseId: "production",
    });
    // Sentry.setTags({
    //   Service: "ResidenceService",
    // });
  }
}
