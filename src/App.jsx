import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';

import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/bootstrap4-light-purple/theme.css";

function App() {
  const value = {
    ripple: true,
  };
  return (
    <PrimeReactProvider value={value}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
