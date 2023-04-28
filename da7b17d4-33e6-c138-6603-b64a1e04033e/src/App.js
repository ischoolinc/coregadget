import React, { useState, useEffect } from 'react';
import './App.css';
import { HiInformationCircle } from "react-icons/hi2";



function App() {

  // 學生清單
  const [studentDateRange, setStudentList] = useState([]);

  //選擇的學生 //sessionStorage
  const [studentID, setStudent] = useState('');

  // 學期歷程
  const [semesterList, setHistoryList] = useState([]);

  const allSemesters = [
    { name: "Semester1", title: "" },
    { name: "Semester2", title: "" },
    { name: "Semester3", title: "" },
    { name: "Semester4", title: "" },
    { name: "Semester5", title: "" },
    { name: "Semester6", title: "" }
  ];

  //整理學習歷程
  const updatedSemesters = semesterList.map((semester) => {
    const semesterIndex = allSemesters.findIndex((s) => s.name === semester.name);
    allSemesters[semesterIndex].title = semester.title;
    return allSemesters[semesterIndex];
  });


  // 學期成績
  const [scoreList, setScoreList] = useState([]);

  // 缺曠
  const [absenceList, setAbsenceList] = useState([]);

  // 獎懲
  const [disciplineList, setDisciplineList] = useState([]);

  // 成績畢業條件
  const [scoreCalcRule, setScoreCalcRule] = useState([]);

  // 學務畢業條件
  const [dailyCalcRule, setDailyCalcRule] = useState([]);

  // 等第對照表
  const [degreeList, setDegreeList] = useState([]);

  // 核可假別
  const [absenceAndPeriodsList, setAbsenceAndPeriods] = useState([]);


  const domainOrder = ['語文', '國語文', '英語', '本土語文', '數學', '社會', '自然科學', '自然與生活科技', '藝術', '藝術與人文', '健康與體育', '綜合活動', '科技'];

  const sortedScoreList = scoreList.sort((a, b) => {
    const aIndex = domainOrder.indexOf(a.Domain);
    const bIndex = domainOrder.indexOf(b.Domain);
    if (aIndex === -1 && bIndex === -1) {
      return 0;
    } else if (aIndex === -1) {
      return 1;
    } else if (bIndex === -1) {
      return -1;
    } else {
      return aIndex - bIndex;
    }
  });



  const position = window.gadget.params.system_position;

  var _connection = window.gadget.getContract("1campus.graduate.alarm.student");

  if (position === 'student')
    _connection = window.gadget.getContract("1campus.graduate.alarm.student");



  useEffect(() => {
    GetDegree();
    GetStudentList();
    GetHistory();
    GetSemesterScore();
    GetScoreCalcRule();
    GetDailyCalcRule();
    GetDiscipline();
    GetAbsence();
    GetAbsenceAndPeriods();
  }, []);


  // 取得學生清單
  async function GetStudentList() {
    await _connection.send({
      service: "_.GetStudentList",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetStudentListError', error);
          return 'err';
        } else {
          if (response) {
            setStudentList([].concat(response.Student || []));

            if (studentID === '' || studentID === null) {
              setStudent([].concat(response.Student || [])[0].id);
            }
          }
        }
      }
    });
  }

  // 取得學習歷程
  async function GetHistory() {
    await _connection.send({
      service: "_.GetHistory",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetHistoryError', error);
          return 'err';
        } else {
          if (response) {
            setHistoryList([].concat(response.response || []));
          }
        }
      }
    });
  }
  // 取得學期成績
  async function GetSemesterScore() {
    await _connection.send({
      service: "_.GetSemesterScore",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetSemesterScoreError', error);
          return 'err';
        } else {
          if (response) {
            setScoreList([].concat(response.response || []));
          }
        }
      }
    });
  }

  // 取得缺曠
  async function GetAbsence() {
    await _connection.send({
      service: "_.GetAbsence",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAbsence Error', error);
          return 'err';
        } else {
          if (response) {
            setAbsenceList([].concat(response.response || []));
            console.log('GetAbsence', [].concat(response.response || []));
          }
        }
      }
    });
  }

  // 取得獎懲
  async function GetDiscipline() {
    await _connection.send({
      service: "_.GetDiscipline",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetDiscipline Error', error);
          return 'err';
        } else {
          if (response) {
            setDisciplineList([].concat(response.response || []));
          }
        }
      }
    });
  }

  // 取得核可假別
  async function GetAbsenceAndPeriods() {
    await _connection.send({
      service: "_.GetAbsenceAndPeriods",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAbsenceAndPeriods Error', error);
          return 'err';
        } else {
          if (response) {
            setAbsenceAndPeriods([].concat(response.Rule || []));
            console.log('GetAbsenceAndPeriods', [].concat(response.Rule || []));
          }
        }
      }
    });
  }


  // 取得成績畢業條件
  async function GetScoreCalcRule() {
    await _connection.send({
      service: "_.GetScoreCalcRule",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetScoreCalcRule Error', error);
          return 'err';
        } else {
          if (response) {
            setScoreCalcRule([].concat(response.Rule || []));
          }
        }
      }
    });
  }

  // 取得學務畢業條件
  async function GetDailyCalcRule() {
    await _connection.send({
      service: "_.GetDailyCalcRule",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetDailyCalcRule Error', error);
          return 'err';
        } else {
          if (response) {
            setDailyCalcRule([].concat(response.Rule || []));
            console.log('學務畢業條件', [].concat(response.response || []));
          }
        }
      }
    });
  }

  // 取得等第對照表
  async function GetDegree() {
    await _connection.send({
      service: "_.GetDegree",
      body: {
        StudentID: studentID,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetDegree Error', error);
          return 'err';
        } else {
          if (response) {
            setDegreeList([].concat(response.Rule || []));
          }
        }
      }
    });
  }


  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">
        <div className='title_border mb-2'>
          <div className='ms-2 me-4 d-flex align-items-center fs-4'>畢業預警查詢</div>
        </div>

        <div className="accordion-item " style={{ borderRadius: '5px', border: '0px solid #8A6D3B' }}>
          <h2 className="accordion-header" id="00">
            <button className="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target='#panel00' aria-expanded="false" aria-controls='panel00'>
              <div className='d-center'><HiInformationCircle /> <div className='ms-1'>領域成績說明 </div></div>
            </button>
          </h2>
          <div id='panel00' className="accordion-collapse collapse" aria-labelledby='00'>
            <div className="accordion-body pt-0">
              <div >

                {[].concat(scoreCalcRule || []).map((scr) => (
                  <>
                    <div className='d-center'> {scr.type === 'LearnDomainEach' && scr.checked === 'True' ?
                      '◇ 每學期' + scr.學習領域 + '個學習領域達' + scr.degree + '等以上，符合畢業資格。' : ''}</div>

                    <div className='d-center'> {scr.type === 'LearnDomainLast' && scr.checked === 'True' ?
                      '◇ 第六學期有' + scr.學習領域 + '個學習領域達' + scr.degree + '等以上，符合畢業資格。' : ''}</div>

                    <div className='d-center'> {scr.type === 'GraduateDomain' && scr.checked === 'True' ?
                      '◇ 所有學習領域有' + scr.學習領域 + '大學習領域以上畢業總平均成績' + scr.degree + '等以上，符合畢業資格。' : ''}</div>

                  </>

                ))}
                <div className='d-center'>◇ 成績等第對照：</div>

                {[].concat(degreeList || []).map((de) => (
                  <div className='d-center text-sm ms-3'>{de.degree}：{de.less !== '' ? '<' + de.less : ''}{de.less && de.greater_or_equal ? '，' : ''}{de.greater_or_equal !== '' ? '≧' + de.greater_or_equal : ''}</div>
                ))}

              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="table-cell">
                  <div className='text-end' style={{ color: 'white' }}>學期</div>
                  <div className='text-start'>領域</div>
                </th>

                {[].concat(allSemesters || []).map((semester) => (
                  <th style={{ background: '#45A7AC', color: 'white' }}>{semester.title}</th>
                ))}
                <th style={{ background: '#45A7AC', color: 'white' }}>平均</th>
              </tr>
            </thead>
            <tbody>

              {[].concat(sortedScoreList || []).map((score) => (
                <tr>
                  <th style={{ background: '#7BD8DC' }}>{score.Domain}</th>
                  {[].concat(allSemesters || []).map((semester) => {
                    const matchedField = [].concat(score.Field || []).find((sf) => sf.SchoolYear + '-' + sf.Semester === semester.title);
                    return <td>{matchedField ? matchedField.Score : ''}</td>;
                  })}
                  <td>{score.Avg}</td>
                </tr>
              ))}



            </tbody>

          </table>
        </div>

        <div className="accordion-item " style={{ borderRadius: '5px', border: '0px solid #8A6D3B' }}>
          <h2 className="accordion-header" id="01">
            <button className="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target='#panel01' aria-expanded="false" aria-controls='panel01'>
              <div className='d-center'><HiInformationCircle /> <div className='ms-1'>懲戒標準說明 </div></div>
            </button>
          </h2>
          <div id='panel01' className="accordion-collapse collapse" aria-labelledby='01'>
            <div className="accordion-body pt-0">
              <div >

                {[].concat(dailyCalcRule || []).map((scr) => (
                  <>
                    <div className='d-center'> {scr.type === 'DemeritAmountEach' && scr.checked === 'True' ?
                      '◇ 每學期懲戒累積未超過' + scr.大過 + '大過，符合畢業資格。' : ''}{scr.type === 'DemeritAmountEach' && scr.checked === 'True' ? scr.功過相抵 === 'True' ? '（功過相抵後進行累計）' : '（僅以懲戒進行累計）' : ''}</div>

                    <div className='d-center'> {scr.type === 'DemeritAmountLast' && scr.checked === 'True' ?
                      '◇ 第六學期懲戒累積未超過' + scr.大過 + '大過，符合畢業資格。' : ''}{scr.type === 'DemeritAmountLast' && scr.checked === 'True' ? scr.功過相抵 === 'True' ? '（功過相抵後進行累計）' : '（僅以懲戒進行累計）' : ''}</div>

                    <div className='d-center'> {scr.type === 'DemeritAmountAll' && scr.checked === 'True' ?
                      '◇ 所有學期懲戒累積未超過' + scr.大過 + '大過，符合畢業資格。' : ''}{scr.type === 'DemeritAmountAll' && scr.checked === 'True' ? scr.功過相抵 === 'True' ? '（功過相抵後進行累計）' : '（僅以懲戒進行累計）' : ''}</div>

                  </>
                ))}

              </div>
            </div>
          </div>
        </div>


        <div className="overflow-x-auto mt-2">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="table-cell">
                  <div className='text-end' style={{ color: 'white' }}>學期</div>
                  <div className='text-start'>獎懲</div>
                </th>

                {[].concat(allSemesters || []).map((semester) => (
                  <th style={{ background: '#45A7AC', color: 'white' }}>{semester.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>



              <tr>
                <th style={{ background: '#7BD8DC' }}>大功</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.大功}</td>;
                  })
                ))}
              </tr>

              <tr>
                <th style={{ background: '#7BD8DC' }}>小功</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.小功}</td>;
                  })
                ))}
              </tr>
              <tr>
                <th style={{ background: '#7BD8DC' }}>嘉獎</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.嘉獎}</td>;
                  })
                ))}
              </tr>
              <tr>
                <th style={{ background: '#7BD8DC' }}>大過</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.大過}</td>;
                  })
                ))}
              </tr>
              <tr>
                <th style={{ background: '#7BD8DC' }}>小過</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.小過}</td>;
                  })
                ))}
              </tr>
              <tr>
                <th style={{ background: '#7BD8DC' }}>警告</th>
                {[].concat(allSemesters || []).map((semester) => (
                  [].concat(disciplineList || []).map((dis) => {
                    if (dis.school_year + '-' + dis.semester === semester.title)
                      return <td>{dis.警告}</td>;
                  })
                ))}
              </tr>



            </tbody>

          </table>
        </div>


        <div className="accordion-item " style={{ borderRadius: '5px', border: '0px solid #8A6D3B' }}>
          <h2 className="accordion-header" id="02">
            <button className="accordion-button align-items-end" type="button" data-bs-toggle="collapse" data-bs-target='#panel02' aria-expanded="false" aria-controls='panel02'>
              <div className='d-center'><HiInformationCircle /> <div className='ms-1'>缺曠標準說明 </div></div>
            </button>
          </h2>
          <div id='panel02' className="accordion-collapse collapse" aria-labelledby='02'>
            <div className="accordion-body pt-0">
              <div >

                {[].concat(dailyCalcRule || []).map((scr) => (
                  <>
                    <div className='d-center'> {scr.type === 'AbsenceAmountEach' && scr.checked === 'True' ?
                      '◇ 每學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '）' : ''}</div>

                    <div className='d-center'> {scr.type === 'AbsenceAmountLast' && scr.checked === 'True' ?
                      '◇ 第六學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '）' : ''}</div>

                    <div className='d-center'> {scr.type === 'AbsenceAmountAll' && scr.checked === 'True' ?
                      '◇ 所有學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '）' : ''}</div>


                    <div className='d-center'> {scr.type === 'AbsenceAmountEachFraction' && scr.checked === 'True' ?
                      '◇ 每學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '、每日節數：' + scr.每日節數 + '）' : ''}</div>


                    <div className='d-center'> {scr.type === 'AbsenceAmountLastFraction' && scr.checked === 'True' ?
                      '◇ 第六學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '、每日節數：' + scr.每日節數 + '）' : ''}</div>

                    <div className='d-center'> {scr.type === 'AbsenceAmountAllFraction' && scr.checked === 'True' ?
                      '◇ 所有學期缺課節數合計未超過' + scr.節數 + '節，符合畢業資格。（核可假別：' + scr.假別 + '、每日節數：' + scr.每日節數 + '）' : ''}</div>





                  </>
                ))}

              </div>
            </div>
          </div>
        </div>


        <div className="overflow-x-auto mt-2">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="table-cell">
                  <div className='text-end' style={{ color: 'white' }}>學期</div>
                  <div className='text-start'>假別</div>
                </th>

                {[].concat(allSemesters || []).map((semester) => (
                  <th style={{ background: '#45A7AC', color: 'white' }}>{semester.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>


              {[].concat(absenceList || []).map((abs) => (
                absenceAndPeriodsList.includes(abs.Name) ?
                  <tr>
                    <th style={{ background: '#7BD8DC' }}>{abs.Name}（節）</th>
                    {[].concat(allSemesters || []).map((semester) => {
                      const matchedField = [].concat(abs.Field || []).find((a) => a.SchoolYear + '-' + a.Semester === semester.title);
                      return <td>{matchedField ? matchedField.Sum : '0'}</td>;
                    })}
                  </tr> : null
              ))}

            </tbody>

          </table>
        </div>



      </div>
    </div>

  );
}

export default App;
