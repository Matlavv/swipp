import React, { createContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
