import React, { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news/all");
        console.log("Fetched data:", res.data);
  
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

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {newsList.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <div className="space-y-6">
          {newsList.map((news) => (
            <div key={news._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{news.description}</h2>

              {news.image && (
                <div className="mt-4">
                  <img
                    src={`http://localhost:5000/uploads/${news.image}`}
                    alt={news.description}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              <p className="mt-2 text-gray-700">{news.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                By: <span className="italic">
                  {typeof news.createdBy === 'object' 
                    ? news.createdBy.username 
                    : news.createdBy}
                </span> |{" "}
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