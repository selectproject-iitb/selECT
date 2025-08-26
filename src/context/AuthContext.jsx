import { createContext, useContext, useReducer, useEffect } from "react";
import apiService from "../services/apiService";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  role: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        sessionId: action.payload.sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        role: action.payload.role,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        sessionId: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        role: null,
      };
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("select_token");
        const sessionId = localStorage.getItem("select_session_id");
        const role = localStorage.getItem("select_role");

        if (token) {
          const userData = await apiService.getCurrentUser();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: userData.user,
              token,
              sessionId: sessionId || null,
              role: role || userData.user?.role || "user",
            },
          });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("select_token");
        localStorage.removeItem("select_session_id");
        localStorage.removeItem("select_role");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials, isAdmin = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiService.login(credentials, isAdmin);

      localStorage.setItem("select_token", response.token);
      if (response.sessionId) {
        localStorage.setItem("select_session_id", response.sessionId);
      }
      const userRole = isAdmin ? "admin" : response.user?.role || "user";
      localStorage.setItem("select_role", userRole);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.user,
          token: response.token,
          sessionId: response.sessionId,
          role: userRole,
        },
      });

      toast.success(response.message || "Login successful!");
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const signup = async (userData, isAdmin = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await apiService.signup(userData, isAdmin);

      localStorage.setItem("select_token", response.token);
      if (response.sessionId) {
        localStorage.setItem("select_session_id", response.sessionId);
      }
      const userRole = isAdmin ? "admin" : response.user?.role || "user";
      localStorage.setItem("select_role", userRole);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.user,
          token: response.token,
          sessionId: response.sessionId,
          role: userRole,
        },
      });

      toast.success(response.message || "Account created successfully!");
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem("select_session_id");
      if (sessionId && state.token) {
        await apiService.logout(sessionId);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.clear();

      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully!");
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
