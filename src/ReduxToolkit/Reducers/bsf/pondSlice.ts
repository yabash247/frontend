import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { RootState } from "../../Store";
import { backendURL } from "../../../Utils/Constants";

// Initial State
interface PondState {
  pondsAvailable: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PondState = {
  pondsAvailable: [],
  status: "idle",
  error: null,
};

// Thunk: Fetch Pond Use Details
export const fetchPondUseDetails = createAsyncThunk(
  "ponds/fetchPondUseDetails",
  async (
    { company, branch, batch, id, status }: { company: string; branch: string; batch: string; id: string; status: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      //console.log("Fetching Pond Use Details:", { company, branch, batch, id, status });
      
      const response = await axios.get(`${backendURL}/api/bsf/ponduse-stats/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { company, branch, batch, id, status },
      });
      console.log("Pond Use Details:", response.data);
      
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Pond Use Details",
        text: error.response?.data || "An error occurred while fetching pond use details.",
      });
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

// Thunk: Fetch Available Ponds
export const getAvailablePonds = createAsyncThunk(
  "ponds/getAvailablePonds",
  async (
    { company, branch }: { company: string; branch: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      const response = await axios.get(`${backendURL}/api/bsf/ponds/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { company, branch, available: true },
      });
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Ponds",
        text: error.response?.data || "An error occurred while fetching ponds.",
      });
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

// Thunk: Create Stage Start
export const createStageStart = createAsyncThunk(
  "ponds/createStageStart",
  async (
    formData: any,
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      const flattenedFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        flattenedFormData.append(key, formData[key]);
      });

      formData.stageStarts.forEach((stageStart: any, index: number) => {
        flattenedFormData.append(`pond_${index}`, stageStart.pond);
        flattenedFormData.append(`startDate_${index}`, stageStart.startDate);
        flattenedFormData.append(`startWeight_${index}`, stageStart.startWeight);
        stageStart.media.forEach((media: any, mediaIndex: number) => {
          flattenedFormData.append(
            `media_title_${index}_${mediaIndex}`,
            media.title
          );
          flattenedFormData.append(
            `media_file_${index}_${mediaIndex}`,
            media.file
          );
          if (media.comments) {
            flattenedFormData.append(
              `media_comments_${index}_${mediaIndex}`,
              media.comments
            );
          }
        });
      });
      console.log( "Flattened Form Data:", flattenedFormData);
      
      await axios.post(`${backendURL}/api/bsf/pondsTask`, flattenedFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Stage Start Created",
        text: "Stage start has been successfully submitted.",
      });

      return true;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data ||
          "An error occurred while creating the stage start.",
      });
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

// Thunk: Create Stage End
export const createStageEnd = createAsyncThunk(
  "ponds/createStageEnd",
  async (formData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      const flattenedFormData = new FormData();
      flattenedFormData.append("taskId", formData.taskId);
      flattenedFormData.append("taskTitle", formData.taskTitle);
      flattenedFormData.append("appName", formData.appName);
      flattenedFormData.append("modelName", formData.modelName);
      flattenedFormData.append("modelID", formData.modelID);
      flattenedFormData.append("activity", formData.activity);
      flattenedFormData.append("batch", formData.batch);
      flattenedFormData.append("branch", formData.branch);
      flattenedFormData.append("company", formData.company);
      flattenedFormData.append("stage", formData.stage);

      formData.stageEnds.forEach((stageEnd: any, index: number) => {
        flattenedFormData.append(`pond_${index}`, stageEnd.pond);
        flattenedFormData.append(`id_${index}`, stageEnd.id);
        flattenedFormData.append(`endDate_${index}`, stageEnd.endDate);
        flattenedFormData.append(`harvestWeight_${index}`, stageEnd.harvestWeight);

        stageEnd.media.forEach((media: any, mediaIndex: number) => {
          flattenedFormData.append(`media_title_${index}_${mediaIndex}`, media.title);
          flattenedFormData.append(`media_file_${index}_${mediaIndex}`, media.file);
          if (media.comments) {
            flattenedFormData.append(`media_comments_${index}_${mediaIndex}`, media.comments);
          }
        });
      });

      console.log("Flattened Form Data:", Object.fromEntries(flattenedFormData.entries()));
      
      await axios.post(`${backendURL}/api/bsf/pondsTask`, flattenedFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Stage End Created",
        text: "Stage end has been successfully submitted.",
      });

      return true;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "An error occurred while creating stage ends.",
      });
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);

// Slice
const pondSlice = createSlice({
  name: "ponds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAvailablePonds.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAvailablePonds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pondsAvailable = action.payload;
      })
      .addCase(getAvailablePonds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createStageStart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStageStart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createStageStart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      }).addCase(fetchPondUseDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPondUseDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pondsAvailable = action.payload;
      })
      .addCase(fetchPondUseDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createStageEnd.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStageEnd.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createStageEnd.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectPondsAvailable = (state: RootState) => state.ponds.pondsAvailable;
export const selectPondStatus = (state: RootState) => state.ponds.status;
export const selectPondError = (state: RootState) => state.ponds.error;

// Export Reducer
export default pondSlice.reducer;


