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

export const resetPassword = (data) => {
  return axiosInstance.post("/auth/reset-password", data);
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

export const assignManager = (data) => {
  return axiosInstance.put("/auth/admin/assign-manager", data);
};

export const getAllManagers = () => {
  return axiosInstance.get("/auth/admin/managers");
};

export const getMyTeam = () => {
  return axiosInstance.get("/auth/manager/my-team");
};
