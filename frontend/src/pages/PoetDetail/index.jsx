import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import poetsData from "../../data/poetsData";
import Header from "@/components/home/Header";


const PoetDetails = () => {
  const { poetName } = useParams();
  const [ghazals, setGhazals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGhazal, setSelectedGhazal] = useState(null);
  const [visibleCount, setVisibleCount] = useState(14);
  const [expandedBio, setExpandedBio] = useState(false);

  const poet = poetsData.find(
    (p) => p.name.toLowerCase() === poetName.toLowerCase()
  );

  useEffect(() => {
    if (!poetName) return;

    const formattedPoetName = poetName.trim().toLowerCase().replace(/\s+/g, "-");

    const fetchPoetry = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/poetry/by-poet/${encodeURIComponent(
            formattedPoetName
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch poetry");

        const data = await response.json();
        setGhazals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoetry();
  }, [poetName]);

  const toggleBio = () => setExpandedBio(!expandedBio);

  // Function to limit the biography to 300 words while preserving paragraphs
  const renderBiography = (bio, limit = 300) => {
    const paragraphs = bio.split("\n"); // Split by newlines to preserve paragraphs
    let wordCount = 0;
    let truncatedBio = [];

    for (const paragraph of paragraphs) {
      const words = paragraph.split(" ");
      if (wordCount + words.length <= limit) {
        truncatedBio.push(paragraph); // Add the full paragraph
        wordCount += words.length;
      } else {
        // Add only the remaining words needed to reach the limit
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
      <Header />
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white p-10">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Poet Biography Section */}
        {poet ? (
          <div className="w-full lg:w-1/2">
            <div className="relative w-52 h-52 mx-auto lg:mx-0">
              <img
                src={poet.image}
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
                ? poet.biography.split("\n").map((para, index) => (
                    <p key={index} className="mb-4">
                      {para}
                    </p>
                  ))
                : renderBiography(poet.biography)}
              <button
                className="mt-4 text-purple-500 hover:text-purple-400 transition"
                onClick={toggleBio}
              >
                {expandedBio ? "Show less" : "Show more"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Poet not found.</p>
        )}
{/* Poetry Titles Section */}
<div className="w-full lg:w-1/2">
  {loading && <p className="text-center text-gray-300">Loading poetry...</p>}
  {error && <p className="text-center text-red-500">{error}</p>}
  
  {/* Main Title */}
  <h1 className="text-4xl font-bold text-center p-8 mb-12 text-white">
    Explore {poet.name}'s Poetry
  </h1>

  {/* Poetry List - Responsive Grid */}
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



          {/* Read More / Read Less Buttons */}
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

      {/* Poetry Modal - Scrollbar on Left */}
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