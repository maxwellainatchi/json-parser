import * as mtt from "maketypes/lib/types";
import JSONValue from "../utility/jsonValue";
import { BaseShape as _BaseShape, d2s } from "maketypes/lib/types";
import { Emitter, NopWriter } from "maketypes/lib/index";
import { string } from "prop-types";

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

export abstract class Shape<T extends mtt.Shape = mtt.Shape> {
  public static _construct<T extends Shape>(shape: mtt.Shape): T {
    let type = mttToType[shape.type];
    let S = {
      [Type.bottom]: undefined,
      [Type.null]: NullShape,
      [Type.record]: RecordShape,
      [Type.string]: StringShape,
      [Type.boolean]: BooleanShape,
      [Type.number]: NumberShape,
      [Type.collection]: CollectionShape,
      [Type.any]: AnyShape,
    }[type];
    if (!S) {
      throw new Error("Invalid base type " + type);
    }
    return new S(shape as any) as any;
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

  public static parse<T extends mtt.Shape>(json: JSONValue): Shape<T> {
    let _shape = d2s(emptyEmitter, json);
    return this._construct(_shape);
  }

  public _shape: T;
  public get type(): Type {
    return mttToType[this._shape.type];
  }

  public constructor(shape: T) {
    this._shape = shape;
  }
}

export class RecordShape extends Shape<mtt.CRecordShape> {
  public fields = new Map<string, Shape>();

  constructor(_shape: mtt.CRecordShape) {
    super(_shape);

    this._shape.forEachField((field, name) => {
      let shape = RecordShape._construct(field);
      this.fields.set(name, shape);
    });
  }
}
export class CollectionShape extends Shape<mtt.CCollectionShape> {
  public derivedShape: Shape;

  constructor(_shape: mtt.CCollectionShape) {
    super(_shape);
    this.derivedShape = Shape._construct(_shape.baseShape);
  }
}

export class BooleanShape extends Shape<mtt.CBooleanShape> {}
export class StringShape extends Shape<mtt.CStringShape> {}
export class NumberShape extends Shape<mtt.CNumberShape> {}
export class NullShape extends Shape<mtt.CNullShape> {}
export class AnyShape extends Shape<mtt.CAnyShape> {}
