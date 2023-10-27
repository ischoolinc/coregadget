import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import RankDetail from './RankDetail';
import Main from './Main';
import { AppProvider } from './AppContext';

function App() {

  return (
    <div className="App">
      <AppProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/RankDetail" element={<RankDetail />} />
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;


