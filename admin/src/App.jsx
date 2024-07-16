import React from "react";
import { Route, Routes } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard/Dashboard";

import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";


function App() {
  const value = {
    ripple: true,
  };
  return (
    <PrimeReactProvider value={value}>
      <Routes>
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </PrimeReactProvider>

  );
}

export default App;
