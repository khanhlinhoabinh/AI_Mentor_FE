import api from "../configs/axios.config";

// LOGIN GOOGLE
export const loginGoogle = async (idToken) => {

  const response = await api.post(
  "/auth/google",
  {
    idToken: idToken,
  }
);

console.log("GOOGLE LOGIN API:", response.data);

localStorage.setItem(
  "token",
  response.data.token
);

return response.data;
};

// LOGOUT
export const logout = () => {

  localStorage.removeItem("token");

  window.location.href = "/login";
};