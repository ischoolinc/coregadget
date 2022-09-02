import React, { useState, useEffect } from "react";
import imgRank from "./img/rank.svg";
import { RoundSelector } from '@fengpu-ischool/ischool-gadges.ui.round-selector';
import { FaAngleLeft, FaAngleRight, FaAngleDown, FaArrowRight, FaCheck, FaTimes, FaAngleUp } from "react-icons/fa"

function App() {


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
    return( <div style={styles.tabcontainer}>
      {props.tabs.map((value, index)=>{
        return <div onClick={()=>{
          setCurrentTab(index);
          props.tabChangeHandler({activeIndex: index, tabName: value});
          }} style={{display: 'flex', flex: 1, borderStyle: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: (currentTab==index)?4:0,borderBottomColor: '#5EC1C7', backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{letterSpacing: 1.5, fontSize: 18, fontWeight: '500', color: (currentTab==index)?'#5EC1C7':'#A3A3A3'}}>{value}</div>
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

    const maxLength = Math.max(...props.options.map((value)=>value.length))
    const [optionOpen, setOptionOpen]=useState(false);
    const [currentOptionIndex, setCurrentOptionIndex]=useState(0);
    return (<div onClick={()=>{setOptionOpen(!optionOpen)}}
    style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, borderRadius: 18, width: 80+maxLength*20, backgroundColor: 'white', marginRight: 24, borderColor: '#E0E0E0', borderStyle: 'solid', borderWidth: 1}}>
    <div style={{width: 12, marginLeft: 12}}></div>
    <div style={{flex: 1, backgroundColor: 'white', alignItems: 'center', textAlign: 'center', color: '#4F4F4F', letterSpacing: 1.1, fontSize: 18, fontWeight: '500',}}>{props.options[currentOptionIndex]}</div>
    {(!optionOpen)&&<FaAngleDown style={{color: '#A3A3A3', fontSize: 12, marginRight: 12}}/>}
    {(optionOpen)&&<FaAngleUp style={{color: '#A3A3A3', fontSize: 12, marginRight: 12}}/>}
    {(optionOpen)&&<div style={{position: 'absolute', top: 37, left: 12, width: 80+maxLength*20-24, height: 'auto', 
    boxShadow: '5px 5px 14px -3px rgba(0,0,0,0.26)',
    borderColor: '#E0E0E0', borderWidth: 1, borderStyle: 'solid', letterSpacing: 1.1, color: '#4F4F4F', fontSize: 18, backgroundColor: 'white'}}>
     
      {

        props.options.map((value, index)=>{
          return <div key={`selector_${index}`} 
          onMouseOver={changeBackgroundActive}
          onMouseLeave={changeBackgroundInactive}
          onClick={()=>{
            setOptionOpen(false);
            setCurrentOptionIndex(index);
          }}
        style={{display: 'flex', alignItems: 'center', height: 40, justifyContent: 'center'}}>{value}</div>

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
    if(props.options.length > 1){
      return(<div style={{display: 'flex', flexDirection: 'row', height:  36}}>
        {props.options.map((value, index)=>{
          return <div key={`rs_${value.toString()}`} onClick={()=>{
            setActiveIndex(index);
          }}
          style={{backgroundColor: (index==activeIndex)?'#A0CECB':'white', 
          borderStartStartRadius: (index==0)?16:0, borderEndStartRadius: (index==0)?16:0,
          borderStartEndRadius: (index==props.options.length-1)?16:0, borderEndEndRadius: (index==props.options.length-1)?16:0,
          borderStyle: 'solid', borderColor: '#E0E0E0', borderLeftWidth: (index==0)?1:0,
          textAlign: 'center', letterSpacing: 1.5, lineHeight: 2.3, color:(index==activeIndex)?secondery2:border1, fontSize: 14, fontWeight: '500',
          width: 28+ 16*(value.length)}}>{value}</div>
        })}</div>)  
    }else{ //只有單一選項時不顯示選單
      return null;
    }
    
   
  }

  // 載入資料中
  const [loading, setLoading] = useState(true)

  // 所有學年度學期
  const [AllSYSItems, setAllSYSItems] = useState([
    {
      label: "",
      value: "",
      SchoolYear: "",
      Semester: ""
    }
  ]);

  // 畫面選項
  const [ScoreType, setScoreType] = useState("each");

  // 試別子項目選取
  const [SubExamChecked, setSubExamChecked] = useState("score_f");

  // 所有試別
  const [AllExams, setAllExams] = useState([]);

  // 試別成績
  const [AllExamScore, setAllExamScore] = useState([]);

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
              GetJHCourseExamScoreBySY(allSYSItems[0]);
              //setSYSItem(allSYSItems[0]);
            }
            setAllSYSItems(allSYSItems)
          }
        }
      }
    });
  }

  // 讀取學生試別成績
  async function GetJHCourseExamScore() {
    //console.log(Item.SchoolYear,Item.Semester);
    console.log(SYSItem.SchoolYear,SYSItem.Semester);
    await _connection.send({
      service: "_.GetJHCourseExamScore",
      body: {
        SchoolYear: SYSItem.SchoolYear,
        Semester: SYSItem.Semester
      },
      result: function (response, error, http) {
        if (error !== null) {
          return 'err';
        } else {
          var chkExamName = [];
          var tmpExamList = [];
          var tmpAllExamScore = [];
          if (response.ExamScoreList) {
            [].concat(response.ExamScoreList.Seme || []).forEach(sem => {
              console.log('sem: ', sem);
              if (sem.SchoolYear === SYSItem.SchoolYear && sem.Semester === SYSItem.Semester) {
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
            // 設定整理後試別
            if (tmpExamList.length > 0) {
              setExam(tmpExamList[0]);
            }
            setAllExams(tmpExamList);
          }
        }
      }
    });
  }

  // 載入資料
  useEffect(() => {
    // 取得所有學年度學期
    GetAllCourseSemester();
 //   GetJHCourseExamScore();
    setLoading(false);

    

  }, [loading]);

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


  function GetJHCourseExamScoreBySY(Item) {
    var ss = Item;
    var x = SYSItem;
    x.SchoolYear = ss.SchoolYear;
    x.Semester = ss.Semester;
    setSYSItem(x);             
    GetJHCourseExamScore();
  }


  function showExamScore() {
    var examScore = [];
    if (AllExamScore.length > 0)
    {
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
   
if(examScore.length > 0) {
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

  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.663 15H12.336H7.663ZM10 1V2V1ZM16.364 3.636L15.657 4.343L16.364 3.636ZM19 10H18H19ZM2 10H1H2ZM4.343 4.343L3.636 3.636L4.343 4.343ZM6.464 13.536C5.76487 12.8367 5.2888 11.9458 5.09598 10.9759C4.90316 10.006 5.00225 9.00076 5.38073 8.08721C5.75921 7.17366 6.40007 6.39284 7.22229 5.84349C8.0445 5.29414 9.01115 5.00093 10 5.00093C10.9889 5.00093 11.9555 5.29414 12.7777 5.84349C13.5999 6.39284 14.2408 7.17366 14.6193 8.08721C14.9977 9.00076 15.0968 10.006 14.904 10.9759C14.7112 11.9458 14.2351 12.8367 13.536 13.536L12.988 14.083C12.6747 14.3963 12.4262 14.7683 12.2567 15.1777C12.0872 15.5871 11.9999 16.0259 12 16.469V17C12 17.5304 11.7893 18.0391 11.4142 18.4142C11.0391 18.7893 10.5304 19 10 19C9.46957 19 8.96086 18.7893 8.58579 18.4142C8.21071 18.0391 8 17.5304 8 17V16.469C8 15.574 7.644 14.715 7.012 14.083L6.464 13.536Z" stroke="#394867" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  */

  // var AllSYSItems1 =
  //   [
  //     { value: "1", label: "test1", abc: "1" },
  //     { value: "2", label: "test2", abc: "2" },
  //     { value: "3", label: "test3", abc: "3" }
  //   ];

  if (loading) {
    return (<div>載入中..</div>);
  } else {
    return (
      <main className="cocontainer px-3 px-md-4">
        
        <div className="w-100">
          <div className="d-none d-md-block fs-36 fw-600 pt-5" style={{ letterSpacing: "6px" }} >評量成績</div>
          <Tab tabs={['各科成績', '領域成績', '領域成績']} tabChangeHandler={(activeTab)=>{console.log(activeTab)}}/>
          <Selector options={['各科成績', '領域成績', '領域成績', 'a', 'b', 'c', 'd', '領域域成成績']}/>
          <div style={{height: 10}}></div>
          <RSelector options={['定期','平時','總成績', '各科成績各科成績各科成績各科成績']}/>
          <RoundSelector options={['定期','平時','總成績', '各科成績各科成績各科成績各科成績']}/>
          <div >{JSON.stringify(AllSYSItems)}</div>
          <div>{'----'}</div>
          <div>{JSON.stringify(Exam)}</div>
          <div>{'----'}</div>
          <div>{JSON.stringify(AllExamScore)}</div>
          <div className="d-flex flex-column flex-md-row pt-2 pb-4">
            <select className="selectpicker w-240 pt-3" onChange={(e) => {             
            GetJHCourseExamScoreBySY(JSON.parse(e.target.value))
            }}>
              {
                AllSYSItems.map((item) => (<option key={item.label} value={JSON.stringify(item)}>{item.label}</option>))
              }
            </select>
            <div className="pr-4"></div>
            <select className="selectpicker w-180 pt-3" onChange={(e) => {
              setExam(JSON.parse(e.target.value));
            }}>
              {
                AllExams.map(item => (<option key={item.id} value={JSON.stringify(item)}>{item.name}</option>))
              }
            </select>
          </div>
          <nav>
            <div className="nav nav-tabs flex-nowrap" id="nav-tab" role="tablist">
              <a className={`nav-item nav-link active color-a fs-18 text-center ${ScoreType === "each" ? "active" : ""}`} style={{ width: " 190px" }} id="each-tab"
                data-toggle="tab" href="#each" role="tab" aria-controls="each" aria-selected={ScoreType === "each"} onClick={(e) => {
                  setScoreType("each");
                }}>各科成績</a>
              <a className={`nav-item nav-link active color-a fs-18 text-center ${ScoreType === "local" ? "active" : ""}`} style={{ width: " 190px" }} id="local-tab" data-toggle="tab"
                href="#local" role="tab" aria-controls="local" aria-selected={ScoreType === "local"} onClick={(e) => {
                  setScoreType("local");
                }} >領域成績</a>
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            <div className={`${ScoreType === "each" ? "tab-pane fade show active" : "tab-pane fade"}`}  id="each" role="tabpanel" aria-labelledby="each-tab">
              <div className="d-flex align-items-center text-nowrap py-4">
                <div className="pr-2 pr-md-3">成績顯示</div>
                <div>
                  <input type="radio" name="score" id="score_f" checked={SubExamChecked === "score_f"} onChange={(e) => { setSubExamChecked("score_f") }}></input>
                  <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" htmlFor="score_f">定期</label>
                  <th style={{ borderTopRightRadius: "8px" }}></th>
                </div>
              </div>
              <table className="table table-borderless table-striped text-center text-nowrap">
                <thead className="table-light">
                  <tr className="color-3">
                    <th style={{ borderTopLeftRadius: "8px", width: "208px" }} >科目名稱</th>
                    <th>權數</th>
                    <th>成績</th>
                    <th>排名</th>
                    <th className="d-table-cell d-md-none">詳細</th>
                    <th style={{ borderTopRightRadius: "8px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {showExamScore}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="" colSpan={2}>加權總分/排名</td>
                    <td className="d-none d-md-table-cell text-right" style={{ width: "200px" }}>
                      <span className="mr-2">12857.000</span>
                      <span className="rank fs-14" style={{ padding: " 2px 13px" }}>
                        <img src={process.env.PUBLIC_URL + imgRank} alt="" className="mr-1 align-baseline" /><span>16</span>
                      </span>
                    </td>

                  </tr>
                  <tr>
                    <td className="" colSpan={2}>加權平均/排名</td>
                    <td className="d-none d-md-table-cell text-right">
                      <span className="mr-2">78.000</span>
                      <span className="rank fs-14" style={{ padding: " 2px 13px" }}>
                        <img src={imgRank} alt="" className="mr-1 align-baseline" /><span>17</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="" colSpan={2}>算術平均/排名</td>
                    <td className="d-none d-md-table-cell text-right">
                      <span className="mr-2">857.000</span>
                      <span className="rank fs-14" style={{ padding: " 2px 13px" }}>
                        <img src={imgRank} alt="" className="mr-1 align-baseline" /><span>17</span>
                      </span>
                    </td>
                  </tr>
                  <tr style={{ borderRadius: "8px" }}>
                    <td className="" colSpan={2}>算術總分/排名</td>
                    <td className="d-none d-md-table-cell text-right">
                      <span className="mr-2">78.000</span>
                      <span className="rank fs-14" style={{ padding: " 2px 13px" }}>
                        <img src={imgRank} alt="" className="mr-1 align-baseline" /><span>17</span>
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="p-4"></div>
              <div className="d-none d-md-block">
                <div className="d-flex align-items-center py-4">
                  <div className="pr-3">定期評量級距</div>{Exam.name}
                  <div>
                    <input type="radio" name="level" id="level1" />
                    <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" style={{ width: "120px" }}
                      htmlFor="level1">{Exam.id}</label>
                  </div>
                </div>

                <table className="table table-borderless table-striped text-center text-nowrap"
                  style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <thead className="table-light">
                    <tr className="color-3">
                      <th style={{ borderTopLeftRadius: "8px" }}>科目名稱</th>
                      <th>0-9</th>
                      <th>10-19</th>
                      <th>20-29</th>
                      <th>30-39</th>
                      <th>40-49</th>
                      <th>50-59</th>
                      <th>60-69</th>
                      <th>70-79</th>
                      <th>80-89</th>
                      <th>90-99</th>
                      <th style={{ borderTopRightRadius: "8px" }}>100</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>國語文</td>
                      <td>0</td>
                      <td>0</td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td className="bg-r">23</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>英語文</td>
                      <td>0</td>
                      <td>0</td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td className="bg-g">14</td>
                      <td>6</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>數學</td>
                      <td>0</td>
                      <td>0</td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td className="bg-g">6</td>
                      <td>3</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>歷史</td>
                      <td>0</td>
                      <td>0</td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td className="bg-g">3</td>
                      <td>2</td>
                      <td>1</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="tab-pane fade" id="local" role="tabpanel" aria-labelledby="local-tab">
                <div className="p-4"></div>
                <table className="table table-borderless table-striped text-center text-nowrap"
                  style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <thead className="table-light">
                    <tr className="color-3">
                      <th style={{ borderTopLeftRadius: "8px" }}>領域</th>
                      <th>科目名稱</th>
                      <th>權數</th>
                      <th className="d-none d-md-table-cell">第一次段考</th>
                      <th className="d-none d-md-table-cell">第二次段考</th>
                      <th className="d-none d-md-table-cell">期末考</th>
                      <th className="d-table-cell d-md-none">成績</th>
                      <th style={{ borderTopRightRadius: "8px" }}></th>
                    </tr>
                  </thead>
                </table>
              </div>

            </div>

            <div className={`${ScoreType === "local" ? "tab-pane fade show active" : "tab-pane fade"}`} id="local" role="tabpanel" aria-labelledby="local-tab">
              <div className="p-4"></div>
              <table className="table table-borderless table-striped text-center text-nowrap"
                style={{ borderBottom: "1px solid #e0e0e0" }}>
                <thead className="table-light">
                  <tr className="color-3">
                    <th style={{ borderTopLeftRadius: "8px" }}>領域</th>
                    <th>科目名稱</th>
                    <th>權數</th>
                    <th className="d-none d-md-table-cell">第一次段考</th>
                    <th className="d-none d-md-table-cell">第二次段考</th>
                    <th className="d-none d-md-table-cell">期末考</th>
                    <th className="d-table-cell d-md-none">成績</th>
                    <th style={{ borderTopRightRadius: "8px" }}></th>
                  </tr>
                </thead>

              </table>
            </div>


          </div>
        </div>
      </main>
    );
  }


}

export default App;
