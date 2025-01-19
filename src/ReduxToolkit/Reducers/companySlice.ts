import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store"; // Adjust the path as necessary
import Swal from "sweetalert2";
import { backendURL } from "../../Utils/Constants";

interface CompanyState {
  companies: { company: any; media: any[] }[];
  branches: any[];
  staffMembers: any[];
  isLoading: boolean;
  error: string | null;
  addCompanyStatus: string | null;
  branchStaffMembers: any[]; // Added for branch staff members
  loading: boolean; // Loading for branch staff members
}

const initialState: CompanyState = {
  companies: [],
  branches: [],
  staffMembers: [],
  isLoading: false,
  error: null,
  addCompanyStatus: null,
  branchStaffMembers: [], // Initial state for branch staff members
  loading: false, // Initial loading state
};

// Thunks
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/company`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Check for non-JSON or unexpected responses
      if (!response.ok) {
        const rawResponse = await response.text();
        throw new Error(
          `Error ${response.status}: ${response.statusText}\n${rawResponse}`
        );
      }

      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Server returned non-JSON response.");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Fetch Companies Error:", error);
      Swal.fire("Error", error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBranches = createAsyncThunk(
  "company/fetchBranches",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/branches`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch branches.");
      return data;
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

export const getMy_BranchStaffMembers = createAsyncThunk(
  "company/getMyBranchStaffMembers",
  async (app_Name: string,  { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      const response = await fetch(`${backendURL}/api/${app_Name}/staff-members/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch branch staff members.");
      Swal.fire("Success", "Branch staff members fetched successfully!", "success");
      return data;
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    resetAddCompanyStatus(state) {
      state.addCompanyStatus = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Companies
    builder.addCase(fetchCompanies.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<{ companies: { company: any; media: any[] }[] }>) => {
      state.isLoading = false;
      state.companies = Array.isArray(action.payload.companies) ? action.payload.companies : [];
    });
    builder.addCase(fetchCompanies.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.companies = []; // Ensure it's reset to an empty array on failure
    });

    // Fetch Branches
    builder.addCase(fetchBranches.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchBranches.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.isLoading = false;
      state.branches = action.payload;
    });
    builder.addCase(fetchBranches.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Branch Staff Members
    builder.addCase(getMy_BranchStaffMembers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMy_BranchStaffMembers.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.branchStaffMembers = action.payload;
    });
    builder.addCase(getMy_BranchStaffMembers.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetError, resetAddCompanyStatus } = companySlice.actions;
export default companySlice.reducer;
