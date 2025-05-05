import React from "react";
import { useNavigate } from "react-router-dom";
import PoetHeader from "@/components/PoetHeader";
import Footer from "@/components/home/footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";  
import axios from "axios";
const PoetDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
  
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUserName(res.data.username); // Adjust based on your API response
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
  
    fetchUser();
  }, []);
  
  const actions = [
    {
      title: "Manage Poetry",
      description: "Manage and share your poetic creations with the world",
      icon: "📖",
      handler: () => navigate("/mypoetry"),
      color: "bg-gradient-to-br from-violet-900 to-purple-800",
      border: "border-l-violet-400",
      delay: 0.1
    },
    {
      title: "News Management",
      description: "Create and share news articles with the community",
      icon: "📰",
      handler: () => navigate("/mynews"),
      color: "bg-gradient-to-br from-slate-800 to-blue-900",
      border: "border-l-blue-300",
      delay: 0.2
    },
    {
      title: "Sukhan Alfaz",
      description: "Create Poetry with unique words",
      icon: "🖋️",
      handler: () => navigate("/sukhanalfaz"),
      color: "bg-gradient-to-br from-rose-900 to-pink-600",
      border: "border-l-rose-300",
      delay: 0.3
    },
    {
      title: "Girah-Bandi",
      description: "Create intricate poetic patterns and explore the art of Girah-Bandi", 
      icon: "📚",
      handler: () => navigate("/girah"),
      color: "bg-gradient-to-br from-emerald-900 to-teal-800",
      border: "border-l-emerald-300",
      delay: 0.4
    },
    {
      title: "Pattern Game",
      description: "Challenge and enhance your poetic skills",
      icon: "🎲",
      handler: () => navigate("/pattern"),
      color: "bg-gradient-to-br from-amber-800 to-orange-800",
      border: "border-l-amber-300",
      delay: 0.5
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div 
        variants={floatingVariants}
        animate="float"
        className="absolute top-1/4 left-1/6 text-8xl opacity-10"
      >
        ✨
      </motion.div>
      <motion.div 
        variants={floatingVariants}
        animate="float"
        style={{ rotate: 180 }}
        className="absolute bottom-1/3 right-1/5 text-5xl opacity-10"
      >
        💫
      </motion.div>

      <PoetHeader />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-purple-900 rounded-full filter blur-3xl opacity-20"></div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 mb-6 relative z-10">
          Welcome To HarfZaar, {userName || "Poet" }
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto font-urdu relative z-10">
          سلیقے سے ہواؤں میں جو خوشبو گھول سکتے ہیں
          </p>
          <p className="text-xl p-4 text-purple-200 max-w-2xl mx-auto font-urdu relative z-10">
          ابھی کچھ لوگ باقی ہیں جو اردو بول سکتے ہیں
          </p>
          <div className="mt-8 flex justify-center relative z-10">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            ></motion.div>
          </div>
        </motion.div>

        {/* Action Items - Floating Orbs */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20"
        >
          {actions.map((action, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover="hover"
              custom={action.delay}
              className={`rounded-2xl overflow-hidden ${action.color} text-white relative group cursor-pointer h-64 flex flex-col items-center justify-center p-6 shadow-2xl`}
              onClick={action.handler}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  repeatType: "reverse" 
                }}
                className="text-5xl mb-4 w-20 h-20 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm"
              >
                {action.icon}
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 text-center">{action.title}</h2>
              <p className="opacity-80 text-center text-sm">{action.description}</p>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full font-medium hover:bg-white/20 transition border border-white/20 hover:border-white/40 flex items-center gap-2"
              >
                Explore
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Inspiration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm mb-20"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-16 h-16 rounded-full bg-purple-700/50 flex items-center justify-center mr-6 mb-4 md:mb-0"
              >
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-3xl"
                >
                  🖋️
                </motion.span>
              </motion.div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">Poetic Inspiration</h2>
                <p className="text-purple-300">Daily wisdom for the creative soul</p>
              </div>
            </div>
            
            <motion.blockquote 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl italic text-gray-300 mb-6 leading-relaxed border-l-4 border-purple-500 pl-6 py-2"
            >
              "Poetry is when an emotion has found its thought and the thought has found words."
            </motion.blockquote>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-purple-400 text-right"
            >
              — Robert Frost
            </motion.p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to begin your poetic journey?</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg"
            onClick={() => navigate("/addpoetry")}
          >
            Start Writing Now
          </motion.button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoetDashboard;