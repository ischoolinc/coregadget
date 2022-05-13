import React, { useState, useEffect } from "react";
import imgRank from "./img/rank.svg";
import SeniorScoreScreen from "./screens/senior";
import JuniorScoreScreen from "./screens/junior";
import { RoundSelector } from '@fengpu-ischool/ischool-gadges.ui.round-selector';
import { FaAngleLeft, FaAngleRight, FaAngleDown, FaArrowRight, FaCheck, FaTimes, FaAngleUp } from "react-icons/fa"

function App() {

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    /*
    Warning: useLayoutEffect does nothing on the server, 
    because its effect cannot be encoded into the server 
    renderer's output format. This will lead to a mismatch 
    between the initial, non-hydrated UI and the intended UI. 
    To avoid this, useLayoutEffect should only be used in 
    components that render exclusively on the client. 
    See https://reactjs.org/link/uselayouteffect-ssr for common fixes.
    */
    //useLayoutEffect(() => {
      useEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [windowWidth, windowHeight] = useWindowSize();


  const Tab = (props) => {
    const [currentTab, setCurrentTab] = useState(0);
    const styles = {
      tabcontainer:
      {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 23,
        height: 40,
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        paddingLeft: 16,
        paddingRight: 16,
        width: '100%',
        marginBottom: 16
      }

    }
    return (<div style={styles.tabcontainer}>
      {props.tabs.map((value, index) => {
        return <div onClick={() => {
          setCurrentTab(index);
          props.tabChangeHandler({ activeIndex: index, tabName: value });
        }} style={{ display: 'flex', flex: 1, borderStyle: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: (currentTab == index) ? 4 : 0, borderBottomColor: '#5EC1C7', backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ letterSpacing: 1.5, fontSize: 18, fontWeight: '500', color: (currentTab == index) ? '#5EC1C7' : '#A3A3A3' }}>{value}</div>
        </div>
      })}
    </div>)
  }

  const Selector = (props) => {
    function changeBackgroundActive(e) {
      e.target.style.background = '#CFEDEF';
    }

    function changeBackgroundInactive(e) {
      e.target.style.background = 'white';
    }

    const maxLength = Math.max(...props.options.map((value) => value.length))
    const [optionOpen, setOptionOpen] = useState(false);
    const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
    return (<div onClick={() => { setOptionOpen(!optionOpen) }}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, borderRadius: 18, width: 80 + maxLength * 20, backgroundColor: 'white', marginRight: 24, borderColor: '#E0E0E0', borderStyle: 'solid', borderWidth: 1 }}>
      <div style={{ width: 12, marginLeft: 12 }}></div>
      <div style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', textAlign: 'center', color: '#4F4F4F', letterSpacing: 1.1, fontSize: 18, fontWeight: '500', }}>{props.options[currentOptionIndex]}</div>
      {(!optionOpen) && <FaAngleDown style={{ color: '#A3A3A3', fontSize: 12, marginRight: 12 }} />}
      {(optionOpen) && <FaAngleUp style={{ color: '#A3A3A3', fontSize: 12, marginRight: 12 }} />}
      {(optionOpen) && <div style={{
        position: 'absolute', top: 37, left: 12, width: 80 + maxLength * 20 - 24, height: 'auto',
        boxShadow: '5px 5px 14px -3px rgba(0,0,0,0.26)',
        borderColor: '#E0E0E0', borderWidth: 1, borderStyle: 'solid', letterSpacing: 1.1, color: '#4F4F4F', fontSize: 18, backgroundColor: 'white'
      }}>

        {

          props.options.map((value, index) => {
            return <div key={`selector_${index}`}
              onMouseOver={changeBackgroundActive}
              onMouseLeave={changeBackgroundInactive}
              onClick={() => {
                setOptionOpen(false);
                setCurrentOptionIndex(index);
              }}
              style={{ display: 'flex', alignItems: 'center', height: 40, justifyContent: 'center' }}>{value}</div>

          })
        }
      </div>}
    </div>)
  }


  const RSelector = (props) => {
    //TODO: css 研究 line-height 單位
    const [activeIndex, setActiveIndex] = useState(0);
    const border1 = '#A3A3A3';
    const secondery2 = '#394867';
    if (props.options.length > 1) {
      return (<div style={{ display: 'flex', flexDirection: 'row', height: 36 }}>
        {props.options.map((value, index) => {
          return <div key={`rs_${value.toString()}`} onClick={() => {
            setActiveIndex(index);
          }}
            style={{
              backgroundColor: (index == activeIndex) ? '#A0CECB' : 'white',
              borderStartStartRadius: (index == 0) ? 16 : 0, borderEndStartRadius: (index == 0) ? 16 : 0,
              borderStartEndRadius: (index == props.options.length - 1) ? 16 : 0, borderEndEndRadius: (index == props.options.length - 1) ? 16 : 0,
              borderStyle: 'solid', borderColor: '#E0E0E0', borderLeftWidth: (index == 0) ? 1 : 0,
              textAlign: 'center', letterSpacing: 1.5, lineHeight: 2.3, color: (index == activeIndex) ? secondery2 : border1, fontSize: 14, fontWeight: '500',
              width: 28 + 16 * (value.length)
            }}>{value}</div>
        })}</div>)
    } else { //只有單一選項時不顯示選單
      return null;
    }


  }

  // 載入資料中
  const [loading, setLoading] = useState(true)

  const [allStudentScore, setAllStudentScore] = useState([]);

  // 所有學年度學期
  const [allSYSItems, setAllSYSItems] = useState([
    {
      label: "",
      value: "",
      SchoolYear: "",
      Semester: ""
    }
  ]);


  const [semensterScores, setSemensterScores] = useState([]);

  // 畫面選項
  const [ScoreType, setScoreType] = useState("each");

  // 試別子項目選取
  const [SubExamChecked, setSubExamChecked] = useState("score_f");

  // 所有試別
  const [AllExams, setAllExams] = useState([]);

  // 試別成績
  const [AllExamScore, setAllExamScore] = useState([]);

  const [weightShowing, setWeightShowing] = useState(true);

  // 試別選項
  const [Exam, setExam] = useState({
    id: "",
    name: ""
  });
  // 學年度學期
  const [SYSItem, setSYSItem] = useState({
    label: "",
    value: "",
    SchoolYear: "",
    Semester: ""
  });

  // 呼叫 Service
  var _connection = null;
  // 判斷傳入參數，是家長或學生，依身分呼叫不同 Contract。
  if (window.gadget._system_position === "parent") {
    _connection = window.gadget.getContract("ischool.exam.parent");
  } else {
    _connection = window.gadget.getContract("ischool.exam.student");
  }


  // 讀取目前學年度學期
  async function GetAllCourseSemester() {
    await _connection.send({
      service: "_.GetAllCourseSemester",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          return 'err';
        } else {
          if (response.Course) {
            console.log('all course response', response);

            var allSYSItems = [];
            [].concat(response.Course.Semester || []).forEach(Semester => {
              //console.log('Semester', Semester);            
              var item = {
                label: Semester.SchoolYear + "學年度第" + Semester.Semester + "學期",
                value: Semester.SchoolYear + "_" + Semester.Semester,
                SchoolYear: Semester.SchoolYear,
                Semester: Semester.Semester
              }
              allSYSItems.push(item);
            })
            if (allSYSItems.length > 0) {
              //GetJHCourseExamScoreBySY(allSYSItems[0]);

            }
            setAllSYSItems(allSYSItems);
            console.log('allSYSItems sem', allSYSItems);


            GetJHCourseExamScore_doc(1, 2);

            allSYSItems.map((value, index) => {
              //mapping 
            })

          }
        }
      }
    });
  }

