import { define, extend, sequence } from "../index";

type Model = { id: number; type?: string };
type User = { firstName: string; age: number; admin?: boolean } & Model;
type Post = { title: string; user: User } & Model;

describe("extend", () => {
  test("allows extending an existing factory", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: (i: number) => `Bob #${i}`,
      age: 42
    });

    expect(user()).toEqual({
      id: 1,
      firstName: "Bob #1",
      age: 42
    });

    expect(user()).toEqual({
      id: 2,
      firstName: "Bob #2",
      age: 42
    });
  });

  test("allows overriding both the factory and the config", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    expect(user({ id: -1, firstName: "Jill" })).toEqual({
      id: -1,
      firstName: "Jill",
      age: 42
    });
  });

  test("allows overriding with 'falsy' values", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42,
      admin: true
    });

    expect(user({ firstName: undefined, admin: false, age: 0 })).toEqual({
      id: 1,
      firstName: undefined,
      admin: false,
      age: 0
    });
  });

  test("allows overriding the factory with the config", () => {
    const model = define<Model>({
      id: sequence,
      type: "BaseModel"
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42,
      type: "User"
    });

    expect(user()).toEqual({
      id: 1,
      firstName: "Bob",
      age: 42,
      type: "User"
    });
  });

  test("allows extending the same factory multiple times", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    const post = extend<Model, Post>(model, {
      title: (i: number) => `My Post #${i}`,
      user
    });

    expect(post()).toEqual({
      id: 1,
      title: "My Post #1",
      user: {
        id: 2,
        firstName: "Bob",
        age: 42
      }
    });

    expect(user()).toEqual({
      id: 3,
      firstName: "Bob",
      age: 42
    });
  });

  test("allows defining optional attributes as overrides", () => {
    const model = define<Model>({
      id: sequence
    });

    const user = extend<Model, User>(model, {
      firstName: "Bob",
      age: 42
    });

    expect(user({ admin: true })).toEqual({
      id: 1,
      firstName: "Bob",
      age: 42,
      admin: true
    });
  });
});
