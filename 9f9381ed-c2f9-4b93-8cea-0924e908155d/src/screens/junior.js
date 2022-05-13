import React, { useState, useEffect } from "react";
import { Dropdown } from '@fengpu-ischool/ischool-gadges.ui.dropdown';
import OneCampusTable from '../components/OneCampusTable';
import Switch from "react-switch";
import { RoundSelector } from '@fengpu-ischool/ischool-gadges.ui.round-selector';
import { FaArrowUp, FaArrowDown, FaEquals, FaAngleLeft } from "react-icons/fa";
import { Tab } from '@fengpu-ischool/ischool-gadges.ui.tab';
import { DateTime } from 'luxon';
import { ggScope } from '../helper/ggScope';

//https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
function isValidDate(d) {
  return d instanceof DateTime && !isNaN(d);
}

const JuniorScoreScreen = (props) => {

  const ScoreTabs = ['科目成績', '領域成績'];
  const [showMeTheScore, setShowMeTheScore] = useState(false);
  const [currentSemester, setCurrentSemesterIndex] = useState(0);
  const [credits, setCredits] = useState([]);
  const [mySemsSubjScore, setMySemsSubjScore] = useState([]);
  const [semsEntryScore, setSemsEntryScore] = useState([]);
  const [student, setStudent] = useState({});

  const [semesterIndex, setSemesterIndex] = useState(0);
  const [currentExamType, setCurrentExamType] = useState(0);
  const [currentSelectExamIndex, setCurrentSelectExamIndex] = useState(0)
  //const [hasCredit, setHasCredit] = useState(false);
  //props.semesters.map((value)=>value.label)
  const [dataDetail, setDataDetail] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredHeaders, setFilteredHeaders] = useState([])
  const [scoreDisplayType, setScoreDisplayType] = useState(0);

  const [currentYS, setCurrentYS] = useState({ schoolYear: '0', semester: '0' });
  const [currentModalData, setCurrentModalData] = useState({});

  const [subjectOrder, setSubjectOrder] = useState([]);

  const [currentValidSubjects, setCurrentValidSubjects] = useState([]);

  // 呼叫 Service
  var _connection = null;
  // 判斷傳入參數，是家長或學生，依身分呼叫不同 Contract。
  if (window.gadget._system_position === "parent") {
    _connection = window.gadget.getContract("ischool.exam.parent");
  } else {
    _connection = window.gadget.getContract("ischool.exam.student");
  }


  const getSubjectsOrder = async () => {
    console.log('國中跟高中 service name 不同, 國中要新增 GetSubjectsOrder', props.scores)
    await _connection.send({
      service: "_.GetSubjectsOrder",
      body: {
      },
      result: function (response, error, http) {
        if (error !== null) {
          console.log('getSubjectsOrder error', error);
          return 'err';
        } else {
          if (response) {
            console.log('detailTransform2 getSubjectsOrder', response);
            setSubjectOrder(response);
            console.log('to firebase if the service is not available')

          }
        }
      }
    });
  }

  useEffect(() => {

    getSubjectsOrder();

    const getGG = async () => {
      let gg = await ggScope('107', '1', setCredits, setMySemsSubjScore, setSemsEntryScore, setStudent);
    }

    getGG();

  }, []);



  useEffect(() => {
    setCurrentYS((props.scores.length > 1) ? props.scores.map(value => { return { schoolYear: value.SchoolYear, semester: value.Semester } }).reverse()[semesterIndex] : { schoolYear: '', semester: '' });
  }, [props.scores, semesterIndex])
  const passScoreGrade = 60;

  const today = DateTime.local();

  const CommonVerticalMargin = (props) => <div style={{ height: 10 }}></div>

  const cellAverageScore = (score, assignment, fixTime) => {
    if (score == '--' && assignment == '--') {
      return <div>{'--'}</div>
    }
    if (score != '--' && assignment == '--') {
      return <div>{parseFloat(score).toFixed(2).toString()}</div>
    }
    if (score == '--' && assignment != '--') {
      return <div>{parseFloat(assignment).toFixed(2).toString()}</div>
    }
    if (score != '--' && assignment != '--') {
      let percent = (parseFloat(fixTime) / 100.0);
      let percentRest = (parseFloat(100 - fixTime) / 100.0);
      return <div>{`${(parseFloat(score) * percent + parseFloat(assignment) * percentRest).toFixed(2).toString()}`}</div>
    }
    //(${parseFloat(score).toFixed(2).toString()}/${parseFloat(assignment).toFixed(2).toString()})

  }

  const averageScore = (props) => {
    let score = props.score;
    let assignment = props.assignmentScore;
    let fixTime = props.fixTime;
    if (score == '--' && assignment == '--') {
      return '--'
    }
    if (score != '--' && assignment == '--') {
      return parseFloat(score).toFixed(2).toString()
    }
    if (score == '--' && assignment != '--') {
      return parseFloat(assignment).toFixed(2).toString()

    }
    if (score != '--' && assignment != '--') {
      //console.log('avScore', props)
      let percent = (parseFloat(fixTime) / 100.0);
      let percentRest = (parseFloat(100 - fixTime) / 100.0);
      return (parseFloat(score) * percent + parseFloat(assignment) * percentRest).toFixed(2).toString()

    }

  }

  const cellNotOpenYet = () => <div>{`尚未開放`}</div>

  const cellActive = (value) => {
    return (<div>
      {(scoreDisplayType == 0) && <div style={{ color: (parseFloat(value.score) < passScoreGrade) ? '#CD5B6D' : '#4F4F4F' }}>{(value.score == '--') ? '--' : parseFloat(value.score).toFixed(2).toString()}</div>}
      {(scoreDisplayType == 1) && <div style={{ color: (parseFloat(value.assignmentScore) < passScoreGrade) ? '#CD5B6D' : '#4F4F4F' }}>{(value.assignmentScore == '--') ? '--' : `${parseFloat(value.assignmentScore).toFixed(2).toString()}`}</div>}
      {(scoreDisplayType == 2) && cellAverageScore(value.score, value.assignmentScore, value.fixTime)}
    </div>)
  }

  const cellTemplate = (cell) => {
    return {
      Header: cell.header,
      accessor: cell.accessor,
      Cell: (props) => {
        if (props.value) {

          if (isValidDate(props.value.endTime)) {
            return <div>{(props.value) ? (props.value.endTime < today) ? cellActive(props.value) :
              (!showMeTheScore) ? cellNotOpenYet() : cellActive(props.value)
              : cellActive({ "score": "--", "assignmentScore": "--" })}</div> //<div>{`${props.value.score}_${props.value.assignmentScore}`}</div>
          } else {
            return <div>{cellActive(props.value)}</div>
          }

        } else {

          return <div></div>


        }

      }

    }
  }



  useEffect(() => {
    console.log('semensterScores response props.scores', props.scores);

    let header = props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers : [];
    let td = props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).transformedData.map(dd=>dd.subject):[];
    setCurrentValidSubjects(td);
    setHeaders(props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers : [])
    if (props.windowWidth > 1300) {
      setFilteredHeaders(props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers : [])
    } else {
      //console.log('Object.keys(headers)[index]2.6', dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers[[Object.keys((props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers : []))[0]]])
      let filtered = dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers[[Object.keys((props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).headers : []))[0]]];
      if (filtered) {
        let f = {};
        f[Object.keys(header)[0]] = filtered
        //console.log('Object.keys(headers)[index]3', filtered, header);
        setFilteredHeaders(f)

      } else {

        setFilteredHeaders([]);
        //console.log('Object.keys(headers)[index]3.1');
      }

    }

  }, [props.scores, props.windowWidth, currentYS]);

  const [matrixData, setMatrixData] = useState([]);

  const updatedProcedure = () => {

    console.log('enter taggedScoreDetail ');

    let m = props.allStudentScore.filter((value) => {
      let currentYS = props.scores.map(cys => { return { schoolYear: cys.SchoolYear, semester: cys.Semester } }).reverse()[semesterIndex];

      console.log('cys taggedScoreDetail ', currentYS, value, value.SchoolYear, currentYS.schoolYear, value.Semester, currentYS.semester);

      if (currentYS == undefined) {
        console.log('cys taggedScoreDetail 1')
        return false
      } else {
        if (currentYS.schoolYear == undefined) {
          console.log('cys taggedScoreDetail 2')
          return false;
        } else {
          if (currentYS.semester == undefined) {
            console.log('cys taggedScoreDetail 3')
            return false;

          } else {
            console.log('cys taggedScoreDetail2 ', value.SchoolYear, currentYS.schoolYear);
            return (value.SchoolYear == currentYS.schoolYear) && (value.Semester == currentYS.semester)
          }

        }

      }

    }).map((value => {


      let levels = ['Level0', 'Level10', 'Level20', 'Level30', 'Level40', 'Level50', 'Level60', 'Level70', 'Level80', 'Level90', 'Level100'];
      //Object.keys(value.ScoreDetail[currentExamType]).filter((value)=>(value!='ExamID')&&(value!='@'));

      //console.log(value.ScoreDetail[currentExamType]);
      //value.ScoreDetail.filter((v)=>v.ExamID == (currentExamType+1).toString())[0]//
      function difference(setA, setB) {
        const diff = new Set(setA);

        for (const elem of setB) {
          diff.delete(elem);
        }

        return diff;
      }
      const dataCleaningForRawScoreDetail = (rsd) => {
        /*

        {"Level0":{"score":"0","color":"transparent"},"Level10":{"score":"0","color":"transparent"},"Level20":{"score":"0","color":"transparent"},"Level30":{"score":"0","color":"transparent"},"Level40":{"score":"0","color":"transparent"},"Level50":{"score":"0","color":"transparent"},"Level60":{"score":"0","color":"transparent"},"Level70":{"score":"0","color":"transparent"},"Level80":{"score":"0","color":"transparent"},"Level90":{"score":"0","color":"transparent"},"Level100":{"score":"0","color":"transparent"}}
 
        {"ExamID":"1","Level0":"0","Level10":"0","Level20":"0","Level30":"0","Level40":"0","Level50":"0","Level60":"0","Level70":"0","Level80":"0","Level90":"0","Level100":"0"}
        */
        rsd = [].concat(rsd || []);
        if (rsd.length > 2) {
          return rsd
        } else {

          // let examIDs = rsd.map((r) => r.ExamID);
          // let examIDSet = new Set(examIDs);
          // let correctSet = new Set(['1', '2', '3']);//TODO: 並非每學期都是三次月考, 應由資料統計生成這個集合
          // let dif = Array.from(difference(correctSet, examIDSet)).map((w) => parseInt(w) - 1).sort();
          // let template = (index) => {
          //   return { "ExamID": `${(index + 1).toString()}`, "Level0": "", "Level10": "", "Level20": "", "Level30": "", "Level40": "", "Level50": "", "Level60": "", "Level70": "", "Level80": "", "Level90": "", "Level100": "" }

          // };

          // dif.map((mIndex) => {
          //   rsd.splice(mIndex, 0, template(mIndex))
          // })


          return rsd
        }
      }
      //FIXME: mobile 的問題在這
      let rawScoreDetail = dataCleaningForRawScoreDetail(value.ScoreDetail).reverse()[currentExamType];
      let currentNotOpenYet = null;
      let currentShowMeTheScore = null;
      let scoreByContext = getScoreByCurrentContext();
      console.log('taggedScoreDetail: ', scoreByContext);
      let taggedScoreDetail = getTaggedScoreByCurrentContext(scoreByContext).filter((tg) => {

        currentNotOpenYet = tg.notOpenYet; //目前的 subject 截止時間還沒開放
        currentShowMeTheScore = showMeTheScore; //目前的 subject 被立即觀看成績
        //(currentNotOpenYet&&currentShowMeTheScore) //如果立即觀看被打開, 同時又尚未開放, 把 matrix item 設定成 0 並取消 color tagging (transparent)
        return (tg.subject == value.Subject)[0]
      });

      if (taggedScoreDetail == undefined) {
        return Object.assign({ subject: `${value.Subject}` }, { "Level0": { "score": "--", "color": "transparent" }, "Level10": { "score": "", "color": "transparent" }, "Level20": { "score": "", "color": "transparent" }, "Level30": { "score": "", "color": "transparent" }, "Level40": { "score": "", "color": "transparent" }, "Level50": { "score": "", "color": "transparent" }, "Level60": { "score": "", "color": "transparent" }, "Level70": { "score": "", "color": "transparent" }, "Level80": { "score": "", "color": "transparent" }, "Level90": { "score": "", "color": "transparent" }, "Level100": { "score": "", "color": "transparent" } });
      } else {
        let newScoreDetail = {};
        // levels.forEach((levelKey) => {
        //   if (levelKey == ((taggedScoreDetail.scoreTag == 'Level0') ? taggedScoreDetail.scoreTag : `${taggedScoreDetail.scoreTag}0`)) {
        //     newScoreDetail[levelKey] = { score: (currentShowMeTheScore) ? rawScoreDetail[levelKey] : currentNotOpenYet ? '0' : rawScoreDetail[levelKey], color: (currentShowMeTheScore) ? taggedScoreDetail.taggedColor : currentNotOpenYet ? 'transparent' : taggedScoreDetail.taggedColor };

        //   } else {

        //     newScoreDetail[levelKey] = { score: (currentShowMeTheScore) ? rawScoreDetail[levelKey] : currentNotOpenYet ? '0' : rawScoreDetail[levelKey], color: 'transparent' }
        //   }

        // })

        levels.forEach((levelKey) => {

          // if (levelKey == ((taggedScoreDetail.scoreTag == 'Level0') ? taggedScoreDetail.scoreTag : `${taggedScoreDetail.scoreTag}0`)) {
          //   newScoreDetail[levelKey] = { score: (currentShowMeTheScore) ? rawScoreDetail[levelKey] : currentNotOpenYet ? '0' : rawScoreDetail[levelKey], color: (currentShowMeTheScore) ? taggedScoreDetail.taggedColor : currentNotOpenYet ? 'transparent' : taggedScoreDetail.taggedColor };
          //   //console.log(value.Subject, levelKey, taggedScoreDetail.taggedColor)
          // } else {
          //   //console.log('rawScoreDetail', JSON.stringify(value.ScoreDetail), currentExamType, rawScoreDetail);
          //   newScoreDetail[levelKey] = { score: (currentShowMeTheScore) ? rawScoreDetail[levelKey] : currentNotOpenYet ? '0' : rawScoreDetail[levelKey], color: 'transparent' }

          // }

          if (taggedScoreDetail.score) {

            if (levelKey == ((taggedScoreDetail.scoreTag == 'Level0') ? taggedScoreDetail.scoreTag : `${taggedScoreDetail.scoreTag}0`)) {

              if (isValidDate(taggedScoreDetail.score.endTime)) {
                newScoreDetail[levelKey] = { score: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? rawScoreDetail[levelKey] : (currentShowMeTheScore) ? rawScoreDetail[levelKey] : `0a${taggedScoreDetail.score.endTime.toString()}`, color: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? taggedScoreDetail.taggedColor : (currentShowMeTheScore) ? taggedScoreDetail.taggedColor : taggedScoreDetail.taggedColor };
              } else {
                newScoreDetail[levelKey] = { score: rawScoreDetail[levelKey], color: taggedScoreDetail.taggedColor } //taggedScoreDetail.score.endTime -> null/invalid datetime: 表示 沒設定 endTime 就當成開放了; 
              }

            } else {

              console.log('taggedScoreDetail.score', taggedScoreDetail);

              if (isValidDate(taggedScoreDetail.score.endTime)) {
                newScoreDetail[levelKey] = { score: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? rawScoreDetail[levelKey] : (currentShowMeTheScore) ? rawScoreDetail[levelKey] : '0', color: 'transparent' }
              } else {
                newScoreDetail[levelKey] = { score: rawScoreDetail[levelKey], color: 'transparent' }  ////taggedScoreDetail.score.endTime -> null/invalid datetime: 表示 沒設定 endTime 就當成開放了; 
              }

            }

          } else {
            console.log('taggedScoreDetail.score: ', taggedScoreDetail)
            //no-op
            newScoreDetail[levelKey] = { score: '0', color: 'transparent' }
          }


        });

        //console.log('taggedScoreDetail newScoreDetail', newScoreDetail)

        return Object.assign({ subject: `${value.Subject}` }, newScoreDetail);//value.ScoreDetail[currentExamType]
      }

    }));

    setMatrixData(m);
  }

  useEffect(() => {

    updatedProcedure();

  }, [])

  useEffect(() => {

    updatedProcedure();

  }, [props.allStudentScore, props.scores, semesterIndex])

  //props.weightShowing
  const columnsDetail2 = [
    {
      Header: '科目名稱',
      accessor: 'subject', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    {
      Header: '權數',
      accessor: 'credit'
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return cellTemplate({ header: value.ExamName, accessor: value.ExamName, fixTime: value.fixTime })
    })
  ];

  const columnsDetail2Mobile = [
    {
      Header: '科目名稱',
      accessor: 'subject', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    {
      Header: '權數',
      accessor: 'credit'
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return cellTemplate({ header: value.ExamName, accessor: value.ExamName, fixTime: value.fixTime })
    }),
    {
      Header: '詳細',
      accessor: 'detail',
      Cell: (cellProps) => <div onClick={() => {
        props.setIsModalNow(true);
        console.log('cellProps.value', cellProps.value)
        setCurrentModalData((cellProps.value))
      }
      }>{'>'}</div>
    }
  ];

  const columnsDetailWithoutCreditMobile = [
    {
      Header: '科目名稱',
      accessor: 'subject', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return cellTemplate({ header: value.ExamName, accessor: value.ExamName, fixTime: value.fixTime })
    }),
    {
      Header: '詳細',
      accessor: 'detail',
      Cell: (cellProps) => <div onClick={() => {
        //isModalNow={isModalNow} setIsModalNow={setIsModalNow}
        console.log('cellProps.value2', cellProps.value)
        setCurrentModalData((cellProps.value));
        props.setIsModalNow(true);
      }
      }>{'>'}</div>
    }
  ];


  const columnsDetailWithoutCredit = [
    {
      Header: '科目名稱',
      accessor: 'subject', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return cellTemplate({ header: value.ExamName, accessor: value.ExamName, fixTime: value.fixTime })
    })
  ];

  const columnsInterval = [
    {
      Header: '科目名稱',
      accessor: 'subject', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    {
      Header: '0-9',
      accessor: 'Level0',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '10-19',
      accessor: 'Level10',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '20-29',
      accessor: 'Level20',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '30-39',
      accessor: 'Level30',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '40-49',
      accessor: 'Level40',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '50-59',
      accessor: 'Level50',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '60-69',
      accessor: 'Level60',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '70-79',
      accessor: 'Level70',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '80-89',
      accessor: 'Level80',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '90-99',
      accessor: 'Level90',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    },
    {
      Header: '100',
      accessor: 'Level100',
      Cell: (props) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 40, height: 32, borderRadius: 6, backgroundColor: props.value.color }}>{props.value.score}</div>
    }
  ];


  //value.Exam.filter((data, index)=>data.ExamDisplayOrder=='1')[0].ScoreDetail.EndTime //'2021/03/31 12:00:22'

  const orderByAPI = (rawData) => {

    // let transformedDataSubjectSet_A = rawData.map(tds => {
    //     return tds.subject.value;
    // })
    // let apiDefinedSubjectOrder_B = subjectOrder.rs.map((adso => {
    //     return adso.subject_name
    // }))


    // let AminusB = transformedDataSubjectSet_A.filter(af => {
    //     return !apiDefinedSubjectOrder_B.includes(af);
    // }).sort((x, y) => x.localeCompare(y, 'zh-TW'));
    // let AintersectB = apiDefinedSubjectOrder_B.filter(af => {
    //     return transformedDataSubjectSet_A.includes(af);
    // });

    // //arr.sort((x,y)=>x.localeCompare(y, 'zh-TW'))
    // console.log('detailTransform2-a', subjectOrder, transformedDataSubjectSet_A, apiDefinedSubjectOrder_B);
    // console.log('detailTransform2-1', AintersectB, AminusB, [...AintersectB, ...AminusB]);

    // let orderedSubjectNames = [...AintersectB, ...AminusB];
    // let orderedData = orderedSubjectNames.map(subject_name => {
    //     return rawData.filter(r => r.subject.value == subject_name)[0]
    // });

    // console.log('detailTransform3', rawData, orderedData);

    return rawData; //orderedData;
  }

  const dataTransform = (rawData) => { //這裡順便做科目排序
    let headers = {};

    console.log('rawdata is :', rawData);

    let transformedData = [].concat(rawData || []).map((value, index) => {

      // let exam1Obj = value.Exam.filter((data, index)=>data.ExamDisplayOrder=='1')[0];
      // let exam2Obj = value.Exam.filter((data, index)=>data.ExamDisplayOrder=='2')[0];
      // let exam3Obj = value.Exam.filter((data, index)=>data.ExamDisplayOrder=='3')[0];

      const compareExamOrder = (examA, examB) => {
        return parseInt(examA.ExamDisplayOrder) - parseInt(examB.ExamDisplayOrder);
      }
      //console.log('value.Exam', value.Exam);

      let exams = [].concat(value.Exam || []).sort(compareExamOrder);

      exams.map((value) => {
        headers[value.ExamName] = value
        console.log('header assign ', value.ExamName, exams, currentYS)
      })

      // //Fault-tolerance: ExamDisplayOrder 非 1,2,3 e.g. 1, 2, 4 
      // let exam1Obj = exams[0];
      // let exam2Obj = exams[1];
      // let exam3Obj = exams[2];

      //TODO: distinct 考試 name 成為 template

      //const isDataValid()
      let examsDict = {}

      exams.forEach((valueExam, index) => {
        //console.log('DateTime.fromFormat(valueExam.ScoreDetail.EndTime, "yyyy/MM/dd hh:mm"),', DateTime.fromFormat(valueExam.ScoreDetail.EndTime, "yyyy/MM/dd hh:mm"));
        examsDict[valueExam.ExamName] = (exams.length > index) ? {
          endTime: DateTime.fromFormat(valueExam.ScoreDetail.EndTime, "yyyy/MM/dd hh:mm"),
          score: valueExam.ScoreDetail.Extension == "" ? "--" : valueExam.ScoreDetail.Extension.Extension.Score == "" ? "--" : valueExam.ScoreDetail.Extension.Extension.Score,
          assignmentScore: valueExam.ScoreDetail.Extension == "" ? "--" : valueExam.ScoreDetail.Extension.Extension.AssignmentScore == "" ? '--' : valueExam.ScoreDetail.Extension.Extension.AssignmentScore,
          fixTime: (value.FixTime) ? value.FixTime.Extension.ScorePercentage : '--'
        } : {
          endTime: '-',
          score: '-',
          assignmentScore: '-'
        }
      });
      console.log('filteredMatrix 1', matrixData)
      let filteredMatrix = matrixData.filter((v) => v.subject == value.Subject);
      console.log('filteredMatrix 3', filteredMatrix.length == 0, filteredMatrix)
      let currentExamName = Object.values(headers).map(value => `${value.ExamName}`)[currentSelectExamIndex]
      return Object.assign({
        subject: value.Subject,
        credit: value.Credit,
        detail: Object.assign({ data: filteredMatrix }, {
          subject: value.Subject,
          credit: value.Credit,
          examHeader: examsDict[currentExamName],
          exams: currentExamName
        }),
      }, examsDict)//[Object.values(headers).map(value => `${value.ExamName}`)[currentExamType]]

    })

    //console.log('headers: ', headers)

    //console.log('transformedData 123', orderByAPI(transformedData));
    console.log('rawdata is : now becomes', transformedData);

    //setCurrentValidSubjects(transformedData.map(tfd=>tfd.subject));

    return { transformedData: transformedData, headers };
  }
  /*
  
  input format example
  [{"subject":"英語文",
  "score":{"endTime":"2020-12-31T23:59:00.000+08:00","score":"90","assignmentScore":"99","fixTime":"40"}},
  {"subject":"國語文","score":{"endTime":"2020-12-31T23:59:00.000+08:00","score":"--","assignmentScore":"--","fixTime":"40"}},{"subject":"數學","score":{"endTime":"2020-12-31T23:59:00.000+08:00","score":"20","assignmentScore":"22","fixTime":"40"}}]
  
  
  */
  const getTaggedScoreByCurrentContext = (scoreData) => {
    let taggedScore = scoreData.filter((v) => v.score != undefined).map((value) => {

      let scoreEndDay = DateTime.fromISO(value.score.endTime);
      //console.log('scoreEndDay', scoreEndDay);
      const scoreTagF = (s) => `Level${(parseFloat(s) / 10).toFixed(2).split('.')[0]}`
      let scoreTag = '';
      let taggedColor = 'transparent';

      let avScore = averageScore(value.score)
      //console.log('vas ted', value.score)

      if ((scoreEndDay > today)) {

        if (showMeTheScore) {

          scoreTag = scoreTagF(avScore);//value.score.score)
          if (parseFloat(avScore) < passScoreGrade) {
            taggedColor = '#D87A89'
          } else {
            taggedColor = '#ADC57C'
          }

        }


      } else {
        if (avScore == '--') {

        } else {

          scoreTag = scoreTagF(avScore);//value.score.score)
          if (parseFloat(avScore) < passScoreGrade) {
            taggedColor = '#D87A89'
          } else {
            taggedColor = '#ADC57C'
          }

        }
      }
      //console.log('kkk', Object.assign(value, {taggedColor, scoreTag}))
      return Object.assign(value, { taggedColor, scoreTag, showMeTheScore, notOpenYet: (scoreEndDay > today) })



    })
    return taggedScore;
  }

  const domainCellTemplate = (cell) => {
    return {
      Header: cell.header,
      accessor: cell.accessor,
      Cell: (props) => (props.value == undefined) ? <div></div> : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16, height: 58, marginRight: 8, color: (parseFloat(props.value.score) < passScoreGrade ? '#CD5B6D' : '#4F4F4F') }}>{props.value.score}</div>
        {(props.value.comparedResult == 'greater') && <FaArrowUp style={{ color: '#547CB4', fontSize: 12, marginRight: 12 }} />}
        {(props.value.comparedResult == 'less') && <FaArrowDown style={{ color: '#CD5B6D', fontSize: 12, marginRight: 12 }} />}
        {(props.value.comparedResult == 'equal') && <FaEquals style={{ color: '#A3A3A3', fontSize: 12, marginRight: 12 }} />}
      </div>
    }
  }

  const domainColumnsDetail = [
    {
      Header: '領域',
      accessor: 'domain', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    {
      Header: '科目名稱',
      accessor: 'subjects', // accessor is the "key" in the data
      Cell: (props) => (<div>{
        props.value.map((v, i) => {
          return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }} key={`subject_${v}_${i.toString()}`}>{v}</div>
        })
      }</div>)
    },
    {
      Header: '權數',
      accessor: 'credits',
      Cell: (props) => (<div>{
        props.value.map((v, i) => {
          return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }} key={`subject_${v}_${i.toString()}`}>{v}</div>
        })
      }</div>)
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return domainCellTemplate({ header: value.ExamName, accessor: value.ExamName })
    })
    // ...Object.values(props.aggregateSemensterScores(currentYS.schoolYear, currentYS.semester, props.scores)).map((value) => {//domainCellTemplate
    //   console.log('domainCellTemplate', value);
    //   return domainCellTemplate({ header: `${value.taggedScore.examName}`, accessor: value.taggedScore.examName })
    // })
  ];

  const domainColumnsDetailWithoutCredit = [
    {
      Header: '領域',
      accessor: 'domain', // accessor is the "key" in the data
      Cell: (props) => <div>{props.value}</div>
    },
    {
      Header: '科目名稱',
      accessor: 'subjects', // accessor is the "key" in the data
      Cell: (props) => (<div>{
        props.value.map((v, i) => {
          return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }} key={`subject_${v}_${i.toString()}`}>{v}</div>
        })
      }</div>)
    },
    ...Object.values(filteredHeaders).map((value) => {//headers
      return domainCellTemplate({ header: value.ExamName, accessor: value.ExamName })
    })
    // ...Object.values(props.aggregateSemensterScores(currentYS.schoolYear, currentYS.semester, props.scores)).map((value) => {//domainCellTemplate
    //   console.log('domainCellTemplate', value);
    //   return domainCellTemplate({ header: value.taggedScore.examName, accessor: value.taggedScore.examName })
    // })
  ];

  const getScoreByCurrentContext = () => {
    let score = props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).transformedData.map((value) => {

      let result = { subject: value.subject };
      let dictIndex = Object.values(headers).map(value => `${value.ExamName}`)[currentExamType];
      result['score'] = value[dictIndex];
      return result;
    }) : []
    return score;
  }

  const domainTableDataTransfer = (data) => {
    function isIterable(obj) {
      // checks for null and undefined
      if (obj == null) {
        return false;
      }
      return typeof obj[Symbol.iterator] === 'function';
    }
    if (isIterable(data)) {

      let tData = data.map((td, index) => {
        let flattenTaggedScore = {};
        td.examNames.map((te, index) => {
          flattenTaggedScore[te] = td.taggedScore[index];
        })

        return Object.assign(td, flattenTaggedScore);
      });
      return tData;

    } else {
      return [];

    }



  }

  const [tabIndex, setTabIndex] = useState(0);
  const tabChangeHandler = (activeIndex, tabName) => {
    setTabIndex(activeIndex);
  }



  const WebScreen = (props) => {
    return (<div>
      <div className="w-100">
        <div className="d-none d-md-block fs-36 fw-600 pt-5" style={{ letterSpacing: "6px", marginBottom: 24 }} >評量成績</div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Dropdown options={props.scores.map((value => `${value.SchoolYear}學年度第${value.Semester}學期`)).reverse()} currentOption={semesterIndex} indexChangeHandler={setSemesterIndex}></Dropdown>

          {/*<div>{JSON.stringify(Object.keys(headers))}</div>*/}
          <Dropdown options={['總覽', ...Object.keys(headers)]} currentOption={0} indexChangeHandler={(index) => {

            if (index == 0) {

              setFilteredHeaders(headers);
            } else {
              //console.log('Object.keys(headers)[index]', headers[Object.keys(headers)[index - 1]])
              let filtered = {};
              filtered[Object.keys(headers)[index - 1]] = headers[Object.keys(headers)[index - 1]]
              setFilteredHeaders(filtered)
            }
          }}></Dropdown>

        </div>

        {/* <div>{JSON.stringify(props.scores[props.scores.length-1-semesterIndex]?.Course)}</div> */}

        <CommonVerticalMargin />

        <div style={{ width: 500 }}>
          <Tab tabs={ScoreTabs} tabChangeHandler={tabChangeHandler}></Tab>

        </div>
        {/*  */}
        {(tabIndex == 0) ? <div>
          <CommonVerticalMargin />

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            <div style={{ fontSize: 17, fontWeight: '500', marginRight: 20 }}>{'成績顯示'}</div>
            <RoundSelector options={[' 定期 ', ' 平時 ', ' 總成績 ']} currentIndex={scoreDisplayType} indexChangeHandler={(index) => { setScoreDisplayType(index) }}></RoundSelector>



          </div>

          <CommonVerticalMargin />

          {<OneCampusTable columns={props.weightShowing ? columnsDetail2 : columnsDetailWithoutCredit} data={props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).transformedData : []} />}



          <CommonVerticalMargin />
          <CommonVerticalMargin />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: '500', marginRight: 20 }}>{'級距'}</div>
            <RoundSelector currentIndex={currentExamType} options={Object.values(headers).map(value => ` ${value.ExamName} `)} indexChangeHandler={(index) => {
              // let optionLength = Object.values(headers).map(value => ` ${value.ExamName} `).length;
              // let arr = [...Array(optionLength).keys()].reverse();
              // setCurrentExamType(arr[index]);
              setCurrentExamType(index)
            }}></RoundSelector>
          </div>

          <CommonVerticalMargin />
          {/* {<OneCampusTable columns={columnsInterval} data={props.allStudentScore.map((value)=>{
          return (value.ScoreDetail)?value.ScoreDetail[0]:{};
        })}/> }  */}



          <OneCampusTable columns={columnsInterval} data={matrixData} />

          <CommonVerticalMargin />



          <CommonVerticalMargin />

        </div>

          : <div>
            <CommonVerticalMargin />
            <OneCampusTable columns={props.weightShowing ? domainColumnsDetail : domainColumnsDetailWithoutCredit} data={domainTableDataTransfer(props.aggregateSemensterScores(currentYS.schoolYear, currentYS.semester, props.scores))} />

            <CommonVerticalMargin />

            <CommonVerticalMargin /></div>}
      </div>
    </div>)
  }

  const columnsInstallDetail = React.useMemo(
    () => [
      {
        Header: '成績級距',
        accessor: 'item', // accessor is the "key" in the data
        Cell: (props) => {
          //console.log('props.value', props.value)
          return (<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ marginLeft: 25 }}>{props.value.title}</div>
            { /*<div style={{marginLeft: 25}}>{JSON.stringify(props.value.data)}</div> */}
            {<div style={{ marginRight: 25, width: 38, height: 30, borderRadius: 3, backgroundColor: props.value.data.color, color: (props.value.data.color != 'transparent') ? 'white' : '#575757' }}>{props.value.data.score}</div>}
          </div>)
        }
      }
    ]);

  const rankMatrixTransform = (modalData) => {
    return ['Level0', 'Level10', 'Level20', 'Level30',
      'Level40', 'Level50', 'Level60',
      'Level70', 'Level80', 'Level90',
      'Level100'].map((v) => {
        if (v != 'Level100') {
          return {
            item: { title: `${parseInt(v.replace('Level', ''))}-${parseInt(v.replace('Level', '')) + 9}`, data: (modalData.length > 0) ? modalData[0][v] : [] }
          }
        } else {
          console.log('modalData', modalData)
          return {
            item: { title: '100', data: (modalData.length > 0) ? modalData[0][v] : [] }
          }
        }
      })
  }

  const IschoolGadgetFullScreenModal = (props) => {
    return <div style={{ width: '100%', height: '100%', backgroundColor: 'pink' }}>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: props.windowHeight, backgroundColor: 'white', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', borderColor: '#C4C4C4', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 1 }}>
          <div onClick={() => { props.setIsModalNow(false) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'white' }}><FaAngleLeft style={{ fontSize: 30, color: '#A3A3A3', fontWeight: '100' }} /></div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: props.windowWidth - 50, backgroundColor: 'white', height: '100%' }}>
            <div style={{ fontSize: 23, fontWeight: '500', letterSpacing: 1.5, marginLeft: -50 }}>{'成績詳細'}</div>
          </div>
        </div>
        <div style={{ width: '80%', marginTop: 30 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#adc47c', width: 86, height: 86, borderRadius: 8 }}>
              <div style={{ color: 'white', fontSize: 28, fontWeight: '500' }}>{currentModalData.examHeader.score}</div>

            </div>
            <div style={{ marginLeft: 36 }}>
              <div style={{ fontSize: 25, letterSpacing: 3 }}>
                {currentModalData.subject}
              </div>
              {props.weightShowing ? <div style={{ fontSize: 18, letterSpacing: 2 }}>
                {`權數 : ${currentModalData.credit}`}
              </div> : null}
            </div>
          </div>
          <CommonVerticalMargin />
          <CommonVerticalMargin />
          <CommonVerticalMargin />

          {<OneCampusTable textAlign={'start'} paddingLeft={26} columns={columnsInstallDetail} data={rankMatrixTransform(currentModalData.data)} />}

          <CommonVerticalMargin />
          <CommonVerticalMargin />
          <CommonVerticalMargin />
        </div>

      </div>
    </div>
  }
  const [fixedExamIndex, setFixedExamIndex] = useState(1);
  function setModalClose() {
    props.setIsModalNow(false);
  }



  return (props.windowWidth > 1300) ? <div>
    <div className="w-100">
      <div className="d-none d-md-block fs-36 fw-600 pt-5" style={{ letterSpacing: "6px", marginBottom: 24 }} >評量成績</div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Dropdown options={props.scores.map((value => `${value.SchoolYear}學年度第${value.Semester}學期`)).reverse()} currentOption={semesterIndex} indexChangeHandler={(index) => {
          setCurrentExamType(0);//重置 matrix 上方的 round-selector; 避免 index overflow
          setSemesterIndex(index)
        }}></Dropdown>

        {/*<div>{JSON.stringify(Object.keys(headers))}</div>*/}
        <Dropdown options={['總覽', ...Object.keys(headers)]} currentOption={0} indexChangeHandler={(index) => {


          if (index == 0) {
            setFilteredHeaders(headers);
          } else {
            //console.log('Object.keys(headers)[index]', headers[Object.keys(headers)[index - 1]])
            let filtered = {};
            filtered[Object.keys(headers)[index - 1]] = headers[Object.keys(headers)[index - 1]]
            setFilteredHeaders(filtered)
          }
        }}></Dropdown>

      </div>

      {/* <div>{JSON.stringify(props.scores[props.scores.length-1-semesterIndex]?.Course)}</div> */}

      <CommonVerticalMargin />

      <div style={{ width: 500 }}>
        <Tab tabs={ScoreTabs} tabChangeHandler={tabChangeHandler}></Tab>

      </div>
      {/*  */}
      {(tabIndex == 0) ? <div>
        <CommonVerticalMargin />

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

          <div style={{ fontSize: 17, fontWeight: '500', marginRight: 20 }}>{'成績顯示'}</div>
          <RoundSelector options={[' 定期 ', ' 平時 ', ' 總成績 ']} currentIndex={scoreDisplayType} indexChangeHandler={(index) => { setScoreDisplayType(index) }}></RoundSelector>
          <div style={{ width: 30 }} />
          <Switch onChange={setShowMeTheScore} checked={showMeTheScore} /> <div style={{ width: 5 }} /> <div>{'測試用: 立即顯示'}</div>
        </div>

        <CommonVerticalMargin />

        {<OneCampusTable columns={props.weightShowing ? columnsDetail2 : columnsDetailWithoutCredit} data={props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).transformedData : []} />}


        {/* <div>{JSON.stringify(columnsDetail2)}</div>
    <div>{JSON.stringify(Object.values(headers))}</div> */}

        <CommonVerticalMargin />
        <CommonVerticalMargin />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: '500', marginRight: 20 }}>{'級距1'}</div>
          <RoundSelector currentIndex={currentExamType} options={Object.values(headers).map(value => ` ${value.ExamName} `)} indexChangeHandler={(index) => {
            // let optionLength = Object.values(headers).map(value => ` ${value.ExamName} `).length;
            // let arr = [...Array(optionLength).keys()].reverse();
            setCurrentExamType(index)

          }}></RoundSelector>
        </div>

        <CommonVerticalMargin />

        <OneCampusTable columns={columnsInterval} data={props.allStudentScore.filter((value) => {
          let currentYS = props.scores.map(value => { return { schoolYear: value.SchoolYear, semester: value.Semester } }).reverse()[semesterIndex];
          //console.log('cy', currentYS);
          return (value.SchoolYear == currentYS.schoolYear) && (value.Semester == currentYS.semester)
        }).map((value => {

          console.log('current YS valuse: ', value);

          let levels = ['Level0', 'Level10', 'Level20', 'Level30', 'Level40', 'Level50', 'Level60', 'Level70', 'Level80', 'Level90', 'Level100'];
          //Object.keys(value.ScoreDetail[currentExamType]).filter((value)=>(value!='ExamID')&&(value!='@'));

          //console.log(value.ScoreDetail[currentExamType]);
          //value.ScoreDetail.filter((v)=>v.ExamID == (currentExamType+1).toString())[0]//
          function difference(setA, setB) {
            const diff = new Set(setA);

            for (const elem of setB) {
              diff.delete(elem);
            }

            return diff;
          }
          const dataCleaningForRawScoreDetail = (rsd) => {
            /*
    
            {"Level0":{"score":"0","color":"transparent"},"Level10":{"score":"0","color":"transparent"},"Level20":{"score":"0","color":"transparent"},"Level30":{"score":"0","color":"transparent"},"Level40":{"score":"0","color":"transparent"},"Level50":{"score":"0","color":"transparent"},"Level60":{"score":"0","color":"transparent"},"Level70":{"score":"0","color":"transparent"},"Level80":{"score":"0","color":"transparent"},"Level90":{"score":"0","color":"transparent"},"Level100":{"score":"0","color":"transparent"}}
     
            {"ExamID":"1","Level0":"0","Level10":"0","Level20":"0","Level30":"0","Level40":"0","Level50":"0","Level60":"0","Level70":"0","Level80":"0","Level90":"0","Level100":"0"}
            */
            rsd = [].concat(rsd || []);
            if (rsd.length > 2) {
              console.log('rsd: 1', rsd)
              return rsd;
            } else {
              console.log('rsd: 2', rsd)

              // let examIDs = rsd.map((r) => r.ExamID);
              // let examIDSet = new Set(examIDs);
              // let correctSet = new Set(['1', '2', '3']); //TODO: 並非每學期都是三次月考, 應由資料統計生成這個集合
              // let dif = Array.from(difference(correctSet, examIDSet)).map((w) => parseInt(w) - 1).sort();
              // let template = (index) => {
              //   return { "ExamID": `${(index + 1).toString()}`, "Level0": "", "Level10": "", "Level20": "", "Level30": "", "Level40": "", "Level50": "", "Level60": "", "Level70": "", "Level80": "", "Level90": "", "Level100": "" }

              // };

              // dif.map((mIndex) => {
              //   rsd.splice(mIndex, 0, template(mIndex))
              // })


              return rsd
            }
          }

          let rawScoreDetail = dataCleaningForRawScoreDetail(value.ScoreDetail).reverse()[currentExamType];
          let currentNotOpenYet = null;
          let currentShowMeTheScore = null;
          let taggedScoreDetail = getTaggedScoreByCurrentContext(getScoreByCurrentContext()).filter((tg) => {
            console.log('tg.subject', tg.subject, tg);
            currentNotOpenYet = tg.notOpenYet; //目前的 subject 截止時間還沒開放
            currentShowMeTheScore = showMeTheScore; //目前的 subject 被立即觀看成績
            //如果立即觀看被打開, 同時又尚未開放, 把 matrix item 設定成 0 並取消 color tagging (transparent)
            return (tg.subject == value.Subject)
          })[0];

          console.log('taggedScoreDetail', taggedScoreDetail)

          //TODO: taggedScoreDetail.endTime --> taggedScoreDetail.score.endTime
          if (taggedScoreDetail == undefined) { //why undefined?
            return Object.assign({ subject: `${value.Subject}` }, { "Level0": { "score": "", "color": "transparent" }, "Level10": { "score": "", "color": "transparent" }, "Level20": { "score": "", "color": "transparent" }, "Level30": { "score": "", "color": "transparent" }, "Level40": { "score": "", "color": "transparent" }, "Level50": { "score": "", "color": "transparent" }, "Level60": { "score": "", "color": "transparent" }, "Level70": { "score": "", "color": "transparent" }, "Level80": { "score": "", "color": "transparent" }, "Level90": { "score": "", "color": "transparent" }, "Level100": { "score": "", "color": "transparent" } });
          } else {
            let newScoreDetail = {};

            levels.forEach((levelKey) => {
              if (levelKey == ((taggedScoreDetail.scoreTag == 'Level0') ? taggedScoreDetail.scoreTag : `${taggedScoreDetail.scoreTag}0`)) {

                if (isValidDate(taggedScoreDetail.score.endTime)) {
                  newScoreDetail[levelKey] = { score: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? rawScoreDetail[levelKey] : (currentShowMeTheScore) ? rawScoreDetail[levelKey] : `0a${taggedScoreDetail.score.endTime.toString()}`, color: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? taggedScoreDetail.taggedColor : (currentShowMeTheScore) ? taggedScoreDetail.taggedColor : taggedScoreDetail.taggedColor };
                } else {
                  newScoreDetail[levelKey] = { score: rawScoreDetail[levelKey], color: taggedScoreDetail.taggedColor } //taggedScoreDetail.score.endTime -> null/invalid datetime: 表示 沒設定 endTime 就當成開放了; 
                }

              } else {


                if (isValidDate(taggedScoreDetail.score.endTime)) {
                  newScoreDetail[levelKey] = { score: (DateTime.fromISO(taggedScoreDetail.score.endTime) < DateTime.local()) ? rawScoreDetail[levelKey] : (currentShowMeTheScore) ? rawScoreDetail[levelKey] : '0', color: 'transparent' }
                } else {
                  newScoreDetail[levelKey] = { score: rawScoreDetail[levelKey], color: 'transparent' }  ////taggedScoreDetail.score.endTime -> null/invalid datetime: 表示 沒設定 endTime 就當成開放了; 
                }

              }

            })

            return Object.assign({ subject: `${value.Subject}` }, newScoreDetail);//value.ScoreDetail[currentExamType]


          }

        })).filter(d => {
          console.log('currentValidSubjects', currentValidSubjects)
          return currentValidSubjects.includes(d.subject);
        }
        )
        } />

        <CommonVerticalMargin />

        <CommonVerticalMargin />

      </div>

        : <div>
          <CommonVerticalMargin />
          <OneCampusTable columns={props.weightShowing ? domainColumnsDetail : domainColumnsDetailWithoutCredit} data={domainTableDataTransfer(props.aggregateSemensterScores(currentYS.schoolYear, currentYS.semester, props.scores))} />

          <CommonVerticalMargin />

          <CommonVerticalMargin /></div>}
    </div>
  </div> : (props.isModalNow) ? <div style={{ width: '100%', height: '100%' }}><IschoolGadgetFullScreenModal {...props} setModalClose={setModalClose} /></div> :

    <div style={{ width: '100%', height: props.windowHeight, backgroundColor: 'white' }}>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', borderColor: '#C4C4C4', borderStyle: 'solid', borderWidth: 0, borderBottomWidth: 1, marginBottom: 30 }}>
        <div onClick={() => { alert('TODO: 問耀明 back to app 的 url'); /*  TODO: 問耀明 back to app 的 url*/ }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'white' }}><FaAngleLeft style={{ fontSize: 30, color: '#A3A3A3', fontWeight: '100' }} /></div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: props.windowWidth - 50, backgroundColor: 'white', height: '100%' }}>
          <div style={{ fontSize: 23, fontWeight: '500', letterSpacing: 1.5, marginLeft: -50 }}>{'國中評量成績'}</div>
        </div>
      </div>



      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Dropdown options={props.scores.map((value => `${value.SchoolYear}學年度第${value.Semester}學期`)).reverse()} currentOption={semesterIndex} indexChangeHandler={setSemesterIndex}></Dropdown>

        {<CommonVerticalMargin />}
        {<Dropdown options={[...Object.keys(headers)]} currentOption={currentSelectExamIndex} indexChangeHandler={(index) => {

          setCurrentSelectExamIndex(index);
          let filtered = {};
          setFixedExamIndex(index);
          filtered[Object.keys(headers)[index]] = headers[Object.keys(headers)[index]]
          setFilteredHeaders(filtered)

          //console.log('Object.keys(headers)[index]', index, headers[Object.keys(headers)[index]], filtered)

        }}></Dropdown>}


        {<Tab tabs={ScoreTabs} tabChangeHandler={tabChangeHandler}></Tab>}
        {
          (tabIndex == 0) && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

              <div style={{ fontSize: 17, fontWeight: '500', marginRight: 20 }}>{'成績顯示'}</div>
              <Switch onChange={setShowMeTheScore} checked={showMeTheScore} /> <div style={{ width: 5 }} />
              <RoundSelector currentIndex={scoreDisplayType} options={[' 定期 ', ' 平時 ', ' 總成績 ']} indexChangeHandler={(index) => { setScoreDisplayType(index) }}></RoundSelector>
            </div>

            <CommonVerticalMargin />

            {<OneCampusTable columns={props.weightShowing ? columnsDetail2Mobile : columnsDetailWithoutCreditMobile} data={props.scores[props.scores.length - 1 - semesterIndex] ? dataTransform(props.scores[props.scores.length - 1 - semesterIndex]?.Course).transformedData : []} />}

          </div>

        }

        {(tabIndex == 1) && <div>
          <CommonVerticalMargin />
          <OneCampusTable columns={props.weightShowing ? domainColumnsDetail : domainColumnsDetailWithoutCredit} data={domainTableDataTransfer(props.aggregateSemensterScores(currentYS.schoolYear, currentYS.semester, props.scores))} />

          <CommonVerticalMargin />

          <CommonVerticalMargin /></div>}

      </div>
      <CommonVerticalMargin />

      <CommonVerticalMargin />
    </div>
};


export default JuniorScoreScreen;
