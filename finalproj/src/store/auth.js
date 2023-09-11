import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  payload: null,
  infoOfUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, actionForToken) {
      if (
        !actionForToken ||
        !actionForToken.payload ||
        !actionForToken.payload.payload
      ) {
        return;
      }
      state.isLoggedIn = true;
      state.payload = actionForToken.payload.payload;
      state.infoOfUser = actionForToken.payload.data;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.payload = null;
      state.infoOfUser = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
