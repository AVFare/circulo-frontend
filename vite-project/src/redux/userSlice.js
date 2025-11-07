import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/api/user";

const getAuthConfig = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const fetchProfile = createAsyncThunk(
  "users/fetchProfile",
  async () => {
    const { data } = await axios.get(`${URL}/profile`, getAuthConfig());
    return data;
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 0, size = 10, sortBy = 'id', sortDirection = 'asc' }) => {
    const { data } = await axios.get(
      `${URL}/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      getAuthConfig()
    );
    return data;
  }
);

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (profileData) => {
    const { data } = await axios.put(
      `${URL}/profile`,
      profileData,
      getAuthConfig()
    );
    return data;
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (passwordData) => {
    const { data } = await axios.put(
      `${URL}/password`,
      passwordData,
      getAuthConfig()
    );
    return data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    profile: null,
    items: [],
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
