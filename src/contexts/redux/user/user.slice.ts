import { getUserPlan } from "@/services/user-plan";
import * as CreditsService from "@/services/credits";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export interface UserState {
  isAuthenticated: boolean;
  user: UserJWT | null;
  plan: UserPlan;
  credits: UserCredits;
}

const defaultPlan: UserPlan = {
  active: true,
  dueDate: null,
  startDate: null,
  name: "FREE",
  tier: 0,
  lastFetch: null,
};

const defaultCredits: UserCredits = {
  lastFetch: null,
  value: 0,
};

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  plan: defaultPlan,
  credits: defaultCredits,
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

export const creditsSchema = z.object({
  credits: z.number(),
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
      const now = new Date(Date.now());
      const res: UserPlan = {
        startDate: new Date(data.startDate).toString(),
        dueDate: dueDate.toString(),
        name: data.name,
        active: dueDate > now,
        tier: data.tier,
        lastFetch: now.toString(),
      };
      return res;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch user plan");
    }
  }
);

export const getUserCredits = createAsyncThunk(
  "user/getCredits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CreditsService.getCredits();
      const data = creditsSchema.parse({ credits: response.data });
      const now = new Date(Date.now());
      const result: UserCredits = {
        value: data.credits,
        lastFetch: now.toString(),
      };
      return result;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch user credits");
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
    setCredits: (state, action: PayloadAction<number>) => {
      state.credits = {
        lastFetch: new Date(Date.now()).toLocaleString("pt-br"),
        value: action.payload,
      };
    },
    setPlan: (state, action: PayloadAction<UserPlan>) => {
      state.plan = action.payload;
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
    builder.addCase(
      getUserCredits.fulfilled,
      (state, action: PayloadAction<UserCredits>) => {
        state.credits = action.payload;
      }
    );
    builder.addCase(getUserCredits.rejected, (state, action) => {
      state.credits.lastFetch = new Date(Date.now()).toString();
      console.error(action.payload);
    });
  },
});

export const { login, logout, setCredits, setPlan } = userSlice.actions;

export default userSlice.reducer;
