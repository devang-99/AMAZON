"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface SignupPayload {
  username: string,
  email: string;
  password: string;
  role:string
}

export interface handleOAuthPayload {
  username: string,
  email: string | null
  role : "CUSTOMER"
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleGithubPayload {
  email: string | null
}

export interface User {
  id: number;
  email: string | null;
  username: string | null;
  role:"SELLER" | "CUSTOMER";
}

interface AuthState {
  loading: boolean;
  error: string | null;
  user: User | null;

}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Signup failed");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const handleGoogleSignUpThunk = createAsyncThunk(
  "auth/googleSignUp",
  async (data: handleOAuthPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, data)
      return res.data;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Sign up with google failed");
    }
  }
)

export const handleGithubSignUpThunk = createAsyncThunk(
  "auth/githubSignUp",
  async (data: handleOAuthPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, data)
      return res.data;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Sign up with github failed");
    }
  }
)

export const GithubLogin = createAsyncThunk(
  "auth/githubLogin",
  async (data: GoogleGithubPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/githublogin`, data)
      return res.data;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Login with github failed");
    }
  }
)

export const GoogleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (data: GoogleGithubPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/googlelogin`, data)
      return res.data;
    }
    catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Login with google failed");
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
        };
        console.log(state.user)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(GithubLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(GithubLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
        };
        console.log(state.user)
      })
      .addCase(GithubLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(GoogleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(GoogleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
        };
        console.log(state.user)
      })
      .addCase(GoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }).addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading=false
        state.user = {
          ...action.payload,
        };
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })

      .addCase(handleGoogleSignUpThunk.fulfilled, (state, action) => {
        state.loading=false
        state.user = {
          ...action.payload,
        };
      })
      .addCase(handleGoogleSignUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(handleGithubSignUpThunk.fulfilled, (state, action) => {
        state.loading=false
        state.user = {
          ...action.payload,
        };
      })
      .addCase(handleGithubSignUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { logout, clearUser, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;