import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the slice state
interface DarkModeState {
  isDarkMode: boolean;
  autoSwitchEnabled: boolean;
}

const initialState: DarkModeState = {
  isDarkMode: localStorage.getItem("darkMode") === "true",
  autoSwitchEnabled: localStorage.getItem("autoSwitch") === "true",
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("darkMode", state.isDarkMode.toString());
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("darkMode", state.isDarkMode.toString());
    },
    enableAutoSwitch: (state, action: PayloadAction<boolean>) => {
      state.autoSwitchEnabled = action.payload;
      localStorage.setItem("autoSwitch", action.payload.toString());
    },
  },
});

export const { toggleDarkMode, setDarkMode, enableAutoSwitch } =
  darkModeSlice.actions;

export default darkModeSlice.reducer;
