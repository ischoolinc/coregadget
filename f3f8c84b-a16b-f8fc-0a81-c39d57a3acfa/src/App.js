import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import RankDetail from './RankDetail';
import RankDetailKH from './RankDetailKH';
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
          <Route path="/RankDetailKH" element={<RankDetailKH />} />
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;


