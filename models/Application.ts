import { Shape, ShapeFields } from "./Shape";
import DB from "./db";
import Lazy from "../utility/Lazy";

export interface ApplicationFields {
  id?: number;
  name: string;
  baseShape: ShapeFields;
  exampleFileIds: number[];
}

export default class Application implements ApplicationFields {
  public static list(): Promise<ApplicationFields[]> {
    return DB.applications.toArray();
  }

  public static async fetch(id: number): Promise<Application | undefined> {
    let fields = await DB.applications.get(id);
    return fields && Application.hydrate(fields);
  }

  public static async create(
    name: string,
    exampleFileId: number,
    baseShape: Shape
  ): Promise<Application> {
    let id = await DB.applications.put({
      name: name,
      exampleFileIds: [exampleFileId],
      baseShape,
    });
    return new Application(id, name, baseShape, [exampleFileId]);
  }

  public static hydrate(fields: ApplicationFields): Application {
    return new Application(
      fields.id!,
      fields.name,
      Shape.hydrate(fields.baseShape),
      fields.exampleFileIds
    );
  }

  public exampleFiles = new Lazy(() =>
    DB.files.where("id").anyOf(this.exampleFileIds).toArray()
  );

  constructor(
    public id: number,
    public name: string,
    public baseShape: Shape,
    public exampleFileIds: number[]
  ) {}
}
