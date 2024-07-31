import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  token: null
};

const initialVendorState = {
  airport: [],
  quotes: []
};

const initialBookingChargeAndCouponCodeState = {
  bookingCharge: null,
  couponCode: null
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

export const bookingChargeCouponCodeSlice = createSlice({
  name: "bookingChargeCouponCode",
  initialState: initialBookingChargeAndCouponCodeState,
  reducers: {
    setBookingCharge: (state, action) => {
      state.bookingCharge = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export const { setAirports, setQuotes } = vendorSlice.actions;
export const { setBookingCharge, setCouponCode } = bookingChargeCouponCodeSlice.actions;

export const authReducer = authSlice.reducer;
export const vendorReducer = vendorSlice.reducer;
export const bookingChargeCouponCodeReducer = bookingChargeCouponCodeSlice.reducer;
