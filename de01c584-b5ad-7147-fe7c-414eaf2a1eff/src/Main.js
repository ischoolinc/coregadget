import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
// import greenDown from './greenDown.png';
// import redUp from './redUp.png';
import greenDown from './down.png';
import redUp from './up.png';

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

  //當前顯示 科目成績 or 領域成績 //sessionStorage
  const [selectedSubjectType, setSubjectType] = useState(Number(sessionStorage.getItem('SelectedSubjectType')));

  //當前顯示 定期&平時 or 定期+平時 //sessionStorage
  //const [selectedScoreType, setScoreType] = useState(0);

  //當前顯示排名類別 //sessionStorage
  //const [selectedRankType, setViewRankType] = useState(sessionStorage.getItem('RankType'));

  // 該學生的指定學年期、指定評量 之排名類別
  //const [examRankType, setRankType] = useState([]);

  // 該校設定要顯示加權平均"分數"還是算術平均"分數" (desktop設定需要同時更新才可生效)
  // 處理如果兩個都是false，則設為加權平均。
  const [avgSetting, setAvgSetting] = useState('加權平均');

  // 該校設定 不顯示排名(true:不顯示，false:顯示) 
  // 國中一律不顯示排名
  const [showNoRankSetting, setShowNoRankSetting] = useState(true);

  //取得 及格標準分數 --- 國中一律為60
  const [avgPassingStardard, setAvgPassingStardard] = useState(60);

  // 該學生的指定學年期、每次評量 之加權平均&算術平均
  //const [examAvgList, setExamAvgList] = useState([]);


  // 計算該次評量的不及格科目數
  //const [failedCount, setFailedCount] = useState(0);


  //******************* */
  // 該學生的指定學年期的課程 科目成績
  const [courseSubjectExamScore, setCourseSubjectExamScore] = useState([]);

  // 該學生的指定學年期的課程 領域成績
  const [courseDomainScore, setCourseDomainExamScore] = useState([]);

  // 該學生的指定學年期的 "加權/算術"平均 固定排名及分數
  const [examAvgRankMatrix, setAvgRankMatrix] = useState([]);

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
    GetAllSubjectExamScore();
    GetAllDomainExamScore();
    //GetRankInfo()
    //GetExamAvgScore();
    //GetScoreCalcRulePassingStandard();
    GetRankAvgScore();
  }, [studentID, selectedSemester]);

  // useEffect(() => {
  //   //GetRankType();
  // }, [selectedSemester, selectedExam]);


  // useEffect(() => {
  //   OrganizeCourseExamScore();
  // }, [courseSubjectExamScore]);


  // useEffect(() => {
  //   //CountFailedExamSubject();
  // }, [selectedExam, selectedSemester, courseExamScore]);


  var _connection = window.gadget.getContract("1campus.j.exam.parent");

  if (position === 'student')
    _connection = window.gadget.getContract("1campus.j.exam.student");

  // 取得顯示 加權平均、算術平均
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
            // let isShowRank = (response.Setting.show_no_rank.toLowerCase() === 'true')
            // setShowNoRankSetting(isShowRank);
            setAvgSetting(response.Setting.show_score);
          }
        }
      }
    });
  }

  // 取得判斷加權平均、算術平均 的及格標準分數 
  async function GetScoreCalcRulePassingStandard() {
    // await _connection.send({
    //   service: "_.GetScoreCalcRulePassingStandard",
    //   body: {
    //     StudentID: studentID,
    //     ViewSemester: selectedSemester
    //   },
    //   result: function (response, error, http) {
    //     if (error !== null) {
    //       console.log('GetScoreCalcRulePassingStandardError', error);
    //       return 'err';
    //     } else {
    //       if (response) {
    //         if ([].concat(response.Rule || []).length) {
    //           if (response.Rule.passing_standard !== '')
    //             setAvgPassingStardard(response.Rule.passing_standard);
    //           //console.log('GetScoreCalcRulePassingStandard', response.Rule.passing_standard);
    //         }
    //       }
    //     }
    //   }
    // });
  }

  // 取得 各評量 加權平均、算術平均  
  async function GetExamAvgScore() {
    // await _connection.send({
    //   service: "_.GetExamAvgScore",
    //   body: {
    //     StudentID: studentID,
    //     ViewSemester: selectedSemester
    //   },
    //   result: function (response, error, http) {
    //     if (error !== null) {
    //       console.log('GetExamAvgScore', error);
    //       return 'err';
    //     } else {
    //       if (response) {
    //         setExamAvgList(response.ExamAvg);
    //         //console.log('response.ExamAvg', response.ExamAvg);
    //       }
    //     }
    //   }
    // });
  }

  // 取得 各評量固定排名之 加權平均、算術平均  
  async function GetRankAvgScore() {
    await _connection.send({
      service: "_.GetRankAvgScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetRankAvgScoreError', error);
          return 'err';
        } else {
          if (response) {
            setAvgRankMatrix([].concat(response.RankAvg || []));
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
              console.log('ASAselectedExam,', selectedExam)
            }
            if ([].concat(response.ExamList || []).length || selectedExam === null) {
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
    // await _connection.send({
    //   service: "_.GetRankType",
    //   body: {
    //     StudentID: studentID,
    //     ViewSemester: selectedSemester,
    //     ExamID: selectedExam
    //   },
    //   result: function (response, error, http) {
    //     if (error !== null) {
    //       console.log('GetRankTypeError', error);
    //       setViewRankType('');
    //       return 'err';
    //     } else {
    //       if (response) {
    //         setRankType([].concat(response.RankType || []));
    //         if ([].concat(response.RankType || []).length) {
    //           if (selectedRankType === '' || selectedRankType === null)
    //             setViewRankType([].concat(response.RankType || [])[0].rank_type);
    //         }
    //       }
    //     }
    //   }
    // });
  }

  //取得指定學年期的固定排名
  async function GetRankInfo() {
    // await _connection.send({
    //   service: "_.GetRankInfo",
    //   body: {
    //     StudentID: studentID,
    //     ViewSemester: selectedSemester
    //   },
    //   result: function (response, error, http) {
    //     if (error !== null) {
    //       console.log('GetRankInfo', error);
    //       return 'err';
    //     } else {
    //       if (response) {
    //         setRankMatrix([].concat(response.RankMatrix || []));
    //       }
    //     }
    //   }
    // });
  }


  // 取得指定學年期的課程 科目 定期評量 & 平時評量 & 定期+平時(固定排名) 成績
  async function GetAllSubjectExamScore() {
    await _connection.send({
      service: "_.GetAllSubjectExamScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllSubjectExamScoreError', error);
          return 'err';
        } else {
          if (response) {
            setCourseSubjectExamScore([].concat(response.ExamScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 領域 定期評量(固定排名) & 定期+平時(固定排名) 成績
  async function GetAllDomainExamScore() {
    await _connection.send({
      service: "_.GetAllDomainExamScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllDomainExamScoreError', error);
          return 'err';
        } else {
          if (response) {
            setCourseDomainExamScore([].concat(response.DomainScore || []));
          }
        }
      }
    });
  }




  const handleChangeStudent = (studentID) => {
    setStudent(studentID);
  }

  const handleChangeViewSemester = (e) => {
    setViewSemester(e.target.value);
  }

  const handleChangeViewExam = (e) => {
    setViewExam(e.target.value);
  }

  // const handleChangeScoreType = (e) => {
  //   setScoreType(e.target.value);
  // }

  const handleSubjectType = (e) => {
    setSubjectType(Number(e.target.value));
  }

  const handleShowRankDetail = (e) => {
    var subject = e.Subject;
    var courseID = e.CourseID;
    var subjectType = 'subject';

    if (!e.Subject && !e.Domain){

      subject = e.ItemName;
      subjectType = 'avg';
    }

    if (!e.Subject && !e.ItemName){
      subjectType = 'domain';
      subject = e.Domain;
    }

    if (!e.CourseID)
      courseID = 0;

    sessionStorage.clear();
    // 按下去的時候才存
    sessionStorage.setItem('StudentID', studentID);
    sessionStorage.setItem('ExamID', selectedExam);
    //sessionStorage.setItem('RankType', selectedRankType);
    sessionStorage.setItem('CourseID', courseID);
    sessionStorage.setItem('Semester', selectedSemester);
    sessionStorage.setItem('Subject', subject);
    //sessionStorage.setItem('PassingStandard', e.PassingStandard);
    sessionStorage.setItem('SubjectType', subjectType); 
    sessionStorage.setItem('SelectedSubjectType', selectedSubjectType);
  };


  // const handleChangeViewRank = (e) => {
  //   setViewRankType(e.target.value);
  // };


  function ConvertStudentName(name) {
    const htmlText = `${name}`

    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  }

  // 手動重新整理/去別的頁面，將清除sessionStorage 
  window.onunload = function () {
    sessionStorage.clear();
  }

  //若有其中一科目是不開放查詢，則最後不會顯示 "不及格科目數"
  //let isShowFailSubjectCount = true;

  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">

        <div className='titleBorder d-flex align-items-center'>
          <div>
            <div className='ms-2 me-4 d-flex align-items-center fs-4'>評量成績</div>
            {position === 'student' ? '' :
              <div className='putLeft'>
                {studentDateRange.map((student) => {
                  if (student.id === studentID)
                    return <button type="button" className="btn btn-outline-blue active me-1 ms-1 mt-1" id={student.id} key={student.id} value={student.id} onClick={() => { handleChangeStudent(student.id); }} >{ConvertStudentName(student.name)}</button>
                  else
                    return <button type="button" className="btn btn-outline-blue me-1 ms-1 mt-1" id={student.id} key={student.id} value={student.id} onClick={() => { handleChangeStudent(student.id); }}>{ConvertStudentName(student.name)}</button>
                })}
              </div>
            }
          </div>
        </div>


        <div className='row align-items-center my-1'>
          <div className='col-12 col-md-4 col-lg-3 py-2'>
            <select className="form-select" value={selectedSemester} onChange={(e) => handleChangeViewSemester(e)} >
              <option value="Y" key="Y">(選擇學年度學期)</option>
              {courseSemesterRange.map((courseSemester, index) => {
                return <option key={index} value={courseSemester.schoolyear + courseSemester.semester}>
                  {courseSemester.schoolyear}學年度第{courseSemester.semester}學期</option>
              })}
            </select>
          </div>
          <div className='col-12 col-md-4 col-lg-3 py-2'>
            <select className="form-select" value={selectedExam} onChange={(e) => handleChangeViewExam(e)}>
              <option value="0" key="Y">總覽</option>
              {courseExamList.map((examList, index) => {
                return <option key={index} value={examList.exam_id}>
                  {examList.exam_name}</option>
              })}
            </select>
          </div>

          {/* 總覽只顯示 科目成績_定期 ， 故不給選科目or領域*/}
          {selectedExam === '0' ? '' :
            <div className='col-12 col-md-4 col-lg-3 py-2'>
              <select className="form-select" value={selectedSubjectType} onChange={(e) => handleSubjectType(e)}>
                <option value={0} key={0}>科目成績</option>
                <option value={1} key={1}>領域成績</option>
              </select>
            </div>}

          {/* <div className='col-12 col-md-6 col-lg-3 py-2'>
            <select className="form-select" value={selectedScoreType} onChange={(e) => handleChangeScoreType(e)} >
              <option value={0} key={0}>定期 與 平時</option>
              <option value={1} key={1}>定期 加 平時</option>
            </select>
          </div> */}

          {/* {selectedExam === '0' || selectedExam === null || showNoRankSetting ? '' :
          <div className='d-flex align-items-center mb-3 col-12 col-md-6 col-lg-6 py-2'>
            <div className="col-2 col-md-4 col-lg-2">排名類別</div>
            <div className="col-10 col-md-8 col-lg-10 ps-1">
              <select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>

                {[].concat(examRankType || []).length < 1 ? <option value="Y" key="Y">(尚無排名資料)</option> : <option value="Y" key="Y">(選擇排名類別)</option>}

                {examRankType.map((rankType, index) => {
                  return <option key={index} value={rankType.rank_type}>
                    {rankType.rank_type}</option>
                })}
              </select>
            </div>
          </div>} */}

        </div>


        <div>{[].concat(courseSubjectExamScore || []).length < 1 ? '尚無成績資料。' : ''}</div>
        <div>{selectedSubjectType === 1 && [].concat(examAvgRankMatrix || []).length < 1 ? '尚無資料。' : ''}</div>

        {/* <div className="row row-cols-1 row-cols-md-2 g-4 "> */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 "> {/* 三排 */}
        
          {/* 評量> 科目成績 */}
          {selectedSubjectType === 0 ? <>          {courseSubjectExamScore.map((ces) => {
            return <>
              {[].concat(ces.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  //let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4 me-0 pe-0';
                  let assignmentScoreColor = 'fs-4 me-0 pe-0';
                  let scoreColor = 'fs-4 me-0 pe-0';
                  let show = '/RankDetail';
                  let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';
                  // if (cField.IsPass === 'f') {
                  //   roundColor = '#FF0000';
                  //   passColor = 'card card-unpass h-100';
                  //   scoreColor = 'fs-4 text-danger me-0 pe-0';
                  // }
                  if (cField.ToView === 'f') {
                    //roundColor = '#5B9BD5';
                    //passColor = 'card h-100';
                    //if (cField.ToView === 'f') {
                    disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                    show = null;
                    //isShowFailSubjectCount = false;
                    //}
                  }

                  // if ([].concat(examRankType || []).length < 1) {
                  //   show = null;
                  //   disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                  // }

                  // if (cField.Score === '') {
                  //   //roundColor = '#5B9BD5';
                  //   scoreColor = 'fs-4 me-0 pe-0';
                  //   //passColor = 'card h-100';
                  // }

                  //缺或免  紅字
                  if (cField.ExamScore !== '' && cField.ExamScoreText !== '')
                    examScoreColor = 'fs-4 text-danger me-0 pe-0';
                  if (cField.AssignmentScore !== '' && cField.AssignmentScoreText !== '')
                    assignmentScoreColor = 'fs-4 text-danger me-0 pe-0';

                  // 有成績 且 非缺 非免 且 60分以下 紅字
                  if (cField.ExamScore !== '' && cField.ExamScoreText === '' && Number(cField.ExamScore) < 60)
                    examScoreColor = 'fs-4 text-danger me-0 pe-0';
                  if (cField.AssignmentScore !== '' && cField.AssignmentScoreText === '' && Number(cField.AssignmentScore) < 60)
                    assignmentScoreColor = 'fs-4 text-danger me-0 pe-0';

                  if (cField.Score !== '' && Number(cField.Score) < 60)
                    scoreColor = 'fs-4 text-danger me-0 pe-0';

                  // 沒有定期+平時 成績 視為沒計算固定排名，無法點入詳細資料
                  if (cField.Score === '') {
                    disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                    show = null;
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
                            {/* {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>} */}

                            <div className='fs-4 fw-bold text-start'>{ces.Domain === "" ? "" : ces.Domain + "-"}{ces.Subject}</div>
                          </div>
                          <div className='d-flex p-2' >
                            <div>權數</div><div>{ces.Credit}</div>
                          </div>
                        </div>

                        <div className='row align-items-center'>

                          {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> : <>
                            <div className='col-6 col-md-6 col-lg-4 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : cField.ExamScore}</div>
                                    <div className='me-0 pe-0'>定期評量</div>
                                  </div>

                                  <div>{index === 0 || cField.ExamScore === '' || ces.Field[im].ExamScore === '' ? '' : Number(ces.Field[index].ExamScore) > Number(ces.Field[im].ExamScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].ExamScore) < Number(ces.Field[im].ExamScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>

                            <div className='col-6 col-md-6 col-lg-4 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={assignmentScoreColor}>{cField.AssignmentScore === '' ? '-' : cField.AssignmentScore}</div>
                                    <div className='me-0 pe-0'>平時評量</div>
                                  </div>

                                  <div>{index === 0 || cField.AssignmentScore === '' || ces.Field[im].AssignmentScore === '' ? '' : Number(ces.Field[index].AssignmentScore) > Number(ces.Field[im].AssignmentScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].AssignmentScore) < Number(ces.Field[im].AssignmentScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>

                            <div className='col-6 col-md-6 col-lg-4 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={scoreColor}>{cField.Score === '' ? '-' : Math.round(Number(cField.Score) * 100) / 100}</div>
                                    <div className='me-0 pe-0'>定期+平時評量</div>
                                  </div>

                                  <div>{index === 0 || cField.Score === '' || ces.Field[im].Score === '' ? '' : Number(ces.Field[index].Score) > Number(ces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].Score) < Number(ces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>


                          </>}

                        </div>

                        {cField.ToView === 'f' ? '' :
                          <div className='d-flex me-auto p-2 align-items-center'>
                            {/* <div className=''>計算時間：{cField.CreateTime}</div> */}
                            <div className=''>{cField.Message}</div>
                          </div>
                        }


                      </Link>
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}


          {/* 評量> 領域成績 */}
          {selectedSubjectType === 1 ? <>   {courseDomainScore.map((ces) => {
            return <>
              {[].concat(ces.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  //let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4 me-0 pe-0';
                  let scoreColor = 'fs-4 me-0 pe-0';
                  let show = '/RankDetail';
                  let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';

                  // 有成績 且 60分以下 紅字
                  if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60)
                    examScoreColor = 'fs-4 text-danger me-0 pe-0';
                  if (cField.Score !== '' && Number(cField.Score) < 60)
                    scoreColor = 'fs-4 text-danger me-0 pe-0';

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
                            {/* {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>} */}

                            <div className='fs-4 fw-bold text-start'>{ces.Domain}</div>
                          </div>
                          {/* <div className='d-flex p-2' >
                            <div>權數</div><div>{ces.Credit}</div>
                          </div> */}
                        </div>

                        <div className='row align-items-center'>


                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : Math.round(Number(cField.ExamScore) * 100) / 100}</div>
                                  <div className='me-0 pe-0'>定期評量</div>
                                </div>

                                <div>{index === 0 || cField.ExamScore === '' || ces.Field[im].ExamScore === '' ? '' : Number(ces.Field[index].ExamScore) > Number(ces.Field[im].ExamScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].ExamScore) < Number(ces.Field[im].ExamScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                              </div>
                            </div>
                          </div>

                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={scoreColor}>{cField.Score === '' ? '-' : Math.round(Number(cField.Score) * 100) / 100}</div>
                                  <div className='me-0 pe-0'>定期+平時評量</div>
                                </div>

                                <div>{index === 0 || cField.Score === '' || ces.Field[im].Score === '' ? '' : Number(ces.Field[index].Score) > Number(ces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].Score) < Number(ces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                              </div>
                            </div>
                          </div>

{/* {箭頭排版} */}
                          {/* <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center m-2'>
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{cField.Score === '' ? '-' : Math.round(Number(cField.Score) * 100) / 100}</div>
                                <div>{index === 0 || cField.Score === '' || ces.Field[im].Score === '' ? '' : Number(ces.Field[index].Score) > Number(ces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].Score) < Number(ces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>
                              </div>
                              <div className=''>定期+平時評量</div>
                            </div>
                          </div> */}

                        </div>



                        <div className='d-flex me-auto p-2 align-items-center'>
                          <div className=''>計算時間：{cField.CreateTime}</div>
                        </div>

                      </Link>
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}


          {/* 評量> 總計成績 */}
          {examAvgRankMatrix.map((ces) => {
            if (ces.ItemName === avgSetting)
              return <>
                {[].concat(ces.Field || []).map((cField, index) => {
                  if (cField.ExamID === selectedExam) {
                    //let roundColor = '#A9D18E';
                    let passColor = 'card card-pass h-100';
                    let examScoreColor = 'fs-4 me-0 pe-0';
                    let scoreColor = 'fs-4 me-0 pe-0';
                    let show = '/RankDetail';
                    let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';

                    // 有成績 且 60分以下 紅字
                    if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60)
                      examScoreColor = 'fs-4 text-danger me-0 pe-0';
                    if (cField.Score !== '' && Number(cField.Score) < 60)
                      scoreColor = 'fs-4 text-danger me-0 pe-0';

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
                              {/* {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>} */}

                              <div className='fs-4 fw-bold text-start'>{ces.ItemName}</div>
                            </div>
                            {/* <div className='d-flex p-2' >
                            <div>權數</div><div>{ces.Credit}</div>
                          </div> */}
                          </div>

                          <div className='row align-items-center'>


                            <div className='col-6 col-md-6 col-lg-6 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : Math.round(Number(cField.ExamScore) * 100) / 100}</div>
                                    <div className='me-0 pe-0'>定期評量</div>
                                  </div>

                                  <div>{index === 0 || cField.ExamScore === '' || ces.Field[im].ExamScore === '' ? '' : Number(ces.Field[index].ExamScore) > Number(ces.Field[im].ExamScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].ExamScore) < Number(ces.Field[im].ExamScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>

                            <div className='col-6 col-md-6 col-lg-6 my-2'>
                              <div className='row align-items-center'>
                                <div className='d-flex justify-content-center'>
                                  <div className='row align-items-center'>
                                    <div className={scoreColor}>{cField.Score === '' ? '-' : Math.round(Number(cField.Score) * 100) / 100}</div>
                                    <div className='me-0 pe-0'>定期+平時評量</div>
                                  </div>

                                  <div>{index === 0 || cField.Score === '' || ces.Field[im].Score === '' ? '' : Number(ces.Field[index].Score) > Number(ces.Field[im].Score) ? <img className='arrow' src={redUp} alt='↑' /> : Number(ces.Field[index].Score) < Number(ces.Field[im].Score) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>

                                </div>
                              </div>
                            </div>



                          </div>



                          <div className='d-flex me-auto p-2 align-items-center'>
                            <div className=''>計算時間：{cField.CreateTime}</div>
                          </div>

                        </Link>
                      </div>
                    </div>
                    </div>
                  }

                })}
              </>
          })}



          {/* 總覽> 科目成績_定期 */}

          {courseSubjectExamScore.map((nces) => {
            if (selectedExam === '0') {
              return <div className="col">
                <div className='card card-pass h-100'>
                  <div className="card-body">
                    <div className="card-block">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {/* {nces.Subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: '#8FAADC' }}></div>} */}

                          <div className='fs-4 fw-bold text-start'>{nces.Domain === "" ? "" : nces.Domain + "-"}{nces.Subject}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{nces.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>

                        {[].concat(nces.Field || []).map((nField, index) => {
                          let scoreColor = 'fs-4';

                          //缺或免  紅字
                          if (nField.ExamScore !== '' && nField.ExamScoreText !== '')
                            scoreColor = 'fs-4 text-danger me-0 pe-0';

                          // 有成績 且 非缺 非免 且 60分以下 紅字
                          if (nField.ExamScore !== '' && nField.ExamScoreText === '' && Number(nField.ExamScore) < 60)
                            scoreColor = 'fs-4 text-danger me-0 pe-0';



                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-6 col-md-6 col-lg-6'>
                            <div className='row align-items-center my-2'>
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{nField.ToView === 't' ? nField.ExamScore === '' ? '-' : nField.ExamScore : <div className='text-unview'><div>開放查詢時間：</div><div>{nField.ToViewTime}</div></div>}
                                </div>
                                <div>{index === 0 || nField.ToView === 'f' || nField.ExamScore === '' || nces.Field[im].ExamScore === '' ? '' : Number(nces.Field[index].ExamScore) > Number(nces.Field[im].ExamScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(nces.Field[index].ExamScore) < Number(nces.Field[im].ExamScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>
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

          {/* 總覽> 總計 */}
          {examAvgRankMatrix.map((earm) => {
            if (selectedExam === '0' && earm.ItemName === avgSetting) {
              return <div className="col">
                <div className='card card-pass h-100'>
                  <div className="card-body">
                    <div className="card-block">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {/* {nces.Subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: '#8FAADC' }}></div>} */}

                          <div className='fs-4 fw-bold'>{earm.ItemName}</div>
                        </div>
                        {/* <div className='d-flex p-2' >
            <div>{nces.Subject === avgSetting ? '' : '權數'}</div><div>{nces.Credit}</div>
          </div> */}
                      </div>

                      <div className='row align-items-center'>

                        {[].concat(earm.Field || []).map((mField, index) => {
                          let scoreColor = 'fs-4';


                          // 有成績 且 非缺 非免 且 60分以下 紅字
                          if (mField.ExamScore !== '' && Number(mField.ExamScore) < 60)
                            scoreColor = 'fs-4 text-danger me-0 pe-0';



                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-6 col-md-6 col-lg-6'>
                            <div className='row align-items-center my-2'>
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{mField.ExamScore === '' ? '-' : Math.round(Number(mField.ExamScore) * 100) / 100}
                                </div>
                                <div>{index === 0 || mField.ExamScore === '' || earm.Field[im].ExamScore === '' ? '' : Number(earm.Field[index].ExamScore) > Number(earm.Field[im].ExamScore) ? <img className='arrow' src={redUp} alt='↑' /> : Number(earm.Field[index].ExamScore) < Number(earm.Field[im].ExamScore) ? <img className='arrow' src={greenDown} alt='↓' /> : ''}</div>
                              </div>
                              <div>{mField.ExamName}</div>
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

        {/* {!isShowFailSubjectCount || selectedExam === '0' || selectedExam === null ? "" : <div>
          <div className='d-flex justify-content-left'>
            <div>不及格科目數：</div><div>{failedCount}</div>
          </div>
        </div>} */}

      </div>

    </div>
  );
}

export default Main;



