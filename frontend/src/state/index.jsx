import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  token: null
};

const initialVendorState = {
  airport: [],
  quotes: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
});

export const vendorSlice = createSlice({
  name: "vendor",
  initialState: initialVendorState,
  reducers: {
    setAirports: (state, action) => {
      state.airport = action.payload;
    },
    setQuotes: (state, action) => {
      state.quotes = action.payload;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export const { setAirports, setQuotes } = vendorSlice.actions;

export const authReducer = authSlice.reducer;
export const vendorReducer = vendorSlice.reducer;
