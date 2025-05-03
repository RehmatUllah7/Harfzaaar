import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/home/Header";
import PoetrySearch from "../PoetrySearch";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/home/footer";
import poetsData from "../../data/poetsData";
import PoetHeader from "@/components/PoetHeader";

const Poets = () => {
  const navigate = useNavigate();
  const [poets, setPoets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPoet, setSelectedPoet] = useState(null);
  const [isPoet, setIsPoet] = useState(false);

  // Ensure the Authorization header is sent with the correct token format
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token using the correct key
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensure cookies are sent for authentication
        });

        const userRole = response.data.role;
        setIsPoet(userRole === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, []);

  // Helper function to get correct image path
  const getImagePath = (image) => {
    if (!image) return ''; // Handle undefined case
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    if (image.startsWith('http')) {
      return image;
    }
    return image;
  };

  useEffect(() => {
    const fetchPoets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/poets/getall");
        setPoets(res.data);
      } catch (err) {
        setError("Failed to fetch poets");
      } finally {
        setLoading(false);
      }
    };

    fetchPoets();
  }, []);

  // Combine hardcoded poets with API fetched poets
  const combinedPoets = [...poetsData, ...poets];

  const closeModal = () => {
    setSelectedPoet(null);
  };
  

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white"> 
      {isPoet ? <PoetHeader /> : <Header />}

      <PoetrySearch />
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white p-10">        <div className="flex flex-wrap justify-center gap-8 px-4">
          {/* Loading and Error States */}
          {loading && (
            <div className="col-span-full text-center text-gray-300">
              <p>Loading poets...</p>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Poet Cards */}
          {combinedPoets.map((poet) => (
            <div
              key={poet._id || poet.name} // Use _id for API poets, name for hardcoded
              className="group bg-white text-gray-900 rounded-2xl shadow-lg overflow-hidden w-72 transform transition-all duration-300 hover:shadow-purple-500/90 hover:scale-105"
            >
              <img
                src={getImagePath(poet.image)}
                alt={poet.name}
                className="w-full h-48 object-cover transform transition-all duration-300 hover:scale-110"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{poet.name}</h2>
                <p className="text-gray-700 mb-4 font-urdu">
                  {poet.couplet.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <button
className="bg-purple-700 text-white w-[240px] px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
onClick={() => navigate(`/poets/${poet.name}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <Footer />
    </div>
  );
};

export default Poets;