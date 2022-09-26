import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // 小孩清單
  const [childDateRange, setChildList] = useState([]);

  //選擇的小孩
  const [studentID, setStudent] = useState("");

  // 心理測驗內容
  const [psychologicalTestData, setPsychologicalTestData] = useState([]);

  useEffect(() => {
    debugger;
    GetChildList();
    console.log('1.5.studentID', studentID);
    GetPsychologicalTestData();
    console.log('2.5.studentID', studentID);
  }, [studentID]);


  var _connection = window.gadget.getContract("1campus.counsel.parent");

  // 取得小孩清單
  async function GetChildList() {
    await _connection.send({
      service: "_.GetChildList",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetChildListerr', error);
          return 'err';
        } else {
          if (response) {
            setChildList(response.Student);
            //debugger;
            console.log('response.Student', response.Student);
            setStudent(response.Student[0].id);
            console.log('1.studentID', studentID);
            
          }
        }
      }
    });
  }

  // 取得心理測驗內容
  async function GetPsychologicalTestData() {
    await _connection.send({
      service: "_.GetPsychologicalTestData",
      body: `<Request><StudentID>${studentID}</StudentID></Request>`,
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetPsychologicalTestDataErr', error);
          console.log('studentIDErr', studentID);
          return 'err';
        } else {
          if (response) {
            console.log('2.studentID', studentID);
            setPsychologicalTestData(response);
            console.log('PsychologicalResponse', response);

          }
        }
      }
    });
  }


  // const handleChangeChild = (e) => {
  //   setStudent(e.target.value);
  // }
  
  //將回傳的Object轉成Array
  function convertToArray(obj) {
    if (obj instanceof Array) {
      return obj;
    } else {
      return [obj];
    }
  }

  return (
    <div className="App">
      <header className="App-header">









        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
