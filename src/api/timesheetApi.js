import axiosInstance from "./axiosInstance";

export const getProjects = () => {
  return axiosInstance.get("/timesheet/projects");
};

export const addEntry = (data) => {
  return axiosInstance.post("/timesheet/entries", data);
};

export const updateEntry = (id, data) => {
  return axiosInstance.put(`/timesheet/entries/${id}`, data);
};

export const deleteEntry = (id) => {
  return axiosInstance.delete(`/timesheet/entries/${id}`);
};

export const getWeekTimesheet = (weekStart) => {
  return axiosInstance.get(`/timesheet/weeks/${weekStart}`);
};

export const submitTimesheet = (data) => {
  return axiosInstance.post("/timesheet/weeks/submit", data);
};

export const recallTimesheet = (data) => {
  return axiosInstance.post("/timesheet/weeks/recall", data);
};

export const getTimesheetHistory = () => {
  return axiosInstance.get("/timesheet/history");
};

export const getSubmittedTimesheets = () => {
  return axiosInstance.get("/timesheet/admin/submitted");
};

export const approveTimesheet = (id, data) => {
  return axiosInstance.put(`/timesheet/admin/approve/${id}`, data);
};

export const rejectTimesheet = (id, data) => {
  return axiosInstance.put(`/timesheet/admin/reject/${id}`, data);
};

export const createProject = (data) => {
  return axiosInstance.post("/timesheet/admin/projects", data);
};
