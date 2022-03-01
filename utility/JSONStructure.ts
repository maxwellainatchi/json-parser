import {
  BaseShape as _BaseShape,
  CCollectionShape,
  CRecordShape,
  d2s,
  Shape,
} from "maketypes/lib/types";
import JSONValue from "./jsonValue";
import { Emitter, NopWriter } from "maketypes/lib/index";

const emptyEmitter = new Emitter(new NopWriter(), new NopWriter());

// UGH, not emitted in the JS :(
const BaseShape: {
  BOTTOM: 0;
  NULL: 1;
  RECORD: 2;
  STRING: 3;
  BOOLEAN: 4;
  NUMBER: 5;
  COLLECTION: 6;
  ANY: 7;
} = {
  BOTTOM: 0,
  NULL: 1,
  RECORD: 2,
  STRING: 3,
  BOOLEAN: 4,
  NUMBER: 5,
  COLLECTION: 6,
  ANY: 7,
} as const;

const BaseShapeName: Record<_BaseShape, string> = {
  [BaseShape.BOTTOM]: "bottom",
  [BaseShape.NULL]: "null",
  [BaseShape.RECORD]: "record",
  [BaseShape.STRING]: "string",
  [BaseShape.BOOLEAN]: "boolean",
  [BaseShape.NUMBER]: "number",
  [BaseShape.COLLECTION]: "collection",
  [BaseShape.ANY]: "any",
};

interface ShapeName {
  shape: Shape;
  type: string;
  name: string;
}

export default class JSONStructure {
  private _shape?: Shape;
  constructor(private json: JSONValue) {}

  public get parsed(): boolean {
    return !!this._shape;
  }

  parse() {
    if (this._shape) return;
    this._shape = d2s(emptyEmitter, this.json);
  }

  toString(): string {
    if (!this._shape) {
      return "[unparsed]";
    }
    return JSONStructure.stringify(this._shape);
  }

  private static stringify(shape: Shape, tabs: number = 0): string {
    let value = (() => {
      switch (shape.type) {
        case BaseShape.STRING:
          return "string";
        case BaseShape.BOOLEAN:
          return "boolean";
        case BaseShape.NUMBER:
          return "number";
        case BaseShape.NULL:
          return "null";
        case BaseShape.ANY:
          return "any";
        case BaseShape.BOTTOM:
          return "bottom";
        case BaseShape.COLLECTION:
          return `Array<${this.stringify(shape.baseShape, tabs)}>`;
        case BaseShape.RECORD:
          let fields = (shape as any)._fields as Map<string, Shape>;
          let entries = [...fields.entries()];
          return `{\n${entries.reduce(
            (prev, [name, shape]) =>
              prev +
              `${"\t".repeat(tabs + 1)}${name}${
                shape.nullable ? "?" : ""
              }: ${this.stringify(shape, tabs + 1)};\n`,
            ""
          )}${"\t".repeat(tabs)}}`;
        default:
          return "";
      }
    })();
    return value;
  }

  recursiveFields(): ShapeName[] {
    if (!this._shape) {
      return [];
    }
    return JSONStructure.recursiveFields(this._shape, "");
  }

  private static recursiveFields(shape: Shape, baseName: string): ShapeName[] {
    if (shape instanceof CRecordShape) {
      return [
        ...((shape as any)._fields as Map<string, Shape>).entries(),
      ].flatMap(([name, shape]) =>
        this.recursiveFields(shape, `${baseName}.${name}`)
      );
    }
    if (shape instanceof CCollectionShape) {
      return this.recursiveFields(shape.baseShape, `${baseName}[]`);
    }
    return [
      {
        shape,
        type: BaseShapeName[shape.type],
        name: baseName,
      },
    ];
  }
}
