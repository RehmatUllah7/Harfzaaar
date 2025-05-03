import React from "react";
import { useTheme } from "./ThemeContext";
import clsx from "clsx";

const WebsiteWrapper = ({ children }) => {
  const { isPoet } = useTheme();

  // Optional: wrap base color class logic here
  const themeClass = isPoet ? "poet-theme" : "user-theme";

  return <div className={clsx("min-h-screen", themeClass)}>{children}</div>;
};

export default WebsiteWrapper;
