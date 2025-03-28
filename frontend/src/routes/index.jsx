import Login from '@/components/auth/login';
import Landing from '@/pages/Landing';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';



const Routing = () => {
  return (
    <Router>
      <Routes>

        {/* Auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Landing />} />
      </Routes>
    </Router>
  );
};

export default Routing;
