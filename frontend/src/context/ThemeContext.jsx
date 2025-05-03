import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isPoet, setIsPoet] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return setIsPoet(false);

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIsPoet(response.data.role === "poet");
      } catch {
        setIsPoet(false);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <ThemeContext.Provider value={{ isPoet }}>
      {isPoet === null ? null : children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
