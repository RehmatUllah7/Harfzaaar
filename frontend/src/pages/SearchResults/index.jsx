import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/home/footer";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search?query=${query}`);


        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-purple-400 font-urdu border-b-2 border-purple-500 pb-2 mb-8 text-center tracking-wider">
       {query}" کے نتائج"
        </h2>

        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {!isLoading && !error && searchResults.length > 0 ? (
          <div className="space-y-8">
            {searchResults.map((poetry, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300 transform hover:scale-105"
              >
                {/* Poetry Title */}
                <h3 className="text-2xl text-center font-urdu font-semibold text-purple-400 mb-6 tracking-wider">
                  {poetry.poetryTitle}
                </h3>

                {/* Poetry Content */}
                <p className="font-urdu text-center text-gray-300 whitespace-pre-line leading-loose tracking-wide">
                  {poetry.poetryContent}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          !error && (
            <p className="text-gray-400 mt-6 text-center text-xl">کوئی نتیجہ نہیں ملا۔</p>
          )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SearchResults;