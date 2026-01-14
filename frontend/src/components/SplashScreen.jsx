import { useState, useEffect } from "react";
import logo from "../assets/HarfZaad.Logo.png";

const SplashScreen = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Show image for 0.5 sec
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black z-50">
        <img
          src={logo}
          alt="Splash Logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return children; // Show actual content after splash
};

export default SplashScreen;
