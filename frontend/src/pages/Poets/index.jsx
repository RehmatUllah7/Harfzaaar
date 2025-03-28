import { useNavigate } from "react-router-dom";
import poetsData from "../../data/poetsData";
import Header from "@/components/home/Header";
import PoetrySearch from "../PoetrySearch";
import Footer from "@/components/home/footer";
const Poets = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <Header />
      <PoetrySearch />
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white p-10">
      
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {poetsData.map((poet) => (
          <div
            key={poet.name}
            className="group bg-white text-gray-900 rounded-2xl shadow-lg overflow-hidden w-72 transform transition-all duration-300 hover:shadow-purple-500/90 hover:scale-105"
          >
            <img
              src={poet.image}
              alt={poet.name}
              className="w-full h-48 object-cover transform transition-all duration-300 hover:scale-110"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{poet.name}</h2>
              <p className="text-gray-700 mb-4 font-urdu">
                {poet.description.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <button
                className="bg-purple-700 w-[240px] text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
