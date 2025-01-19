import thunk from "redux-thunk"; // Middleware for handling async logic
import { Middleware } from "@reduxjs/toolkit";

// Example of a custom middleware
const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Dispatching:", action);
    console.log("State before action:", storeAPI.getState());
  }

  const result = next(action);

  if (process.env.NODE_ENV !== "production") {
    console.log("State after action:", storeAPI.getState());
  }

  return result;
};

// Combine your middlewares
const middleware = [thunk, loggerMiddleware]; // Add more middlewares as needed

export default middleware;
