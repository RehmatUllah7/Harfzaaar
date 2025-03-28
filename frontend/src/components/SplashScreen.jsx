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
          className="absolute inset-0 w-full h-full object-cover animate-fade-in-out"
        />
      </div>
    );
  }

  return children; // Show the actual page after loading
};

export default SplashScreen;
