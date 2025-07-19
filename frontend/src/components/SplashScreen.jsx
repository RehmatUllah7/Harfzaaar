import { useState, useEffect } from "react";
import logo from "../assets/slide1.png";

const SplashScreen = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Show logo for 0.5 sec
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black">
        <img
          src={logo}
          alt="Logo"
          className="max-w-full max-h-full w-auto h-auto object-contain animate-fade-in-out"
          style={{ maxHeight: "80vh", maxWidth: "80vw" }}
        />
      </div>
    );
  }

  return children; // Show the actual page after loading
};

export default SplashScreen;
