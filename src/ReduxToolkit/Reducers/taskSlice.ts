
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";
import { RootState } from "../Store";
import { backendURL } from "../../Utils/Constants";

interface TaskState {
  tasks: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedTask: any | null;
}

const initialState: TaskState = {
  tasks: [],
  status: "idle",
  error: null,
  selectedTask: null,
};

// Thunk to fetch tasks
export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (
    params: {
      all?: boolean;
      company?: string;
      branch?: string;
      status?: string;
      manager?: boolean;
      owner?: boolean;
      assistant?: boolean;
    },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.access;
    //console.log("Params:", params); // Log params
    
    try {
      const response = await axios.get(`${backendURL}/api/company/tasks/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      });
      Swal.fire({
        icon: "success",
        title: "Your Tasks",
        text: "successfully retrieved.",
        position: "top-right",
        timerProgressBar: true,
        timer: 1500,
        toast: true,
      });
      //console.log(response.data)
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Tasks",
        text: error.response?.data || "An error occurred while fetching tasks.",
        position: "top-left",
        timerProgressBar: true,
        timer: 1500,
        toast: true,
      });
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching tasks."
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {selectTask(state, action) {
    state.selectedTask = action.payload;
  },
  clearSelectedTask(state) {
    state.selectedTask = null;
  },},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { selectTask, clearSelectedTask } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskStatus = (state: RootState) => state.tasks.status;
export const selectTaskError = (state: RootState) => state.tasks.error;
export const selectSelectedTask = (state: RootState) => state.tasks.selectedTask;

export default taskSlice.reducer;
