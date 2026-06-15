import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    // API public
    const publicEndpoints = [
      "/auth/google",
    ];

    const isPublic = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Tự động gắn JWT
    if (token && !isPublic && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (!error.response) {

      alert("Không thể kết nối server!");

    } else if (error.response.status === 401) {

      alert("Phiên đăng nhập hết hạn!");

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;