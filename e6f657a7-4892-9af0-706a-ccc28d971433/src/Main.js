import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
// import greenDown from './greenDown.png';
// import redUp from './redUp.png';
import greenDown from './down.png';
import redUp from './up.png';



export function ConvertStudentName(name) {
  const htmlText = `${name}`

  return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
}


function Main() {

  // 學生清單
  const [studentDateRange, setStudentList] = useState([]);

  //選擇的學生 //sessionStorage
  const [studentID, setStudent] = useState(sessionStorage.getItem('StudentID'));

  // 該學生的所有課程學年期
  const [courseSemesterRange, setCourseSemesterList] = useState([]);

  // 該學生的指定學年期的評量清單
  const [courseExamList, setCourseExamList] = useState([]);

  //系統學年期 
  const [currSemester, setCurrSemester] = useState("");

  //當前顯示學年期 //sessionStorage
  const [selectedSemester, setViewSemester] = useState(sessionStorage.getItem('Semester'));

  //當前顯示評量ID //sessionStorage
  const [selectedExam, setViewExam] = useState(sessionStorage.getItem('ExamID'));

  //當前顯示排名類別 //sessionStorage
  const [selectedRankType, setViewRankType] = useState(sessionStorage.getItem('RankType'));

  // 該學生的指定學年期、指定評量 之排名類別
  const [examRankType, setRankType] = useState([]);

  // 該校設定要顯示加權平均"分數"還是算術平均"分數" (desktop設定需要同時更新才可生效)
  const [avgSetting, setAvgSetting] = useState('加權平均');

  // 該校設定 不顯示排名(true:不顯示，false:顯示) ... 因為過去desktop選項是"不顯示排名"則值=true，所以比較拗口 (desktop設定需要同時更新才可生效)
  const [showNoRankSetting, setShowNoRankSetting] = useState(true);

  //取得 判斷加權平均、算術平均 的及格標準分數
  const [avgPassingStardard, setAvgPassingStardard] = useState(60);

  // 該學生的指定學年期、每次評量 之加權平均&算術平均
  const [examAvgList, setExamAvgList] = useState([]);


  // 計算該次評量的不及格科目數
  const [failedCount, setFailedCount] = useState(0);


  //******************* */
  // 該學生的指定學年期的課程成績
  const [courseExamScore, setCourseExamScore] = useState([]);

  // 該學生的指定學年期的課程成績 再加上 總計成績
  const [courseExamScorePlusAvg, setCourseExamScorePlusAvg] = useState([]);

  // 該學生的指定學年期的定期評量固定排名資料
  const [examRankMatrix, setRankMatrix] = useState([]);

  //******************* */

  const position = window.gadget.params.system_position;

  useEffect(() => {
    GetCurrentSemester();
    GetViewSetting();
    GetStudentList();
  }, []);


  useEffect(() => {
    GetCourseSemesterList();
  }, [studentID]);


  useEffect(() => {
    GetCourseExamList();
    GetAllExamScore();
    GetRankInfo()
    GetExamAvgScore();
    GetScoreCalcRulePassingStandard();
  }, [studentID, selectedSemester]);

  useEffect(() => {
    GetRankType();
  }, [selectedSemester, selectedExam]);


  useEffect(() => {
    OrganizeCourseExamScore();
  }, [courseExamScore]);


  useEffect(() => {
    CountFailedExamSubject();
  }, [selectedExam, selectedSemester, courseExamScore]);


  var _connection = window.gadget.getContract("1campus.h.exam.parent");

  if (position === 'student')
    _connection = window.gadget.getContract("1campus.h.exam.student");

  // 取得顯示 加權平均、算術平均 或不顯示排名 
  async function GetViewSetting() {
    await _connection.send({
      service: "_.GetViewSetting",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetViewSettingError', error);
          return 'err';
        } else {
          if (response) {
            let isShowRank = (response.Setting.show_no_rank.toLowerCase() === 'true')
            setShowNoRankSetting(isShowRank);
            setAvgSetting(response.Setting.show_score);
            // console.log('GetViewSetting', response.Setting);
            // console.log('isShowRank', isShowRank);
            // console.log('response.Setting.show_score', response.Setting.show_score);
            //debugger;
          }
        }
      }
    });
  }

  // 取得判斷加權平均、算術平均 的及格標準分數 
  async function GetScoreCalcRulePassingStandard() {
    await _connection.send({
      service: "_.GetScoreCalcRulePassingStandard",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetScoreCalcRulePassingStandardError', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.Rule || []).length) {
              if (response.Rule.passing_standard !== '')
                setAvgPassingStardard(response.Rule.passing_standard);
              //console.log('GetScoreCalcRulePassingStandard', response.Rule.passing_standard);
            }
          }
        }
      }
    });
  }

  // 取得 各評量 加權平均、算術平均  
  async function GetExamAvgScore() {
    await _connection.send({
      service: "_.GetExamAvgScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetExamAvgScore', error);
          return 'err';
        } else {
          if (response) {
            setExamAvgList(response.ExamAvg);
            //console.log('response.ExamAvg', response.ExamAvg);
          }
        }
      }
    });
  }

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
            else {
              var temp = false;
              [].concat(response.Student || []).forEach(element => {
                if (element.id === studentID) {
                  setStudent(studentID);
                  temp = true;
                }
              });
              if (!temp) {
                sessionStorage.clear();
                setStudent([].concat(response.Student || [])[0].id);
              }
            }
          }
        }
      }
    });
  }

  // 取得課程學年期清單
  async function GetCourseSemesterList() {
    await _connection.send({
      service: "_.GetAllCourseSemester",
      body: {
        StudentID: studentID
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllCourseSemesterError', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.CourseSemester || []).length) {
              setCourseSemesterList([].concat(response.CourseSemester || []));
              var tempSelectedSemester = selectedSemester;

              //1. 返回，保持原來的學年期
              //2. 從別的學生點過來，且課程中有一樣的學年期
              //3. 從別的學生點過來，且課程中沒有一樣的學年期>>系統學年期
              //4. 上述情況都不符合，填入最新的學年期
              var sameInCourse = false; //課程中有一樣的學年期
              var sameAsCurrency = false; //有一樣的系統學年期
              //if (selectedSemester) {
              [].concat(response.CourseSemester || []).forEach(element => {
                if (element.schoolyear + element.semester === currSemester) {
                  sameAsCurrency = true;
                }
                if (element.schoolyear + element.semester === selectedSemester) {
                  sameInCourse = true;
                }

              });

              //* 先填入最新的學年期
              setViewSemester([].concat(response.CourseSemester || [])[0].schoolyear + [].concat(response.CourseSemester || [])[0].semester);

              // 再根據檢查結果填入學年期
              if (sessionStorage.getItem('IsBack')) {
                setViewSemester(tempSelectedSemester);
                //sessionStorage.removeItem('IsBack');
                sessionStorage.clear();
              }
              else if (sameInCourse)
                setViewSemester(tempSelectedSemester);
              else if (sameAsCurrency) {
                setViewSemester(currSemester);
                sessionStorage.clear();
              }

            }
            else {
              setViewSemester('');
              setCourseSemesterList([]);
            }
          }
        }
      }
    });
  }

  // 取得系統學年期
  async function GetCurrentSemester() {
    await _connection.send({
      service: "_.GetCurrentSemester",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetCurrentSemesterError', error);
          return 'err';
        } else {
          if (response) {
            setCurrSemester(response.CurrentSemester.schoolyear + response.CurrentSemester.semester);

            // if (selectedSemester === '' || selectedSemester === null) {
            //   setViewSemester(response.CurrentSemester.schoolyear + response.CurrentSemester.semester);
            // }

          }
        }
      }
    });
  }

  // 取得顯示學年期的評量清單
  async function GetCourseExamList() {
    await _connection.send({
      service: "_.GetCourseExamList",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setViewExam('0');
          console.log('GetCourseExamListError', error);
          return 'err';
        } else {
          if (response) {
            setCourseExamList([].concat(response.ExamList || []));
            if ([].concat(response.ExamList || []).length < 1 || selectedExam === null) {
              setViewExam('0');
              console.log('ASAselectedExam,',selectedExam)
            }
            if([].concat(response.ExamList || []).length || selectedExam === null){
              var temp = false;
              [].concat(response.ExamList || []).forEach(element => {
                if (element.exam_id === selectedExam) {
                  setViewExam(selectedExam);
                  temp = true;
                }
              });
              if (!temp) {
                setViewExam('0');
              }             
            }
          }
        }
      }
    });
  }

  // 取得指定學年期的排名類別
  async function GetRankType() {
    await _connection.send({
      service: "_.GetRankType",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester,
        ExamID: selectedExam
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetRankTypeError', error);
          setViewRankType('');
          return 'err';
        } else {
          if (response) {
            setRankType([].concat(response.RankType || []));
            if ([].concat(response.RankType || []).length) {
              if (selectedRankType === '' || selectedRankType === null)
                setViewRankType([].concat(response.RankType || [])[0].rank_type);
            }
          }
        }
      }
    });
  }

  //**************************** */

  //取得指定學年期的固定排名
  async function GetRankInfo() {
    await _connection.send({
      service: "_.GetRankInfo",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetRankInfo', error);
          return 'err';
        } else {
          if (response) {
            setRankMatrix([].concat(response.RankMatrix || []));
          }
        }
      }
    });
  }


  // 取得指定學年期的課程評量成績
  async function GetAllExamScore() {
    await _connection.send({
      service: "_.GetAllExamScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllExamScore', error);
          return 'err';
        } else {
          if (response) {
            setCourseExamScore([].concat(response.ExamScore || []));
          }
        }
      }
    });
  }

  //**************************** */

  const handleChangeStudent = (e) => {
    setStudent(e.target.value);
  }

  const handleChangeViewSemester = (e) => {
    setViewSemester(e.target.value);
  }

  const handleChangeViewExam = (e) => {
    setViewExam(e.target.value);
  }

  const handleShowRankDetail = (e) => {
    sessionStorage.clear();
    // 按下去的時候才存
    sessionStorage.setItem('StudentID', studentID);
    sessionStorage.setItem('ExamID', selectedExam);
    sessionStorage.setItem('RankType', selectedRankType);
    sessionStorage.setItem('CourseID', e.CourseID);
    sessionStorage.setItem('Semester', selectedSemester);
    sessionStorage.setItem('Subject', e.Subject);
    sessionStorage.setItem('PassingStandard', e.PassingStandard);

  };


  const handleChangeViewRank = (e) => {
    setViewRankType(e.target.value);
  };



  function OrganizeCourseExamScore() {
    //寫入加權平均or算術平均
    let courseExamScoreNewPlusSource = courseExamScore;
    let avgScoreArray = [];
    //debugger;
    if ([].concat(courseExamScoreNewPlusSource || []).length)
      if ([].concat(examAvgList || []).length) {
        //let obj = [];
        for (let avg of [].concat(examAvgList || [])) {
          let avgScoreObj = {
            'ExamID': avg.exam_id,
            'ExamName': avg.exam_name,
            'Score': (avgSetting === '加權平均' ? Math.round(avg.w_score * 100) / 100 : Math.round(avg.a_score * 100) / 100),
            'IsPass': ((avgSetting === '加權平均' ? Math.round(avg.w_score * 100) / 100 : Math.round(avg.a_score * 100) / 100) >= avgPassingStardard ? 't' : 'f'),
            'ToView': (avg.toview === 'f' ? avg.toview : 't'), // f 或 t
            'ToViewTime': avg.toviewtime
          }
          avgScoreArray.push(avgScoreObj);
          var subject = (avgSetting === '加權平均' ? avgSetting : '算術平均');
          var domain = '';
          var courseID = 0;
          var passingStandard = avgPassingStardard;
        }
        var dd1 = { CourseID: courseID, Domain: domain, Subject: subject, PassingStandard: passingStandard, Field: avgScoreArray };
        courseExamScoreNewPlusSource.push(dd1);
      }

    setCourseExamScorePlusAvg(courseExamScoreNewPlusSource);

  }

  // 處理 該評量 不及格科目數
  function CountFailedExamSubject() {
    let failCount = 0;
    if (Object.keys(courseExamScore).length)
      courseExamScore.forEach(ces => {
        [].concat(ces.Field || []).forEach(e => {
          if (selectedExam === e.ExamID) {
            if (e.IsPass === 'f' && ces.Subject !== avgSetting && e.Score !== '') {
              failCount++;
            }
          }
        });

      });
    setFailedCount(failCount);
  }

  // 手動重新整理/去別的頁面，將清除sessionStorage 
  window.onunload = function () {
    sessionStorage.clear();
  }

  //若有其中一科目是不開放查詢，則最後不會顯示 "不及格科目數"
  let isShowFailSubjectCount = true;

  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">

        <div className='titleBorder d-flex align-items-center'>
        {/* overlay={
            <Tooltip id={`tooltip-${placement}`}>
              Tooltip on <strong>{placement}</strong>.
            </Tooltip>
          } */}
          <div>
            <div className='ms-2 me-4 d-flex align-items-center fs-4'>評量成績</div>
            {position === 'student' ? '' :
              <div className='putLeft'>
                {studentDateRange.map((student) => {
                  if (student.id === studentID)
                  return <button type="button" className="btn btn-outline-blue active me-1 ms-1" id={student.id} key={student.id} value={student.id} onClick={(e) => { handleChangeStudent(e); }} >{ConvertStudentName(student.name)}</button>
                  else
                  return <button type="button" className="btn btn-outline-blue me-1 ms-1" id={student.id} key={student.id} value={student.id} onClick={(e) => { handleChangeStudent(e); }}>{ConvertStudentName(student.name)}</button>
                })}
              </div>
            }
          </div>

        </div>

        
        {/* <div className="d-flex col-12 col-md-6 col-lg-6 m-2">
          <select className="form-select me-3" value={selectedSemester} onChange={(e) => handleChangeViewSemester(e)} >
            <option value="Y" key="Y">(選擇學年度學期)</option>
            {courseSemesterRange.map((courseSemester, index) => {
              return <option key={index} value={courseSemester.schoolyear + courseSemester.semester}>
                {courseSemester.schoolyear}學年度第{courseSemester.semester}學期</option>
            })}
          </select>

          <select className="form-select" value={selectedExam} onChange={(e) => handleChangeViewExam(e)}>
            <option value="0" key="Y">總覽</option>
            {courseExamList.map((examList, index) => {
              return <option key={index} value={examList.exam_id}>
                {examList.exam_name}</option>
            })}
          </select>
        </div> */}




        <div className='row align-items-center my-1'>
          <div className='col-12 col-md-3 col-lg-3 ms-1 p-2 me-2'>
            <select className="form-select" value={selectedSemester} onChange={(e) => handleChangeViewSemester(e)} >
              <option value="Y" key="Y">(選擇學年度學期)</option>
              {courseSemesterRange.map((courseSemester, index) => {
                return <option key={index} value={courseSemester.schoolyear + courseSemester.semester}>
                  {courseSemester.schoolyear}學年度第{courseSemester.semester}學期</option>
              })}
            </select>
          </div>
          <div className='col-12 col-md-3 col-lg-3 ms-1 p-2'>
            <select className="form-select" value={selectedExam} onChange={(e) => handleChangeViewExam(e)}>
              <option value="0" key="Y">總覽</option>
              {courseExamList.map((examList, index) => {
                return <option key={index} value={examList.exam_id}>
                  {examList.exam_name}</option>
              })}
            </select>
          </div>

        </div>



        {selectedExam === '0' || selectedExam === null || showNoRankSetting ? '' :
          <div className='d-flex align-items-center mb-3 col-12 col-md-6 col-lg-6'>
            <div className="col-2 col-md-4 col-lg-2">排名類別</div>
            <div className="col-10 col-md-8 col-lg-10 mx-2">
              <select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>

                {[].concat(examRankType || []).length < 1 ? <option value="Y" key="Y">(尚無排名資料)</option> : <option value="Y" key="Y">(選擇排名類別)</option>}

                {/* <option value="Y" key="Y">(選擇排名類別)</option> */}

                {examRankType.map((rankType, index) => {
                  return <option key={index} value={rankType.rank_type}>
                    {rankType.rank_type}</option>
                })}
              </select>
            </div>
          </div>}

        <div>{[].concat(courseExamScorePlusAvg || []).length < 1 ? '尚無資料。' : ''}</div>

        <div className="row row-cols-1 row-cols-md-2 g-4 ">

          {courseExamScorePlusAvg.map((ces) => {
            return <>
              {[].concat(ces.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let scoreColor = 'fs-4 me-0 pe-0';
                  let show = '/RankDetail';
                  let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';
                  if (cField.IsPass === 'f') {
                    roundColor = '#FF0000';
                    passColor = 'card card-unpass h-100';
                    scoreColor = 'fs-4 text-danger me-0 pe-0';
                  }
                  if (cField.ToView === 'f' || ces.Subject === avgSetting) {
                    roundColor = '#5B9BD5';
                    passColor = 'card h-100';
                    if (cField.ToView === 'f') {
                      disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                      show = null;
                      isShowFailSubjectCount = false;
                    }
                  }

                  if ([].concat(examRankType || []).length < 1) {
                    show = null;
                    disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                  }

                  if (cField.Score === '') {
                    roundColor = '#5B9BD5';
                    scoreColor = 'fs-4 me-0 pe-0';
                    passColor = 'card h-100';
                  }
                  let im = 0;
                  let previousExamID = selectedExam;
                  if (index !== 0) {
                    im = index - 1;
                    previousExamID = ces.Field[im].ExamID;
                  }
                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      <Link className={disabledCursor} to={show} onClick={() => { handleShowRankDetail(ces); }}>
                        <div className='d-flex'>
                          <div className='d-flex me-auto p-2 align-items-center'>
                            {ces.Subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}
                            {/* <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div> */}
                            <div className='fs-4 fw-bold'>{ces.Domain === "" ? "" : ces.Domain + "-"}{ces.Subject}</div>
                          </div>
                          <div className='d-flex p-2' >
                            <div>{ces.Subject === avgSetting ? '' : '權數'}</div><div>{ces.Credit}</div>
                          </div>
                        </div>

                        <div className='row align-items-center'>

                          {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> :
                            <div className='col-6 col-md-6 col-lg-6 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={scoreColor}>{cField.Score === '' ? '-' : cField.Score}</div>
                                    <div className='me-0 pe-0'>分數</div>
                                  </div>

                                  <div>{index === 0 || cField.ToView === 'f' || cField.Score === '' || ces.Field[im].Score === '' ? '' : Number(ces.Field[index].Score) > Number(ces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].Score) < Number(ces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>
                          }

                          {examRankMatrix.map((rank, index) => {
                            if (cField.ToView === 't')
                              if (rank.ItemName === ces.Subject) {
                                let previousExamRank = '0';
                                return <>
                                  {[].concat(rank.Field || []).map((rField, index) => {

                                    if (rField.RankType === selectedRankType && rField.ExamID === previousExamID)
                                      previousExamRank = rField.Rank;

                                    if (rField.RankType === selectedRankType && rField.ExamID === selectedExam && !showNoRankSetting)
                                      return <>
                                        <div className='col-6 col-md-6 col-lg-6 my-2'>
                                          <div className='d-flex justify-content-center'>
                                            <div className='row align-self-center'>
                                              <div className='fs-4 pe-0 me-0'>{rField.Rank}</div>
                                              <div className='pe-0 me-0'>名次</div>
                                            </div>

                                            <div>{previousExamRank === '0' || previousExamID === '' || rField.Rank === '' || previousExamRank === '' ? '' : Number(rField.Rank) > Number(previousExamRank) ? <img className='arrow' src={greenDown} alt='↓' /> : Number(rField.Rank) === Number(previousExamRank) ? '' : <img className='arrow' src={redUp} alt='↑' />}</div>
                                          </div>
                                        </div>
                                        <div className='col-6 col-md-6 col-lg-6 my-2'>
                                          <div className='row align-self-center'>
                                            <div className='d-flex justify-content-center'>
                                              <div className='fs-4'>{rField.PR}</div>
                                            </div>
                                            <div>PR</div>
                                          </div>
                                        </div>

                                        <div className='col-6 col-md-6 col-lg-6 my-2'>
                                          <div className='row align-self-center'>
                                            <div className='d-flex justify-content-center'>
                                              <div className='fs-4'>{rField.Percentile}</div>
                                            </div>
                                            <div>百分比</div>
                                          </div>
                                        </div>
                                      </>
                                  })}

                                </>
                              }
                          })}


                        </div>


                      </Link>
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}





          {/* {總覽} */}

          {courseExamScorePlusAvg.map((nces) => {

            if (selectedExam === '0') {
              return <div className="col">
                <div className={nces.Subject === avgSetting ? 'card h-100' : 'card card-pass h-100'}>
                  <div className="card-body">
                    <div className="card-block">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {nces.Subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: '#8FAADC' }}></div>}

                          <div className='fs-4 fw-bold'>{nces.Domain === "" ? "" : nces.Domain + "-"}{nces.Subject}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>{nces.Subject === avgSetting ? '' : '權數'}</div><div>{nces.Credit}</div>
                        </div>
                      </div>

                      {/* <div className='d-flex justify-content-around'> */}{/* 一排版面:取消註解 */}
                      <div className='row align-items-center'>{/* 一排版面:註解 */}

                        {[].concat(nces.Field || []).map((nField, index) => {
                          let scoreColor = 'fs-4';
                          if (nField.IsPass === 'f') {
                            scoreColor = 'fs-4 text-danger';
                          }
                          if (nField.ToView === 'f' || nField.Score === '') {
                            scoreColor = 'fs';
                          }

                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-6 col-md-6 col-lg-6'>{/* 一排版面:刪除 */}
                            <div className='row align-items-center m-2'>{/* 一排版面:m-2刪除 */}
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{nField.ToView === 't' ? nField.Score === '' ? '-' : nField.Score : <div className='text-unview'><div>開放查詢時間：</div><div>{nField.ToViewTime}</div></div>}
                                </div>
                                <div>{index === 0 || nField.ToView === 'f' || nField.Score === '' || nces.Field[im].Score === '' ? '' : Number(nces.Field[index].Score) > Number(nces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(nces.Field[index].Score) < Number(nces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>
                              </div>
                              <div>{nField.ExamName}</div>
                            </div>
                          </div>
                        })}
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            }
          })}


        </div>

        {!isShowFailSubjectCount || selectedExam === '0' || selectedExam === null ? "" : <div>
          <div className='d-flex justify-content-left'>
            <div>不及格科目數：</div><div>{failedCount}</div>
          </div>
          {/* 評分樣板不同，前次考試不一定來自同一個試別，先註解
          <div className='d-flex justify-content-left'>
             <div>進退步參考試別：</div><div>第一次</div>
          </div>*/}
        </div>}

      </div>

    </div>
  );
}

export default Main;



