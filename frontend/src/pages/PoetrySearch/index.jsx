import { useState, useEffect, useRef } from "react";
import axios from "axios";

const PoetrySearch = () => {
  const [poets, setPoets] = useState([]);
  const [genres, setGenres] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedPoet, setSelectedPoet] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [poetryList, setPoetryList] = useState([]);
  const [selectedPoetry, setSelectedPoetry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch filter data
  useEffect(() => {
    axios.get("http://localhost:5000/api/ghazals/poets").then((res) => setPoets(res.data));
    axios.get("http://localhost:5000/api/ghazals/genres").then((res) => setGenres(res.data));
    axios.get("http://localhost:5000/api/ghazals/domains").then((res) => setDomains(res.data));
  }, []);

  const handleSearch = () => {
    let query = `?poet=${selectedPoet}&genre=${selectedGenre}&domain=${selectedDomain}`;
    axios.get(`http://localhost:5000/api/ghazals/search${query}`)
      .then((res) => {
        if (res.data.length === 0) {
          setPoetryList([{ poetryTitle: "  کوئی شاعری نہیں ملی ", poetryContent: "" }]); // Show message
        } else {
          setPoetryList(res.data);
        }
      })
      .catch(() => {
        setPoetryList([{ poetryTitle: "Error fetching poetry", poetryContent: "" }]); // Handle errors
      });
  };
  
  // Open poetry in modal
  const openPoetryDetails = (title) => {
    axios
      .get(`http://localhost:5000/api/ghazals/poetry/${encodeURIComponent(title)}`)
      .then((res) => {
        setSelectedPoetry(res.data);
        setIsOpen(true);
      })
      .catch(() => setSelectedPoetry(null));
  };

  // Close dropdown when clicking outside (only if modal is NOT open)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!isOpen) {
          setPoetryList([]); // Close dropdown only if modal is not open
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-purple text-white rounded-lg shadow-md">

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <select className="p-2 bg-gray-700 rounded w-40" onChange={(e) => setSelectedPoet(e.target.value)}>
          <option value="">Poet</option>
          {poets.map((poet) => (
            <option key={poet} value={poet}>
              {poet}
            </option>
          ))}
        </select>

        <select className="p-2 bg-gray-700 rounded w-40" onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select className="p-2 bg-gray-700 rounded w-40" onChange={(e) => setSelectedDomain(e.target.value)}>
          <option value="">Domain</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        <button className="p-2 bg-purple-600 rounded w-32 hover:bg-purple-700" onClick={handleSearch}>
          Search
        </button>
      </div>

    {/* Poetry List or No Poetry Message */}
{poetryList.length > 0 ? (
  poetryList[0].poetryContent === "" ? (
    <div className="text-red-500 text-center mt-4 font-bold font-urdu">
      {poetryList[0].poetryTitle}
    </div>
  ) : (
    <div className="bg-gray-900 p-3 rounded-lg" ref={dropdownRef}>
      {poetryList.map((poetry) => (
        <div
          key={poetry.poetryTitle}
          className="p-2 text-center font-urdu mb-2 bg-gray-700 rounded cursor-pointer hover:bg-purple-700"
          onClick={() => openPoetryDetails(poetry.poetryTitle)}
        >
          {poetry.poetryTitle}
        </div>
      ))}
    </div>
  )
) : null}

      {/* Poetry Content Modal */}
      {selectedPoetry && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white max-w-2xl w-full p-10 rounded-3xl shadow-2xl transition-transform duration-300 relative">
            <h2 className="text-3xl font-urdu font-bold text-purple-500 text-center mb-6">{selectedPoetry.poetryTitle}</h2>
            <div className="font-urdu text-gray-300 text-right whitespace-pre-line leading-[2.5rem] tracking-wide max-h-[70vh] overflow-y-auto scrollbar-none p-3">
              <div className="direction-rtl text-right">{selectedPoetry.poetryContent}</div>
            </div>
            <button
              className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all block mx-auto"
              onClick={() => {
                setIsOpen(false); // Close modal first
                setSelectedPoetry(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoetrySearch;
