import { useNavigate } from 'react-router-dom';
import {
  FaFeatherAlt, FaPhoneAlt, FaEnvelope,
  FaFacebook, FaInstagram, FaBars, FaTimes,
  FaTwitter, FaLinkedin, FaYoutube
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';
import bgImage from '../../assets/landing.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="text-white scroll-smooth bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm shadow-lg px-6 py-4 flex justify-between items-center transition-all duration-300 hover:bg-black/90">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => scrollTo('hero')}
        >
          <FaFeatherAlt className="text-purple-400 text-2xl animate-pulse" />
          <span className="font-bold font-urdu text-xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            حرف زاد
          </span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 font-medium items-center">
          <motion.button 
            whileHover={{ scale: 1.05, color: "#a78bfa" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('about')} 
            className="transition-colors duration-200"
          >
            About
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, color: "#a78bfa" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('why')} 
            className="transition-colors duration-200"
          >
            Why Us?
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, color: "#a78bfa" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('pathways')} 
            className="transition-colors duration-200"
          >
            For Poets
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, color: "#a78bfa" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('contact')} 
            className="transition-colors duration-200"
          >
            Contact
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, color: "#a78bfa" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')} 
            className="transition-colors duration-200"
          >
            Login
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')} 
            className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Sign Up
          </motion.button>
        </nav>

        {/* Mobile Menu Toggle */}
        <motion.div 
          className="md:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <FaTimes size={22} className="text-purple-400" />
            ) : (
              <FaBars size={22} className="text-purple-400" />
            )}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                height: "auto"
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                height: 0
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            className="absolute top-16 left-0 w-full bg-gradient-to-b from-purple-900/95 to-purple-800/95 px-6 py-4 flex flex-col gap-4 text-center backdrop-blur-md"
          >
            {['about', 'why', 'pathways', 'contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo(item)}
                className="py-2 text-gray-200 hover:text-white transition-colors duration-200 capitalize"
              >
                {item.replace('-', ' ')}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05, color: "#ffffff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="py-2 text-gray-200 hover:text-white transition-colors duration-200"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 mt-2"
            >
              Sign Up
            </motion.button>
          </motion.div>
        )}
      </header>

     <div
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 pt-24"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-black/70 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-2xl"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FaFeatherAlt className="text-5xl text-purple-400 mx-auto mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Harfzaad
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl font-urdu text-gray-300 mb-8"
          >
            کہ آتی ہے اردو زباں آتے آتے
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-lg font-medium"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('about')}
              className="border border-purple-400 px-6 py-3 rounded-lg hover:bg-purple-900/30 transition-all duration-300 text-lg font-medium"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Animated floating elements */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20 pointer-events-none"
            initial={{
              y: 0,
              x: Math.random() * 100 - 50,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0.3, 0],
              scale: [0.5, 1, 1.2]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5
            }}
            style={{
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px'
            }}
          />
        ))}
      </div>

      {/* About Section */}
      <section id="about" className="py-24 px-6 scroll-mt-24 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              About Harfzaad
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              A platform dedicated to preserving and promoting the rich poetic heritage of our culture while nurturing new voices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-purple-400 text-4xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                Harfzaad is a space to preserve, celebrate, and empower poetic voices from every region and dialect. 
                We uplift emerging talent, honor literary history, and use modern tools to make expression more powerful.
              </p>
            </motion.div>

            {/* Cultural Depth */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-purple-400 text-4xl mb-4">🏛️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Cultural Depth</h3>
              <p className="text-gray-300 leading-relaxed">
                Our region's poetic legacy spans centuries — from ghazals and nazms to modern expressions. 
                Harfzaad celebrates this continuum, preserving its soul and making it resonate with today's generation.
              </p>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-purple-400 text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Join a growing family of poets, mentors, readers, and language lovers contributing to a thriving, 
                respectful, and inclusive poetic ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-20 px-6 scroll-mt-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute border border-purple-500/20 rounded-full"
              style={{
                width: `${100 + Math.random() * 300}px`,
                height: `${100 + Math.random() * 300}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
              Why Harfzaad?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes our platform unique and why poets and poetry lovers choose us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-purple-900/40 to-purple-900/10 p-8 rounded-xl backdrop-blur-sm border border-purple-800/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">📖</div>
              <h3 className="text-xl font-semibold text-white mb-3">Preserve & Promote</h3>
              <p className="text-gray-300 leading-relaxed">
                Harfzaad safeguards poetic traditions, revives forgotten verses, and shines light on emerging voices in our diverse literary landscape.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-purple-900/40 to-purple-900/10 p-8 rounded-xl backdrop-blur-sm border border-purple-800/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Build Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Writers, readers, and mentors come together to exchange, support, and grow. Harfzaad is your digital mehfil.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-purple-900/40 to-purple-900/10 p-8 rounded-xl backdrop-blur-sm border border-purple-800/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">💡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Innovate Poetry</h3>
              <p className="text-gray-300 leading-relaxed">
                Use AI-powered Qaafia tools, collaborative writing features, and rich metadata to enrich your poetic journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pathways for Poets */}
      <section id="pathways" className="py-20 px-6 scroll-mt-24 bg-gradient-to-b from-black via-purple-900/10 to-black relative">
        {/* Animated floating elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-500/10 pointer-events-none"
            initial={{
              y: 0,
              x: 0,
              opacity: 0
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 0.3, 0.2, 0],
              scale: [0.5, 1, 1.2]
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 10
            }}
            style={{
              width: `${10 + Math.random() * 30}px`,
              height: `${10 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
              Pathways for Poets
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're an emerging poet or an established writer, we provide tools and opportunities to grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-pink-900/40 to-pink-900/10 p-8 rounded-xl backdrop-blur-sm border border-pink-800/50 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-pink-500/20"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">✍️</div>
              <h3 className="text-xl font-semibold text-white mb-3">Learn & Improve</h3>
              <p className="text-gray-300 leading-relaxed">
                Discover guides, writing prompts, and tools that help refine your poetic voice and structure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-pink-900/40 to-pink-900/10 p-8 rounded-xl backdrop-blur-sm border border-pink-800/50 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-pink-500/20"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">📢</div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Discovered</h3>
              <p className="text-gray-300 leading-relaxed">
                Be part of curated collections, gain recognition, and grow your following in a platform made for poets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-pink-900/40 to-pink-900/10 p-8 rounded-xl backdrop-blur-sm border border-pink-800/50 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-pink-500/20"
            >
              <div className="text-4xl mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">💰</div>
              <h3 className="text-xl font-semibold text-white mb-3">Earn & Thrive</h3>
              <p className="text-gray-300 leading-relaxed">
                Monetize your art through contests, community support, and direct patron contributions.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-lg font-medium"
            >
              Start Your Poetic Journey Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 scroll-mt-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute border border-purple-500/10 rounded-full"
              style={{
                width: `${200 + Math.random() * 200}px`,
                height: `${200 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Contact Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions or want to collaborate? Reach out to our team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-900/50 p-3 rounded-full">
                    <FaEnvelope className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">contact@harfzaad360.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-900/50 p-3 rounded-full">
                    <FaPhoneAlt className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">+92 300 1234567</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
              <p className="text-gray-300 mb-6">Stay connected with our community</p>
              <div className="flex gap-4">
                {[
                  { icon: <FaFacebook className="text-2xl" />, color: "bg-blue-600/20", hover: "hover:bg-blue-600/40" },
                  { icon: <FaInstagram className="text-2xl" />, color: "bg-pink-600/20", hover: "hover:bg-pink-600/40" },
                  { icon: <FaTwitter className="text-2xl" />, color: "bg-blue-400/20", hover: "hover:bg-blue-400/40" },
                  { icon: <FaLinkedin className="text-2xl" />, color: "bg-blue-700/20", hover: "hover:bg-blue-700/40" },
                  { icon: <FaYoutube className="text-2xl" />, color: "bg-red-600/20", hover: "hover:bg-red-600/40" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className={`${social.color} ${social.hover} p-3 rounded-full transition-all duration-300`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center items-center gap-2 mb-6">
            <FaFeatherAlt className="text-purple-300 text-2xl animate-pulse" />
            <span className="font-bold font-urdu text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              حرف زاد
            </span>
          </div>
          <p className="text-purple-100 mb-6">
            Where poetry lives forever. Join us in celebrating the art of words.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            {['about', 'why', 'pathways', 'contact'].map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollTo(item)}
                className="text-purple-200 hover:text-white transition-colors duration-200 capitalize text-sm"
              >
                {item.replace('-', ' ')}
              </motion.button>
            ))}
          </div>
          <p className="text-purple-200 text-sm">
            © {new Date().getFullYear()} Harfzaad. All rights reserved.
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default LandingPage;