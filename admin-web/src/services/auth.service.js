import api from "./api";

const loginAdmin = async (data) => {
  const res = await api.post("/auth/admin/login", data);
  return res.data;
};

const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
};

const getToken = () => {
  return localStorage.getItem("admin_token");
};

export default {
  loginAdmin,
  logoutAdmin,
  getToken,
};