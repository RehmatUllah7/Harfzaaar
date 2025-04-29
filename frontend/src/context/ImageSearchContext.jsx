import React, { createContext, useState, useContext } from "react";

const ImageSearchContext = createContext();

export const ImageSearchProvider = ({ children }) => {
  const [imageData, setImageData] = useState(null);

  const clearImageData = () => {
    setImageData(null);
  };

  return (
    <ImageSearchContext.Provider value={{ imageData, setImageData, clearImageData }}>
      {children}
    </ImageSearchContext.Provider>
  );
};

export const useImageSearch = () => {
  return useContext(ImageSearchContext);
};