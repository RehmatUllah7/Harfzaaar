import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";


const SearchImage = () => {
  const [genre, setGenre] = useState("");
  const [poet, setPoet] = useState("");
  const [poetryList, setPoetryList] = useState([]);
  const fileInputRef = useRef();

  const triggerFileInput = () => fileInputRef.current.click();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);


    try {
      const res = await fetch("http://localhost:5000/api/deepseek", {
        method: "POST",
        body: formData,
      });

      

      if (data?.genre && Array.isArray(data.poetry) && data.poetry.length > 0) {
        setGenre(data.genre);
        setPoet("");
        setPoetryList(data.poetry);
        
      } else if (data?.poet && Array.isArray(data.poetry) && data.poetry.length > 0) {
        setGenre("");
        setPoet(data.poet);
        setPoetryList(data.poetry);
        
      } else {
        setGenre("");
        setPoet("");
        setPoetryList([]);
       
      }
    } catch (error) {
      
      
      console.error("Error analyzing image:", error);
    }
  };

  return (
    
     
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
        <button
          onClick={triggerFileInput}
          className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
        >
          <FaCamera className="text-lg" />
          <span className="text-md font-medium">Search by Image</span>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {(genre || poet) && (
          <div className="mt-10 w-full max-w-4xl">
            <p className="text-center text-xl font-semibold text-purple-800 mb-4">
              {genre && <>Detected Genre: <span className="italic">{genre}</span><br /></>}
              {poet && <>Detected Poet: <span className="italic">{poet.replace(/-/g, " ")}</span><br /></>}
            </p>

            {poetryList.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {poetryList.map((poem, index) => (
                  <div
                    key={index}
                    className="bg-white border border-purple-200 rounded-xl shadow-sm p-5 transition hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold text-purple-800 text-right">{poem.title}</h3>
                    <p className="mt-3 text-gray-800 text-right whitespace-pre-line leading-[2.75]">
                      {poem.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-8">Fetching poetry...</p>
            )}
          </div>
        )}
      </div>
    
  );
};

export default SearchImage;