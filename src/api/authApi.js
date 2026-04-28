import axiosInstance from "./axiosInstance";

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const forgotPassword = (data) => {
  return axiosInstance.post("/auth/forgot-password", data);
};

export const getProfile = () => {
  return axiosInstance.get("/auth/profile");
};

export const updateProfile = (data) => {
  return axiosInstance.put("/auth/profile", data);
};

export const getAllUsers = () => {
  return axiosInstance.get("/auth/users");
};

export const getUserByEmail = (email) => {
  return axiosInstance.get(`/auth/admin/user/${email}`);
};

export const promoteUser = (data) => {
  return axiosInstance.put("/auth/admin/promote", data);
};
