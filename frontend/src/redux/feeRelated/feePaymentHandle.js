import axios from "axios";
import { BASE_URL } from "../../config";
import { getRequest, getPaymentsSuccess, getCurrentStatusSuccess, getFailed, getError, postDone } from "./feePaymentSlice";

// Get current period payment status for a class
export const getCurrentPeriodStatus = (classId, period) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/ClassPayments/${classId}/${period}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getCurrentStatusSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Mark fee as paid
export const markFeePaid = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${BASE_URL}/FeePayment`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(postDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Get student payment history
export const getStudentPayments = (studentId) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/StudentPayments/${studentId}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getPaymentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
