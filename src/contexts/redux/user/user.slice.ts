import { getUserPlan } from "@/services/user-plan";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

interface UserState {
  isAuthenticated: boolean;
  user: UserJWT | null;
  plan: UserPlan | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  plan: null,
};

export const userPlanSchema = z.object({
  name: z.string(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const getUserPlanInfo = createAsyncThunk(
  "user/getPlan",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { user: UserState };
    if (!state.user.isAuthenticated) {
      return rejectWithValue("User is not authenticated");
    }
    try {
      const response = await getUserPlan();
      const data = userPlanSchema.parse(response.data);
      const dueDate = new Date(data.dueDate);
      const res: UserPlan = {
        startDate: new Date(data.startDate),
        dueDate,
        name: data.name,
        active: dueDate > new Date(Date.now()),
      };
      return res;
    } catch (error) {
      console.error(error)
      return rejectWithValue("Failed to fetch user plan");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserJWT>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getUserPlanInfo.fulfilled,
      (state, action: PayloadAction<UserPlan>) => {
        state.plan = action.payload;
      }
    );
    builder.addCase(getUserPlanInfo.rejected, (state, action) => {
      console.error(action.payload);
    });
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
