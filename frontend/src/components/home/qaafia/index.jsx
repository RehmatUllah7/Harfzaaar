import React, { useState, useRef } from "react";
import Header from "../Header";
import Footer from "@/components/home/footer";
import toast from "react-hot-toast"; // ✅ Import toast
import { useEffect } from "react";
import axios from "axios";
import PoetHeader from "@/components/PoetHeader";

function QaafiyaSection() {
  const [firstQaafia, setFirstQaafia] = useState("");
  const [secondQaafia, setSecondQaafia] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [raviPattern, setRaviPattern] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPoet, setIsPoet] = useState(false);

  // Refs for scrolling
  const introductionRef = useRef(null);
  const rhymingTableRef = useRef(null);

  const isUrdu = (text) => {
    const urduRegex = /^[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF ]+$/;
    return urduRegex.test(text);
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


  const findMatchingSuffix = (word1, word2) => {
    let minLength = Math.min(word1.length, word2.length);
    for (let i = 0; i < minLength; i++) {
      if (word1[word1.length - 1 - i] !== word2[word2.length - 1 - i]) {
        return word1.slice(word1.length - i);
      }
    }
    return word1.slice(-minLength);
  };
  const handleSearch = async () => {
    if (!firstQaafia || !secondQaafia) {
      setErrorMessage("Please enter both Qaafiya words");
      setRaviPattern("");
      return;
    }
    if (!isUrdu(firstQaafia) || !isUrdu(secondQaafia)) {
      setErrorMessage("Please enter your Qaafiya words in Urdu");
      setRaviPattern("");
      return;
    }
  
    setErrorMessage("");
    setLoading(true);
  
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/qaafiaSearch?firstQaafia=${encodeURIComponent(firstQaafia)}&secondQaafia=${encodeURIComponent(secondQaafia)}`
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setRaviPattern(data.raviPattern || ""); // Set Ravi pattern from response
        setSearchResults(data.matches || []); // Store only the matches
      } else {
        setSearchResults([]);
        setErrorMessage(
          data.message ||
          "Your Qaafia words are not valid. Please check the instructions."
        );
      }
    } catch (error) {
       toast.error("Unable to connect to server!")
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  // Scroll to Introduction
  const scrollToIntroduction = () => {
    introductionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to Rhyming Table
  const scrollToRhymingTable = () => {
    rhymingTableRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
    {isPoet ? <PoetHeader /> : <Header />}
      <div className="mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-purple-400 mb-8">Search Qaafiya</h2>
        <p className="text-center text-purple-200 italic mb-8">
      "In every letter, there's a melody; in every rhyme, there's a secret."
    </p>


         {/* Search Fields */}
         <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <input
              type="text"
              placeholder="Enter first qaafiya"
              value={firstQaafia}
              onChange={(e) => setFirstQaafia(e.target.value)}
              className="border border-gray-600 rounded-xl px-4 py-3 w-full bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <input
              type="text"
              placeholder="Enter second qaafiya"
              value={secondQaafia}
              onChange={(e) => setSecondQaafia(e.target.value)}
              className="border border-gray-600 rounded-xl px-4 py-3 w-full mt-4 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={handleSearch}
              className="mt-6 bg-purple-600 text-white px-6 py-3 w-full rounded-xl text-lg font-semibold shadow-md hover:bg-purple-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>


        {/* Error Message */}
        {errorMessage && <p className="text-red-400 text-center font-bold mt-2">{errorMessage}</p>}

        {/* Search Results */}
        {loading && <p className="text-yellow-400 font-urdu text-center">Loading...</p>}

        {raviPattern && (
          <div className="mt-6 p-5 bg-gray-800 text-white rounded-2xl shadow-lg text-center max-w-4xl mx-auto">
            <h3 className="text-xl font-urdu font-bold text-green-400">
              Ravi Pattern: <span className="text-white">{raviPattern}</span>
            </h3>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 p-5 bg-gray-800 text-white rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-green-400 text-center mb-4">Matching Exact Qaafiyas:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {searchResults.map((item, index) => (
    <li
      key={index}
      className="bg-gray-900 font-urdu p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all text-center"
    >
      {item.word}  {/* Now correctly accessing 'word' property */}
    </li>
  ))}
</ul>

          </div>
        )}

        {/* Guide Boxes */}
        <div className="w-full max-w-8xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-100 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-black">Learn How to Use Qaafiya</h3>
              <p className="text-gray-700 text-sm mb-4">A step-by-step guide on how to find rhyming words.</p>
              <button
                onClick={scrollToIntroduction}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Start Learning
              </button>
            </div>
            <div className="p-6 bg-green-100 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-black">Introducing Harf-e-Ravi</h3>
              <p className="text-gray-700 text-sm mb-4">Learn Harf-e-Ravi and how to use them in Ghazal and Nazam.</p>
              <button
                onClick={scrollToRhymingTable}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Check Patterns
              </button>
            </div>
            <div className="p-6 bg-yellow-100 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-black">Harfzaar E-Learning Platform</h3>
              <p className="text-gray-700 text-sm mb-4">Learn Urdu language, literature, and culture.</p>
              <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-all">
                Visit Platform
              </button>
            </div>
          </div>
        </div>

        {/* Introduction to Qaafiya */}
        <div ref={introductionRef} className="mt-12 p-6 rounded-lg">
          <h3 className="text-2xl text-white font-bold mb-4">How to use Qaafiya</h3>
          <p className="text-lg mb-4">
            Qaafiya is an essential component in a Ghazal and creates its rhyming pattern. It is a set of words that has the same sound as another within a group.
          </p>
          <p className="text-lg mb-4">
            <strong>For example:</strong> Aan, Baan, Shaan are Qaafiya with “aan” being the similar sound. The word Qaafiya is derived from the Arabic word <em>“qauf”</em>, which means “that which follows”.
          </p>
          <p className="text-lg mb-4">
            The rhyming structure in Urdu poetry is explained below:
          </p>

         
          <div  className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-purple-900 text-white">
                  <th className="border bg-purple-500 px-4 py-2 font-semibold">Sher</th>
                  <th className="border bg-purple-500 px-4 py-2 font-semibold">Qaafiya</th>
                  <th className="border bg-purple-500 px-4 py-2 font-semibold">Similar Sound</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-purple-50 text-black">
                  <td className="border border-pink-300 px-4 py-2">
                    <em>koii ummiid <span className="text-red-500">bar</span> nahii.n aatii<br />
                      koii suurat <span className="text-red-500">nazar</span> nahii.n aatii</em>
                  </td>
                  <td className="border border-pink-300 px-4 py-2">bar<br />nazar</td>
                  <td className="border border-pink-300 px-4 py-2">ar<br />ar</td>
                </tr>
                <tr className="bg-white text-black">
                  <td className="border border-pink-300 px-4 py-2">
                    <em>maut kaa ek din muayyan hai<br />
                      niind kyun.n raat <span className="text-red-500">bhar</span> nahii.n aatii</em>
                  </td>
                  <td className="border border-pink-300 px-4 py-2">–<br />bhar</td>
                  <td className="border border-pink-300 px-4 py-2">–<br />ar</td>
                </tr>
                <tr className="bg-purple-50 text-black">
                  <td className="border border-pink-300 px-4 py-2">
                    <em>aage aatii thii haal-e-dil pe ha.nsi<br />
                      ab kisii baat <span className="text-red-500">par</span> nahii.n aatii</em>
                  </td>
                  <td className="border border-pink-300 px-4 py-2">–<br />par</td>
                  <td className="border border-pink-300 px-4 py-2">–<br />ar</td>
                </tr>
                <tr className="bg-white text-black">
                  <td className="border border-pink-300 px-4 py-2">
                    <em>jaantaa hu.n savaab-e-taa.at-o-zohd<br />
                      par tabii.at <span className="text-red-500">idhar</span> nahii.n aatii</em>
                  </td>
                  <td className="border border-pink-300 px-4 py-2">bar<br />idhar</td>
                  <td className="border border-pink-300 px-4 py-2">–<br />dhar</td>
                </tr>
              </tbody>
            </table>
            <p className="text-lg mb-4 p-2">
            In most ghazals, the matla, (i.e. first sher of the ghazal) has qaafiyaa in both lines (misras). Thereafter the qaafiyaa is essential in the second misra of each sher. In the above ghazal, the first sher is the matla and the qaafiyaa are highlighted : bar, nazar, bhar, par, idhar          </p>
         
          <p className="text-lg mb-4">
          HarfZaar Qaafiya Search is an online tool which enables one to find similar sounding qaafiyaas for the given word. This is primarily meant for aspiring poets and can also be a reference for established poets.          </p> 
          </div>
        </div>


          {/* Rhyming Structure Table */}
          <div ref={rhymingTableRef} className="mt-12 p-6 rounded-lg">
          <h3 className="text-2xl text-white font-bold mb-4">Learn Harf-e-Ravi</h3>
          <p className="text-lg mb-4">
          HarfZaar Qaafiya Search presents search results based on Rhyming pattern called Ravi Pattern.         </p>
          <p className="text-lg mb-4">
          Search results of similar rhyming words will be broadly divided into categories based on the rhyming pattern of the searched word.          </p>
          <p className="text-lg mb-4">
            1.EXACT  2.CLOSE  3.OPEN
          </p>

    
          <div  className="overflow-x-auto">
          <table className="w-full text-left border-collapse mt-4">
        <thead>
          <tr className="bg-gradient-to-r from-gray-700 to-purple-900 text-white">
            <th className="border bg-purple-500 px-4 py-2 font-semibold">Example</th>
            <th className="border bg-purple-500 px-4 py-2 font-semibold">Rhyming Pattern</th>
            <th className="border bg-purple-500 px-4 py-2 font-semibold">Qaafiyaas</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-pink-50 text-black">
            <td rowSpan={3} className="border border-pink-300 px-4 py-2 font-bold">Veerani</td>
            <td className="border border-pink-300 px-4 py-2">EXACT</td>
            <td className="border border-pink-300 px-4 py-2">raat kii raani (ending with – iiranii)</td>
          </tr>
          <tr className="bg-white text-black">
            <td className="border border-pink-300 px-4 py-2">CLOSE</td>
            <td className="border border-pink-300 px-4 py-2">faanii, saanii (ending with – aanii)</td>
          </tr>
          <tr className="bg-pink-50 text-black">
            <td className="border border-pink-300 px-4 py-2">OPEN</td>
            <td className="border border-pink-300 px-4 py-2">maahii, chaa.ndii, Galatii (ending with – ii)</td>
          </tr>
        </tbody>
      </table>
      <p className="text-lg mb-4 p-2">The selection set of qaafiya for a Ghazal is linked with the first sher of the Ghazal, i.e. matla. The type of qaafiya (exact, close, open) used in the matla should be used in the rest of the shayari.</p>
           <p className="mt-2 font-semibold p-2">→ Example of the Exact Qaafiya is given below...</p> 
           <table className="w-full text-left border-collapse">
  <thead>
    <tr className="bbg-gradient-to-r from-gray-700 to-purple-900 text-white">
      <th className="border bg-purple-500 px-4 py-2 font-semibold">Matla</th>
      <th className="border bg-purple-500 px-4 py-2 font-semibold">Qaafiyaas</th>
    </tr>
  </thead>
  <tbody>
    <tr className="bg-pink-50 text-black">
      <td className="border border-pink-300 px-4 py-2">
        <em>ko.ii din gar <span className="text-red-500">zindagaanii</span> aur hai<br />
          apne jii me.n ham ne <span className="text-red-500">Thaanii</span> aur hai</em>
      </td>
      <td className="border border-pink-300 px-4 py-2">zabani, asmani, Thani, zindagani</td>
    </tr>
  </tbody>
</table>

<p className="mt-4">This sher uses --yaa sounding qaafiyas. Hence, the rest of the Ghazal should use qaafiya pattern like the above example...</p>

<p className="mt-2 font-semibold">→ Example of the Close Qaafiya is given below...</p>

<table className="w-full text-left border-collapse mt-2">
  <thead>
    <tr className="bg-gradient-to-r from-gray-700 to-purple-900 text-white">
      <th className="border bg-purple-500 px-4 py-2 font-semibold">Matla</th>
      <th className="bborder bg-purple-500 px-4 py-2 font-semibold">Qaafiyaas</th>
    </tr>
  </thead>
  <tbody>
    <tr className="bg-pink-50 text-black">
      <td className="border border-pink-300 px-4 py-2">
        <em>aa.ina samne <span className="text-red-500">rakhoge</span> to yaad aa.u.ngaa<br />
          apni zulfon ko <span className="text-red-500">sanwaroge</span> to yaad aaunga</em>
      </td>
      <td className="border border-pink-300 px-4 py-2">KHaridoge, chaahoge, baiThoge, bhigoge, nikaloge, guzroge</td>
    </tr>
  </tbody>
</table>
<p className="mt-4">This sher uses --yaa sounding qaafiyas. Hence, the rest of the Ghazal should use qaafiya pattern like the above example...</p>

<p className="mt-2 font-semibold">→ Example of the Open Qaafiya is given below...</p>

<table className="w-full text-left border-collapse mt-2">
  <thead>
    <tr className="bg-gradient-to-r from-gray-700 to-purple-900 text-white">
      <th className="border bg-purple-500 px-4 py-2 font-semibold">Matla</th>
      <th className="border bg-purple-500 px-4 py-2 font-semibold">Qaafiyaas</th>
    </tr>
  </thead>
  <tbody>
    <tr className="bg-pink-50 text-black">
      <td className="border border-pink-300 px-4 py-2">
        <em>aadmii <span className="text-red-500">aadmii</span> se miltaa hai<br />
          dil magar kam <span className="text-red-500">kisii</span> se miltaa hai</em>
      </td>
      <td className="border border-pink-300 px-4 py-2">Saadgii, hansii, KHush-qaamatii, be-KHuudii, ham-saaegii</td>
    </tr>
  </tbody>
</table>

<p className="mt-4">This sher uses --oge sounding qaafiyas. Hence, the rest of the Ghazal should use qaafiya pattern like above example...</p>

<p className="mt-2">If the matla is not written first, then the poet should take care that the above rules are followed for the matla based on the qaafiyas used in other shers.</p>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QaafiyaSection;