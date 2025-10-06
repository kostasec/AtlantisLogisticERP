import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import axios from 'axios'; // CUSTOM LOADING COMPONENT

import { LoadingProgress } from '@/components/loader';
// ==============================================================

// ==============================================================
const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      };

    case 'LOGIN':
      return { ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    case 'LOGOUT':
      return { ...state,
        user: null,
        isAuthenticated: false
      };

    case 'REGISTER':
      return { ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
}; // ==============================================================


// ==============================================================
export const AuthContext = createContext({});
export function AuthProvider({
  children
}) {
  const [state, dispatch] = useReducer(reducer, initialState); // USER LOGIN HANDLER

  const login = useCallback(async (email, password) => {
    // Mock login - accept any credentials
    const mockUser = {
      id: '1',
      name: 'User',
      email: email,
      avatar: '/static/avatar/020-man-4.svg',
      role: 'admin'
    };
    
    setSession('mock-jwt-token');
    dispatch({
      type: 'LOGIN',
      payload: {
        user: mockUser,
        isAuthenticated: true
      }
    });
  }, []); // USER REGISTER HANDLER

  const register = useCallback(async (name, email, password) => {
    const {
      data
    } = await axios.post(`${API_URL}/users`, {
      name,
      email,
      password
    });
    setSession(data.token);
    dispatch({
      type: 'REGISTER',
      payload: {
        user: data,
        isAuthenticated: true
      }
    });
  }, []); // USER LOGOUT HANDLER

  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
        isAuthenticated: false
      }
    });
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  const checkCurrentUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        setSession(accessToken);
        const {
          data
        } = await axios.get(`${API_URL}/users/profile`);
        dispatch({
          type: 'INIT',
          payload: {
            user: data,
            isAuthenticated: true
          }
        });
      } else {
        dispatch({
          type: 'INIT',
          payload: {
            user: null,
            isAuthenticated: false
          }
        });
      }
    } catch (err) {
      dispatch({
        type: 'INIT',
        payload: {
          user: null,
          isAuthenticated: false
        }
      });
    }
  }, []);
  useEffect(() => {
    checkCurrentUser();
  }, []);
  const contextValue = useMemo(() => ({ ...state,
    method: 'JWT',
    login,
    register,
    logout,
    // Firebase compatibility aliases
    signInWithEmail: login,
    createUserWithEmail: register,
    signInWithGoogle: () => Promise.resolve() // Mock Google login
  }), [state, login, register, logout]);
  if (!state.isInitialized) return <LoadingProgress />;
  return <AuthContext value={contextValue}>{children}</AuthContext>;
}