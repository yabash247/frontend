import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode, JwtPayload } from "jwt-decode";
import Swal from "sweetalert2";
import { NavigateFunction } from "react-router-dom";
import { backendURL } from "../../Utils/Constants";

// Define the structure of the decoded JWT payload
interface CustomJwtPayload extends JwtPayload {
  user_id?: string; // Optional field for user ID in the token
}

// Types for the state
interface AuthState {
  user: CustomJwtPayload | null; // Store the decoded JWT payload
  access: string | null;
  refresh: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem("access")
    ? jwtDecode<CustomJwtPayload>(localStorage.getItem("access") as string)
    : null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
  loading: false,
  error: null,
  success: false,
};

// SweetAlert2 Helpers
const showSuccessAlert = (title: string) => {
  Swal.fire({
    title,
    icon: "success",
    toast: true,
    timer: 3000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

const showErrorAlert = (title: string) => {
  Swal.fire({
    title,
    icon: "error",
    toast: true,
    timer: 3000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password, goTo }: { email: string; password: string; goTo: (path: string) => void },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${backendURL}/api/users/login/`, {
        email,
        password,
      });

      const data = response.data;

      // Decode token and save to local storage
      const decodedUser = jwtDecode<CustomJwtPayload>(data.access);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Success alert and redirection
      showSuccessAlert("Login Successful");
      goTo("/");

      return { user: decodedUser, access: data.access, refresh: data.refresh };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      showErrorAlert(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      email,
      username,
      password,
      password2,
      navigate,
    }: { email: string; username: string; password: string; password2: string; navigate: NavigateFunction },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${backendURL}/api/users/register/`, {
        email,
        username,
        password,
        password2,
      });

      showSuccessAlert("Registration Successful! Please Login.");
      navigate("/login");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      showErrorAlert(`Registration Error: ${errorMessage}`);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      showSuccessAlert("You have been logged out...");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register Reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
