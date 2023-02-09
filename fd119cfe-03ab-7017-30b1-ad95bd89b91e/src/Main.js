import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import down from './down.png';
import up from './up.png';

function Main() {

  // 學生清單
  const [studentDateRange, setStudentList] = useState([]);

  //選擇的學生
  const [studentID, setStudent] = useState('');

  // 該學生的所有課程學年期
  const [courseSemesterRange, setCourseSemesterList] = useState([]);

  // 該學生的指定學年期的評量清單
  const [courseExamList, setCourseExamList] = useState([]);

  //系統學年期 
  const [currSemester, setCurrSemester] = useState("");

  //當前顯示學年期 
  const [selectedSemester, setViewSemester] = useState('');

  //當前顯示評量ID 總覽'0' 平時評量'assignment'
  const [selectedExam, setViewExam] = useState('0');

  //當前顯示 科目成績{0} or 領域成績{1} 
  const [selectedSubjectType, setSubjectType] = useState(0);

  // 該校設定要顯示加權平均"分數"還是算術平均"分數" (desktop設定需要同時更新才可生效)
  // 處理如果兩個都是false，則設為加權平均。
  const [avgSetting, setAvgSetting] = useState('加權平均');

  //取得 及格標準分數 --- 國中一律為60
  const [avgPassingStardard, setAvgPassingStardard] = useState(60);

  // 該學生的指定學年期、每次評量 之加權平均&算術平均
  const [examAvgList, setExamAvgList] = useState([]);

  // 該學生的指定學年期、平時評量 之加權平均&算術平均
  const [assignmentAvgList, setAssignmentAvgList] = useState([]);

  // 各評量的不及格科目數
  const [subjectExamFailedCount, setSubjectExamFailedCount] = useState([]);
  // 各評量的不及格領域數
  const [domainExamFailedCount, setDomainExamFailedCount] = useState([]);
  // 平時評量的不及格科目數
  const [subjectAssignmentFailedCount, setSubjectAssignmentFailedCount] = useState(0);
  // 平時評量的不及格領域數
  const [domainAssignmentFailedCount, setDomainAssignmentFailedCount] = useState(0);


  //******************* */
  // 該學生的指定學年期的課程 各評量 科目成績
  const [courseSubjectExamScore, setCourseSubjectExamScore] = useState([]);

  // 該學生的指定學年期的課程 各評量 領域成績
  const [courseDomainExamScore, setCourseDomainExamScore] = useState([]);

  // 該學生的指定學年期的課程 平時評量 科目成績
  const [courseSubjectAssignmentScore, setCourseSubjectAssignmentScore] = useState([]);

  // 該學生的指定學年期的課程 平時評量 領域成績
  const [courseDomainAssignmentScore, setCourseDomainAssignmentScore] = useState([]);

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
    GetAllSubjectExamScoreKH();
    GetAllSubjectAssignmentScoreKH();
    GetAllDomainExamScoreKH();
    GetAllDomainAssignmentScoreKH();
    GetExamAvgScoreKH();
    GetAssignmentAvgScoreKH();
    GetFailedExamSubjectCountKH();
    GetFailedAssignmentSubjectCountKH();
    GetFailedExamDomainCountKH();
    GetFailedAssignmentDomainCountKH();
  }, [studentID, selectedSemester]);


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

  // 取得 各評量 不及格科目數 
  async function GetFailedExamSubjectCountKH() {
    await _connection.send({
      service: "_.GetFailedExamSubjectCountKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setSubjectExamFailedCount([]);
          console.log('GetFailedExamSubjectCountKH Error', error);
          return 'err';
        } else {
          if (response) {
            setSubjectExamFailedCount([].concat(response.Failed || []));
          }
        }
      }
    });
  }

  // 取得 平時評量 不及格科目數 
  async function GetFailedAssignmentSubjectCountKH() {
    await _connection.send({
      service: "_.GetFailedAssignmentSubjectCountKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setSubjectAssignmentFailedCount('0');
          console.log('GetFailedAssignmentSubjectCountKH', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.Failed || []).length) {
              if (response.Failed.failed_count !== '')
                setSubjectAssignmentFailedCount(response.Failed.failed_count);
            }
          }
        }
      }
    });
  }

  // 取得 各評量 不及格領域數 
  async function GetFailedExamDomainCountKH() {
    await _connection.send({
      service: "_.GetFailedExamDomainCountKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setDomainExamFailedCount([]);
          console.log('GetFailedExamDomainCountKH Error', error);
          return 'err';
        } else {
          if (response) {
            setDomainExamFailedCount([].concat(response.Failed || []));
          }
        }
      }
    });
  }

  // 取得 平時評量 不及格科目數 
  async function GetFailedAssignmentDomainCountKH() {
    await _connection.send({
      service: "_.GetFailedAssignmentDomainCountKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setDomainAssignmentFailedCount('0');
          console.log('GetFailedAssignmentDomainCountKH', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.Failed || []).length) {
              if (response.Failed.failed_count !== '')
                setDomainAssignmentFailedCount(response.Failed.failed_count);
            }
          }
        }
      }
    });
  }

  // 取得 各評量 加權平均、算術平均  
  async function GetExamAvgScoreKH() {
    await _connection.send({
      service: "_.GetExamAvgScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setExamAvgList([]);
          console.log('GetExamAvgScoreKH Error', error);
          return 'err';
        } else {
          if (response) {
            setExamAvgList([].concat(response.ExamAvg || []));
          }
        }
      }
    });
  }

  // 取得 平時評量 加權平均、算術平均  
  async function GetAssignmentAvgScoreKH() {
    await _connection.send({
      service: "_.GetAssignmentAvgScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setAssignmentAvgList([]);
          console.log('GetAssignmentAvgScoreKH Error', error);
          return 'err';
        } else {
          if (response) {
            setAssignmentAvgList([].concat(response.ExamAvg || []));
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

              //1. 從別的學生點過來，且課程中有一樣的學年期
              //2. 從別的學生點過來，且課程中沒有一樣的學年期>>系統學年期
              //3. 上述情況都不符合，填入最新的學年期
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
              if (sameInCourse)
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
            }
          }
        }
      }
    });
  }

  // 取得指定學年期的課程 各評量 科目成績
  async function GetAllSubjectExamScoreKH() {
    await _connection.send({
      service: "_.GetAllSubjectExamScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setCourseSubjectExamScore([]);
          console.log('GetAllSubjectExamScoreKH Error', error);
          return 'err';
        } else {
          if (response) {
            setCourseSubjectExamScore([].concat(response.ExamScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的課程 平時評量 科目成績
  async function GetAllSubjectAssignmentScoreKH() {
    await _connection.send({
      service: "_.GetAllSubjectAssignmentScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          setCourseSubjectAssignmentScore([]);
          console.log('GetAllSubjectAssignmentScoreKH Error', error);
          return 'err';
        } else {
          if (response) {
            setCourseSubjectAssignmentScore([].concat(response.Assignment || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 各評量 領域成績
  async function GetAllDomainExamScoreKH() {
    await _connection.send({
      service: "_.GetAllDomainExamScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllDomainExamScoreKH Error', error);
          setCourseDomainExamScore([]);
          return 'err';
        } else {
          if (response) {
            setCourseDomainExamScore([].concat(response.DomainScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 平時評量 領域成績
  async function GetAllDomainAssignmentScoreKH() {
    await _connection.send({
      service: "_.GetAllDomainAssignmentScoreKH",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllDomainAssignmentScoreKH Error', error);
          setCourseDomainAssignmentScore([]);
          return 'err';
        } else {
          if (response) {
            setCourseDomainAssignmentScore([].concat(response.DomainScore || []));
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

  const handleSubjectType = (e) => {
    setSubjectType(Number(e.target.value));
  }


  function ConvertStudentName(name) {
    const htmlText = `${name}`

    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  }



  //若有其中一科目是不開放查詢，則最後不會顯示 "不及格科目數"
  let isShowFailSubjectCount = true;
  let isShowFailDomainCount = true;
  let isShowFailAssignmenetSubjectCount = true;
  let isShowFailAssignmenetDomainCount = true;
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
              {[].concat(courseSemesterRange || []).length < 1 ? <option value="Y" key="Y">(選擇學年度學期)</option> : <></>}
              {courseSemesterRange.map((courseSemester, index) => {
                return <option key={index} value={courseSemester.schoolyear + courseSemester.semester}>
                  {courseSemester.schoolyear}學年度第{courseSemester.semester}學期</option>
              })}
            </select>
          </div>
          <div className='col-12 col-md-4 col-lg-3 py-2'>
            <select className="form-select" value={selectedExam} onChange={(e) => handleChangeViewExam(e)}>
              {[].concat(courseExamList || []).length < 1 ? <option value="Y" key="Y">(選擇評量)</option> : <option value="0" key="Y">總覽</option>}

              {courseExamList.map((examList, index) => {
                return <option key={index} value={examList.exam_id}>
                  {examList.exam_name}</option>
              })}
              {[].concat(courseExamList || []).length ? <option value="assignment" key="平時評量">平時評量</option> : ''}

            </select>
          </div>

          <div className='col-12 col-md-4 col-lg-3 py-2'>
            <select className="form-select" value={selectedSubjectType} onChange={(e) => handleSubjectType(e)}>
              <option value={0} key={0}>科目成績</option>
              <option value={1} key={1}>領域成績</option>
            </select>
          </div>

        </div>


        <div>{selectedExam !== 'assignment' && [].concat(courseSubjectExamScore || []).length < 1 ? '尚無評量成績資料。' : ''}</div>
        <div>{selectedExam === 'assignment' && [].concat(courseSubjectAssignmentScore || []).length < 1 ? '尚無平時評量成績資料。' : ''}</div>


        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 "> {/* 三排 */}

          {/* 各評量> 科目成績 */}
          {selectedSubjectType === 0 ? <>  {courseSubjectExamScore.map((cses) => {
            return <>
              {[].concat(cses.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4';

                  //let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';

                  if (cField.ToView === 'f') {
                    roundColor = '#5B9BD5';
                    passColor = 'card h-100';
                    //disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                    isShowFailSubjectCount = false;
                  }

                  //<60分  紅字
                  if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60){
                    examScoreColor = 'fs-4 text-danger';
                    passColor = 'card card-unpass h-100';
                  }


                  let im = 0;
                  let previousExamID = selectedExam;
                  if (index !== 0) {
                    im = index - 1;
                    previousExamID = cses.Field[im].ExamID;
                  }
                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      {/* <Link className={disabledCursor}  > */}
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}

                          <div className='fs-4 fw-bold text-start'>{cses.Domain === "" ? "" : cses.Domain + "-"}{cses.Subject}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{cses.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>

                        {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> : <>
                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : cField.ExamScore}</div>
                                  <div className=''>分數</div>
                                </div>

                                <div>{index === 0 || cField.ExamScore === '' || cses.Field[im].ExamScore === '' ? '' : Number(cses.Field[index].ExamScore) > Number(cses.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(cses.Field[index].ExamScore) < Number(cses.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>

                              </div>
                            </div>
                          </div>

                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className='fs-4'>{cField.Effort === '' ? '-' : cField.Effort}</div>
                                  <div className=''>努力程度</div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </>}

                      </div>

                      {/* </Link> */}
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}


          {/* 各評量> 領域成績 */}
          {selectedSubjectType === 1 ? <>  {courseDomainExamScore.map((cdes) => {
            return <>
              {[].concat(cdes.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4';

                  if (cField.ToView === 'f') {
                    roundColor = '#5B9BD5';
                    passColor = 'card h-100';
                    isShowFailDomainCount = false;
                  }

                  //<60分  紅字
                  if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60){
                    examScoreColor = 'fs-4 text-danger';
                    passColor = 'card card-unpass h-100';
                  }

                  let im = 0;
                  let previousExamID = selectedExam;
                  if (index !== 0) {
                    im = index - 1;
                    previousExamID = cdes.Field[im].ExamID;
                  }
                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}

                          <div className='fs-4 fw-bold text-start'>{cdes.Domain}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{cdes.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>
                        {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> : <>
                          <div className='col-12 col-md-12 col-lg-12 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : cField.ExamScore}</div>
                                  <div className=''>分數</div>
                                </div>
                                <div>{index === 0 || cField.ExamScore === '' || cdes.Field[im].ExamScore === '' ? '' : Number(cdes.Field[index].ExamScore) > Number(cdes.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(cdes.Field[index].ExamScore) < Number(cdes.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                              </div>
                            </div>
                          </div>
                        </>}
                      </div>
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}

          {/* 各評量> 總計成績 */}
          {examAvgList.map((cdes, index) => {
            //console.log('examAvgList', examAvgList);
            if (cdes.exam_id === selectedExam) {
              let eScore = cdes.score_avg;
              if (avgSetting === '加權平均')
                eScore = cdes.score_weightavg;
              let scoreColor = 'fs-4';

              // 有成績 且 60分以下 紅字
              if (eScore !== '' && Number(eScore) < 60)
                scoreColor = 'fs-4 text-danger';

              let im = 0;
              if (index !== 0)
                im = index - 1

              return <div className="col"><div className='card h-100'>
                <div className="card-body">
                  <div className='d-flex'>
                    <div className='d-flex me-auto p-2 align-items-center'>
                      <div className='fs-4 fw-bold text-start'>{avgSetting}</div>
                    </div>
                  </div>

                  <div className='row align-items-center'>
                    {cdes.toview === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cdes.toviewtime}</div></div> : <>
                      <div className='col-12 col-md-12 col-lg-12 my-2'>
                        <div className='row align-items-center'>
                          <div className='d-flex justify-content-center'>
                            <div className='row align-items-center'>
                              <div className={scoreColor}>{eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100}</div>
                              <div className=''>分數</div>
                            </div>

                            {avgSetting === '加權平均' ?
                              <div>{index === 0 || eScore === '' || examAvgList[im].score_weightavg === '' ? '' : Number(examAvgList[index].score_weightavg) > Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_weightavg) < Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                              :
                              <div>{index === 0 || eScore === '' || examAvgList[im].score_avg === '' ? '' : Number(examAvgList[index].score_avg) > Number(examAvgList[im].score_avg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_avg) < Number(examAvgList[im].score_avg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>}
                          </div>
                        </div>
                      </div>
                    </>}
                  </div>
                </div>
              </div>
              </div>
            }

          })}



          {/* 平時評量> 科目成績 */}
          {selectedSubjectType === 0 ? <>  {courseSubjectAssignmentScore.map((csas) => {
            return <>
              {[].concat(csas.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4';

                  //let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';

                  if (cField.ToView === 'f') {
                    roundColor = '#5B9BD5';
                    passColor = 'card h-100';
                    //disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                    isShowFailAssignmenetSubjectCount = false;
                  }

                  //<60分  紅字
                  if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60){
                    examScoreColor = 'fs-4 text-danger';
                    passColor = 'card card-unpass h-100';
                  }


                  let im = 0;
                  let previousExamID = selectedExam;
                  if (index !== 0) {
                    im = index - 1;
                    previousExamID = csas.Field[im].ExamID;
                  }
                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      {/* <Link className={disabledCursor}  > */}
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}

                          <div className='fs-4 fw-bold text-start'>{csas.Domain === "" ? "" : csas.Domain + "-"}{csas.Subject}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{csas.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>

                        {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> : <>
                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : cField.ExamScore}</div>
                                  <div className=''>分數</div>
                                </div>

                                {/* <div>{index === 0 || cField.ExamScore === '' || csas.Field[im].ExamScore === '' ? '' : Number(csas.Field[index].ExamScore) > Number(csas.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(csas.Field[index].ExamScore) < Number(csas.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div> */}

                              </div>
                            </div>
                          </div>

                          <div className='col-6 col-md-6 col-lg-6 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className='fs-4'>{cField.Effort === '' ? '-' : cField.Effort}</div>
                                  <div className=''>努力程度</div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </>}

                      </div>

                      {/* </Link> */}
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}

          {/* 平時評量> 領域成績 */}
          {selectedSubjectType === 1 ? <>  {courseDomainAssignmentScore.map((cdas) => {
            return <>
              {[].concat(cdas.Field || []).map((cField, index) => {
                if (cField.ExamID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass h-100';
                  let examScoreColor = 'fs-4';

                  if (cField.ToView === 'f') {
                    roundColor = '#5B9BD5';
                    passColor = 'card h-100';
                    isShowFailAssignmenetDomainCount = false;
                  }

                  //<60分  紅字
                  if (cField.ExamScore !== '' && Number(cField.ExamScore) < 60){
                    examScoreColor = 'fs-4 text-danger';
                    passColor = 'card card-unpass h-100';
                  }

                  let im = 0;
                  let previousExamID = selectedExam;
                  if (index !== 0) {
                    im = index - 1;
                    previousExamID = cdas.Field[im].ExamID;
                  }
                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {<div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}

                          <div className='fs-4 fw-bold text-start'>{cdas.Domain}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{cdas.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>
                        {cField.ToView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{cField.ToViewTime}</div></div> : <>
                          <div className='col-12 col-md-12 col-lg-12 my-2'>
                            <div className='row align-items-center'>
                              <div className='d-flex justify-content-center'>
                                <div className='row align-items-center'>
                                  <div className={examScoreColor}>{cField.ExamScore === '' ? '-' : cField.ExamScore}</div>
                                  <div className=''>分數</div>
                                </div>
                                {/* <div>{index === 0 || cField.ExamScore === '' || cdas.Field[im].ExamScore === '' ? '' : Number(cdas.Field[index].ExamScore) > Number(cdas.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(cdas.Field[index].ExamScore) < Number(cdas.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div> */}
                              </div>
                            </div>
                          </div>
                        </>}
                      </div>
                    </div>
                  </div>
                  </div>
                }

              })}
            </>
          })}</> : ''}




          {/* 平時評量> 總計成績 */}
          {assignmentAvgList.map((asal, index) => {
            //console.log('examAvgList', examAvgList);
            if (asal.exam_id === selectedExam) {
              let eScore = asal.score_avg;
              if (avgSetting === '加權平均')
                eScore = asal.score_weightavg;
              let scoreColor = 'fs-4';

              // 有成績 且 60分以下 紅字
              if (eScore !== '' && Number(eScore) < 60)
                scoreColor = 'fs-4 text-danger';

              let im = 0;
              if (index !== 0)
                im = index - 1

              return <div className="col"><div className='card h-100'>
                <div className="card-body">
                  <div className='d-flex'>
                    <div className='d-flex me-auto p-2 align-items-center'>
                      <div className='fs-4 fw-bold text-start'>{avgSetting}</div>
                    </div>
                  </div>

                  <div className='row align-items-center'>
                    {asal.toview === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{asal.toviewtime}</div></div> : <>
                      <div className='col-12 col-md-12 col-lg-12 my-2'>
                        <div className='row align-items-center'>
                          <div className='d-flex justify-content-center'>
                            <div className='row align-items-center'>
                              <div className={scoreColor}>{eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100}</div>
                              <div className=''>分數</div>
                            </div>

                            {avgSetting === '加權平均' ?
                              <div>{index === 0 || eScore === '' || examAvgList[im].score_weightavg === '' ? '' : Number(examAvgList[index].score_weightavg) > Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_weightavg) < Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                              :
                              <div>{index === 0 || eScore === '' || examAvgList[im].score_avg === '' ? '' : Number(examAvgList[index].score_avg) > Number(examAvgList[im].score_avg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_avg) < Number(examAvgList[im].score_avg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>}
                          </div>
                        </div>
                      </div>
                    </>}
                  </div>
                </div>
              </div>
              </div>
            }

          })}

          {/* 總覽(各評量&平時)> 科目成績 */}
          {courseSubjectExamScore.map((nces) => {
            //console.log('總覽(各評量)> 科目成績', nces);
            if (selectedExam === '0' && selectedSubjectType === 0) {
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

                          //<60  紅字
                          if (nField.ExamScore !== '' && Number(nField.ExamScore) < 60)
                            scoreColor = 'fs-4 text-danger';

                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-6 col-md-6 col-lg-6'>
                            <div className='row align-items-center my-2'>
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{nField.ToView === 't' ? nField.ExamScore === '' ? '-' : nField.ExamScore : <div className='text-unview'><div>開放查詢時間：</div><div>{nField.ToViewTime}</div></div>}
                                </div>
                                <div>{index === 0 || nField.ToView === 'f' || nField.ExamScore === '' || nces.Field[im].ExamScore === '' ? '' : Number(nces.Field[index].ExamScore) > Number(nces.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(nces.Field[index].ExamScore) < Number(nces.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                              </div>
                              <div>{nField.ExamName}</div>
                            </div>
                          </div>
                        })}

                        {/* 總覽(平時評量)> 科目成績 */}
                        {courseSubjectAssignmentScore.map((csas) => {
                          if (csas.CourseID === nces.CourseID) {
                            return <div className='col-6 col-md-6 col-lg-6'>
                              {[].concat(csas.Field || []).map((csasField, index) => {
                                let scoreColor = 'fs-4';

                                //<60 紅字
                                if (csasField.ExamScore !== '' && Number(csasField.ExamScore) < 60)
                                  scoreColor = 'fs-4 text-danger';

                                return <div className='row align-items-center my-2'>
                                  <div className='d-flex justify-content-center'>
                                    <div className={scoreColor}>{csasField.ToView === 't' ? csasField.ExamScore === '' ? '-' : csasField.ExamScore : <div className='text-unview'><div>開放查詢時間：</div><div>{csasField.ToViewTime}</div></div>}
                                    </div>
                                  </div>
                                  <div>{csasField.ExamName}</div>
                                </div>

                              })}

                            </div>
                          }
                        })}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          })}


          {/* 總覽(各評量&平時)> 領域成績 */}
          {courseDomainExamScore.map((cdes) => {
            //console.log('studentID', studentID);
            if (selectedExam === '0' && selectedSubjectType === 1) {
              return <div className="col">
                <div className='card card-pass h-100'>
                  <div className="card-body">
                    <div className="card-block">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {/* {nces.Subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: '#8FAADC' }}></div>} */}
                          <div className='fs-4 fw-bold text-start'>{cdes.Domain}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>權數</div><div>{cdes.Credit}</div>
                        </div>
                      </div>

                      <div className='row align-items-center'>

                        {[].concat(cdes.Field || []).map((nField, index) => {
                          let scoreColor = 'fs-4';

                          //<60  紅字
                          if (nField.ExamScore !== '' && Number(nField.ExamScore) < 60)
                            scoreColor = 'fs-4 text-danger';

                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-6 col-md-6 col-lg-6'>
                            <div className='row align-items-center my-2'>
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{nField.ToView === 't' ? nField.ExamScore === '' ? '-' : nField.ExamScore : <div className='text-unview'><div>開放查詢時間：</div><div>{nField.ToViewTime}</div></div>}
                                </div>
                                <div>{index === 0 || nField.ToView === 'f' || nField.ExamScore === '' || cdes.Field[im].ExamScore === '' ? '' : Number(cdes.Field[index].ExamScore) > Number(cdes.Field[im].ExamScore) ? <img className='arrow' src={up} alt='↑' /> : Number(cdes.Field[index].ExamScore) < Number(cdes.Field[im].ExamScore) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                              </div>
                              <div>{nField.ExamName}</div>
                            </div>
                          </div>
                        })}

                        {/* 總覽(平時評量)> 領域成績 */}
                        {courseDomainAssignmentScore.map((csas) => {
                          //console.log('總覽(平時評量)> 領域成績', csas);
                          if (csas.Domain === cdes.Domain) {
                            return <div className='col-6 col-md-6 col-lg-6'>
                              {[].concat(csas.Field || []).map((cdasField, index) => {
                                let scoreColor = 'fs-4';

                                //<60 紅字
                                if (cdasField.ExamScore !== '' && Number(cdasField.ExamScore) < 60)
                                  scoreColor = 'fs-4 text-danger';

                                return <div className='row align-items-center my-2'>
                                  <div className='d-flex justify-content-center'>
                                    <div className={scoreColor}>{cdasField.ToView === 't' ? cdasField.ExamScore === '' ? '-' : cdasField.ExamScore : <div className='text-unview'><div>開放查詢時間：</div><div>{cdasField.ToViewTime}</div></div>}
                                    </div>
                                  </div>
                                  <div>{cdasField.ExamName}</div>
                                </div>

                              })}

                            </div>
                          }
                        })}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          })}


          {/* 總覽(各評量&平時)> 總計 */}
          {selectedExam === '0' && ([].concat(examAvgList || []).length || [].concat(assignmentAvgList || []).length) ?
            <div className="col">
              <div className='card h-100'>
                <div className="card-body">
                  <div className="card-block">
                    <div className='d-flex'>
                      <div className='d-flex me-auto p-2 align-items-center'>
                        <div className='fs-4 fw-bold'>{avgSetting}</div>
                      </div>
                    </div>
                    <div className='row align-items-center'>

                      {/* 總覽(各評量&平時)> 總計 */}
                      {examAvgList.map((earm, index) => {
                        let eScore = earm.score_avg;
                        if (avgSetting === '加權平均')
                          eScore = earm.score_weightavg;
                        let scoreColor = 'fs-4';

                        // 有成績 且 60分以下 紅字
                        if (eScore !== '' && Number(eScore) < 60)
                          scoreColor = 'fs-4 text-danger';

                        let im = 0;
                        if (index !== 0)
                          im = index - 1

                        return <div className='col-6 col-md-6 col-lg-6'>
                          <div className='row align-items-center my-2'>
                            <div className='d-flex justify-content-center'>
                              <div className={scoreColor}>{earm.toview === 't' ? eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100 : <div className='text-unview'><div>開放查詢時間：</div><div>{earm.toviewtime}</div></div>}
                              </div>
                              {/* <div className={scoreColor}>{eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100}
                              </div> */}
                              {/* {avgSetting === '加權平均' ?
                                <div>{index === 0 || eScore === '' || examAvgList[im].score_weightavg === '' ? '' : Number(examAvgList[index].score_weightavg) > Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_weightavg) < Number(examAvgList[im].score_weightavg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>
                                :
                                <div>{index === 0 || eScore === '' || examAvgList[im].score_avg === '' ? '' : Number(examAvgList[index].score_avg) > Number(examAvgList[im].score_avg) ? <img className='arrow' src={up} alt='↑' /> : Number(examAvgList[index].score_avg) < Number(examAvgList[im].score_avg) ? <img className='arrow' src={down} alt='↓' /> : ''}</div>}
 */}

                            </div>
                            <div>{earm.exam_name}</div>
                          </div>
                        </div>


                      })}

                      {/* 總覽(平時評量)> 總計 */}
                      {assignmentAvgList.map((aal, index) => {
                        //console.log('aal', aal);

                        let eScore = aal.score_avg;
                        if (avgSetting === '加權平均')
                          eScore = aal.score_weightavg;
                        let scoreColor = 'fs-4';

                        // 有成績 且 60分以下 紅字
                        if (eScore !== '' && Number(eScore) < 60)
                          scoreColor = 'fs-4 text-danger';

                        return <div className='col-6 col-md-6 col-lg-6'>
                          <div className='row align-items-center my-2'>
                            <div className='d-flex justify-content-center'>
                              <div className={scoreColor}>{aal.toview === 't' ? eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100 : <div className='text-unview'><div>開放查詢時間：</div><div>{aal.toviewtime}</div></div>}
                              </div>
                              {/* <div className={scoreColor}>{eScore === '' ? '-' : Math.round(Number(eScore) * 100) / 100}
                              </div> */}

                            </div>
                            <div>{aal.exam_name}</div>
                          </div>
                        </div>


                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            : ''}




        </div>

        {/* 各評量科目 */}
        {isShowFailSubjectCount && selectedExam !== '0' && selectedExam !== 'assignment' && selectedSubjectType === 0 ? 
        [].concat(subjectExamFailedCount || []).length?
        <>
          {[].concat(subjectExamFailedCount || []).map((sfc) => {
            if (sfc.exam_id === selectedExam)
              return <div className='d-flex justify-content-left'>
                <div>不及格科目數：{sfc.failed_count}</div>
                </div>
          })}

        </>:<div className='d-flex justify-content-left'>不及格科目數：0</div> : ''}

        {/* 各評量領域 */}
        {isShowFailDomainCount && selectedExam !== '0' && selectedExam !== 'assignment' && selectedSubjectType === 1 ? 
        [].concat(domainExamFailedCount || []).length?
        <>
          {[].concat(domainExamFailedCount || []).map((sfc) => {
            if (sfc.exam_id === selectedExam)
              return <div className='d-flex justify-content-left'>
                <div>不及格領域數：{sfc.failed_count}</div>
                </div>
          })}

        </>:<div className='d-flex justify-content-left'>不及格領域數：0</div> : ''}


        {/* 平時評量科目 */}
        {isShowFailAssignmenetSubjectCount && selectedExam === 'assignment' && selectedSubjectType === 0 ? 
        <div className='d-flex justify-content-left'>不及格科目數：{domainAssignmentFailedCount}</div>: ''}

        {/* 平時評量領域 */}
        {isShowFailAssignmenetDomainCount && selectedExam === 'assignment' && selectedSubjectType === 1 ? 
        <div className='d-flex justify-content-left'>不及格領域數：{domainAssignmentFailedCount}</div>: ''}









      </div>

    </div>
  );
}

export default Main;



