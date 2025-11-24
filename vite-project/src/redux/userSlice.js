import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_URL = "http://localhost:4002/api/v1/auth";
const USER_URL = "http://localhost:4002/api/user";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

const getAuthConfig = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials) => {
    const { data } = await axios.post(`${AUTH_URL}/login`, credentials);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData) => {
    const { data } = await axios.post(`${AUTH_URL}/register`, userData);
    return data;
  }
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async () => {
    const { data } = await axios.get(`${USER_URL}/profile`, getAuthConfig());
    return data;
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ page = 0, size = 10, sortBy = 'username', sortDirection = 'asc' } = {}) => {
    const { data } = await axios.get(
      `${USER_URL}/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      getAuthConfig()
    );
    return data;
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId) => {
    const { data } = await axios.get(`${USER_URL}/users/${userId}`, getAuthConfig());
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }) => {
    const { data } = await axios.put(
      `${USER_URL}/users/update/${id}`,
      userData,
      getAuthConfig()
    );
    return data;
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData) => {
    const userId = passwordData.userId || passwordData.id;
    const { data } = await axios.put(
      `${USER_URL}/users/update/${userId}`,
      { password: passwordData.password },
      getAuthConfig()
    );
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    isAuthenticated: false,
    profile: null,
    users: [],
    totalPages: 0,
    totalElements: 0,
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.profile = null;
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("access_token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.profile = {
          id: action.payload.id,
          role: action.payload.role,
        };
        // Persiste en localStorage
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("userInfo", JSON.stringify(state.profile));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // ========== REGISTER ==========
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.profile = {
          id: action.payload.id,
          role: action.payload.role,
        };
        // Persiste en localStorage
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("userInfo", JSON.stringify(state.profile));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // ========== FETCH PROFILE ==========
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Actualiza el perfil con todos los datos del usuario
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // ========== FETCH USERS ==========
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Guarda la respuesta paginada del backend
        state.users = action.payload.content || action.payload;
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // ========== FETCH USER BY ID ==========
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Guarda el usuario seleccionado
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // ========== UPDATE USER ==========
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Actualiza el usuario en el array de usuarios
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
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

export const { logout, clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
