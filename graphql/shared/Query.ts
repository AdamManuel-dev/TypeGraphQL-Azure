import type { BaseItem, QueryLiteral } from "./Dao";
import * as DAO from "./Dao";

export class Parameter {
  public name: string;
  public value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }

  public valueOf() {
    return {
      name: this.name,
      value: this.value,
    };
  }
}

/**
 * Splits an object into a Cosmos DB SQL Query
 * @param {Object} obj Object to split into query
 */
function splitObjectIntoQuery(obj: any) {
  if (!obj)
    return {
      query: "",
      parameters: [],
    };
  const entries = Object.entries(obj);
  let query = "";
  let parameters: Parameter[] = [];
  entries.forEach((strings, i) => {
    if (typeof i === "number") query += ` and c[@P${i}] = @V${i}`;
  });
  entries
    .map((entry, i) => {
      return [
        new Parameter(`@P${i}`, entry[0]),
        new Parameter(`@V${i}`, entry[1]),
      ];
    })
    .forEach((entryDouble) => {
      parameters.push(entryDouble[0]);
      parameters.push(entryDouble[1]);
    });

  return {
    query,
    parameters,
  };
}

/**
 * Remove the metadata properties from Cosmos responses
 * @param records Records to clean metadata from
 */
function removeMetaProperties(...records: any[]): any[] | any {
  const toReturn = records.map((record) =>
    Array.isArray(record)
      ? record.map((i) =>
          Object.entries(i).reduce((prev, cur) => {
            if (cur[0].charAt(0) === "_") {
              return prev;
            } else {
              return { ...prev, [cur[0]]: cur[1] };
            }
          }, [])
        )
      : Object.entries(record).reduce((prev, cur) => {
          if (cur[0].charAt(0) === "_") {
            return prev;
          } else {
            return { ...prev, [cur[0]]: cur[1] };
          }
        }, {})
  );
  if (toReturn.length === 1) {
    return toReturn[0];
  } else if (toReturn.length === 0) {
    return [];
  } else return toReturn;
}

/**
   * @function search Searches the DB using an object, that is split into query parameters
   * @returns results of the query
   * @example 
    // Searches all users for user with First Name "Adam"
    this.flow(
      this.search({
        "type": "User",
        "firstName": "Adam"
      })
    )
    */
export async function search<T>({
  type,
  item,
  dao,
  page,
  sortOptions,
}: {
  type: string;
  item: BaseItem;
  dao: DAO.Dao;
  page?: {
    offset: number;
    limit: number;
  };
  sortOptions?: {
    path: string;
    dir: "asc" | "desc";
  };
}) {
  if (!page?.limit && !page?.offset) {
    page = {
      offset: 0,
      limit: 10,
    };
  }
  if (!sortOptions) {
    sortOptions = {
      path: "_ts",
      dir: "desc",
    };
  }
  const search = splitObjectIntoQuery(item);
  // console.log(search);
  // HACK:  This needs to be SQL Injection Protected
  let queryString = `SELECT * FROM c where c.type = @Type${
    search.query
  } order by c.${sortOptions.path} ${
    sortOptions.dir === "asc" ? "ASC" : "DESC"
  } offset ${page.offset} limit ${page.limit}`; // order by c[@Order] @Dir OFFSET @Skip LIMIT @Limit`;
  const parameters = [new Parameter("@Type", type), ...search.parameters];

  const queryParams = parameters.map((param) => param.valueOf());

  // console.log(queryParams);
  const Query = {
    query: queryString,
    parameters: queryParams,
    partition: type,
  };

  // console.log("query: ", Query);
  const items = await dao.query<any>(Query);
  // console.log(items);
  return items as T[];
}
