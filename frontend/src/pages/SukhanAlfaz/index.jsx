import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
const feedbacks = {
  score0: [
    "کوئی مطابقت نہیں ملی، دوبارہ کوشش کریں!",
    "الفاظ شامل نہیں ہوئے، تھوڑی اور محنت کریں۔",
    "آپ کی تخلیق میں چیلنج کے الفاظ نہیں تھے۔",
    "لفظوں کی کمی محسوس ہوئی، دوبارہ آزمائیں۔",
    "الفاظ کا استعمال نہیں ہوا، شاعری میں اضافہ کریں۔",
    "حوصلہ نہ ہاریں، ابھی آغاز ہے!",
    "کچھ بہتر ہوسکتا ہے، دوبارہ لکھیے۔",
    "کچھ کمی رہ گئی ہے، دوبارہ کوشش کریں۔",
    "یہ آغاز ہے، بہتر ہونے کی امید رکھیں۔",
    "الفاظ کی کمی ہے، کوشش جاری رکھیں۔"
  ],
  score40: [
    "ایک لفظ شامل ہوا، اچھی شروعات ہے۔",
    "کچھ روشنی نظر آئی، مزید بہتری کی ضرورت ہے۔",
    "ایک لفظ درست، مزید محنت کریں۔",
    "آپ کا سفر شروع ہوچکا ہے، جاری رکھیں۔",
    "شاعری میں تھوڑی جان ڈالنے کی کوشش کی گئی ہے۔",
    "ایک قدم صحیح سمت میں ہے۔",
    "ایک لفظ صحیح، لیکن مزید شامل کریں۔",
    "کچھ تو خاص ہے، مگر کچھ کم بھی ہے۔",
    "پہلا لفظ مل گیا، باقی کا انتظار ہے۔",
    "آپ نے آغاز کر لیا ہے، واہ!"
  ],
  score40to60: [
    "دو الفاظ کا خوب استعمال، مزا آیا!",
    "آپ کے اشعار میں روانی ہے، مزید جوش لائیں۔",
    "شاعری میں جان آ رہی ہے، بس کچھ اور چمک کی کمی ہے۔",
    "دو میں سے دو! زبردست!",
    "بس ایک لفظ رہ گیا، خوبصورت کوشش۔",
    "آپ کے الفاظ بولتے ہیں، مزید حوصلہ افزائی کریں۔",
    "شاعری میں مہارت نظر آ رہی ہے۔",
    "خیال عمدہ ہے، تھوڑا اور نکھاریں۔",
    "بس ایک قدم اور، آپ قریب ہیں۔",
    "شاعری میں خوبصورتی جھلک رہی ہے۔"
  ],
  score60plus: [
    "تینوں الفاظ خوبصورتی سے باندھے گئے ہیں۔",
    "تعلق، جمالیات اور الفاظ کا چناؤ سب بہترین ہے۔",
    "کیا ہی خوبصورت ہم آہنگی ہے! واہ واہ!",
    "شاعری میں نرمی اور گہرائی دونوں نمایاں ہیں۔",
    "الفاظ کا بہاؤ دل کو چھو گیا۔",
    "شعر مکمل اور خوشگوار اثر رکھتا ہے۔",
    "آپ کی تخلیق نے دل جیت لیا۔",
    "شاعری میں توازن اور حسن کی جھلک ہے۔",
    "الفاظ میں احساس اور ربط دونوں ہیں۔",
    "ایسی تخلیق واقعی داد کے قابل ہے!"
  ]
  
};

const SukhanAlfaz = () => {
  const [words, setWords] = useState([]);
  const [couplet, setCouplet] = useState('');
  const [matchCount, setMatchCount] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const fetchWords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sukhan');
      setWords(res.data.words);
      setCouplet('');
      setMatchCount(null);
      setSubmitted(false);
      setScore(null);
      setFeedback('');
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const coupletNormalized = couplet.replace(/\s/g, '').trim();
    let count = 0;

    words.forEach(word => {
      if (coupletNormalized.includes(word)) {
        count += 1;
      }
    });

    setMatchCount(count);
    setSubmitted(true);

    let newScore = 0;
    if (count === 1) newScore = 40;
    else if (count === 2) newScore = 60;
    else if (count === 3) newScore = Math.floor(Math.random() * 31) + 60; // 60–90
    else newScore = 0;

    setScore(newScore);

    let feedbackText = '';
    if (newScore === 0) {
      feedbackText = randomFromArray(feedbacks.score0);
    } else if (newScore === 40) {
      feedbackText = randomFromArray(feedbacks.score40);
    } else if (newScore > 40 && newScore <= 60) {
      feedbackText = randomFromArray(feedbacks.score40to60);
    } else if (newScore > 60) {
      feedbackText = randomFromArray(feedbacks.score60plus);
    }

    setFeedback(feedbackText);
  };

  const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const getScoreText = () => {
    if (matchCount === null) return '';
    return `  ${matchCount} ${matchCount !== 1 ? '' : ''}. Score: ${score}%`;
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
        <h2 className="text-3xl font-bold text-center text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Create Poetry On Words
        </h2>

        {/* Words Display */}
        <div className="mb-8 text-center">
          <h3 className="text-lg font-semibold text-purple-200 mb-4">Your Words:</h3>
          <ul className="flex flex-wrap justify-center gap-4 font-urdu text-2xl text-white">
            {words.map((word, index) => (
              <li 
                key={index}
                className="px-4 py-2 bg-purple-900/30 rounded-full border border-purple-400/30"
              >
                {word}
              </li>
            ))}
          </ul>
        </div>

        {/* Poetry Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={couplet}
            onChange={(e) => setCouplet(e.target.value)}
            placeholder="اپنا اردو شعر یہاں لکھیں..."
            className="w-full font-urdu p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right text-xl"
            rows={5}
            required
          />

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
          >
            Submit
          </button>
        </form>

        {/* Results Section */}
        {submitted && (
          <div className="mt-10 text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {/* Score Display */}
            <div className="mb-6">
              <p className="text-2xl font-bold text-white mb-2">
                {matchCount} word{matchCount !== 1 ? 's' : ''} matched
              </p>
              <p className="text-4xl font-bold text-white mb-4">
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
                {feedback}
              </p>
            </div>

            {/* Play Again Button */}
            <button
              onClick={fetchWords}
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

export default SukhanAlfaz;