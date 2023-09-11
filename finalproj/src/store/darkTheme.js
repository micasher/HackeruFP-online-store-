import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: true,
};

const darkThemeSlice = createSlice({
  name: "darkTheme",
  initialState,
  reducers: {
    changeTheme(state) {
      state.isDarkTheme = !state.isDarkTheme;
    },
    setToDarkTheme(state) {
      state.isDarkTheme = true;
    },
    setToLightTheme(state) {
      state.isDarkTheme = false;
    },
  },
});

export const darkThemeActions = darkThemeSlice.actions;

export default darkThemeSlice.reducer;
