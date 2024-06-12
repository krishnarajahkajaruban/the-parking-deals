import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

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
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
