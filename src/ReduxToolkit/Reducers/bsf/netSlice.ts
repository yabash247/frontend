import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { RootState } from "../../Store";
import { backendURL } from "../../../Utils/Constants";


interface NetState {
  nets: any[];
  netsAvailable: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NetState = {
  nets: [],
  netsAvailable: [],
  status: "idle",
  error: null,
};

// Thunk to create lay starts
export const createLayStart = createAsyncThunk(
  "nets/createLayStart",
  async (formData: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    //console.log("Form Data:", formData); // Log form data

    try {
      const flattenedFormData = new FormData();
      flattenedFormData.append("taskId", formData.taskId);
      flattenedFormData.append("taskTitle", formData.taskTitle);
      if (formData.createdDate) { flattenedFormData.append("createdDate", formData.createdDate); }
      if (formData.harvestWeight) { flattenedFormData.append("harvestWeight", formData.harvestWeight); console.log(formData.harvestWeight); }
      if (formData.lay_end) { flattenedFormData.append("lay_end ", formData.lay_end); console.log(formData.lay_end);} 
      if (formData.modelID) { flattenedFormData.append("modelID ", formData.modelID); }
      flattenedFormData.append("appName", formData.appName);
      flattenedFormData.append("modelName", formData.modelName);
      flattenedFormData.append("activity", formData.activity);
      flattenedFormData.append("batch", formData.batch);
      flattenedFormData.append("branch", formData.branch);
      flattenedFormData.append("company", formData.company);

      if (formData.activity === "Laying_Start") {
        formData.layStarts.forEach((layStart: any, layIndex: number) => {
          flattenedFormData.append(`net_${layIndex}`, layStart.net);
          flattenedFormData.append(`startDate_${layIndex}`, layStart.startDate);

          layStart.media.forEach((media: any, mediaIndex: number) => {
            flattenedFormData.append(`media_title_${layIndex}_${mediaIndex}`, media.title);
            //console.log(`Uploading file:`, media.file); // Debug the file
            flattenedFormData.append(`media_file_${layIndex}_${mediaIndex}`, media.file);
            if (media.comments) {
              flattenedFormData.append(`media_comments_${layIndex}_${mediaIndex}`, media.comments);
            }
          });
        });
      }

      if (formData.activity === "Laying_End") {
        formData.layEnds.forEach((layEnd: any, layIndex: number) => {
          flattenedFormData.append(`net_${layIndex}`, layEnd.net);
          flattenedFormData.append(`endDate_${layIndex}`, layEnd.endDate);
          flattenedFormData.append(`harvestWeight_${layIndex}`, layEnd.harvestWeight);

          layEnd.media.forEach((media: any, mediaIndex: number) => {
            flattenedFormData.append(`media_title_${layIndex}_${mediaIndex}`, media.title);
            console.log(`Uploading file:`, media.file); // Debug the file
            flattenedFormData.append(`media_file_${layIndex}_${mediaIndex}`, media.file);
            if (media.comments) {
              flattenedFormData.append(`media_comments_${layIndex}_${mediaIndex}`, media.comments);
            }
          });
        });
      }

      flattenedFormData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      //console.log("Flattened Form Data:", Array.from(flattenedFormData.entries())); // Log flattened form data keys and values

      await axios.post(`${backendURL}/api/bsf/net-use-stats/`, flattenedFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Lay Starts Created",
        text: "Lay starts have been successfully submitted.",
      });

      return true;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "An error occurred while creating lay starts.",
      });
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);
// Thunk to fetch nets
export const getNet = createAsyncThunk(
  "nets/getNet",
  async (
    params: {
      company: string;
      farm: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;

    try {
      const response = await axios.get(`${backendURL}/api/bsf/nets/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
      Swal.fire({
        icon: "success",
        title: "Nets Fetched",
        text: "The nets were successfully retrieved.",
        position: "top-right",
        timerProgressBar: true,
        timer: 1500,
        toast: true,
      });
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Nets",
        text: error.response?.data || "An error occurred while fetching nets.",
      });
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching nets."
      );
    }
  }
);

// Thunk to fetch available nets
export const getNetAvailable = createAsyncThunk(
  "nets/getNetAvailable",
  async (
    params: {
      company: string;
      branch: string;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;
    console.log(params);
    try {
      const response = await axios.get(`${backendURL}/api/bsf/nets_statsCheck/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
      Swal.fire({
        icon: "success",
        title: "Net Availability Fetched",
        text: "The net availability was successfully retrieved.",
        position: "top-right",
        timerProgressBar: true,
        timer: 1500,
        toast: true,
      });
      console.log("API Response for getNetAvailable:", response.data); // Log API response
      return response.data;
    } catch (error: any) {
      console.error("Error fetching nets:", error.response || error.message);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Net Availability",
        text: error.response?.data || "An error occurred while fetching net availability.",
      });
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching net availability."
      );
    }
  }
);


export const fetchNetUseDetails = createAsyncThunk(
  "nets/fetchNetDetails",
  async ({ company, branch, batch, stats, modelID }: { company: string; branch: string; batch: string; stats: string; modelID: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;
    console.log(batch);

    try {
      const response = await axios.get(`${backendURL}/api/bsf/net-use-stats/retrieve-all/`, {
        params: { company, branch, batch, stats, modelID },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("API Response for fetchNetUseDetails:", response.data); // Log API response

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const netSlice = createSlice({
  name: "nets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getNet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.nets = action.payload;
      })
      .addCase(getNet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getNetAvailable.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getNetAvailable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.netsAvailable = action.payload || [];
      })
      .addCase(getNetAvailable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createLayStart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createLayStart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createLayStart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      }).addCase(fetchNetUseDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNetUseDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.nets = action.payload;
      })
      .addCase(fetchNetUseDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectNets = (state: RootState) => state.nets.nets;
export const selectNetsAvailable = (state: RootState) => state.nets.netsAvailable;
export const selectNetStatus = (state: RootState) => state.nets.status;
export const selectNetError = (state: RootState) => state.nets.error;

export default netSlice.reducer;
