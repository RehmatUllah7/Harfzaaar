import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HarfZaarLogin from './components/auth/login';
import HarfZaarRegister from './components/signup';
import HarfZaarResetPassword from './components/forgetpass';
import Header from './components/home/Header';
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
import Poets from "./pages/Poets";
import PoetDetail from "./pages/PoetDetail";
import ResetOptions from './components/forgetpass/resetoptions';
import ContinueViaPassword from './components/forgetpass/ContinueViaPassword';
import BecomePoet from './pages/BecomePoet';
import Bazm from './pages/Bazm';

import ImageSearchPage from './pages/ImageSearch';
import { ImageSearchProvider } from '../src/context/ImageSearchContext'; // import context   
import SearchResults from './pages/SearchResults';
import VoiceSearch from './pages/VoiceSearch';
import ChatbotPage from './pages/ChatbotPage';

function App() {
  return (
    <div className="">
      {/*  Add Toaster at global level */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            zIndex: 9999,
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
          },
        }}
      />
      <ImageSearchProvider>
      <BrowserRouter>
      <SplashScreen> 
        <Routes>
       ``
          
          {/* Default Route */}
          <Route path="/" element={<HarfZaarLogin />} />
          
          {/* Signup Route */}
          <Route path="/signup" element={<HarfZaarRegister />} />
          <Route path='/reset' element={<HarfZaarResetPassword/>}/>
          <Route path="/resetoptions" element={<ResetOptions />} />
          <Route path="viapassword" element={<ContinueViaPassword />} />
          <Route path='/home' element={<Home/>}/>

          <Route path="/poets" element={<Poets />} />
          <Route path="/poets/:poetName" element={<PoetDetail />} />

          <Route path='/news' element={<News/>}/>
          <Route path='/qaafia' element={<Qaafia/>}/>
         
          <Route path="/search" element={<SearchResults />} />

           {/* Quiz Landing Page */}
        <Route path="/quiz" element={<QuizLandingPage />} />

               {/* Quiz Questions Page */}
          <Route path="/quizpages" element={<QuizPage />} />

                 {/* Quiz Results Page */}
           <Route path="/quizresults" element={<ResultPage />} />
           <Route path='/becomepoet' element={<BecomePoet />} />
           <Route path='/bazm' element={<Bazm />} />
        

         <Route path="/is" element={<ImageSearchPage />} />
         <Route path="/voicesearch" element={<VoiceSearch />} />
        </Routes>
        <ChatbotButton />
        <Routes>
        <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
        </SplashScreen>
      </BrowserRouter>
      </ImageSearchProvider>  
    </div>
  );
}

export default App;
