import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    paymentsList: [],
    currentPeriodStatus: null,
    loading: false,
    error: null,
    response: null,
};

const feePaymentSlice = createSlice({
    name: 'feePayment',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getPaymentsSuccess: (state, action) => {
            state.paymentsList = action.payload;
            state.loading = false;
            state.error = null;
        },
        getCurrentStatusSuccess: (state, action) => {
            state.currentPeriodStatus = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        postDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },
    },
});

export const {
    getRequest,
    getPaymentsSuccess,
    getCurrentStatusSuccess,
    getFailed,
    getError,
    postDone
} = feePaymentSlice.actions;

export const feePaymentReducer = feePaymentSlice.reducer;
