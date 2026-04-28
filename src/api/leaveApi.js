import axiosInstance from "./axiosInstance";

export const getLeaveTypes = () => {
  return axiosInstance.get("/leave/types");
};

export const getLeaveBalance = () => {
  return axiosInstance.get("/leave/balance");
};

export const applyLeave = (data) => {
  return axiosInstance.post("/leave/apply", data);
};

export const getLeaveHistory = () => {
  return axiosInstance.get("/leave/history");
};

export const getLeaveById = (id) => {
  return axiosInstance.get(`/leave/${id}`);
};

export const cancelLeave = (id) => {
  return axiosInstance.put(`/leave/cancel/${id}`);
};

export const getHolidays = () => {
  return axiosInstance.get("/leave/holidays");
};

export const getPendingLeaves = () => {
  return axiosInstance.get("/leave/admin/pending");
};

export const approveLeave = (id, data) => {
  return axiosInstance.put(`/leave/admin/approve/${id}`, data);
};

export const rejectLeave = (id, data) => {
  return axiosInstance.put(`/leave/admin/reject/${id}`, data);
};

export const addHoliday = (data) => {
  return axiosInstance.post("/leave/admin/holidays", data);
};

export const deleteHoliday = (id) => {
  return axiosInstance.delete(`/leave/admin/holidays/${id}`);
};
