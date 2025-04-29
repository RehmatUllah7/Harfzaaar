import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaMicrophone, FaStop, FaSearch, FaVolumeUp } from "react-icons/fa";
import { RiVoiceprintFill } from "react-icons/ri";

const VoiceSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const navigate = useNavigate();

  // Speech Recognition hook
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support voice recognition.");
      return;
    }

    // Start listening on page load
    SpeechRecognition.startListening({ continuous: true, language: "ur-PK" });
    setIsListening(true);

    // Update the search query based on the transcript
    setSearchQuery(transcript);

    // Simulate audio level changes for visual feedback
    const audioInterval = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 100));
    }, 200);

    return () => clearInterval(audioInterval);
  }, [transcript, browserSupportsSpeechRecognition]);

  const stopVoiceSearch = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setIsListening(false);
    setAudioLevel(0);
  };

  const startVoiceSearch = () => {
    SpeechRecognition.startListening({ continuous: true, language: "ur-PK" });
    setIsListening(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please speak your search query first");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/10"
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <RiVoiceprintFill />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
            Voice Search
          </h1>
          <p className="text-purple-200">Speak your search query in Urdu</p>
        </motion.div>

        {/* Voice visualization */}
        <motion.div 
          className="relative flex justify-center mb-12 h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute w-32 h-32 rounded-full bg-purple-900/30 border-2 border-purple-500/30 flex items-center justify-center">
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaMicrophone className="text-4xl text-purple-300" />
              </motion.div>
            ) : (
              <FaMicrophone className="text-4xl text-purple-300/50" />
            )}
          </div>

          {/* Audio level visualization */}
          {isListening && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-purple-300/20"
                  style={{
                    width: `${60 + i * 20}px`,
                    height: `${60 + i * 20}px`,
                  }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1 + (audioLevel / 100) * 0.2],
                  }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Search query display */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaVolumeUp className="text-purple-300" />
            <h3 className="text-sm font-medium text-purple-200">Your Query</h3>
          </div>
          {searchQuery ? (
            <motion.p 
              className="text-xl font-urdu text-right text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={searchQuery}
            >
              {searchQuery}
            </motion.p>
          ) : (
            <motion.p 
              className="text-gray-400 italic"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isListening ? "Listening for your voice..." : "Press start to begin listening"}
            </motion.p>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isListening ? (
            <button
              onClick={stopVoiceSearch}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full shadow-lg transition-all"
            >
              <FaStop />
              Stop Listening
            </button>
          ) : (
            <button
              onClick={startVoiceSearch}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg transition-all"
            >
              <FaMicrophone />
              Start Listening
            </button>
          )}

          <button
            onClick={handleSearch}
            disabled={!searchQuery}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all ${
              searchQuery
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaSearch />
            Search Now
          </button>
        </motion.div>

        {/* Help text */}
        <motion.div 
          className="text-center mt-8 text-sm text-purple-300/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Speak clearly in Urdu after pressing "Start Listening"</p>
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceSearch;