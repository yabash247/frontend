import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Default: localStorage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./rootReducer"; // Import the rootReducer
import logger from "redux-logger"; // Example of additional middleware

// Redux Persist Configuration
const persistConfig = {
  key: "root", // Key in storage (can be a namespace)
  storage, // Define storage (localStorage or AsyncStorage for React Native)
  whitelist: ["auth"], // Specify which slices should be persisted
  blacklist: ["temporary"], // Blacklist non-critical slices to improve loading
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(logger), // Add additional middleware like redux-logger here
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

// Export the persisted store and the persistor
export const persistor = persistStore(store);

// Export the store
export default store;

// Define RootState and AppDispatch types for strong TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
