import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import HarfZaarLogin from './components/auth/login';
import HarfZaarRegister from './components/signup';
import HarfZaarResetPassword from './components/forgetpass';

import Qaafia from './components/home/qaafia';
import SplashScreen from './components/SplashScreen';
import { Toaster } from 'react-hot-toast';
import News from './components/home/news';
import ChatbotButton from './components/ChatbotButton';
import Slideimg from './components/home/Slideimg';
import Home from './components/home/homePage';
import QuizLandingPage from './pages/QuizLandingPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/quizResult';
import Poets from './pages/Poets';
import PoetDetail from './pages/PoetDetail';
import ResetOptions from './components/forgetpass/resetoptions';
import ContinueViaPassword from './components/forgetpass/ContinueViaPassword';
import BecomePoet from './pages/BecomePoet';
import Bazm from './pages/Bazm';
import ImageSearchPage from './pages/ImageSearch';
import { ImageSearchProvider } from './context/ImageSearchContext'; // simplified path
import SearchResults from './pages/SearchResults';
import VoiceSearch from './pages/VoiceSearch';
import ChatbotPage from './pages/ChatbotPage';
import BecomePoet2 from './pages/BecomePoet2';
import PoetDashboard from './pages/PoetDashBoard';
import FeedbackPage from './pages/FeedBack';
import AddNewsPage from './pages/AddNews';
import AddPoetry from './pages/AddPoetry';
import MyNewsPage from './pages/MyNews';
import MyPoetryPage from './pages/MyPoetry';
import SukhanAlfaz from './pages/SukhanAlfaz';
import Girah from './pages/Girah';
import PatternGame from './pages/PatternGame';
import LandingPage from './pages/HomePage';

function AppRoutes() {
  const location = useLocation();
  const hideChatbotOn = ['/', '/login', '/signup' , '/reset','/resetoptions' , '/viapassword'];

  return (
    <SplashScreen>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<HarfZaarLogin />} />
        <Route path='/signup' element={<HarfZaarRegister />} />
        <Route path='/reset' element={<HarfZaarResetPassword />} />
        <Route path='/resetoptions' element={<ResetOptions />} />
        <Route path='/viapassword' element={<ContinueViaPassword />} />
        <Route path='/home' element={<Home />} />
        <Route path='/poets' element={<Poets />} />
        <Route path='/poets/:poetName' element={<PoetDetail />} />
        <Route path='/addnews' element={<AddNewsPage />} />
        <Route path='/news' element={<News />} />
        <Route path='/qaafia' element={<Qaafia />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/quiz' element={<QuizLandingPage />} />
        <Route path='/quizpages' element={<QuizPage />} />
        <Route path='/quizresults' element={<ResultPage />} />
        <Route path='/becomepoet' element={<BecomePoet />} />
        <Route path='/becomepoet2' element={<BecomePoet2 />} />
        <Route path='/bazm' element={<Bazm />} />
        <Route path='/feedback' element={<FeedbackPage />} />
        <Route path='/is' element={<ImageSearchPage />} />
        <Route path='/voicesearch' element={<VoiceSearch />} />
        <Route path='/poetdashboard' element={<PoetDashboard />} />
        <Route path='/addpoetry' element={<AddPoetry />} />
        <Route path='/mynews' element={<MyNewsPage />} />
        <Route path='/mypoetry' element={<MyPoetryPage />} />
        <Route path='/sukhanalfaz' element={<SukhanAlfaz />} />
        <Route path='/slideimg' element={<Slideimg />} />
        <Route path='/chatbot' element={<ChatbotPage />} />
        <Route path='/image-search' element={<ImageSearchPage />} />
        <Route path='/girah' element={<Girah />} />
        <Route path='/pattern' element={<PatternGame />} />
      </Routes>

      {/* Show chatbot except on login/signup/landing page */}
      {!hideChatbotOn.includes(location.pathname) && <ChatbotButton />}
    </SplashScreen>
  );
}

function App() {
  return (
    <div className=''>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 2000,
          style: {
            zIndex: 9999,
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
          },
        }}
      />
      <ImageSearchProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ImageSearchProvider>
    </div>
  );
}

export default App;
