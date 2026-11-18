import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

const initialState = { status: "LOGGED_OUT", user: null, error: "" };

function reducer(state, action) {
  switch (action.type) {
    case "AUTH_START":
      return { status: "AUTHENTICATING", user: null, error: "" };
    case "AUTH_SUCCESS":
      return { status: "LOGGED_IN", user: action.user, error: "" };
    case "AUTH_FAILURE":
      return { status: "LOGGED_OUT", user: null, error: action.message };
    case "LOGOUT":
      return { status: "LOGGED_OUT", user: null, error: "" };
    case "SESSION_EXPIRED":
      return { status: "SESSION_EXPIRED", user: null, error: action.message || "Your session expired. Please log in again." };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshSession = useCallback(async () => {
    try {
      const result = await apiRequest("/auth/me");
      dispatch({ type: "AUTH_SUCCESS", user: result.user });
    } catch (error) {
      // On first app load, a 401 simply means there is no existing session.
      // A later protected-resource 401 is handled as SESSION_EXPIRED by Dashboard.
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  useEffect(() => { refreshSession(); }, [refreshSession]);

  const login = async (email, password) => {
    dispatch({ type: "AUTH_START" });
    try {
      const result = await apiRequest("/auth/login", {
        method: "POST", body: JSON.stringify({ email, password })
      });
      dispatch({ type: "AUTH_SUCCESS", user: result.user });
      return result;
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE", message: error.message });
      throw error;
    }
  };

  const register = async (name, email, password) => apiRequest("/auth/register", {
    method: "POST", body: JSON.stringify({ name, email, password })
  });

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const markSessionExpired = (message) => dispatch({ type: "SESSION_EXPIRED", message });

  const value = useMemo(() => ({ ...state, login, register, logout, refreshSession,
    markSessionExpired, clearError: () => dispatch({ type: "CLEAR_ERROR" }) }),
    [state, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
