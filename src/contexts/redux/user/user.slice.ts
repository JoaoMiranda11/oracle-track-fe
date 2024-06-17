import { getUserPlan } from "@/services/user-plan";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

type UserPlanStatus = UserPlan & {
  lastFetch: Date | null;
};
interface UserState {
  isAuthenticated: boolean;
  user: UserJWT | null;
  plan: UserPlanStatus;
}

const defaultPlan: UserPlanStatus = {
  active: true,
  dueDate: null,
  startDate: null,
  name: "FREE",
  tier: 0,
  lastFetch: null,
};

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  plan: defaultPlan,
};

export const userPlanSchema = z.object({
  name: z.string(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  tier: z.number(),
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
      const res: UserPlanStatus = {
        startDate: new Date(data.startDate),
        dueDate,
        name: data.name,
        active: dueDate > new Date(Date.now()),
        tier: data.tier,
        lastFetch: new Date(Date.now())
      };
      return res;
    } catch (error) {
      console.error(error);
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
      (state, action: PayloadAction<UserPlanStatus>) => {
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
