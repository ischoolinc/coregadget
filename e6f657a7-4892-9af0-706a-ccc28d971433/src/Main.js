import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';


function Main() {

  // 學生清單
  const [studentDateRange, setStudentList] = useState([]);

  //選擇的學生 //sessionStorage
  const [studentID, setStudent] = useState(sessionStorage.getItem('StudentID'));

  // 該學生的所有課程學年期
  const [courseSemesterRange, setCourseSemesterList] = useState([]);

  // 該學生的指定學年期的評量清單
  const [courseExamList, setCourseExamList] = useState([]);

  //尚無資料 提示字
  const [informationText, setText] = useState("");

  //系統學年期 
  const [currSemester, setCurrSemester] = useState("");

  //當前顯示學年期 //sessionStorage
  const [selectedSemester, setViewSemester] = useState(sessionStorage.getItem('Semester'));

  //當前顯示評量ID //sessionStorage
  const [selectedExam, setViewExam] = useState(sessionStorage.getItem('ExamID'));

  //當前顯示排名類別 //sessionStorage
  const [selectedRankType, setViewRankType] = useState(sessionStorage.getItem('RankType'));

  // 該學生的指定學年期的課程成績
  const [courseExamScore, setCourseExamScore] = useState([]);

  // 該學生的指定學年期的定期評量固定排名資料
  const [examRankMatrix, setRankMatrix] = useState([]);

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

  //const [newCourseExamScore,setNewCourseExamScore] =useState([]);

  useEffect(() => {
    GetCurrentSemester();
    GetViewSetting();
  }, []);

  useEffect(() => {
    GetStudentList();
  }, [studentID]);

  useEffect(() => {
    GetCourseSemesterList();
  }, [studentID]);


  useEffect(() => {
    GetCourseExamList();
    GetAllExamScore();
    GetRankInfo();
    GetExamAvgScore();
    GetScoreCalcRulePassingStandard();
  }, [studentID, selectedSemester]);

  useEffect(() => {
    GetRankType();
  }, [selectedSemester, selectedExam]);


  var _connection = window.gadget.getContract("1campus.exam.parent");

  // 取得顯示 加權平均、算術平均 或不顯示排名 
  async function GetViewSetting() {
    await _connection.send({
      service: "_.GetViewSetting",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetViewSetting', error);
          return 'err';
        } else {
          if (response) {
            let isShowRank = (response.Setting.show_no_rank.toLowerCase() === 'true')
            setShowNoRankSetting(isShowRank);
            setAvgSetting(response.Setting.show_score);
            console.log('GetViewSetting', response.Setting);
            console.log('isShowRank', isShowRank);
            console.log('response.Setting.show_score', response.Setting.show_score);
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
          console.log('GetScoreCalcRulePassingStandard', error);
          return 'err';
        } else {
          if (response) {
            setAvgPassingStardard(response.Rule.passing_standard);
            console.log('GetScoreCalcRulePassingStandard', response.Rule.passing_standard);
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
            console.log('response.ExamAvg', response.ExamAvg);
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
          console.log('GetStudentListErr', error);
          return 'err';
        } else {
          if (response) {
            //debugger;
            setStudentList([].concat(response.Student || []));

            if (studentID === '' || studentID === null) {
              setStudent([].concat(response.Student || [])[0].id);
              //id=[].concat(response.Student || [])[0].id;
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
          console.log('GetAllCourseSemester', error);
          return 'err';
        } else {
          if (response) {
            //debugger;
            setCourseSemesterList([].concat(response.CourseSemester || []));
            if (selectedSemester === '' || selectedSemester === null) {
              setViewSemester([].concat(response.CourseSemester || [])[0].schoolyear + [].concat(response.CourseSemester || [])[0].semester);
              [].concat(response.CourseSemester || []).forEach(element => {
                if (element.schoolyear + element.semester === currSemester) {
                  setViewSemester(currSemester);
                  console.log('SScurrSemester', currSemester);
                }
              });
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
          console.log('GetCurrentSemester', error);
          return 'err';
        } else {
          if (response) {
            //setCurrSemester([].concat(response.CurrentSemester || []));
            setCurrSemester(response.CurrentSemester.schoolyear + response.CurrentSemester.semester);
            // console.log('currSemester', currSemester);
            if (!selectedSemester) {
              //debugger;
              setViewSemester(response.CurrentSemester.schoolyear + response.CurrentSemester.semester);
              // console.log('selectedSemester00', response.CurrentSemester.schoolyear + response.CurrentSemester.semester);
              // console.log('selectedSemester', selectedSemester);
            }
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
          console.log('GetCourseExamList', error);
          if (studentID === '')
            setText("請選擇學生。");
          if (selectedSemester === '')
            setText("請選擇學年度學期。");
          return 'err';
        } else {
          if (response) {
            if (isEmpty(response)) {
              setCourseExamList([]);
              setText("尚無資料。");
            }
            else {
              setText("");

              setCourseExamList([].concat(response.ExamList || []));
              if (selectedExam === '' || selectedExam === null)
                setViewExam('0');
              //setViewExam([].concat(response.ExamList || [])[0].exam_id);
            }
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
          if (!studentID)
            setText("請選擇學生。");
          if (!selectedSemester)
            setText("請選擇學年度學期。");
          return 'err';
        } else {
          if (response) {
            if (isEmpty(response)) {
              setCourseExamScore([]);
              setText("尚無資料。");
            }
            else {
              setText("");
              setCourseExamScore([].concat(response.ExamScore || []));
            }
          }
        }
      }
    });
  }

  // 取得指定學年期的固定排名
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
            if (isEmpty(response)) {
              setRankMatrix([]);
            }
            else {
              setRankMatrix([].concat(response.RankMatrix || []));
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
          console.log('GetRankType', error);
          return 'err';
        } else {
          if (response) {
            if (isEmpty(response)) {
              setRankType([]);
            }
            else {
              setRankType([].concat(response.RankType || []));
              if (selectedRankType === '' || selectedRankType === null)
                setViewRankType([].concat(response.RankType || [])[0].rank_type);
            }
          }
        }
      }
    });
  }


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
    // 按下去的時候才存
    sessionStorage.setItem('StudentID', studentID);
    sessionStorage.setItem('ExamID', selectedExam);
    sessionStorage.setItem('RankType', selectedRankType);
    sessionStorage.setItem('CourseID', e.courseID);
    sessionStorage.setItem('Semester', selectedSemester);
    sessionStorage.setItem('Subject', e.subject);
    sessionStorage.setItem('PassingStandard', e.passingStandard);
  };


  const handleChangeViewRank = (e) => {
    setViewRankType(e.target.value);
  };



  let failCount = 0;


  // 處理成績資料(for 總覽 & 進退步箭頭)
  const newCourseExamScore = [];
  let examScoreArray = [];

  let key1domain = '';
  let key1subject = '';
  let key1credit = '';
  let key1passingStandard = '';
  let newkey1 = '';
  let courseID = ''; //new key
  let itemCount = 0;
  if (Object.keys(courseExamScore).length) {
    for (let item of [].concat(courseExamScore || [])) {
      let newkey2 = item.course_id;
      let examScoreObj = {
        examID: item.exam_id,
        examName: item.exam_name,
        score: item.score,
        isPass: item.ispass,
        toView: item.toview,
        toViewtime: item.toviewtime
      }

      if (newkey1 === '') {
        examScoreArray.push(examScoreObj);
        itemCount++;
      }
      else if (newkey1 === newkey2) {
        itemCount++;
        examScoreArray.push(examScoreObj);

        //處理最後一個 
        if (itemCount === [].concat(courseExamScore || []).length) {
          let subjectObj = {
            domain: key1domain,
            subject: key1subject,
            credit: key1credit,
            passingStandard: key1passingStandard,
            examScore: examScoreArray,
            courseID: courseID
          }
          newCourseExamScore.push(subjectObj);
        }
      }
      else {
        itemCount++;

        let subjectObj = {
          domain: key1domain,
          subject: key1subject,
          credit: key1credit,
          passingStandard: key1passingStandard,
          examScore: examScoreArray,
          courseID: courseID
        }
        newCourseExamScore.push(subjectObj);
        examScoreArray = [];
        examScoreArray.push(examScoreObj);
      }
      newkey1 = newkey2;
      key1domain = item.domain;
      key1subject = item.subject;
      key1credit = item.credit;
      key1passingStandard = item.passing_standard;
      courseID = item.course_id;

      if (selectedExam === item.exam_id) {
        if (item.ispass === 'f') {//&& item.subject!==avgSetting
          failCount++;
        }

      }
    }

  }

  //avgSetting ='加權平均'
  //viewRankSetting = false;

  //寫入加權平均or算術平均

  let avgScoreArray = [];
  if (Object.keys(newCourseExamScore).length)
    if (Object.keys(examAvgList).length) {
      let obj = [];
      for (let avg of [].concat(examAvgList || [])) {
        //debugger;
        let avgScoreObj = {
          examID: avg.exam_id,
          examName: avg.exam_name,
          score: (avgSetting === '加權平均' ? Math.round(avg.w_score * 100) / 100 : Math.round(avg.a_score * 100) / 100),
          isPass: ((avgSetting === '加權平均' ? Math.round(avg.w_score * 100) / 100 : Math.round(avg.a_score * 100) / 100) >= avgPassingStardard ? 't' : 'f'),
          toView: (avg.toview === 'f' ? avg.toview : 't'), // f 或 t
          toViewtime: avg.toviewtime
          //passingStandard: avgPassingStardard
        }

        avgScoreArray.push(avgScoreObj);
        obj = {
          subject: (avgSetting === '加權平均' ? avgSetting : '算術平均'),
          examScore: avgScoreArray,
          domain: '',
          courseID: 0,
          passingStandard: avgPassingStardard
        }
      }
      newCourseExamScore.push(obj);
    }


  console.log('newCourseExamScore', newCourseExamScore);


  // 處理排名成績資料(for 進退步箭頭)
  const newExamRankMatrix = [];
  let rankMatrixArray = [];
  //let keySubject = ''; //key
  let previousSubject = '';
  let matrixCount = 0;
  if (Object.keys(examRankMatrix).length) {
    for (let matrix of [].concat(examRankMatrix || [])) {
      let examRankObj = {
        examID: matrix.ref_exam_id,
        examName: matrix.exam_name,
        create_time: matrix.create_time,
        item_type: matrix.item_type, //定期評量/科目成績
        item_name: matrix.item_name, //公民與社會
        rank_type: matrix.rank_type, //年排名
        rank_name: matrix.rank_name, //2年級
        score: matrix.score,
        rank: matrix.rank,
        PR: matrix.pr,
        percentile: matrix.percentile,
        matrix_count: matrix.matrix_count,
        level_gte100: matrix.level_gte100,
        level_90: matrix.level_90,
        level_80: matrix.level_80,
        level_70: matrix.level_70,
        level_60: matrix.level_60,
        level_50: matrix.level_50,
        level_40: matrix.level_40,
        level_30: matrix.level_30,
        level_20: matrix.level_20,
        level_10: matrix.level_10,
        level_lt10: matrix.level_lt10,
        under60: Number(matrix.level_50) + Number(matrix.level_40) + Number(matrix.level_30) + Number(matrix.level_20) + Number(matrix.level_10) + Number(matrix.level_lt10),
        avg_top_25: matrix.avg_top_25,
        avg_top_50: matrix.avg_top_50,
        avg: matrix.avg,
        avg_bottom_50: matrix.avg_bottom_50,
        avg_bottom_25: matrix.avg_bottom_25,
        std_dev_pop: matrix.std_dev_pop,
        pr_88: matrix.pr_88,
        pr_75: matrix.pr_75,
        pr_50: matrix.pr_50,
        pr_25: matrix.pr_25,
        pr_12: matrix.pr_12
      }

      if (previousSubject === '') {
        matrixCount++;
        rankMatrixArray.push(examRankObj);
      }
      else if (previousSubject === matrix.item_name) {
        matrixCount++;
        rankMatrixArray.push(examRankObj);
        //處理最後一個
        if (matrixCount === [].concat(examRankMatrix || []).length) {
          let subjectObj = {
            subject: previousSubject,
            rankMatrix: rankMatrixArray
          }
          newExamRankMatrix.push(subjectObj);
        }

      }
      else {
        matrixCount++;
        let subjectObj = {
          subject: previousSubject,
          rankMatrix: rankMatrixArray
        }
        newExamRankMatrix.push(subjectObj);
        rankMatrixArray = [];
        rankMatrixArray.push(examRankObj);
      }
      previousSubject = matrix.item_name;

    }
  }
  console.log('newExamRankMatrix', newExamRankMatrix);


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

  //若有其中一科目是不開放查詢，則最後不會顯示 "不及格科目數"
  let isShowFailSubjectCount = true;

  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 ">

        <div className='d-flex align-items-center'>

          <div style={{ width: '5px', height: '72px', background: '#5B9BD5' }}></div>

          <div>
            <div className='ms-2 me-4 d-flex align-items-center fs-4'>評量成績</div>
            {studentDateRange.map((student) => {
              if (student.id === studentID)
                return <button type="button" className="btn btn-outline-blue active me-1 ms-1" key={student.id} value={student.id} onClick={(e) => { handleChangeStudent(e); }}>{student.name}</button>
              else
                return <button type="button" className="btn btn-outline-blue me-1 ms-1" key={student.id} value={student.id} onClick={(e) => { handleChangeStudent(e); }}>{student.name}</button>
            })}
          </div>

        </div>

        <div className="d-flex col-12 col-md-6 col-lg-6 m-2">
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


        </div>
        {selectedExam === '0' || showNoRankSetting ? '' : <div className='d-flex align-items-center mb-3'>
          <div className="col-2 col-md-2 col-lg-1">排名類別</div>
          <div className="col-10 col-md-4 col-lg-5 m-2">
            <select className="form-select" value={selectedRankType} onChange={(e) => handleChangeViewRank(e)}>
              <option value="Y" key="Y">(選擇排名類別)</option>
              {examRankType.map((rankType, index) => {
                return <option key={index} value={rankType.rank_type}>
                  {rankType.rank_type}</option>
              })}
            </select>
          </div>
        </div>}


        <div>{informationText}</div>


        <div className="row row-cols-1 row-cols-md-2 g-4">

          {newCourseExamScore.map((ces) => {
            //debugger;
            return <>
              {[].concat(ces.examScore || []).map((exam, index) => {
                if (exam.examID === selectedExam) {
                  let roundColor = '#A9D18E';
                  let passColor = 'card card-pass';
                  let scoreColor = 'fs-4';
                  let show = '/RankDetail';
                  let disabledCursor = 'card-block stretched-link text-decoration-none link-dark';
                  if (exam.isPass === 'f') {
                    roundColor = '#FF0000';
                    passColor = 'card card-unpass';
                    scoreColor = 'fs-4 text-danger';
                  }
                  if (exam.toView === 'f' || ces.subject === avgSetting) {
                    roundColor = '#5B9BD5';
                    passColor = 'card';
                    if (exam.toView === 'f') {
                      disabledCursor = 'card-block stretched-link text-decoration-none link-dark disabledCursor';
                      show = null;
                      isShowFailSubjectCount = false;
                    }
                  }

                  if (exam.score === '') {
                    roundColor = '#5B9BD5';
                    scoreColor = 'fs-4';
                    passColor = 'card';
                  }
                  let im = 0;
                  let previousEaxmID = selectedExam;
                  if (index !== 0)
                    im = index - 1;
                  previousEaxmID = ces.examScore[im].examID;

                  return <div className="col"><div className={passColor}>
                    <div className="card-body">
                      <Link className={disabledCursor} to={show} onClick={() => { handleShowRankDetail(ces); }}>
                        <div className='d-flex'>
                          <div className='d-flex me-auto p-2 align-items-center'>
                            {ces.subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div>}
                            {/* <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: roundColor }}></div> */}
                            <div className='fs-4 fw-bold'>{ces.domain === "" ? "" : ces.domain + "-"}{ces.subject}</div>
                          </div>
                          <div className='d-flex p-2' >
                            <div>{ces.subject === avgSetting ? '' : '權數'}</div><div>{ces.credit}</div>
                          </div>
                        </div>


                        <div className='d-flex justify-content-center'>
                          {exam.toView === 'f' ? <div><div>未開放查詢。</div> <div>開放查詢時間：{exam.toViewtime}</div></div> : <div className='row align-items-center'>
                            <div className='row align-items-center mx-1'>

                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{exam.score === '' ? '-' : exam.score}
                                </div>
                                <div>{index === 0 || exam.toView === 'f' ? '' : ces.examScore[index].score > ces.examScore[im].score ? '↑' : ces.examScore[index].score === ces.examScore[im].score ? '' : '↓'}</div>
                              </div>

                              <div>分數</div>
                            </div>
                          </div>

                          }

                          {newExamRankMatrix.map((rank, index) => {
                            if (exam.toView === 't')
                              if (rank.subject === ces.subject) {
                                let previousEaxmRank = '0';
                                return <>
                                  {[].concat(rank.rankMatrix || []).map((matrix, index) => {

                                    if (matrix.rank_type === selectedRankType && matrix.examID === previousEaxmID)
                                      previousEaxmRank = matrix.rank;

                                    if (matrix.rank_type === selectedRankType && matrix.examID === selectedExam && !showNoRankSetting)

                                      return <div className='d-flex justify-content-around'>
                                        <div className='row align-items-center mx-1'>
                                          <div className='d-flex justify-content-center'>
                                            <div className='fs-4'>{matrix.rank}</div>
                                            <div>{previousEaxmRank === '0' || previousEaxmID === '' ? '' : matrix.rank > previousEaxmRank ? '↓' : matrix.rank === previousEaxmRank ? '' : '↑'}</div>
                                          </div>
                                          <div>名次</div>
                                        </div>

                                        <div className='row align-items-center mx-1'>
                                          <div className='d-flex justify-content-center'>
                                            <div className='fs-4'>{matrix.PR}</div>
                                          </div>
                                          <div>PR</div>
                                        </div>

                                        <div className='row align-items-center mx-1'>
                                          <div className='d-flex justify-content-center'>
                                            <div className='fs-4'>{matrix.percentile}</div>
                                          </div>
                                          <div>百分比</div>
                                        </div>
                                      </div>
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

          {newCourseExamScore.map((nces) => {

            if (selectedExam === '0') {
              return <div className="col">
                <div className={nces.subject === avgSetting ? 'card' : 'card card-pass'}>
                  <div className="card-body">
                    <div className="card-block">
                      <div className='d-flex'>
                        <div className='d-flex me-auto p-2 align-items-center'>
                          {nces.subject === avgSetting ? <></> : <div className='rounded-circle me-1' style={{ width: '10px', height: '10px', background: '#8FAADC' }}></div>}

                          <div className='fs-4 fw-bold'>{nces.domain === "" ? "" : nces.domain + "-"}{nces.subject}</div>
                        </div>
                        <div className='d-flex p-2' >
                          <div>{nces.subject === avgSetting ? '' : '權數'}</div><div>{nces.credit}</div>
                        </div>
                      </div>

                      {/* <div className='d-flex justify-content-around'> */}{/* 一排版面:取消註解 */}
                      <div className='row align-items-center'>{/* 一排版面:註解 */}

                        {[].concat(nces.examScore || []).map((exam, index) => {
                          let scoreColor = 'fs-4';
                          if (exam.isPass === 'f') {
                            scoreColor = 'fs-4 text-danger';
                          }
                          if (exam.toView === 'f' || exam.score === '') {
                            scoreColor = 'fs';
                          }

                          let im = 0;
                          if (index !== 0)
                            im = index - 1
                          return <div className='col-12 col-md-6 col-lg-6'>{/* 一排版面:刪除 */}
                            <div className='row align-items-center m-2'>{/* 一排版面:m-2刪除 */}
                              <div className='d-flex justify-content-center'>
                                <div className={scoreColor}>{exam.toView === 't' ? exam.score === '' ? '-' : exam.score : <div className='text-unview'><div>開放查詢時間：</div><div>{exam.toViewtime}</div></div>}
                                </div>
                                <div>{index === 0 || exam.toView === 'f' ? '' : nces.examScore[index].score > nces.examScore[im].score ? '↑' : nces.examScore[index].score === nces.examScore[im].score ? '' : '↓'}</div>
                              </div>
                              <div>{exam.examName}</div>
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

        {informationText || !isShowFailSubjectCount || selectedExam === '0' ? "" : <div>
          <div className='d-flex justify-content-left'>
            <div>不及格科目數：</div><div>{failCount}</div>
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


