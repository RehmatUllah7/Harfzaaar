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
  const [isPoet, setIsPoet] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIsPoet(response.data.role === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, []);

  const getImagePath = (image) => {
    if (!image) return '';
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    return image.startsWith('http') ? image : image;
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

  const combinedPoets = [...poetsData, ...poets];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      {isPoet ? <PoetHeader /> : <Header />}
      <PoetrySearch />

      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white px-4 py-6 md:p-10">
        <div className="flex flex-wrap justify-center gap-8">
          {loading && (
            <div className="w-full text-center text-gray-300">
              <p>Loading poets...</p>
            </div>
          )}

          {error && (
            <div className="w-full text-center text-red-500">
              <p>{error}</p>
            </div>
          )}

          {combinedPoets.map((poet) => (
            <div
              key={poet._id || poet.name}
              className="group bg-white text-gray-900 rounded-2xl shadow-lg overflow-hidden w-full sm:w-72 md:w-72 transform transition-all duration-300 hover:shadow-purple-500/90 hover:scale-105"
            >
              <img
                src={getImagePath(poet.image)}
                alt={poet.name}
                className="w-full h-48 object-cover transform transition-all duration-300 hover:scale-110"
              />
              <div className="p-4">
                <h2 className="text-lg md:text-xl font-bold mb-2">{poet.name}</h2>
                <p className="text-gray-700 mb-4 font-urdu text-sm md:text-base">
                  {poet.couplet.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <button
                  className="bg-purple-700 text-white w-full md:w-[240px] px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
