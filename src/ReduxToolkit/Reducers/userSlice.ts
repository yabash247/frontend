import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../Store"; // Import RootState type if using TypeScript
import { backendURL } from "../../Utils/Constants"; // Import backendURL from Constants

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (userId: string, { getState }) => {
    console.log('response');
    const state = getState() as RootState; // Get RootState
    const token = state.auth.access; // Access token from auth slice
    console.log(token);
    
    if (!token) throw new Error("Access token is missing");
    const response = await fetch(`${backendURL}/api/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the access token
      },
    });
    if (!response.ok) throw new Error("Failed to fetch user details");
    console.log(response);
    
    return await response.json(); // Ensure JSON response
  }
);

// Update user details
export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (
    { userId, updatedFields }: { userId: string; updatedFields: Record<string, any> },
    { getState }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    if (!token) throw new Error("Access token is missing");

    const response = await fetch(`${backendURL}/api/users/${userId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });
    if (!response.ok) throw new Error("Failed to update user details");
    return await response.json();
  }
);

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  "user/uploadProfileImage",
  async (
    { userId, image }: { userId: string; image: File },
    { getState }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    if (!token) throw new Error("Access token is missing");

    const formData = new FormData();
    formData.append("profile_image", image);

    const response = await fetch(`${backendURL}/api/users/${userId}/upload-image/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload profile image");
    return await response.json();
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching user details";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.user = { ...state.user, profile_image: action.payload.profile_image };
      });
  },
});


export default userSlice.reducer;
