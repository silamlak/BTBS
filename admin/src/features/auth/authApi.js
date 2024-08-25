import axios from 'axios'
import { endpoints } from '../../api/endpoints'
import { handleError } from '../../api/handleError'
import axiosInstance from '../../api/endpoints'


export const signinApi = async(form) => {
    try {
        const res = await axios.post(endpoints.signin, form, {
          withCredentials: true, // Make sure cookies are sent with the request
        });
        return res.data
    } catch (error) {
        return handleError(error)
    }
}

export const signupApi = async (data) => {
    try {
        const res = await axios.post(endpoints.signup, data)
        return res.data
    } catch (error) {
        return handleError(error)
    }
}

export const confirmApi = async (data) => {
    try {
        const res = await axios.post(endpoints.confirm, data)
        return res.data
    } catch (error) {
        return handleError(error)
    }
}

export const requestResetApi = async (data) => {
    try {
        const res = await axios.post(endpoints.request_reset, data)
        return res.data
    } catch (error) {
        return handleError(error)
    }
}

export const resetPasswordApi = async (data) => {
    try {
        const res = await axios.post(endpoints.reset_password, data);
        return res.data
    } catch (error) {
        return handleError(error)
    }
}