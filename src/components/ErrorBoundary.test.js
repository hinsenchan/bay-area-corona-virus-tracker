import React from "react";
import { render } from "@testing-library/react";
import { noop } from "lodash";
import ErrorBoundary from "./ErrorBoundary";

const DEFAULT_ERROR_NAME = "Error";
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";
const CUSTOM_ERROR_NAME = "TypeError";
const CUSTOM_ERROR_MESSAGE = "bar";

let logSpy;
let errorSpy;

describe("ErrorBoundary", () => {
  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(noop);
    errorSpy = jest.spyOn(console, "error").mockImplementation(noop);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("no error", () => {
    const VALID_CONTENT = "foo";
    const ComponentWillNotError = () => {
      return <div>{VALID_CONTENT}</div>;
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ComponentWillNotError />
      </ErrorBoundary>
    );
    expect(getByText(VALID_CONTENT)).toBeInTheDocument();
  });

  test("default name and message", () => {
    const ComponentWillError = () => {
      throw new Error();
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ComponentWillError />
      </ErrorBoundary>
    );
    expect(getByText(DEFAULT_ERROR_NAME)).toBeInTheDocument();
    expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
  });

  test("custom name and message", () => {
    const ComponentWillError = () => {
      throw new TypeError(CUSTOM_ERROR_MESSAGE);
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ComponentWillError />
      </ErrorBoundary>
    );
    expect(getByText(CUSTOM_ERROR_NAME)).toBeInTheDocument();
    expect(getByText(CUSTOM_ERROR_MESSAGE)).toBeInTheDocument();
  });
});
