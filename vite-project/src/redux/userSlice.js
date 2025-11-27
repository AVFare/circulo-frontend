import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// urls del backend
const BASE_URL = "http://localhost:4002/api";
const AUTH_URL = `${BASE_URL}/v1/auth`;
const USER_URL = `${BASE_URL}/user`;

// interceptor para manejar errores del backend
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

// arma los headers con el token para las peticiones autenticadas
const getAuthConfig = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

// thunk para iniciar sesión
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials) => {
    const { data } = await axios.post(`${AUTH_URL}/login`, credentials);
    return data;
  }
);

// thunk para registrar un nuevo usuario
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData) => {
    const { data } = await axios.post(`${AUTH_URL}/register`, userData);
    return data;
  }
);

// thunk para traer el perfil del usuario logueado
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState }) => {
    const { user } = getState();
    const { data } = await axios.get(`${USER_URL}/profile`, getAuthConfig(user.token));
    return data;
  }
);

// thunk para traer la lista de usuarios (admin)
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ page = 0, size = 10, sortBy = 'username', sortDirection = 'asc' } = {}, { getState }) => {
    const { user } = getState();
    const { data } = await axios.get(
      `${USER_URL}/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      getAuthConfig(user.token)
    );
    return data;
  }
);

// thunk para traer un usuario específico por id
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { getState }) => {
    const { user } = getState();
    const { data } = await axios.get(`${USER_URL}/users/${userId}`, getAuthConfig(user.token));
    return data;
  }
);

// thunk para actualizar datos de un usuario
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { getState }) => {
    const { user } = getState();
    const { data } = await axios.put(
      `${USER_URL}/users/update/${id}`,
      userData,
      getAuthConfig(user.token)
    );
    return data;
  }
);

// thunk para cambiar la contraseña de un usuario
// usa el mismo endpoint de update pero solo manda el campo password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, { getState }) => {
    const { user } = getState();
    const userId = passwordData.userId || passwordData.id;
    const { data } = await axios.put(
      `${USER_URL}/users/update/${userId}`,
      { password: passwordData.password },
      getAuthConfig(user.token)
    );
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,                  // jwt del usuario logueado
    isAuthenticated: false,       // flag de si está logueado
    profile: null,                // info del usuario actual
    users: [],                    // lista de todos los usuarios (admin)
    totalPages: 0,                // paginación
    totalElements: 0,             // total de usuarios
    currentUser: null,            // usuario seleccionado (para ver detalles)
    loading: false,               // si está cargando algo
    error: null,                  // mensaje de error si algo falla
  },
  reducers: {
    // cerrar sesión y limpiar todo
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.profile = null;
      state.error = null;
    },
    // limpiar el error para poder volver a intentar
    clearError: (state) => {
      state.error = null;
    },
    // limpiar el usuario seleccionado
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // registro
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // traer perfil completo del usuario
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
      
      // traer lista de usuarios (admin)
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content || action.payload;
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // traer usuario por id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // actualizar usuario
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // busca el usuario en la lista y lo actualiza
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // cambiar contraseña
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
