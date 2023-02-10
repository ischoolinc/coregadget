import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function Main() {

  // 學生清單
  const [studentDateRange, setStudentList] = useState([]);

  //選擇的學生 //sessionStorage
  const [studentID, setStudent] = useState(sessionStorage.getItem('StudentID'));

  // 該學生的所有學期成績 學年期
  const [semesterRange, setSubjectScoreSemesterList] = useState([]);

  //系統學年期 
  const [currSemester, setCurrSemester] = useState("");

  //當前顯示學年期 //sessionStorage
  const [selectedSemester, setViewSemester] = useState(sessionStorage.getItem('Semester'));

  //當前顯示 科目成績 or 領域成績 //sessionStorage
  const [selectedSubjectType, setSubjectType] = useState(Number(sessionStorage.getItem('SelectedSubjectType')));

  //當前顯示排名類別 //sessionStorage
  const [selectedRankType, setViewRankType] = useState(sessionStorage.getItem('RankType'));

  // 該學生的指定學年期 之排名類別
  const [rankTypeList, setRankTypeList] = useState([]);

  //預設顯示成績
  const [showScore, setShowScore] = useState(true);

  //預設不顯示等第
  const [showDegree, setShowDegree] = useState(false);

  //預設不顯示排名
  const [showRank, setShowRank] = useState(false);

  //預設即時查看成績
  //const [showImmediately, setShowImmediately] = useState(true);

  //預設即時查看成績 = 現在可看成績
  const [showNow, setShowNow] = useState(true);

  //可查看成績起始日
  const [viewTime, setViewtime] = useState('');

  //取得 及格標準分數 --- 國中一律為60
  const [passingStardard, setPassingStardard] = useState(60);

  // 該學生的 指定 學年期的 學期科目成績
  const [semesterSubjectScore, setSemesterSubjectScore] = useState([]);

  // 該學生的 指定 學年期的 學期領域成績
  const [semesterDomainScore, setSemesterDomainScore] = useState([]);

  // 該學生的 指定 學年期的 學期總計成績
  const [semesterMixDomainScore, setSemesterMixDomainScore] = useState([]);

  // 該學生的 指定 學年期的 固定排名
  const [semesterRankMatrix, setRankMatrix] = useState([]);

  // 該學期的不及格科目數
  const [failedSubjectCount, setFailedSubjectCount] = useState(0);

  // 該學期的不及格領域數
  const [failedDomainCount, setFailedDomainCount] = useState(0);

  //高雄國中用
  const [currentTargetIndex, setCurrentTargetIndex] = useState('');
  const [currentTarget, setCurrentTarget] = useState('');

  const position = window.gadget.params.system_position;
  const system_type = window.gadget.params.system_type;

  useEffect(() => {
    GetCurrentSemester();
    //GetViewSetting();
    GetStudentList();
  }, []);


  useEffect(() => {
    GetSubjectScoreSemesterList();
  }, [studentID]);


  useEffect(() => {
    GetAllSemesterSubjectScore();
    GetAllSemesterDomainScore();
    GetAllSemesterMixDomainScore();
    GetFailedSemesterSubjectCount();
    GetFailedSemesterDomainCount();
    GetRankInfo();
    GetRankType();
  }, [studentID, selectedSemester]);

  useEffect(() => {
    GetViewSetting();
    //GetRankType();
  }, [selectedSemester]);


  // useEffect(() => {
  //   OrganizeCourseExamScore();
  // }, [courseSubjectExamScore]);


  // useEffect(() => {
  //   //CountFailedExamSubject();
  // }, [selectedExam, selectedSemester, courseExamScore]);


  var _connection = window.gadget.getContract("1campus.j.semester.parent");

  if (position === 'student')
    _connection = window.gadget.getContract("1campus.j.semester.student");

  // 取得顯示 時間、分數、等第、排名
  async function GetViewSetting() {
    await _connection.send({
      service: "_.GetViewSetting",
      body: {
        ViewSemester: selectedSemester,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetViewSettingError', error);
          return 'err';
        } else {
          if (response) {
            //console.log('Setting[]', [].concat(response.Setting || []));
            if ([].concat(response.Setting || []).length) {
              setShowScore(response.Setting.showscore.toLowerCase() === 'true');
              setShowDegree(response.Setting.showdegree.toLowerCase() === 'true');
              setShowRank(response.Setting.showrank.toLowerCase() === 'true');
              setShowNow(response.Setting.toview.toLowerCase() === 't');
              setViewtime(response.Setting.viewtime);

              // console.log('showscore[]', response.Setting.showscore.toLowerCase() === 'true');
              // console.log('showdegree[]', response.Setting.showdegree.toLowerCase() === 'true');
              // console.log('showrank[]', response.Setting.showrank.toLowerCase() === 'true');
              // console.log('toview[]', response.Setting.toview.toLowerCase() === 't');
              // console.log('viewtime[]', response.Setting.viewtime);
            }
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

  // 取得學期科目成績 學年期清單
  async function GetSubjectScoreSemesterList() {
    await _connection.send({
      service: "_.GetAllSubjectScoreSemester",
      body: {
        StudentID: studentID
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllSubjectScoreSemesterError', error);
          return 'err';
        } else {
          if (response) {//semesterRange
            if ([].concat(response.Semester || []).length) {
              //console.log('ScoreSemester[]', [].concat(response.Semester || []));
              setSubjectScoreSemesterList([].concat(response.Semester || []));
              var tempSelectedSemester = selectedSemester;

              //1. 返回，保持原來的學年期
              //2. 從別的學生點過來，且有一樣的學年期
              //3. 從別的學生點過來，且沒有一樣的學年期>>系統學年期
              //4. 上述情況都不符合，填入最新的學年期
              var sameInCourse = false; //有一樣的學年期
              var sameAsCurrency = false; //有一樣的系統學年期
              //if (selectedSemester) {
              [].concat(response.Semester || []).forEach(element => {
                if (element.schoolyear + element.semester === currSemester) {
                  sameAsCurrency = true;
                }
                if (element.schoolyear + element.semester === selectedSemester) {
                  sameInCourse = true;
                }

              });

              //* 先填入最新的學年期
              setViewSemester([].concat(response.Semester || [])[0].schoolyear + [].concat(response.Semester || [])[0].semester);

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
              setSubjectScoreSemesterList([]);
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

  // 取得指定學年期的排名類別
  async function GetRankType() {
    await _connection.send({
      service: "_.GetRankType",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester,
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetRankTypeError', error);
          setViewRankType('');
          return 'err';
        } else {
          if (response) {
            setRankTypeList([].concat(response.RankType || []));
            if ([].concat(response.RankType || []).length) {
              if (selectedRankType === '' || selectedRankType === null)
                setViewRankType([].concat(response.RankType || [])[0].rank_type);
            }
          }
        }
      }
    });
  }

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


  // 取得指定學年期的 科目 成績
  async function GetAllSemesterSubjectScore() {
    await _connection.send({
      service: "_.GetAllSemesterSubjectScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllSemesterSubjectScoreError', error);
          return 'err';
        } else {
          if (response) {
            setSemesterSubjectScore([].concat(response.SemesterScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 領域 成績
  async function GetAllSemesterDomainScore() {
    await _connection.send({
      service: "_.GetAllSemesterDomainScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllSemesterDomainScoreError', error);
          return 'err';
        } else {
          if (response) {
            setSemesterDomainScore([].concat(response.DomainScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 總計領域 成績
  async function GetAllSemesterMixDomainScore() {
    await _connection.send({
      service: "_.GetAllSemesterMixDomainScore",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAllSemesterMixDomainScoreError', error);
          return 'err';
        } else {
          if (response) {
            setSemesterMixDomainScore([].concat(response.MixDomainScore || []));
          }
        }
      }
    });
  }

  // 取得指定學年期的 不及格科目數
  async function GetFailedSemesterSubjectCount() {
    await _connection.send({
      service: "_.GetFailedSemesterSubjectCount",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetFailedSemesterSubjectCountError', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.Failed || []).length) {
              setFailedSubjectCount(response.Failed.failed_count);
            }
          }
        }
      }
    });
  }

  // 取得指定學年期的 不及格領域數
  async function GetFailedSemesterDomainCount() {
    await _connection.send({
      service: "_.GetFailedSemesterDomainCount",
      body: {
        StudentID: studentID,
        ViewSemester: selectedSemester
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetFailedSemesterDomainCountError', error);
          return 'err';
        } else {
          if (response) {
            if ([].concat(response.Failed || []).length) {
              setFailedDomainCount(response.Failed.failed_count);
            }
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

  const handleSubjectType = (e) => {
    setSubjectType(Number(e.target.value));
  }

  const handleShowRankDetail = (e) => {
    var subject = e.subject;
    var subjectType = 'subject';

    if (!e.subject) {
      subject = e.domain;
      subjectType = 'domain';
    }

    if (!e.domain && !e.domain) {
      subjectType = 'mixdomain';
    }

    if (e.subject && e.domain === '')
      subjectType = 'subject';

    sessionStorage.clear();
    // 按下去的時候才存
    sessionStorage.setItem('StudentID', studentID);
    sessionStorage.setItem('RankType', selectedRankType);
    sessionStorage.setItem('Semester', selectedSemester);
    sessionStorage.setItem('Subject', subject);
    //sessionStorage.setItem('PassingStandard', passingStardard);
    sessionStorage.setItem('SubjectType', subjectType);
    sessionStorage.setItem('SelectedSubjectType', selectedSubjectType);
  };


  const handleChangeViewRank = (e) => {
    setViewRankType(e.target.value);
  };

  const handleOnMouseEnter = (index, target) => {
    setCurrentTargetIndex(index);
    setCurrentTarget(target);
  }
  const handleOnMouseLeave = () => {
    setCurrentTargetIndex('');
    setCurrentTarget('');
  }

  function ConvertStudentName(name) {
    const htmlText = `${name}`

    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  }

  // 手動重新整理/去別的頁面，將清除sessionStorage 
  window.onunload = function () {
    sessionStorage.clear();
  }



  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">

        <div className='titleBorder d-flex align-items-center'>
          <div>
            <div className='ms-2 me-4 d-flex align-items-center fs-4'>學期成績</div>
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
          <div className='col-12 col-md-6 col-lg-3 py-2'>
            <select className="form-select" value={selectedSemester} onChange={(e) => handleChangeViewSemester(e)} >
              {[].concat(semesterRange || []).length < 1 ? <option value="Y" key="Y">(選擇學年度學期)</option> : <></>}
              {semesterRange.map((semester, index) => {
                return <option key={index} value={semester.schoolyear + semester.semester}>
                  {semester.schoolyear}學年度第{semester.semester}學期</option>
              })}
            </select>
          </div>

          <div className='col-12 col-md-6 col-lg-3 py-2'>
            <select className="form-select" value={selectedSubjectType} onChange={(e) => handleSubjectType(e)}>
              <option value={0} key={0}>科目成績</option>
              <option value={1} key={1}>領域成績</option>
            </select>
          </div>

          {/*高雄 無論設定都不顯示排名 */}
          {!showRank || system_type === 'kh' ? '' :
            <div className='d-flex align-items-center text-nowrap col-12 col-md-6 col-lg-6 py-2'>
              <div className='pe-1'>排名類別</div>
              <select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>

                {[].concat(rankTypeList || []).length < 1 ? <option value="Y" key="Y">(尚無排名資料)</option> : <></>}

                {rankTypeList.map((rankType, index) => {
                  return <option key={index} value={rankType.rank_type}>
                    {rankType.rank_type}</option>
                })}
              </select>

            </div>}



          <div className='col-12 col-md-6 col-lg-3 text-start py-2'>
            {!showNow ? '' : selectedSubjectType === 0 ? '不及格科目數：' + failedSubjectCount : '不及格領域數：' + failedDomainCount}
            {/* {showNow && selectedSubjectType === 0 ? '不及格科目數：' + failedSubjectCount : '不及格領域數：' + failedDomainCount} */}
          </div>


        </div>




        <div>{selectedSubjectType === 0 && [].concat(semesterSubjectScore || []).length < 1 ? '尚無成績資料。' : ''}</div>

        <div>{selectedSubjectType === 1 && [].concat(semesterDomainScore || []).length < 1 ? '尚無資料。' : ''}</div>

        {/* <div className="row row-cols-1 row-cols-md-2 g-4 "> */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

          {/* 科目成績 */}
          {selectedSubjectType === 0 ? <>
            {semesterSubjectScore.map((sss, index) => {
              let makeUpText = '';
              let makeUpTextColor = 'text-blue align-self-end';
              if (Number(sss.score) === Number(sss.pscore) && Number(sss.oscore) !== Number(sss.pscore))
                makeUpText = '補';

              let col = 'col-6 my-2';
              let roundColor = '#5b9bd5';//A9D18E
              let passColor = 'card card-pass shadow h-100';
              let scoreColor = 'fs-4-blue text-nowrap';
              let show = '/RankDetail';
              let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';
              let passText = '及格';
              let passTextColor = 'text-green';

              if (Number(sss.score) < passingStardard) {
                roundColor = '#FF66CC';
                passColor = 'card card-unpass shadow h-100';
                scoreColor = 'fs-4 text-danger text-nowrap me-0 pe-0';
                passText = '不及格';
                passTextColor = 'text-danger';
                makeUpTextColor = 'text-red align-self-end';
              }
              if (!showNow) {
                passColor = 'card shadow h-100';
                disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                show = null;
                //isShowFailSubjectCount = false;
              }

              if (showRank && [].concat(rankTypeList || []).length > 0) {
                // 顯示排名 且 有排名 (共5個)
                col = 'col-4 col-md-4 col-lg-1-5 my-2';
                if ((!showScore && showDegree) || (showScore && !showDegree))//(共4個)
                  col = 'col-6 col-md-3 col-lg-3 my-2';
              }

              if (!showRank || [].concat(rankTypeList || []).length < 1) {
                //不顯示排名 或 沒有排名 //只有分數+等第 (共2個)
                col = 'col-6 my-2';
                if ((!showScore && showDegree) || (showScore && !showDegree)) //只有分數or只有等第  (共1個)
                  col = 'col-12 my-2';
              }

              //高雄 
              if (system_type === 'kh') {
                //*高雄沒有固定排名，不支援 第二頁
                show = null;
                disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';

                //1. 預設有分數 + 等第 + 努力程度
                col = 'col-4 col-md-4 col-lg-4 my-2';
                //2. 只有等第 + 努力程度
                //3. 只有分數 + 努力程度
                if ((!showScore && showDegree) || (showScore && !showDegree))
                  col = 'col-6 my-2';
                //4. 只有努力程度
                if (!showScore && !showDegree)
                  col = 'col-12 my-2';
              }

              return <div className="col">
                <div className={passColor}>

                  <div className="card-body">

                    <OverlayTrigger key={sss.index} placement='auto' show={currentTargetIndex === index && currentTarget === 'subject' && system_type === 'kh' && showNow}
                      containerPadding={0}
                      overlay={
                        <Popover id='popover-contained' key={sss.index} onMouseEnter={() => { handleOnMouseEnter(index, 'subject'); }} onMouseLeave={handleOnMouseLeave}>
                          <Popover.Body>
                            【{sss.domain === "" ? "" : sss.domain + "-"}{sss.subject}】<br />
                            原始分數：{sss.oscore}<br />
                            {sss.pscore === '' ? '' : '補考分數：' + sss.pscore}
                          </Popover.Body>
                        </Popover>
                      }>

                      <Link className={disabledCursor} to={show} key={sss.index} onMouseEnter={() => { handleOnMouseEnter(index, 'subject'); }} onMouseLeave={handleOnMouseLeave} onClick={() => { handleShowRankDetail(sss); }}>
                        <div className='d-flex'>
                          <div className='d-flex me-auto p-2 align-items-center'>
                            {!showNow ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}
                            <div className='fs-4 fw-bold text-start'>{sss.domain === "" ? "" : sss.domain + "-"}{sss.subject}</div>
                          </div>
                          <div className='d-flex align-items-center p-2' >
                            <div className={passTextColor}>{passText}</div>
                          </div>
                        </div>

                        <div className='d-flex  ms-4'>節/權數 {sss.period === sss.credit ? sss.credit : sss.period + '/' + sss.credit}</div>


                        <div className='row align-items-center  p-2'>
                          {!showNow ? <div><div>未開放查詢。</div> <div>開放查詢時間：{viewTime}</div></div> : <>
                            {showScore ?
                              <div className={col}>
                                <div>
                                  <div className='d-flex justify-content-center' >
                                    <div className={scoreColor}>{sss.score === '' ? '-' : sss.score}</div>
                                    <div className={makeUpTextColor}>{makeUpText}</div>
                                  </div>
                                  <div className='text-nowrap'>分數</div>
                                </div>
                              </div>
                              : <></>}

                            {showDegree ?
                              <div className={col}>
                                <div>
                                  <div className='fs-4-blue'>{sss.namedegree === '' ? '-' : sss.namedegree}</div>
                                  <div className='text-nowrap'>等第</div>
                                </div>
                              </div>
                              : <></>}

                            {system_type === 'kh' ?
                              <div className={col}>
                                <div>
                                  <div className='fs-4-blue'>{sss.effort === '' ? '-' : sss.effort}</div>
                                  <div className='text-nowrap'>努力程度</div>
                                </div>
                              </div>
                              : <></>}
                          </>
                          }

                          {semesterRankMatrix.map((rank, index) => {
                            if (showRank && showNow && system_type !== 'kh')
                              if (rank.item_type === '學期/科目成績' && rank.rank_type === selectedRankType && rank.item_name === sss.subject) {
                                return <>
                                  <div className={col}>
                                    <div>
                                      <div className='fs-4-blue text-nowrap'>{rank.rank}</div>
                                      <div className='text-nowrap'>名次</div>
                                    </div>
                                  </div>
                                  <div className={col}>
                                    <div>
                                      <div className='fs-4-blue text-nowrap'>{rank.pr}</div>
                                      <div className='text-nowrap'>PR</div>
                                    </div>
                                  </div>
                                  <div className={col}>
                                    <div>
                                      <div className='fs-4-blue text-nowrap'>{rank.percentile}</div>
                                      <div className='text-nowrap'>百分比</div>
                                    </div>
                                  </div>


                                </>
                              }
                          })}


                        </div>


                        <div className='d-flex text-start p-2 ms-2'>{sss.textq}</div>
                        {system_type === 'kh' ? '' :
                          <div className="d-flex align-items-center justify-content-end text-nowrap text-end text-more">
                            <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                            更多
                          </div>}
                      </Link>



                    </OverlayTrigger>
                  </div>



                </div>
              </div>

            })}
          </>
            : ''}



          {/* 領域成績 */}
          {selectedSubjectType === 1 ? <>
            {semesterDomainScore.map((sds, index) => {
              let makeUpText = '';
              let makeUpTextColor = 'text-blue align-self-end';
              if (Number(sds.score) === Number(sds.pscore) && Number(sds.oscore) !== Number(sds.pscore))
                makeUpText = '補';

              let col = 'col-6 my-2';
              let roundColor = '#5b9bd5';//A9D18E
              let passColor = 'card card-pass shadow h-100';
              let scoreColor = 'fs-4-blue text-nowrap';
              let show = '/RankDetail';
              let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';
              let passText = '及格';
              let passTextColor = 'text-green';

              if (Number(sds.score) < passingStardard) {
                roundColor = '#FF66CC';
                passColor = 'card card-unpass shadow h-100';
                scoreColor = 'fs-4 text-danger text-nowrap me-0 pe-0';
                passText = '不及格';
                passTextColor = 'text-danger';
                makeUpTextColor = 'text-red align-self-end';
              }
              if (!showNow) {
                passColor = 'card shadow h-100';
                disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                show = null;
                //isShowFailSubjectCount = false;
              }

              if (showRank && [].concat(rankTypeList || []).length > 0) {
                // 顯示排名 且 有排名  (共5個)
                col = 'col-4 col-md-4 col-lg-1-5 my-2';
                if ((!showScore && showDegree) || (showScore && !showDegree))  //(共4個)
                  col = 'col-6 col-md-3 col-lg-3 my-2';
              }

              if (!showRank || [].concat(rankTypeList || []).length < 1) {
                //不顯示排名 或 沒有排名
                col = 'col-6 my-2';
                if ((!showScore && showDegree) || (showScore && !showDegree)) //只有分數or只有等第
                  col = 'col-12 my-2';
              }

              //高雄 
              if (system_type === 'kh') {
                //*高雄沒有固定排名，不支援 第二頁
                show = null;
                disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';

                //1. 預設有分數 + 等第 + 努力程度
                col = 'col-4 col-md-4 col-lg-4 my-2';
                //2. 只有等第 + 努力程度
                //3. 只有分數 + 努力程度
                if ((!showScore && showDegree) || (showScore && !showDegree))
                  col = 'col-6 my-2';
                //4. 只有努力程度
                if (!showScore && !showDegree)
                  col = 'col-12 my-2';
              }

              return <div className="col"><div className={passColor}>
                <div className="card-body">
                  <OverlayTrigger key={sds.index} placement='auto' show={currentTargetIndex === index && currentTarget === 'domain' && system_type === 'kh' && showNow}
                    containerPadding={0}
                    overlay={
                      <Popover id='popover-contained' key={sds.index} onMouseEnter={() => { handleOnMouseEnter(index, 'domain'); }} onMouseLeave={handleOnMouseLeave}>
                        <Popover.Body>
                          【{sds.domain}】<br />
                          原始分數：{sds.oscore}<br />
                          {sds.pscore === '' ? '' : '補考分數：' + sds.pscore}
                        </Popover.Body>
                      </Popover>
                    }>
                    <Link className={disabledCursor} to={show} onMouseEnter={() => { handleOnMouseEnter(index, 'domain'); }} onMouseLeave={handleOnMouseLeave} onClick={() => { handleShowRankDetail(sds); }}>
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {!showNow ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}
                          <div className='fs-4 fw-bold text-start'>{sds.domain}</div>
                        </div>
                        <div className='d-flex align-items-center p-2' >
                          <div className={passTextColor}>{passText}</div>
                        </div>
                      </div>
                      <div className='d-flex  ms-4'>節/權數 {sds.period === sds.credit ? sds.credit : sds.period + '/' + sds.credit}</div>
                      <div className='row align-items-center  p-2'>

                        {!showNow ? <div><div>未開放查詢。</div> <div>開放查詢時間：{viewTime}</div></div> : <>
                          {showScore ?


                            <div className={col}>
                              <div>
                                <div className='d-flex justify-content-center' >
                                  <div className={scoreColor}>{sds.score === '' ? '-' : sds.score}</div>
                                  <div className={makeUpTextColor}>{makeUpText}</div>
                                </div>
                                <div className='text-nowrap'>分數</div>
                              </div>
                            </div>
                            : <></>}

                          {showDegree ?
                            <div className={col}>
                              <div>
                                <div className='fs-4-blue'>{sds.namedegree === '' ? '-' : sds.namedegree}</div>
                                <div className='text-nowrap'>等第</div>
                              </div>
                            </div>
                            : <></>}

                          {system_type === 'kh' ?
                            <div className={col}>
                              <div>
                                <div className='fs-4-blue'>{sds.effort === '' ? '-' : sds.effort}</div>
                                <div className='text-nowrap'>努力程度</div>
                              </div>
                            </div>
                            : <></>}
                        </>
                        }

                        {semesterRankMatrix.map((rank, index) => {
                          if (showRank && showNow && system_type !== 'kh')
                            if (rank.item_type === '學期/領域成績' && rank.rank_type === selectedRankType && rank.item_name === sds.domain) {
                              return <>
                                <div className={col}>
                                  <div>
                                    <div className='fs-4-blue text-nowrap'>{rank.rank}</div>
                                    <div className='text-nowrap'>名次</div>
                                  </div>
                                </div>
                                <div className={col}>
                                  <div>
                                    <div className='fs-4-blue text-nowrap'>{rank.pr}</div>
                                    <div className='text-nowrap'>PR</div>
                                  </div>
                                </div>
                                <div className={col}>
                                  <div>
                                    <div className='fs-4-blue text-nowrap'>{rank.percentile}</div>
                                    <div className='text-nowrap'>百分比</div>
                                  </div>
                                </div>

                              </>
                            }
                        })}


                      </div>

                      <div className='d-flex text-start p-2 ms-2'>{sds.textq}</div>
                      {system_type === 'kh' ? '' :
                        <div className="d-flex align-items-center justify-content-end text-nowrap text-end text-more">
                          <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                          更多
                        </div>}
                    </Link>
                  </OverlayTrigger>
                </div>
              </div>
              </div>

            })}
          </>
            : ''}

          {/* 總計成績 */}
          {semesterMixDomainScore.map((smds, index) => {
            let col = 'col-6 my-2';
            let scoreColor = 'fs-4-blue text-nowrap';
            let show = '/RankDetail';
            let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';

            if (Number(smds.score) < passingStardard) {
              scoreColor = 'fs-4 text-danger text-nowrap me-0 pe-0';
            }
            if (!showNow) {
              disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
              show = null;
              //isShowFailSubjectCount = false;
            }

            if (showRank && [].concat(rankTypeList || []).length > 0) {
              // 顯示排名 且 有排名  (共5個)
              col = 'col-4 col-md-4 col-lg-1-5 my-2';
              if ((!showScore && showDegree) || (showScore && !showDegree)) // (共4個)
                col = 'col-6 col-md-3 col-lg-3 my-2';
            }

            if (!showRank || [].concat(rankTypeList || []).length < 1) {
              //不顯示排名 或 沒有排名
              col = 'col-6 my-2';
              if ((!showScore && showDegree) || (showScore && !showDegree)) //只有分數or只有等第
                col = 'col-12 my-2';
            }

            //高雄 
            if (system_type === 'kh') {
              //*高雄沒有固定排名，不支援 第二頁
              show = null;
              disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';

              //1. 預設有分數 + 等第 
              col = 'col-6 my-2';
              //2. 只有等第 
              //3. 只有分數 
              if ((!showScore && showDegree) || (showScore && !showDegree))
                col = 'col-12 my-2';
            }

            return <div className="col"><div className='card shadow h-100'>
              <div className="card-body">
                <OverlayTrigger key={smds.index} placement='auto' show={currentTargetIndex === index && currentTarget === 'mixdomain' && system_type === 'kh' && showNow}
                  containerPadding={0}
                  overlay={
                    <Popover id='popover-contained' key={smds.index} onMouseEnter={() => { handleOnMouseEnter(index); }} onMouseLeave={handleOnMouseLeave}>
                      <Popover.Body>
                        【{smds.subject === '課程學習總成績' ? '課程學習成績(含彈性課程)' : smds.subject === '學習領域總成績' ? '學習領域成績' : smds.subject}】<br />
                        原始分數：{smds.oscore}<br />
                        {/* {smds.pscore === '' ? '' : '補考分數：' + smds.pscore} */}
                      </Popover.Body>
                    </Popover>
                  }>
                  <Link className={disabledCursor} to={show} onMouseEnter={() => { handleOnMouseEnter(index, 'mixdomain'); }} onMouseLeave={handleOnMouseLeave} onClick={() => { handleShowRankDetail(smds); }}>
                    <div className='d-flex'>
                      <div className='d-flex me-auto p-2 align-items-center'>
                        <div className='fs-4 fw-bold text-start'>{smds.subject === '課程學習總成績' ? '課程學習成績(含彈性課程)' : smds.subject === '學習領域總成績' ? '學習領域成績' : smds.subject}</div>
                      </div>
                    </div>

                    <div className='row align-items-center'>

                      {!showNow ? <div><div>未開放查詢。</div> <div>開放查詢時間：{viewTime}</div></div> : <>
                        {showScore ?
                          <div className={col}>
                            <div >
                              <div className={scoreColor}>{smds.score === '' ? '-' : smds.score}</div>
                              <div className='text-nowrap'>分數</div>
                            </div>
                          </div>
                          : <></>}

                        {showDegree ?
                          <div className={col}>
                            <div>
                              <div className='fs-4-blue'>{smds.namedegree === '' ? '-' : smds.namedegree}</div>
                              <div className='text-nowrap'>等第</div>
                            </div>
                          </div>
                          : <></>}
                      </>
                      }

                      {semesterRankMatrix.map((rank, index) => {
                        if (showRank && showNow && system_type !== 'kh')
                          if (rank.item_type === '學期/總計成績' && rank.rank_type === selectedRankType && rank.item_name === smds.subject) {
                            return <>
                              <div className={col}>
                                <div>
                                  <div className='fs-4-blue text-nowrap'>{rank.rank}</div>
                                  <div className='text-nowrap'>名次</div>
                                </div>
                              </div>
                              <div className={col}>
                                <div>
                                  <div className='fs-4-blue text-nowrap'>{rank.pr}</div>
                                  <div className='text-nowrap'>PR</div>
                                </div>
                              </div>
                              <div className={col}>
                                <div>
                                  <div className='fs-4-blue text-nowrap'>{rank.percentile}</div>
                                  <div className='text-nowrap'>百分比</div>
                                </div>
                              </div>


                            </>
                          }
                      })}

                      {system_type === 'kh' ? '' :
                        <div className="d-flex align-items-center justify-content-end text-nowrap text-end text-more">
                          <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
                          更多
                        </div>}
                    </div>


                  </Link>
                </OverlayTrigger>
              </div>
            </div>
            </div>

          })}


        </div>

      </div>

    </div>
  );
}

export default Main;



