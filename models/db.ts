import Dexie, { Table } from "dexie";
import { ApplicationFields } from "./Application";

export interface JSONFile {
  id?: number;
  name: string;
  uploadedAt: Date;
  content: string;
}

export class JSONParserDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  files!: Table<JSONFile, number>;
  applications!: Table<ApplicationFields, number>;

  constructor() {
    super("json-parser");
    this.version(1).stores({
      files: "++id, name",
      applications: "++id, name",
    });
  }
}

const DB = new JSONParserDB();
export default DB;
