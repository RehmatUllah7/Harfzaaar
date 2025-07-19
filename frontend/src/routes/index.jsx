import Login from '@/components/auth/login';
import LandingPage from '@/pages/HomePage';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const Routing = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default Routing;
