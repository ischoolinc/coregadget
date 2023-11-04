import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import RankDetail from './RankDetail';
import CreditDetail from './CreditDetail';
import RankDetailImmediately from './RankDetailImmediately';
import Main from './Main';
import { AppProvider } from './AppContext';

function App() {

  return (
    <div className="App">
      {/* This is App.js Page. */}
      <AppProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/RankDetail" element={<RankDetail />} />
          <Route path="/CreditDetail" element={<CreditDetail />} />
          <Route path="/RankDetailImmediately" element={<RankDetailImmediately />} />
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;


