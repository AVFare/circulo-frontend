import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/api/v1/auth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${URL}/login`, credentials);
      
      // Extraer id del response
      let id = null;
      try {
        id = data?.id ?? data?.userId ?? data?.user?.id ?? null;
        if (id != null) {
          const n = Number(id);
          if (!Number.isNaN(n) && Number.isFinite(n)) id = n;
          else id = null;
        }
      } catch (err) {
        id = null;
      }

      // Guardar en localStorage
      const token = data.access_token || data.accessToken;
      if (token) localStorage.setItem("access_token", token);

      const userInfo = {
        email: credentials.email,
        role: data.role,
      };
      if (id != null) userInfo.id = id;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      return { ...data, email: credentials.email, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error al iniciar sesión");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${URL}/register`, userData);
      
      // Guardar en localStorage
      const token = data.access_token || data.accessToken;
      if (token) localStorage.setItem("access_token", token);

      const userInfo = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        username: userData.username,
        role: data.role,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      return { ...data, ...userInfo };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error al registrar usuario");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
    token: localStorage.getItem("access_token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("access_token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          email: action.payload.email,
          role: action.payload.role,
          id: action.payload.id,
        };
        state.token = action.payload.access_token || action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          email: action.payload.email,
          username: action.payload.username,
          role: action.payload.role,
        };
        state.token = action.payload.access_token || action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
