import * as mtt from "maketypes/lib/types";
import JSONValue from "../utility/jsonValue";
import { BaseShape as _BaseShape, d2s } from "maketypes/lib/types";
import { Emitter, NopWriter } from "maketypes/lib/index";

export enum Type {
  bottom,
  null,
  record,
  string,
  boolean,
  number,
  collection,
  any,
}

let mttToType: Record<mtt.BaseShape, Type> = {
  0: Type.bottom,
  1: Type.null,
  2: Type.record,
  3: Type.string,
  4: Type.boolean,
  5: Type.number,
  6: Type.collection,
  7: Type.any,
};

const emptyEmitter = new Emitter(new NopWriter(), new NopWriter());

export interface ShapeFields {
  type: Type;
}

interface ShapeWithName {
  name: string;
  shape: Shape;
}

export abstract class Shape implements ShapeFields {
  public static hydrate(object: ShapeFields): Shape {
    switch (object.type) {
      case Type.record:
        return RecordShape.hydrate(object as RecordShapeFields);
      case Type.collection:
        return CollectionShape.hydrate(object as CollectionShapeFields);
      default:
        return new PrimitiveShape(object.type);
    }
  }

  protected static _construct(shape: mtt.Shape): Shape {
    let type = mttToType[shape.type];
    switch (type) {
      case Type.bottom:
        throw new Error("Invalid base type " + type);
      case Type.record:
        let recordShape = shape as mtt.CRecordShape;
        let fields = new Map<string, Shape>();
        recordShape.forEachField((field, name) => {
          let shape = Shape._construct(field);
          fields.set(name, shape);
        });
        return new RecordShape(type, fields);
      case Type.collection:
        let collectionShape = shape as mtt.CCollectionShape;
        return new CollectionShape(
          type,
          Shape._construct(collectionShape.baseShape)
        );
      default:
        return new PrimitiveShape(type);
    }
  }

  public static parse<T extends mtt.Shape>(json: JSONValue): Shape {
    return this._construct(d2s(emptyEmitter, json));
  }

  public static typeToName: Record<_BaseShape, string> = {
    [Type.bottom]: "bottom",
    [Type.null]: "null",
    [Type.record]: "record",
    [Type.string]: "string",
    [Type.boolean]: "boolean",
    [Type.number]: "number",
    [Type.collection]: "collection",
    [Type.any]: "any",
  };

  public get typeName(): string {
    return Shape.typeToName[this.type];
  }

  public constructor(public type: Type) {}

  abstract recursiveFields(baseName?: string): ShapeWithName[];
}

export interface RecordShapeFields extends ShapeFields {
  fields: Map<string, ShapeFields>;
}

export class RecordShape extends Shape implements RecordShapeFields {
  public static override hydrate(object: RecordShapeFields): RecordShape {
    return new RecordShape(
      object.type,
      new Map(
        [...object.fields].map(([name, field]) => [name, Shape.hydrate(field)])
      )
    );
  }

  constructor(type: Type, public fields: Map<string, Shape>) {
    super(type);
  }

  public override recursiveFields(baseName?: string): ShapeWithName[] {
    return [...this.fields].flatMap(([name, field]) =>
      field.recursiveFields(`${baseName ?? ""}.${name}`)
    );
  }
}

export interface CollectionShapeFields extends ShapeFields {
  derivedShape: ShapeFields;
}

export class CollectionShape extends Shape implements CollectionShapeFields {
  public static override hydrate(
    object: CollectionShapeFields
  ): CollectionShape {
    return new CollectionShape(object.type, Shape.hydrate(object.derivedShape));
  }

  constructor(type: Type, public derivedShape: Shape) {
    super(type);
  }

  public override recursiveFields(baseName?: string): ShapeWithName[] {
    return this.derivedShape.recursiveFields(`${baseName ?? ""}[]`);
  }
}

export class PrimitiveShape extends Shape {
  public override recursiveFields(baseName?: string): ShapeWithName[] {
    return [
      {
        name: baseName ?? "",
        shape: this,
      },
    ];
  }
}
