import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
//import RankDetail from './RankDetail';
import Main from './Main';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/RankDetail" element={<RankDetail />} /> */}
      </Routes>
    </div>
  );
}

export default App;


