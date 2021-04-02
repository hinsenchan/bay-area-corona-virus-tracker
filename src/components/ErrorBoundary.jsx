import React from "react";
import { defaultTo, get } from "lodash";
import { Box, Grid, Typography } from "@material-ui/core";
import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorHandler,
} from "react-error-boundary";
import styled from "styled-components/macro";

const ERROR_NAME_ATTRIBUTE = "name";
const ERROR_MESSAGE_ATTRIBUTE = "message";
const DEFAULT_ERROR_NAME = "Error";
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";

const StyledBox = styled(Box)`
  word-break: break-word;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

/**
 * Get error value or fallback to null value.
 * @param {Error} error
 * @param {string} attribute
 * @returns {string} value
 */
function defaultToNull(error, attribute) {
  return get(error, attribute) || null;
}

/**
 * Get error value or fallback to default value.
 * @param {Error} error
 * @param {string} attribute
 * @param {string} defaultValue
 * @returns {string} value
 */
function getErrorValue(error, attribute, defaultValue) {
  const value = defaultToNull(error, attribute);
  return defaultTo(value, defaultValue);
}

/**
 * Gets name and message from Error object.
 * @param {Error} error
 * @returns {Object} errorName, errorMessage
 */
function nameAndMessageFrom(error) {
  const errorName = getErrorValue(
    error,
    ERROR_NAME_ATTRIBUTE,
    DEFAULT_ERROR_NAME
  );

  const errorMessage = getErrorValue(
    error,
    ERROR_MESSAGE_ATTRIBUTE,
    DEFAULT_ERROR_MESSAGE
  );
  return { errorName, errorMessage };
}

/**
 *
 * Presenter for error fallback component.
 */
function ErrorFallback(props) {
  const { error, className } = props;
  const { errorName, errorMessage } = nameAndMessageFrom(error);
  return (
    <Grid item xs={12} className={className}>
      <StyledBox>
        <Typography>{errorName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {errorMessage}
        </Typography>
      </StyledBox>
    </Grid>
  );
}

/**
 * Throws error caught by parent at the child level.
 */
function ThrowableError(props) {
  const { error } = props;
  useErrorHandler(error);
  return "";
}

/**
 * Presenter for error boundary component.
 */
function ErrorBoundary(props) {
  const { throwableError, className, children } = props;
  return (
    <ReactErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorFallback error={error} className={className} />
      )}
    >
      <ThrowableError error={throwableError} />
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
