import React, { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Change the URL to use localhost with the correct port
        const res = await axios.get("http://localhost:5000/api/news/all");
        console.log("Fetched data:", res.data);  // Log the response
  
        // Ensure that res.data is an array before setting it to state
        if (Array.isArray(res.data)) {
          setNewsList(res.data);
        } else {
          setErrorMessage("Fetched data is not an array.");
        }
      } catch (err) {
        setErrorMessage("Error fetching news.");
        console.error("Error fetching news:", err);
      }
    };
  
    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Latest News</h1>

      {/* Error message if there is an issue fetching data */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Display news or a message if no news found */}
      {newsList.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <div className="space-y-6">
          {newsList.map((news) => (
            <div key={news._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{news.description}</h2>

              {/* Display the image if it exists */}
              {news.image && (
                <div className="mt-4">
                  <img
                    src={`http://localhost:5000/uploads/${news.image}`} // Assuming the image path
                    alt={news.description}
                    className="w-full h-auto rounded-lg" // Adjust styles as needed
                  />
                </div>
              )}

              <p className="mt-2 text-gray-700">{news.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                By: <span className="italic">{news.createdBy}</span> |{" "}
                {new Date(news.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
