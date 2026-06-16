import axios from "axios";
import { BASE_URL } from "../../config";
import { getRequest, getSuccess, getFailed, getError, postDone } from "./feeSlice";

// Get all fees for a school
export const getAllFees = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${BASE_URL}/FeeList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

// Set or update fee for a class
export const setClassFee = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${BASE_URL}/FeeCreate`, fields, {
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

// Delete fee
export const deleteFee = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${BASE_URL}/Fee/${id}`);
        if (result.data.message) {
            dispatch(postDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
