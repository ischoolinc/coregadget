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

  //尚無資料 提示字
  const [informationText, setText] = useState("");

  useEffect(() => {
    GetChildList();
    console.log('1.5studentID', studentID);
    GetPsychologicalTestData();
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
            //debugger;
            setChildList(convertToArray(response.Student));
            // console.log('response.Student[0].id', convertToArray(response.Student)[0].id);
            // console.log('1studentID', studentID);

            if (studentID === "") {
              //debugger;
              setStudent(convertToArray(response.Student)[0].id);
              // console.log('2studentID', studentID);
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
          setText("請選擇學生。");
          return 'err';
        } else {
          if (response) {
            if (isEmpty(response)) {
              setPsychologicalTestData([])
              setText("尚無資料。");
            }
            else {
              setText("");
              setPsychologicalTestData(convertToArray(response.Quiz));
            }
          }
        }
      }
    });
  }


  const handleChangeChild = (e) => {
    setStudent(e.target.value);
  }

  //將回傳的Object轉成Array
  function convertToArray(obj) {
    if (obj instanceof Array) {
      return obj;
    } else {
      return [obj];
    }
  }

  function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }


  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">
        <div className='d-flex align-items-center'>
          <div style={{ width: '5px', height: '32px', background: '#74A94F' }}></div>
          <div className='ms-2 me-4'>心理測驗</div>
          {childDateRange.map((child) => {
            if (child.id === studentID)
              return <button type="button" className="btn btn-outline-green active me-2" key={child.id} value={child.id} onClick={(e) => { handleChangeChild(e); }}>{child.name}</button>
            else
              return <button type="button" className="btn btn-outline-green me-2" key={child.id} value={child.id} onClick={(e) => { handleChangeChild(e); }}>{child.name}</button>
          })}
        </div>

        {/* 兩欄的排版 */}
        {/* <div class="accordion row align-items-start mt-1" id="accordionPanel">
          <div className='col-12 col-lg-6 px-0 mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '0px' }}>
              <h2 class="accordion-header" id="item1">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel1" aria-expanded="false" aria-controls="panel1">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel1" class="accordion-collapse collapse" aria-labelledby="item1">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>First</th>
                        <th className='w-50'>Last</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>機械推理百分等級</td>
                        <td>20</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 px-0 mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '0px' }}>
              <h2 class="accordion-header" id="item2">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel2" aria-expanded="false" aria-controls="panel2">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel2" class="accordion-collapse collapse" aria-labelledby="item2">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>First</th>
                        <th className='w-50'>Last</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Mark</td>
                        <td>@mdo</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 px-0 mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '0px' }}>
              <h2 class="accordion-header" id="item3">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel3" aria-expanded="false" aria-controls="panel3">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel3" class="accordion-collapse collapse" aria-labelledby="item3">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>First</th>
                        <th className='w-50'>Last</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Mark</td>
                        <td>@mdo</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div> */}


        <div className="accordion align-items-start mt-1" id="accordionPanel">
          {/* 尚無資料 提示字。 */}
          <div className="mt-4">
            {informationText}
          </div>

          {psychologicalTestData.map((pst) => {
            return <div className='mt-3'>
              <div className="accordion-item mx-2" style={{ borderRadius: '5px' }}>
                <h2 className="accordion-header" id={'item' + pst.Uid}>
                  <button className="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target={'#panel' + pst.Uid} aria-expanded="false" aria-controls={'panel' + pst.Uid}>
                    <div>
                      <div>測驗名稱：<span>{pst.QuizName}</span></div>
                      <div className='my-2'>實施日期：<span>{pst.ImplementationDate}</span></div>
                      <div>解析日期：<span>{pst.AnalysisDate}</span></div>
                    </div>
                  </button>
                </h2>
                <div id={'panel' + pst.Uid} class="accordion-collapse collapse" aria-labelledby={'item' + pst.Uid}>
                  <div className="accordion-body py-0">
                    <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                    <table className="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                      <thead>
                        <tr style={{ background: '#A8D18D' }}>
                          <th className='w-50'>項目名稱</th>
                          <th className='w-50'>施測結果</th>
                        </tr>
                      </thead>
                      <tbody style={{ borderTop: '4px solid #fff' }}>
                        {pst.Field.map((quiz) => {
                          return <tr style={{ background: '#E2F0D9' }}>
                            <td>{quiz.Name}</td>
                            <td>{quiz.Value}</td>
                          </tr>
                        })}
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
            </div>

          })}


          {/* 一欄往下長的版面 */}
          {/* <div className='mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '5px' }}>
              <h2 class="accordion-header" id="item1">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel1" aria-expanded="false" aria-controls="panel1">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel1" class="accordion-collapse collapse" aria-labelledby="item1">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>項目名稱</th>
                        <th className='w-50'>施測結果</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>機械推理百分等級</td>
                        <td>20</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div> 
           <div className='mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '5px' }}>
              <h2 class="accordion-header" id="item2">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel2" aria-expanded="false" aria-controls="panel2">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel2" class="accordion-collapse collapse" aria-labelledby="item2">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>First</th>
                        <th className='w-50'>Last</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Mark</td>
                        <td>@mdo</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            <div class="accordion-item mx-2" style={{ borderRadius: '5px' }}>
              <h2 class="accordion-header" id="item3">
                <button class="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target="#panel3" aria-expanded="false" aria-controls="panel3">
                  <div>
                    <div>測驗名稱：<span>基本人格量表</span></div>
                    <div className='my-2'>實施日期：</div>
                    <div>解析日期：</div>
                  </div>
                </button>
              </h2>
              <div id="panel3" class="accordion-collapse collapse" aria-labelledby="item3">
                <div class="accordion-body py-0">
                  <hr className='my-0' style={{ height: '5px', color: '#a5cc93' }}></hr>

                  <table class="table table-bordered mt-3" style={{ border: '1px solid #fff' }}>
                    <thead>
                      <tr style={{ background: '#A8D18D' }}>
                        <th className='w-50'>First</th>
                        <th className='w-50'>Last</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '4px solid #fff' }}>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Mark</td>
                        <td>@mdo</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Jacob</td>
                        <td>Thornton</td>
                      </tr>
                      <tr style={{ background: '#E2F0D9' }}>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div> */}


        </div>







      </div>

    </div>
  );
}

export default App;
