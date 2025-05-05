import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
const fuzzyMatch = (a, b) => {
  if (!a || !b) return false;
  a = a.trim().toLowerCase();
  b = b.trim().toLowerCase();
  if (a === b) return true;
  const distance = levenshteinDistance(a, b);
  const threshold = Math.floor(Math.max(a.length, b.length) * 0.3);
  return distance <= threshold;
};

const levenshteinDistance = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
};

// Feedback arrays
const feedbacks = {
  0: [
    "ہر عظیم شاعر نے صفر سے آغاز کیا۔",
    "حوصلہ رکھیں، یہ سفر کا پہلا قدم ہے۔",
    "لکھتے رہیے، آپ کی شاعری نکھرے گی۔",
    "کامیابی کی کنجی کوشش ہے، جاری رکھیں۔",
    "آپ کے الفاظ میں جذبہ ہے، بس تھوڑا اور نکھار لائیں۔",
    "ہر شعر ہمیں کچھ سکھاتا ہے، یہ بھی سیکھنے کا لمحہ ہے۔",
    "عظمت کی شروعات ہمیشہ سادہ ہوتی ہے۔",
    "یہ صرف آغاز ہے، آگے بڑھتے جائیں۔",
    "شاعری دل سے نکلتی ہے، دل سے لکھتے رہیں۔",
    "یہ کوشش قابلِ تحسین ہے، ہمت نہ ہاریں۔"
  ],
  40: [
    "آپ نے اچھی کوشش کی ہے، شاباش!",
    "ایک قدم قریب تر، بہت عمدہ!",
    "بہتر کی طرف سفر جاری رکھیں۔",
    "شاعری نکھر رہی ہے، جاری رکھیں۔",
    "آپ کا انداز نرالا ہے، مشق کرتے رہیں۔",
    "قافیہ میں بہتری آئی ہے، مبارک ہو!",
    "الفاظ میں روانی محسوس ہو رہی ہے۔",
    "آپ کی نظم میں روشنی ہے۔",
    "محنت نظر آ رہی ہے، بہت خوب!",
    "اچھا آغاز ہے، اب مزید نکھار لائیں۔"
  ],
  60: [
    "تلازمہ اچھا ہے، جمالیات مزید اچھی کریں۔",
    "جمالیات عمدہ ہیں، تلازمہ مزید اچھا ہو سکتا ہے۔",
    "روانی ہے، الفاظ اور اچھے تراشے جا سکتے ہیں۔",
    "خوبصورتی سے تراشا ہے، تلازمہ مزید بہتر ہو سکتا ہے۔",
    "اشعار میں نرمی ہے، لیکن جمالیاتی پہلو مضبوط کریں۔",
    "بہتر نظم ہے، مگر قافیے کی مطابقت بڑھائی جا سکتی ہے۔",
    "تشبیہات عمدہ ہیں، تھوڑا اور نکھار لائیں۔",
    "روانی اور توازن ہے، اب تھوڑی جدت بھی دکھائیں۔",
    "خیال عمدہ ہے، مگر الفاظ کی چمک بڑھائیں۔",
    "اچھی کوشش ہے، مزید مشق سے کمال آ جائے گا۔"
  ],
  
  high: [
    "تلازمہ بہت اچھا ہے، جمالیات بھی بہت اچھی ہیں۔",
    "بہت عمدہ تراشا ہے، خوبصورت بھی۔",
    "جمالیاتی حسن اور فکری ربط دونوں کمال کے ہیں۔",
    "تراکیب خوب ہیں، اور روانی لاجواب۔",
    "الفاظ چنے بھی خوب اور باندھے بھی کمال۔",
    "شعر مکمل اور مؤثر انداز میں تراشا گیا ہے۔",
    "تلازمہ اور جمالیات کا خوبصورت امتزاج ہے۔",
    "خیال اور بیان دونوں متاثر کن ہیں۔",
    "ردیف، قافیہ اور خیال سب نے مل کر اثر چھوڑا ہے۔",
    "ایسی گرہ واقعی دل کو چھو لینے والی ہوتی ہے۔"
  ]
  
};

const getFeedback = (score) => {
  if (score === 0) return randomItem(feedbacks[0]);
  if (score === 40) return randomItem(feedbacks[40]);
  if (score === 60) return randomItem(feedbacks[60]);
  if (score > 60) return randomItem(feedbacks.high);
  return "Keep writing!";
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const Girah = () => {
  const [lineFromAPI, setLineFromAPI] = useState("");
  const [userInput, setUserInput] = useState("");
  const [matchCount, setMatchCount] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const fetchRandomLine = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/girah/girah");
      setLineFromAPI(res.data.line);
      setUserInput("");
      setMatchCount(null);
      setScore(null);
      setFeedback("");
      setShowResult(false);
    } catch (error) {
      console.error("Error fetching couplet line:", error);
    }
  };

  useEffect(() => {
    fetchRandomLine();
  }, []);

  const handleSubmit = () => {
    const userWords = userInput.trim().split(/\s+/);
    const apiWords = lineFromAPI.trim().split(/\s+/);

    const userLast3 = userWords.slice(-3);
    const apiLast3 = apiWords.slice(-3);

    let matches = 0;

    // Qaafia
    if (userLast3[0] && apiLast3[0]) {
      const userChar = userLast3[0].slice(-1);
      const apiChar = apiLast3[0].slice(-1);
      if (userChar === apiChar) matches++;
    }

    // Radiif
    for (let i = 1; i < 3; i++) {
      if (fuzzyMatch(userLast3[i], apiLast3[i])) matches++;
    }

    let calculatedScore = 0;
    if (matches === 1) calculatedScore = 40;
    else if (matches === 2) calculatedScore = 60;
    else if (matches === 3) calculatedScore = Math.floor(Math.random() * 31) + 60;
    else calculatedScore = 0;

    setMatchCount(matches);
    setScore(calculatedScore);
    setFeedback(getFeedback(calculatedScore));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden p-4 flex items-center justify-center">
      {/* Floating Ink Drops Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-900 opacity-10"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 120 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% / 60%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Constellation Stars */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center text-white hover:text-purple-300 transition-colors group"
      >
        <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Back</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Create Your Own Second Verse
        </h1>
        
        <p className="text-lg text-purple-200 mb-8 text-center">
          Hint: Take last 2 words as radiif and 3rd last as qaafia
        </p>

        <div className="mb-8 p-4 bg-purple-900/20 rounded-xl border border-purple-400/30">
          <p className="text-2xl font-urdu text-white text-center">"{lineFromAPI}"</p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full font-urdu py-5 px-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xl text-center leading-relaxed"
            placeholder="یہاں گرۃ لگائیں"
            required
          />

          <button 
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
          >
            Check
          </button>
        </div>

        {showResult && (
          <div className="mt-10 text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="mb-6">
              <p className="text-2xl font-bold text-white mb-2">
                Score: {score}%
              </p>
              
              {/* Animated Score Bar */}
              <div className="w-full h-4 bg-gray-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-8">
              <p className="text-xl font-urdu text-purple-100 leading-relaxed">
                "{feedback}"
              </p>
            </div>

            {/* Play Again Button */}
            <button
              onClick={fetchRandomLine}
              className="px-8 py-3 bg-white/10 hover:bg-purple-500 text-white rounded-xl border border-white/20 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.4; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default Girah;