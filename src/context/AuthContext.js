import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as authApi from "../api/auth";
import * as branchesApi from "../api/branches";
import { getErrorMessage } from "../utils/Errors";

const AuthContext = createContext(null);

const TOKEN_KEY = "sm_access_token";
const REFRESH_KEY = "sm_refresh_token";
const USER_KEY = "sm_user";
const BRANCH_KEY = "sm_selected_branch";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedBranch = localStorage.getItem(BRANCH_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedBranch) setSelectedBranch(JSON.parse(storedBranch));
      } catch (e) {
        // ignore parse error
      }
    }
    setLoading(false);
  }, []);

  const persistSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.access);
    if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    // Auto-select for staff
    if (!data.user.requires_branch_selection && data.user.branch) {
      localStorage.setItem(BRANCH_KEY, JSON.stringify(data.user.branch));
      setSelectedBranch(data.user.branch);
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      const data = await authApi.login(username, password);
      persistSession(data);
      return data;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    try {
      if (refresh) await authApi.logout(refresh);
    } catch (e) {
      // Ignore logout errors — we clear local state anyway
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(BRANCH_KEY);
    setUser(null);
    setSelectedBranch(null);
  }, []);

  const selectBranch = useCallback(async (branchId) => {
    const data = await branchesApi.selectBranch(branchId);
    localStorage.setItem(BRANCH_KEY, JSON.stringify(data.branch));
    setSelectedBranch(data.branch);
    return data.branch;
  }, []);

  const clearBranch = useCallback(() => {
    localStorage.removeItem(BRANCH_KEY);
    setSelectedBranch(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getCurrentUser();
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      return null;
    }
  }, []);

  const value = {
    user,
    selectedBranch,
    loading,
    login,
    logout,
    selectBranch,
    clearBranch,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
