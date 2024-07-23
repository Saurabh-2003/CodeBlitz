import { profileSchema } from "@/core/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: profileSchema = {
  user: null,
  loading: false,
  isAuthenticated: null,
  success: null,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getUserRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    getUserSuccess: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload?.user;
    },
    getUserFailure: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = payload.message;
    },
    clearUserErros: (state) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = null;
      state.success = null;
      state.error = null;
    },
  },
});

export const {
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  clearUserErros,
} = profileSlice?.actions;
export default profileSlice.reducer;
