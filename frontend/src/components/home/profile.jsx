import React, { useState } from "react";
import pic from "../../assets/images/profile.png.png";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Fetch user info only when opening the dropdown
      await fetchUserInfo();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

    if (!token) {
      setErrorMessage("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the header
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data); // Set user info in state
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to fetch user info.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative">
      {/* Profile Picture Section */}
      <a
        href="#profile"
        onClick={toggleDropdown}
        className="inline-block w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:scale-105 transition-transform"
      >
        <img src={pic} alt="Profile" className="w-full h-full object-cover" />
      </a>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-10">
          {/* Close Button */}
          <button
            onClick={closeDropdown}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          >
            ×
          </button>

          {/* Name Section */}
          <div className="py-4 px-4 text-xl font-semibold text-gray-800">
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : userInfo && userInfo.username ? (
              capitalizeName(userInfo.username)
            ) : (
              "Loading..."
            )}
          </div>
          <hr className="border-gray-300" />

          {/* Menu Items */}
          <div className="px-4 py-2">
            <a
              href="/favourites"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Favourites
            </a>
            <a
              href="#recitations"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Recitations
            </a>
            <a
              href="#edit-profile"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Edit Profile
            </a>
            <a
              href="/becomepoet"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Become a Poet
            </a>
            <a
              onClick={goToHome}
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3 cursor-pointer"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

const capitalizeName = (name) => {
  if (!name) return ""; // Handle empty or undefined names
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
