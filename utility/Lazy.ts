export default class Lazy<T> {
  #value: T | undefined;

  constructor(private getter: () => T | Promise<T> | PromiseLike<T>) {}

  public async get(): Promise<T> {
    if (typeof this.#value !== "undefined") {
      return this.#value;
    }
    let value = await this.getter();
    this.#value = value;
    return value;
  }

  public get value(): T | undefined {
    return this.#value;
  }
}
