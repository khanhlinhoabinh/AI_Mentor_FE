import api from "../configs/axios.config";

// LOGIN GOOGLE
export const loginGoogle = async (idToken) => {
  const response = await api.post("/auth/google", {
    idToken: idToken,
  });

  console.log("GOOGLE LOGIN API:", response.data);

  localStorage.setItem("token", response.data.token);

  return response.data;
};
// LOGIN ADMIN
export const loginAdmin = async (email, password) => {
  const response = await api.post("/auth/admin/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  localStorage.setItem("role", response.data.role);

  return response.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");

  window.location.href = "/login";
};
