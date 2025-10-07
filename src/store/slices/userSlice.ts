import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types/user";

interface UserState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean; // Track if we've already checked authentication
  redirectUrl: string | null; // Store the URL user was trying to access before login
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  redirectUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.hasCheckedAuth = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthChecked: (state) => {
      state.hasCheckedAuth = true;
    },
    setRedirectUrl: (state, action: PayloadAction<string | null>) => {
      state.redirectUrl = action.payload;
    },
    clearRedirectUrl: (state) => {
      state.redirectUrl = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.hasCheckedAuth = true;
      state.redirectUrl = null;
      // Cookie will be cleared by the server on logout
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    },
  },
});

export const { setUser, setLoading, setAuthChecked, setRedirectUrl, clearRedirectUrl, logout } = userSlice.actions;
export default userSlice.reducer;
