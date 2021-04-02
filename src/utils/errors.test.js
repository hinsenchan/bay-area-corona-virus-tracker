import { ApiError } from "./errors";

describe("errors", () => {
  test("ApiError", () => {
    const message = "foo bar";
    const error = new ApiError(message);
    expect(error.name).toEqual("ApiError");
    expect(error.message).toEqual(message);
  });
});
