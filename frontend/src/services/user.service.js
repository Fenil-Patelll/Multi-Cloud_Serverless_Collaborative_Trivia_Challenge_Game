import axios from "axios";
import api from "./auth.interceptor";

const USER_AUTH_BASE_URL = process.env.REACT_APP_USER_AUTHENTICATION_BASE_URL;
const USER_PROFILE_MANAGEMENT_BASE_URL = process.env.REACT_APP_USER_PROFILE_MANAGEMENT_BASE_URL;

export const CreateUser = (data) => axios.post(`${USER_AUTH_BASE_URL}/users/create`, data);
export const VerifyEmail = (data) => axios.post(`${USER_AUTH_BASE_URL}/users/verifyEmail`, data);
export const Login = (data) => axios.post(`${USER_AUTH_BASE_URL}/login`, data);
export const ForgotPassword = (data) => axios.post(`${USER_AUTH_BASE_URL}/forgot-password`, data);
export const ConfirmPasswordReset = (data) => axios.post(`${USER_AUTH_BASE_URL}/confirm-password-reset`, data);
export const verifyToken = (data) => axios.post(`${USER_AUTH_BASE_URL}/verifyToken`, data);
export const StoreUserResponse = (data) => axios.post(`${USER_AUTH_BASE_URL}/storeUserResponse`, data);
export const QuestionAnswerValidation = (data) => axios.post(`${USER_AUTH_BASE_URL}/questionAnswerValidation`, data);
export const GetQuestionAnswer = (data) => axios.post(`${USER_AUTH_BASE_URL}/getQuestionAnswer`, data);
export const VerifyEmailWithoutCode = (data) => axios.post(`${USER_AUTH_BASE_URL}/verifyEmailWithoutCode`, data);
export const GetUserById = (id) => axios.get(`${USER_AUTH_BASE_URL}/getuserbyuserid/${id}`);
export const GetAllUsers = () => axios.get(`${USER_AUTH_BASE_URL}/getAllUsers`);
export const MakeAdmin = (data) => axios.post(`${USER_AUTH_BASE_URL}/makeAdmin`, data);
export const RemoveAdmin = (data) => axios.post(`${USER_AUTH_BASE_URL}/removeAdmin`, data)
export const GetUser = () => api.get(`${USER_AUTH_BASE_URL}/getUser`);
export const UpdateUser = (data) => api.post(`${USER_AUTH_BASE_URL}/updateUser`, data);
export const SignOut = () => api.get(`${USER_AUTH_BASE_URL}/signout`);
export const DeleteUser = () => api.get(`${USER_AUTH_BASE_URL}/deleteUser`);
export const QuestionAnswerValidationWithAuth = (data) => api.post(`${USER_AUTH_BASE_URL}/questionAnswerValidation`, data);
export const GetUserByUserId = (userId) => api.get(`${USER_AUTH_BASE_URL}/getuserbyuserid/${userId}`);
export const SaveUser = (data) => axios.post(`${USER_PROFILE_MANAGEMENT_BASE_URL}/saveUser`, data);
export const UpdateGameData = (data) => api.post(`${USER_PROFILE_MANAGEMENT_BASE_URL}/updateGameData`, data);
export const GetAllGameData = () => api.get(`${USER_PROFILE_MANAGEMENT_BASE_URL}/getGameData`);
