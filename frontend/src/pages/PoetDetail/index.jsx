import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import poetsData from "../../data/poetsData";
import Header from "@/components/home/Header";
import PoetHeader from "@/components/PoetHeader";

const PoetDetails = () => {
  const { poetName } = useParams();
  const [poet, setPoet] = useState(null);
  const [ghazals, setGhazals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGhazal, setSelectedGhazal] = useState(null);
  const [visibleCount, setVisibleCount] = useState(14);
  const [expandedBio, setExpandedBio] = useState(false);
const [isPoet, setIsPoet] = useState(false);
  // Helper function to get correct image path
  const getImagePath = (image) => {
    if (!image) return ''; // Handle undefined case
    // If image is from API (starts with /uploads)
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    // If image is already a full URL
    if (image.startsWith('http')) {
      return image;
    }
    // For local images from poetsData
    return image;
  };

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

  useEffect(() => {
    
    const fetchPoetData = async () => {
      setLoading(true);
      try {
        // First check in hardcoded data (case insensitive)
        const hardcodedPoet = poetsData.find(
          (p) => p.name.toLowerCase() === poetName.toLowerCase()
        );
  
        if (hardcodedPoet) {
          setPoet(hardcodedPoet);
          // For hardcoded poets, fetch poetry using lowercase with hyphens
          const formattedName = poetName.toLowerCase().replace(/\s+/g, '-');
          const poetryResponse = await axios.get(
            `http://localhost:5000/api/poetry/by-poet/${encodeURIComponent(formattedName)}`
          );
          setGhazals(poetryResponse.data);
        } else {
          // If not found in hardcoded data, fetch poet from API
          const response = await axios.get(
            `http://localhost:5000/api/poets/${encodeURIComponent(poetName)}`
          );
          setPoet(response.data);
          // For API-sourced poets, fetch poetry using exact name
          const poetryResponse = await axios.get(
            `http://localhost:5000/api/poetry/by-poet/${encodeURIComponent(poetName)}`
          );
          setGhazals(poetryResponse.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch poet data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPoetData();
  }, [poetName]);

  const toggleBio = () => setExpandedBio(!expandedBio);

  const renderBiography = (bio, limit = 300) => {
    if (!bio) return null;
    
    const paragraphs = bio.split("\n");
    let wordCount = 0;
    let truncatedBio = [];

    for (const paragraph of paragraphs) {
      const words = paragraph.split(" ");
      if (wordCount + words.length <= limit) {
        truncatedBio.push(paragraph);
        wordCount += words.length;
      } else {
        const remainingWords = limit - wordCount;
        truncatedBio.push(words.slice(0, remainingWords).join(" ") + "...");
        break;
      }
    }

    return truncatedBio.map((para, index) => (
      <p key={index} className="mb-4">
        {para}
      </p>
    ));
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      {isPoet ? <PoetHeader /> : <Header />}
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white p-10">
        {loading ? (
          <div className="text-center text-gray-300">
            <p>Loading poet data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : poet ? (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
            {/* Poet Biography Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-52 h-52 mx-auto lg:mx-0">
                <img
                  src={getImagePath(poet.image)}
                  alt={poet.name}
                  className="w-full h-full rounded-full border-8 border-purple-600 shadow-2xl transition-transform transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 rounded-full"></div>
              </div>
              <h1 className="text-4xl text-white font-bold mt-6 text-center lg:text-left">
                {poet.name}
              </h1>

              <div className="mt-6 text-lg font-urdu text-gray-300 text-justify leading-relaxed">
                {expandedBio
                  ? poet.biography?.split("\n").map((para, index) => (
                      <p key={index} className="mb-4">
                        {para}
                      </p>
                    ))
                  : renderBiography(poet.biography)}
                {poet.biography && poet.biography.split(/\s+/).length > 300 && (
                  <button
                    className="mt-4 text-purple-500 hover:text-purple-400 transition"
                    onClick={toggleBio}
                  >
                    {expandedBio ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>

            {/* Poetry Titles Section */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl font-bold text-center p-8 mb-12 text-white">
                Explore {poet.name}'s Poetry
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
                {ghazals.length > 0 ? (
                  ghazals.slice(0, visibleCount).map((ghazal) => (
                    <div
                      key={ghazal._id}
                      className="text-right rtl min-h-[100px] bg-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-purple-600/70 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-purple-600 hover:scale-105 flex items-center justify-center"
                      onClick={() => setSelectedGhazal(ghazal)}
                    >
                      <h3 className="text-lg font-urdu text-center text-white leading-relaxed">
                        {ghazal.poetryTitle}
                      </h3>
                    </div>
                  ))
                ) : (
                  !loading && (
                    <p className="text-center text-gray-300 col-span-full">
                      No poetry found for this poet.
                    </p>
                  )
                )}
              </div>

              {ghazals.length > 12 && (
                <div className="text-center mt-6">
                  {visibleCount < ghazals.length ? (
                    <button
                      className="bg-purple-600 font-urdu text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all"
                      onClick={() => setVisibleCount(visibleCount + 12)}
                    >
                      مزید پڑھیں
                    </button>
                  ) : (
                    <button
                      className="bg-gray-700 font-urdu text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
                      onClick={() => setVisibleCount(12)}
                    >
                      کم پڑھیں
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Poet not found in any source.</p>
        )}

        {/* Poetry Modal */}
        {selectedGhazal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-md"
            onClick={() => setSelectedGhazal(null)}
          >
            <div
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white max-w-2xl w-full p-10 rounded-3xl shadow-2xl transition-transform duration-300 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-urdu font-bold text-purple-500 text-center mb-6">
                {selectedGhazal.poetryTitle}
              </h2>
              <div className="font-urdu text-gray-300 text-right whitespace-pre-line leading-[2.5rem] tracking-wide max-h-[70vh] overflow-y-auto scrollbar-none p-3">
                <div className="direction-rtl text-right">
                  {selectedGhazal.poetryContent}
                </div>
              </div>
              <button
                className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all block mx-auto"
                onClick={() => setSelectedGhazal(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoetDetails;