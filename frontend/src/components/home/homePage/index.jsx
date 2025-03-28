


import react from 'react';
import Header from '../Header';
import Slideimg from '../Slideimg';
import Footer from '@/components/home/footer';
const Home = () => {
    return (
      <div className="flex flex-col min-h-screen">
      <Header/>
      <Slideimg/>
      <Footer/>
      </div>
    );
  };
  
  export default Home;