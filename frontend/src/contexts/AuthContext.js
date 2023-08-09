import React, { createContext, useContext, useState } from "react";
import { SignOut, Login, verifyToken } from "../services/user.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  const checkLogin = async () => {
    const requestBody = {
      token: localStorage.getItem("AccessToken"),
    };
    const response = await verifyToken(requestBody);
    if (!response?.data?.error) {
      return true;
    } else {
      return false;
    }
  };

  const login = async (user) => {
    const response = await Login(user);
    if (!response?.data?.error) {
      localStorage.setItem(
        "AccessToken",
        response?.data?.authDetails?.AuthenticationResult?.AccessToken
      );
      localStorage.setItem("UserId", response?.data?.user?.id);
      localStorage.setItem("isAdmin", response?.data?.user?.isAdmin);
      setUser(true);
      return true;
    } else {
      return false;
    }
  };

  const logout = async () => {
    await SignOut();
    localStorage.clear();
    setUser(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
