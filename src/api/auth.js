import api from "./client";

export async function login(username, password) {
  const { data } = await api.post("auth/login/", { username, password });
  return data;
}

export async function logout(refresh) {
  const { data } = await api.post("auth/logout/", { refresh });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("auth/me/");
  return data;
}
