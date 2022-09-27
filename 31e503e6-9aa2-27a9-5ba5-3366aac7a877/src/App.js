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
            console.log('childDateRange', childDateRange);
            //debugger;
            console.log('response.Student', response.Student);
            if (studentID === "") {
              setStudent(response.Student[0].id);
              console.log('1.studentID', studentID);
            }

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


  const handleChangeChild = (e) => {
    setStudent(e.target.value);
    console.log('e.target.value', e.target.value);
    console.log('e.studentID', studentID);
  }

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
      <div className="container px-3 px-sm-4 py-5 ">
        <div className='d-flex align-items-center'>
          <div style={{ width: '5px', height: '32px', background: '#74A94F' }}></div>
          <div className='ms-2 me-4'>心理測驗</div>
          {childDateRange.map((child) => {
            return <button type="button" className="btn btn-outline-green me-2" key={child.id} value={child.id} onClick={(e) => { handleChangeChild(e); }}>{child.name}</button>
          })}
          <button type="button" className="btn btn-outline-green active me-2">作用中</button>
          <button type="button" className="btn btn-outline-green">吳二寶</button>
        </div>


        {/* <div className='fs-24 fw-600 color-32 me-3'>缺曠統計</div>
        <i className="collapse-close fa fa-chevron-down fs-20 me-3 color-1"
          aria-hidden="true"></i> a123123
        <i className="collapse-open fa fa-chevron-up fs-20 me-3 color-1"
          aria-hidden="true"></i> b123123



        <div class="accordion" id="accordionPanelsStayOpenExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                測驗名稱<br />
                實施日期<br />
                解析日期
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <div class="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                Accordion Item #2
              </button>
            </h2>
            <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
              <div class="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>



        </div> */}










      </div>

    </div>
  );
}

export default App;
