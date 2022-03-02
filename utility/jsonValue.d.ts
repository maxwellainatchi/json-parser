export type JSONObject = { [key: string]: JSONValue };
export type JSONPrimitive = string | number | boolean | null;

type JSONValue = JSONPrimitive | JSONValue[] | JSONObject;

export default JSONValue;