// 讀取學生資訊
async function GetStudentInfo() {
  await _connection.send({
    service: "_.GetStudentInfo",
    body: {},
    result: function (response, error, http) {
      if (error !== null) {
        console.log('ranks error std ', error);
        return 'err';
      } else {
        if (response) {

        console.log('ranks std ', response);
        
          

        }
      }
    }
  });
}
  // 讀取排名
  async function GetRank() {
    //await GetStudentInfo();

    await _connection.send({
      service: "_.GetRank",
      body: {
        SchoolYear: 107,
        Semester: 1
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('ranks error', error);
          return 'err';
        } else {
          if (response) {
          console.log('ranks ', response.RankMatrix.filter((v)=>v.rank_type=='年排名').map((d)=>d.item_name));
          console.log('ranks ', response.RankMatrix.filter((v)=>v.rank_type=='年排名').filter((d)=>d.item_name=='平均'));
          //var ranks = [].concat(response.Course.Semester || []);
            

          }
        }
      }
    });
  }

  //GetViewerConfig
  async function GetViewerConfig() {
   

    await _connection.send({
      service: "_.GetViewerConfig",
      body: {
        SchoolYear: 108,
        Semester: 2
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('ranks error', error);
          return 'err';
        } else {
          if (response) {
          
         
          //var ranks = [].concat(response.Course.Semester || []);
            

          }
        }
      }
    });
  }

  //GetScoreCalcRule
  async function GetRule() {
    //await GetStudentInfo();

    await _connection.send({
      service: "_.GetScoreCalcRule",
      body: {
        SchoolYear: 108,
        Semester: 2
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('ranks error', error);
          return 'err';
        } else {
          if (response) {
          
         
          //var ranks = [].concat(response.Course.Semester || []);
            

          }
        }
      }
    });
  }


  //
  async function GetJHAllStudentScore() {
    await _connection.send({
      service: "_.GetJHAllStudentScore",
      body: {
      },
      result: function (response, error, http) {
        if (error !== null) {
          return 'err';
        } else {
          //console.log('all student response', response.ExamScoreList.Course);
          setAllStudentScore(response.ExamScoreList.Course);
        }
      }
    });

  }


  const aggregateSemensterScores = (SchoolYear, Semester, semensterScores) => {

    //1. filtering current UI context (user selected schoolYear and semester)
    let data = semensterScores.filter((value) => {
      return (value.Semester == Semester) && (value.SchoolYear == SchoolYear)
    });
    if (data.length > 0) {
      let semData = data[0];


      ////2. finding the Union set of domain (distinct) & the Union of ExamID 
      let domainSet = new Set();
      let examIdSet = new Set();

      [].concat(semData.Course || [])
      .map((se) => {

        ischoolArrayData(se.Exam).map((seE) => {
          examIdSet.add(seE.ExamID);
        });

        //console.log('data', se.Domain);
        domainSet.add(se.Domain);
        //console.log('data2', domainSet)
      })
      let domainArr = Array.from(domainSet);
      let examIdArr = Array.from(examIdSet);//FIXME: order by displayOrder


      const averageScore = (props) => {
        let score = props.score;
        let assignment = props.assignmentScore;
        let fixTime = props.fixTime;
        let examName = props['examName'];
        let examDisplayOrder = props['examDisplayOrder'];
        if (score == '' && assignment == '') {
          return { examName, examDisplayOrder, score: '--' }
        }
        if (score != '' && assignment == '') {
          return { examName, examDisplayOrder, score: parseFloat(score).toFixed(2).toString() }
        }
        if (score == '' && assignment != '') {
          return { examName, examDisplayOrder, score: parseFloat(assignment).toFixed(2).toString() }

        }
        if (score != '' && assignment != '') {

          let percent = (parseFloat(fixTime) / 100.0);
          let percentRest = (parseFloat(100 - fixTime) / 100.0);
          return { examName, examDisplayOrder, score: (parseFloat(score) * percent + parseFloat(assignment) * percentRest).toFixed(2).toString() }

        }
      }


      /*

      Example 1:
      {"@":["ExamDisplayOrder","ExamID","ExamName"],"ExamDisplayOrder":"4","ExamID":"3","ExamName":"期末考","ScoreDetail":{"@":["CourseID","EndTime","Score"],"CourseID":"911","EndTime":"2020/12/31 23:59","Score":"","Extension":""},"subject":"數學","fixTime":{"Extension":{"ScorePercentage":"40"}},"credit":"4"}

      Example 2:
      {"@":["ExamDisplayOrder","ExamID","ExamName"],"ExamDisplayOrder":"4","ExamID":"3","ExamName":"期末考","ScoreDetail":{"@":["CourseID","EndTime","Score"],"CourseID":"911","EndTime":"2020/12/31 23:59","Score":"","Extension":""}}

      Example 3:
      {"@":["ExamDisplayOrder","ExamID","ExamName"],"ExamDisplayOrder":"2","ExamID":"2","ExamName":"第二次段考","ScoreDetail":{"@":["CourseID","EndTime","Score"],"CourseID":"760","EndTime":"2023/01/01 23:59","Score":"0","Extension":{"Extension":{"Score":"30","Text":"","Effort":"","AssignmentScore":""}}}}


      template: {"Extension":{"Score":"100","Text":"","Effort":"","AssignmentScore":"99"}}
      */

      const mockSD1 = { "@": ["ExamDisplayOrder", "ExamID", "ExamName"], "ExamDisplayOrder": "4", "ExamID": "3", "ExamName": "期末考", "ScoreDetail": { "@": ["CourseID", "EndTime", "Score"], "CourseID": "911", "EndTime": "2020/12/31 23:59", "Score": "", "Extension": "" }, "subject": "數學", "fixTime": { "Extension": { "ScorePercentage": "40" } }, "credit": "4" };
      const mockSD2 = { "@": ["ExamDisplayOrder", "ExamID", "ExamName"], "ExamDisplayOrder": "2", "ExamID": "2", "ExamName": "第二次段考", "ScoreDetail": { "@": ["CourseID", "EndTime", "Score"], "CourseID": "912", "EndTime": "2021/10/01 23:59", "Score": "0", "Extension": { "Extension": { "Score": "99", "Text": "", "Effort": "", "AssignmentScore": "" } } }, "subject": "歷史", "fixTime": { "Extension": { "ScorePercentage": "50" } }, "credit": "1" };
      const mockSD3 = { "@": ["ExamDisplayOrder", "ExamID", "ExamName"], "ExamDisplayOrder": "2", "ExamID": "2", "ExamName": "第二次段考", "ScoreDetail": { "@": ["CourseID", "EndTime", "Score"], "CourseID": "912", "EndTime": "2021/10/01 23:59", "Score": "0", "Extension": { "Extension": { "Score": "99", "Text": "", "Effort": "", "AssignmentScore": "60" } } }, "subject": "歷史2", "fixTime": { "Extension": { "ScorePercentage": "40" } }, "credit": "2" }


      const scoreDetailReducer = (arrayOfScoreDetail) => {
        let arrayOfAverageScoreWithCredit = arrayOfScoreDetail.filter((d) => d.nodata != true).map((value) => {
          console.log('scoreDetailReducer', value)
          let props = {};
          if (value.ScoreDetail.Extension == '') {
            props['examName'] = value.ExamName;
            props['examDisplayOrder'] = value.ExamDisplayOrder;
            props['score'] = '';
            props['assignmentScore'] = '';
            props['fixTime'] = '';
          } else {
            props['examName'] = value.ExamName;
            props['examDisplayOrder'] = value.ExamDisplayOrder;
            props['score'] = value.ScoreDetail.Extension.Extension.Score;
            props['assignmentScore'] = value.ScoreDetail.Extension.Extension.AssignmentScore;
            props['fixTime'] = value.fixTime.Extension ? value.fixTime.Extension.ScorePercentage : '50';
          }
          let avScore = averageScore(props);
          return { credit: value.credit, subject: value.subject, examName: value.ExamName, examDisplayOrder: value.ExamDisplayOrder, averageScore: avScore.score }
        });

        //2. data cleaning: remove empty data
        let cleanWeightScores = arrayOfAverageScoreWithCredit.filter((aasc) => aasc.averageScore != '--');
        let subjectList = arrayOfAverageScoreWithCredit.map((c) => c.subject);
        let creditList = arrayOfAverageScoreWithCredit.map((c) => c.credit);
        //console.log('abdcses', (arrayOfAverageScoreWithCredit.map((c) => c.examName).length>0)?arrayOfAverageScoreWithCredit.map((c) => c.examName)[0]:'', arrayOfAverageScoreWithCredit);
        let examName = (arrayOfAverageScoreWithCredit.map((c) => c.examName).length>0)?arrayOfAverageScoreWithCredit.map((c) => c.examName)[0]:'';
        let filteredSubjectList = cleanWeightScores.map((c) => c.subject);
        if (cleanWeightScores.length == 0) {
          return { score: '--', subjects: subjectList, credits: creditList, filteredSubjectList: filteredSubjectList, examName: examName};
        }

        //3. reduce to Numerator & reduce to Denominator
        let cleanWeightScoresAverageScores = cleanWeightScores.map((ca) => parseFloat(ca.averageScore) * parseFloat(ca.credit));
        let Numerator = cleanWeightScoresAverageScores.reduce((previousValue, currentValue) => {
          return previousValue + currentValue
        }, 0);

        let cleanWeightScoresCredits = cleanWeightScores.map((cc) => parseFloat(cc.credit));
        let Denominator = cleanWeightScoresCredits.reduce((previousValue, currentValue) => {
          return previousValue + currentValue
        }, 0);

        //4. Numerator/Denominator  (precision: 2 digits);
        let result = (cleanWeightScoresCredits.length==1)?cleanWeightScores[0].averageScore:(Numerator / Denominator).toFixed(2);

        return { score: result, subjects: subjectList, credits: creditList, filteredSubjectList: filteredSubjectList, arrayOfAverageScoreWithCredit, examName: examName };
      }

      //console.log('test expected: 83.40', scoreDetailReducer([mockSD1, mockSD2, mockSD3]))


      //3. aggregated raw data by domain

      let coursesAggregatedByDomain = domainArr.map((domainName) => {
        console.log('semData.Course', semData.Course);
        /*

        Example: 

        FixTime:
            Extension: {ScorePercentage: '50'}

        */
        let domainSpecificCourses = [].concat(semData.Course || []).filter((sElement) => {
          return sElement.Domain == domainName;
        });

        return {
          domain: domainName,
          aggregation: domainSpecificCourses
        }

      })

      //4. caculating domain-level data on top of aggregated domains

      //4.a define operation on top of 'aggregation' json structure
      /* expected JSON structure
      [{
        domain: xx,
        fixedExams: [
          {
            examID: xx,
            subjects: [
              name: xx,
              credit: xx,
              score: [{ Score: x, AssignmentScore: x FixTime: x}, ...] //raw_data of course score
            ],
            averageScore: xx
          }, ...
        ],

      }]


      */

      let ww = coursesAggregatedByDomain.map((cab) => {
        let domain = cab.domain;
        //console.log('filteredCab domain', domain);

        let examArr = examIdArr.map((eid) => {
          let examElement = [];
          let filteredCab = cab;
          let ca = cab.aggregation.map((caba) => {
            let filteredCA = ischoolArrayData(caba.Exam).filter((exid) => {
              //console.log('filteredCab fca', exid)
              return exid.ExamID == eid
            });
            let thisExidExisted = filteredCA.length > 0;

            if (thisExidExisted) {

              let flatterenCA = Object.assign(filteredCA[0],
                {
                  subject: caba.Subject,
                  fixTime: caba.FixTime,
                  credit: caba.Credit
                }
              );
              console.log('filteredCA[0]', JSON.stringify(flatterenCA))

              return flatterenCA;

            } else {

              return { nodata: true }

            }

          })
          //scoreDetailReducer([])
          console.log("filteredCab ca", scoreDetailReducer(ca), ca);

          
          let reducedScore = scoreDetailReducer(ca);

          
          return { averageScore: reducedScore, domain: ca.domain};
        });


         /*
         
          Set Union example in JS:

          let a = new Set([1,2,3]);
          let b = new Set([4,3,2]);

          let union = new Set([...a, ...b]);
          // {1,2,3,4}

          */

          

          let listOfSubjectsSet = examArr.map((ear)=>{
            //console.log('unionWithInitial ear', ear.averageScore.subjects);
            return new Set(ear.averageScore.subjects)
          })

          let listOfCredits = examArr.map((ear)=>{
            return ear.averageScore.credits
          }).reduce((previous, next)=>{
            return (previous.length>next.length)?previous:next
          },[])

          let listOfExamNamesSet = new Set();

          examArr.map((ear)=>{
            console.log('unionWithInitial ear 2', ear.averageScore.examName);
            listOfExamNamesSet.add(ear.averageScore.examName);
            console.log('unionWithInitial ear 3', listOfExamNamesSet);
          })
  
          const initialValue = new Set([]);
          const unionWithInitial = listOfSubjectsSet.reduce(
            (previousValue, currentValue) => new Set([...previousValue, ...currentValue]),
            initialValue
          );
  
          console.log('subjects', Array.from(unionWithInitial));

        let scoreList = examArr.map((e)=>{
          return e.averageScore.score;//{score: e.averageScore.score}
        })
        /*

        compared result: 'greater', 'less', 'equal', 'NA'

        */
        const scoreListCompareTagger = (sList) => {

          let sct = sList.map((v, index)=>{

            if(index==0){
              return { score: v, comparedResult: 'NA'}
            }else{
              if((v=='--')||(sList[index-1]=='--')){
                return { score: v, comparedResult: 'NA' }
              }else{
                if(parseFloat(v) > parseFloat(sList[index-1])){
                  return { score: v, comparedResult: 'greater' }
                }
                if(parseFloat(v) == parseFloat(sList[index-1])){
                  return { score: v, comparedResult: 'equal' }
                }
                if(parseFloat(v) < parseFloat(sList[index-1])){
                  return { score: v, comparedResult: 'less' }
                }
              }
            }
          })

          return sct;

        }
        let finalExamNames = Array.from(listOfExamNamesSet);
        let finalTaggedScoreList = scoreListCompareTagger(scoreList).map((sxde, sxdeIndex)=>{
          return Object.assign(sxde, {examName: finalExamNames[sxdeIndex]})
        });

        return { fixedExams: examArr, credits: listOfCredits, scores: scoreList, taggedScore: finalTaggedScoreList, domain: cab.domain==''?'彈性課程':cab.domain, subjects: Array.from(unionWithInitial), examNames: finalExamNames };
      })






      return ww;//courssesAggregatedByDomain;//domainArr;//semData.Course;//

    } else {
      return {};//無符合學年資料
    }

  }

  const ischoolArrayData = (responseData) => {
    return [].concat(responseData || [])
  }

  // 讀取學生試別成績
  async function GetJHCourseExamScore_doc(SchoolYear, Semester) {
    console.log('sem...', {
      SchoolYear: 1, //SchoolYear, //高中這可亂傳?, 會 return 全部學期 ... API semantics 與 syntax 對應不直覺
      Semester: 2 //Semester
    })
    await _connection.send({
      service: "_.GetJHCourseExamScore",
      body: {
        SchoolYear: SchoolYear,
        Semester: Semester
      },
      result: function (response, error, http) {
        if (error !== null) {
          return 'err';
        } else {
          var chkExamName = [];
          var tmpExamList = [];
          var tmpAllExamScore = [];
          console.log('sem response', response)

          if (response.ExamScoreList) {
            let seMap = ([].concat(response.ExamScoreList.Seme || [])).map(v=>{
              return{
                SchoolYear: v.SchoolYear,
                Semester: v.Semester,
                Course: [].concat(v.Course || [])

              }
            });

            setSemensterScores(seMap);
            console.log('semensterScores response', seMap, [].concat(response.ExamScoreList.Seme || []));

            [].concat(response.ExamScoreList.Seme || []).forEach(sem => {
              console.log('sem1: ', sem);
              if (sem.SchoolYear === SchoolYear && sem.Semester === Semester) {
                // 有課程資料
                if (sem.Course) {
                  [].concat(sem.Course || []).forEach(cos => {
                    console.log('cos: ', cos);
                    var ScoreItem = {
                      CourseID: cos.CourseID,
                      CourseName: cos.CourseName,
                      Credit: cos.Credit,
                      Domain: cos.Domain,
                      Subject: cos.Subject,
                      Exam: cos.Exam
                    }

                    // 整理有的試別
                    if (ScoreItem.Exam) {
                      [].concat(ScoreItem.Exam || []).forEach(exam => {
                        if (!chkExamName.includes(exam.ExamName)) {
                          chkExamName.push(exam.ExamName);
                          let exn = {
                            id: exam.ExamID,
                            name: exam.ExamName
                          }

                          tmpExamList.push(exn);
                        }

                      });
                    }
                    tmpAllExamScore.push(ScoreItem);
                  });
                }
              }
            })
            // 資料整理後
            //console.log(tmpExamList);
            // 設定成績
            setAllExamScore(tmpAllExamScore);
            //console.log('tmpAllExamScore response', tmpAllExamScore);

            // 設定整理後試別
            if (tmpExamList.length > 0) {
              setExam(tmpExamList[0]);
              //console.log('tmpExamList response: ', tmpExamList[0]);

            }
            setAllExams(tmpExamList);
            console.log('tmpExamList response: ', tmpExamList);
          }
        }
      }
    });
  }

  let _gd_connection = window.gadget.getContract("gadget.detail.setting");
  //【gadget.detail.setting】> 【_】>【GetGadgetDetailSettingByGUID】
  // 國中測試 GUID: 7307318B-B676-4AFB-98B1-FA431F212972
  async function GetGadgetDetailSetting() {
    await _gd_connection.send({
      service: "_.GetGadgetDetailSettingByGUID",
      body: {
        GUID: "7307318B-B676-4AFB-98B1-FA431F212972"
      },
      result: function (response, error, http) {
        if (error !== null) {
          return 'err';
        } else {
          console.log('GetGadgetDetailSetting', response);
          if(response.hasOwnProperty('GadgetSetting')){
          let rsp = response.GadgetSetting;
          if(rsp.hasOwnProperty('setting')){
            let setting = JSON.parse(rsp.setting);
            console.log('GetGadgetDetailSetting setting', setting)
            if(setting.hasOwnProperty('notShowCredit')){
              console.log('weight', setting.notShowCredit)
              setWeightShowing(!setting.notShowCredit);
            }
            
          }
        }
      }
      }
    });
  }

  // 載入資料
  useEffect(() => {
    // 取得所有學年度學期
    GetAllCourseSemester();
    GetJHAllStudentScore();
    GetGadgetDetailSetting();
    console.log('??ranks??')
    //GetRank();
    GetRule();
    GetViewerConfig();
    //   GetJHCourseExamScore();
    setLoading(false);
  }, []);

  var i = 0;
  function showMainScore(id) {
    if (id === ScoreType)
      return "tab-pane fade show active";
    else
      return "tab-pane fade"
  }

  function showMainScoreGroup(id) {
    if (id === ScoreType)
      return "nav-item nav-link active color-a fs-18 text-center active";
    else
      return "nav-item nav-link active color-a fs-18 text-center"
  }


  // function GetJHCourseExamScoreBySY(Item) {
  //   var ss = Item;
  //   var x = SYSItem;
  //   x.SchoolYear = ss.SchoolYear;
  //   x.Semester = ss.Semester;
  //   setSYSItem(x);             
  //   GetJHCourseExamScore();
  // }

  function GetJHCourseExamScoreBySY_doc(Item) {
    console.log('current sem: ', Item.SchoolYear, Item.Semester)
    GetJHCourseExamScore_doc(Item.SchoolYear, Item.Semester);

    // if(Item.SchoolYear==108 && Item.Semester==2){
    //   GetJHCourseExamScore_doc(Item.SchoolYear, Item.Semester);
    // }else{
    //   console.log('no sem', Item.SchoolYear, Item.Semester)
    // }

  }


  function showExamScore() {
    var examScore = [];
    if (AllExamScore.length > 0) {
      AllExamScore.forEach((data) => {
        console.log(data);
        if (data.Exam) {
          data.Exam.forEach((exam) => {
            if (exam.id === Exam.id) {
              examScore.push(data);
            }
          })
        }
      })
    }

    if (examScore.length > 0) {
      return examScore.map(item => (<tr>
        <td>{item.Subject}</td>
        <td>{item.Credit}</td>
        <td className="d-none d-md-table-cell color-r">46.0</td>
        <td>25</td>
        <td className="d-table-cell d-md-none"><span className="material-icons-outlined color-6">chevron_right</span>
        </td>
        <td></td>
      </tr>
      ))
    }

  }

  /*

    <Tab tabs={["a", "b"]} tabChangeHandler={(activeTab)=>{console.log(activeTab)}}/>
    <RSelector options={['定期','平時','總成績', '各科成績各科成績各科成績各科成績']}/>
    <RoundSelector options={['定期','平時','總成績', '各科成績各科成績各科成績各科成績']}/>

    <Selector options={allSYSItems.map((value,index)=>value.label)}/>
       
  */

  const [isModalNow, setIsModalNow] = useState(false);

  //0: 高中, 1: 國中 cocontainer px-3 px-md-4
  const [currentScreen, setCurrentScreen] = useState(0);
  return (
    <>
      {(loading) ? <div>載入中..</div> :
        <main className={(isModalNow?"":"cocontainer px-3 px-md-4")}>

          { /*<RoundSelector options={['高中', '國中']} indexChangeHandler={setCurrentScreen}></RoundSelector> */}
          <div style={{ height: 10 }}></div>

          {(currentScreen == 0) ? <SeniorScoreScreen isModalNow={isModalNow} setIsModalNow={setIsModalNow} windowWidth= {windowWidth} windowHeight= {windowHeight} semesters={allSYSItems} scores={semensterScores} /> : <JuniorScoreScreen weightShowing={weightShowing} aggregateSemensterScores={aggregateSemensterScores} allStudentScore={allStudentScore} isModalNow={isModalNow} setIsModalNow={setIsModalNow} windowWidth= {windowWidth} windowHeight= {windowHeight} semesters={allSYSItems} scores={semensterScores} />}

        </main>}
    </>
  );



}

export default App;


