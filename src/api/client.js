// import axios from "axios";

// const TOKEN_KEY = "sm_access_token";
// const REFRESH_KEY = "sm_refresh_token";

// const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

// const api = axios.create({
//   baseURL,
//   headers: { "Content-Type": "application/json" },
// });

// // Request interceptor to add auth header
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response interceptor to handle 401 and refresh tokens
// let refreshing = null;

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config;
//     const status = error?.response?.status;

//     if (status === 401 && !original._retry) {
//       const refresh = localStorage.getItem(REFRESH_KEY);
//       if (!refresh) {
//         // No refresh token — force logout
//         clearSession();
//         if (window.location.pathname !== "/login") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(error);
//       }

//       original._retry = true;

//       try {
//         if (!refreshing) {
//           refreshing = axios.post(`${baseURL}auth/token/refresh/`, { refresh });
//         }
//         const { data } = await refreshing;
//         refreshing = null;
//         if (data?.access) {
//           localStorage.setItem(TOKEN_KEY, data.access);
//           original.headers.Authorization = `Bearer ${data.access}`;
//           return api(original);
//         }
//       } catch (refreshError) {
//         refreshing = null;
//         clearSession();
//         if (window.location.pathname !== "/login") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// function clearSession() {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(REFRESH_KEY);
//   localStorage.removeItem("sm_user");
//   localStorage.removeItem("sm_selected_branch");
// }

// export default api;

import axios from "axios";

const TOKEN_KEY = "sm_access_token";
const REFRESH_KEY = "sm_refresh_token";

const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh token when access token expires
let refreshing = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(REFRESH_KEY);

    if (!refresh) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshing) {
        refreshing = axios.post(`${baseURL}auth/token/refresh/`, {
          refresh,
        });
      }

      const { data } = await refreshing;

      refreshing = null;

      if (data?.access) {
        localStorage.setItem(TOKEN_KEY, data.access);

        original.headers.Authorization = `Bearer ${data.access}`;

        return api(original);
      }

      throw new Error("Access token was not returned.");
    } catch (refreshError) {
      refreshing = null;

      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  },
);

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("sm_user");
  localStorage.removeItem("sm_selected_branch");
}

export default api;
