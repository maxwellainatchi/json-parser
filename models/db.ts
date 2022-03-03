import Dexie, { Table } from "dexie";

export interface JSONFile {
  id?: number;
  name: string;
  content: string;
}

export class JSONParserDB extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  files!: Table<JSONFile>;

  constructor() {
    super("json-parser");
    this.version(1).stores({
      files: "++id, name, content",
    });
  }
}

const DB = new JSONParserDB();
export default DB;
