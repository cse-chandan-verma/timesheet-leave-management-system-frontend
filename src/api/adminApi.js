import axiosInstance from "./axiosInstance";

export const adminGetPendingTimesheets = () => {
  return axiosInstance.get("/admin/timesheets/pending");
};

export const adminApproveTimesheet = (id, data) => {
  return axiosInstance.put(`/admin/timesheets/${id}/approve`, data);
};

export const adminRejectTimesheet = (id, data) => {
  return axiosInstance.put(`/admin/timesheets/${id}/reject`, data);
};

export const adminGetPendingLeaves = () => {
  return axiosInstance.get("/admin/leaves/pending");
};

export const adminApproveLeave = (id, data) => {
  return axiosInstance.put(`/admin/leaves/${id}/approve`, data);
};

export const adminRejectLeave = (id, data) => {
  return axiosInstance.put(`/admin/leaves/${id}/reject`, data);
};

export const getNotifications = () => {
  return axiosInstance.get("/admin/notifications");
};

export const getNotificationsByUser = (email) => {
  return axiosInstance.get(`/admin/notifications/user/${email}`);
};

export const getNotificationsByType = (type) => {
  return axiosInstance.get(`/admin/notifications/type/${type}`);
};
