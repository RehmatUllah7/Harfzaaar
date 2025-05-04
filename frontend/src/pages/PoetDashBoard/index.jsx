import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import PoetHeader from "@/components/PoetHeader";
import Footer from "@/components/home/footer";

const PoetDashboard = () => {
  const navigate = useNavigate();

  const handleAddNews = () => {
    navigate("/addnews");
  };
  const handleAddPoetry = () => {
    navigate("/addpoetry");
  };
  
  return (
    <div>
      <PoetHeader />
      <main className="p-6 space-y-8">
        <h1 className="text-3xl font-bold">Welcome to the Poet Dashboard</h1>

        <section>
          <h2 className="text-xl font-semibold mb-2">Your Poems</h2>
          <p>Here you can view and manage your poems.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p>Track your poem views, likes, and more.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Add your Poetry</h2>
          <button
            onClick={handleAddPoetry}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add poetry
          </button>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">News Management</h2>
          <button
            onClick={handleAddNews}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add News
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PoetDashboard;
