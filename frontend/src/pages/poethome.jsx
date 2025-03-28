


import react from 'react';
import PoetHeader from '@/components/home/PoetHeader';
import Slideimg from '@/components/home/Slideimg';
import Footer from '@/components/home/footer';
const PoetHome = () => {
    return (
      <div className="flex flex-col min-h-screen">
      <PoetHeader />
      <Slideimg/>
      <Footer/>
      </div>
    );
  };
  
  export default PoetHome;