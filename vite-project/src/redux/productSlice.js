import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4002/api/item";
const CATALOG_URL = `${BASE_URL}/catalog/products`;
const PRODUCTS_URL = `${BASE_URL}/products`;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

const getAuthConfig = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    page = 0,
    size = 12,
    sortBy = 'id',
    sortDirection = 'asc',
    name,
    category,
    minPrice,
    maxPrice,
    hasDiscount,
    inStock,
  } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);

    if (name) params.append('name', name);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (hasDiscount) params.append('hasDiscount', 'true');
    if (inStock) params.append('inStock', 'true');

    const { data } = await axios.get(`${CATALOG_URL}/search?${params.toString()}`);
    return data;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    const { data } = await axios.get(`${CATALOG_URL}/${productId}`);
    return data;
  }
);

export const fetchAdminProducts = createAsyncThunk(
  "products/fetchAdminProducts",
  async (_, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.get(CATALOG_URL, getAuthConfig(token));
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.post(PRODUCTS_URL, productData, getAuthConfig(token));
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.put(
      `${PRODUCTS_URL}/${id}`,
      productData,
      getAuthConfig(token)
    );
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id, status = 2 }, { getState }) => {
    const token = getState().user.token;
    const { data } = await axios.put(
      `${PRODUCTS_URL}/${id}`,
      { status },
      getAuthConfig(token)
    );
    return data || { id, status };
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    adminItems: [],
    currentProduct: null,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    shouldRefresh: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    triggerRefresh(state) {
      state.shouldRefresh = true;
    },
    clearRefresh(state) {
      state.shouldRefresh = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH PRODUCTS ==========
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content || action.payload;
        state.totalPages = action.payload.totalPages ?? 0;
        const elements =
          action.payload.totalElements ??
          (Array.isArray(action.payload.content)
            ? action.payload.content.length
            : Array.isArray(action.payload)
            ? action.payload.length
            : 0);
        state.totalElements = elements;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== FETCH PRODUCT BY ID ==========
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== FETCH ADMIN PRODUCTS ==========
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== CREATE PRODUCT ==========
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.adminItems = [action.payload, ...state.adminItems];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== UPDATE PRODUCT ==========
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updateList = (list) => {
          const index = list.findIndex((product) => product.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        updateList(state.adminItems);
        updateList(state.items);
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ========== DELETE PRODUCT ==========
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload ?? {};
        const updatedId = payload.id ?? action.meta.arg?.id;
        const resolvedStatus = payload.status ?? action.meta.arg?.status;
        const changes = { ...payload };
        if (!changes.id && updatedId) {
          changes.id = updatedId;
        }
        if (resolvedStatus !== undefined) {
          changes.status = resolvedStatus;
        }
        const updateList = (list) => {
          const index = list.findIndex((product) => product.id === updatedId);
          if (index !== -1 && updatedId) {
            list[index] = { ...list[index], ...changes };
          }
        };
        updateList(state.adminItems);
        updateList(state.items);
        if (state.currentProduct?.id === updatedId && updatedId) {
          state.currentProduct = { ...state.currentProduct, ...changes };
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentProduct, triggerRefresh, clearRefresh } = productSlice.actions;
export default productSlice.reducer;
