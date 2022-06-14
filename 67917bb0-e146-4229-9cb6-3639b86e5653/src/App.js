import React, { useState, useEffect } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DateRangePicker, CustomProvider } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import zhTW from 'rsuite/locales/zh_TW';
import moment from 'moment';


function App() {

  // const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7e58', '#ff9bd3', '#d8abff', '#b2abff', '#c7b679'];
  // const instance = <DateRangePicker />;
  // ReactDOM.render(instance);

  // const chartAttData = [
  //   {
  //     name: "曠課",
  //     count: 80,
  //   },
  //   {
  //     name: "事假",
  //     count: 20,
  //   },
  //   {
  //     name: "病假",
  //     count: 1,
  //   },
  //   {
  //     name: "喪假",
  //     count: 0,
  //   },
  //   {
  //     name: "公假",
  //     count: 18,
  //   },
  //   {
  //     name: "婚假",
  //     count: 2,
  //   },
  //   {
  //     name: "產假",
  //     count: 5,
  //   },
  //   {
  //     name: "暑曠",
  //     count: 9,
  //   },
  //   {
  //     name: "防疫假",
  //     count: 12,
  //   },
  //   {
  //     name: "缺課",
  //     count: 89,
  //   },
  //   {
  //     name: "遲到",
  //     count: 50,
  //   }
  // ];

  const chartDisData = [
    {
      name: "大功",
      count: 4,
      fill: '#83a6ed',
    },
    {
      name: "小功",
      count: 20,
      fill: '#83a6ed',
    },
    {
      name: "嘉獎",
      count: 1,
      fill: '#83a6ed',
    },
    {
      name: "大過",
      count: 0,
      fill: '#fb6340',
    },
    {
      name: "小過",
      count: 18,
      fill: '#fb6340',
    },
    {
      name: "警告",
      count: 2,
      fill: '#fb6340',
    }
  ];

  // const selChange = event => {
  //   setShowSemester(false);
  //   const value = event.target.value;
  //   setDateRangeType(value);
  // };

  const [dateRangeType, setDateRangeType] = useState('selday');
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [attschoolYears, setAttSchoolYears] = useState([]); // 學年度
  const [showSemester, setShowSemester] = useState(false);
  const [yearSemester, setYearSemester] = useState(''); //'107,2'
  const [absenceLists, setAbsenceLists] = useState([]); // 假別清單
  const [attSum, setAttSum] = useState([]); // 假別：總計人數

  const [merged, setMerged] = useState([]); // 
  const [setStudMerged, setSetStudMerged] = useState([]); // 

  const [chartMax, setChartMax] = useState(0); // 取圖表最大值

  const [attClassNames, setAttClassNames] = useState([]); // 班級清單
  const [attCount, setAttCount] = useState(['假別', 0]); //假別,人數

  const [attLists, setAttLists] = useState([]); // 缺曠名單
  const [attSearchLists, setAttSearchLists] = useState([]); // 缺曠查詢名單
  const [selAttClassName, setSelAttClassName] = useState([]); // 班級的下拉式選單

  const [studLists, setStudLists] = useState([]); // 班級學生清單
  const [selClass, setSelClass] = useState(""); // 選取的班級
  const [selGyear, setSelGyear] = useState("Y"); // 選取的年級

  const [searchName, setSearchName] = useState(""); // 搜尋值
  const [searchNameSend, setSearchNameSend] = useState(""); // 搜尋值send





  // const tmp = {};


  useEffect(() => {
    GetAttSchoolYear();
    GetAbsenceList();
    GetClassName();
  }, []);


  useEffect(() => {
    // bodyReturn();
    GetAttendanceSummary();
  }, [dateRange, yearSemester, showSemester]);

  useEffect(() => {
    GetAttendanceList();
    // console.log(attLists);
  }, [attCount]);

  useEffect(() => {
    GetClassStudent();
    GetAttendanceListSearch();
  }, [selClass, dateRange, yearSemester, showSemester, searchNameSend]);

  useEffect(() => {
    setSelClass("");
    if (selGyear === "Y") {
      setSelAttClassName([]);
    }
  }, [selGyear]);


  const colAttLists = {};

  if (Object.keys(attLists).length) {
    for (let item of [].concat(attLists || [])) {
      //   if (!tmp[item.name]) {
      //     tmp[item.name] = [item];
      //   } else {
      //     tmp[item.name].push(item);
      //   }
      // }
      // console.log(tmp)
      const studentKey = `stu_${item.grade_year}_${item.class_name}_${item.student_id}`;
      if (!colAttLists[studentKey]) {
        colAttLists[studentKey] = {
          name: item.name,
          class_name: item.class_name,
          grade_year: item.grade_year,
          student_id: item.student_id,
          student_number: item.student_number,
          seat_no: item.seat_no,
          seme: {},
        };
      }

      const semeKey = `seme_${item.school_year}_${item.semester}`;
      if (!colAttLists[studentKey].seme[semeKey]) {
        colAttLists[studentKey].seme[semeKey] = {
          school_year: item.school_year,
          semester: item.semester,
          absence_list: [],
        };
      }

      colAttLists[studentKey].seme[semeKey].absence_list.push({
        absence_type: item.absence_type,
        counts: item.counts,
        occur: item.occur,
        periods: item.periods,
      });
    }
    // console.log(colAttLists);
  }


  const colSearchAttLists = {};

  if (Object.keys(attSearchLists).length) {
    for (let item of [].concat(attSearchLists || [])) {
      const studentKey = `stu_${item.grade_year}_${item.class_name}_${item.student_id}`;
      if (!colSearchAttLists[studentKey]) {
        colSearchAttLists[studentKey] = {
          name: item.name,
          class_name: item.class_name,
          grade_year: item.grade_year,
          student_id: item.student_id,
          student_number: item.student_number,
          seat_no: item.seat_no,
          seme: {},
        };
      }

      const semeKey = `seme_${item.school_year}_${item.semester}`;
      if (!colSearchAttLists[studentKey].seme[semeKey]) {
        colSearchAttLists[studentKey].seme[semeKey] = {
          school_year: item.school_year,
          semester: item.semester,
          absence_list: [],
        };
      }

      colSearchAttLists[studentKey].seme[semeKey].absence_list.push({
        absence_type: item.absence_type,
        counts: item.counts,
        occur: item.occur,
        periods: item.periods,
      });
    }
    // console.log(colSearchAttLists);
  }

  // useEffect(() => {
  if (studLists) {
    ([].concat(studLists || [])).forEach((item) => {
      const studentKey = `stu_${item.grade_year}_${item.class_name}_${item.student_id}`;
      item.seme = colSearchAttLists[studentKey]?.seme || {};
    });
  };
  // }, [selClass]);


  useEffect(() => {
    const source = {};
    absenceLists.forEach(v => source[v.name] = v.count);
    ([].concat(attSum || [])).forEach(v => source[v.name] = v.count);
    const merge = Object.getOwnPropertyNames(source).map(v => ({ name: v, count: source[v] }));
    setMerged(merge);
    setChartMax(Math.max(...merge.map(c => c.count)));
  }, [attSum]);


  const bodyReturn = () => {
    if (showSemester) {
      return `<Request><YearSemester>${yearSemester}</YearSemester></Request>`
    } else {
      // console.log(yearSemester, dateRange);
      return `<Request><BeginDate>${moment(dateRange[0]).format('YYYY-MM-DD')}</BeginDate><EndDate>${moment(dateRange[1]).format('YYYY-MM-DD')}</EndDate></Request>`;
    }
  }


  // 呼叫 Service
  var _connection = window.gadget.getContract("1campus.affairs.teacher");

  // 取得缺曠統計數據
  async function GetAttendanceSummary() {
    // console.log(bodyReturn());
    await _connection.send({
      service: "_.GetAttendanceSummary",
      body: `${bodyReturn()}`,
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAttendanceSummaryErr', yearSemester);
          return 'err';
        } else {
          if (response) {
            setAttSum(response.AttendanceSum);
          }
        }
      }
    });
  }


  const bodyListReturn = () => {
    if (showSemester) {
      return `<Request><YearSemester>${yearSemester}</YearSemester><DisType>${attCount[0]}</DisType></Request>`
    } else {
      // console.log(yearSemester, dateRange);
      return `<Request><BeginDate>${moment(dateRange[0]).format('YYYY-MM-DD')}</BeginDate><EndDate>${moment(dateRange[1]).format('YYYY-MM-DD')}</EndDate><DisType>${attCount[0]}</DisType></Request>`;
    }
  }


  // 取得缺曠名單(假別用)
  async function GetAttendanceList() {
    // console.log(bodyReturn());
    await _connection.send({
      service: "_.GetAttendanceList",
      body: `${bodyListReturn()}`,
      result: function (response, error, http) {
        // console.log(bodyListReturn());
        if (error !== null) {
          console.log('GetAttendanceListErr', yearSemester);
          return 'err';
        } else {
          if (response.AttendanceList) {

            setAttLists(response.AttendanceList);

          } else { setAttLists([]); }
        }
      }
    });
  }


  // 取得缺曠學期
  async function GetAttSchoolYear() {
    await _connection.send({
      service: "_.GetAttSchoolYear",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAttSchoolYearErr', error);
          return 'err';
        } else {
          if (response) {

            // console.log('GetAttSchoolYear', response);
            setAttSchoolYears(response.SchoolYear);
          }
        }
      }
    });
  }

  // 取得假別
  async function GetAbsenceList() {
    await _connection.send({
      service: "_.GetAbsenceList",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAbsenceList', error);
          return 'err';
        } else {
          if (response) {
            setAbsenceLists(response.AbsenceList);
            // console.log(absenceLists);

          }
        }
      }
    });
  }

  // 取得班級學生清單
  async function GetClassStudent() {
    await _connection.send({
      service: "_.GetClassStudent",
      body: `<Request><ClassName>${selClass}</ClassName><SearchKey>${searchNameSend}</SearchKey></Request>`,
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetClassStudentErr', error);
          return 'err';
        } else {
          if (response) {
            setStudLists(response.ClassStudent || []);
          }
        }
      }
    });
  }


  const bodyListReturnSearch = () => {
    if (showSemester) {
      return `<Request><YearSemester>${yearSemester}</YearSemester><ClassName>${selClass}</ClassName><SearchKey>${searchNameSend}</SearchKey></Request>`
    } else {
      // console.log(yearSemester, dateRange);
      return `<Request><BeginDate>${moment(dateRange[0]).format('YYYY-MM-DD')}</BeginDate><EndDate>${moment(dateRange[1]).format('YYYY-MM-DD')}</EndDate><ClassName>${selClass}</ClassName><SearchKey>${searchNameSend}</SearchKey></Request>`;
    }
  }


  // 取得缺曠名單(查詢依班級或姓名)
  async function GetAttendanceListSearch() {
    // console.log(bodyReturn());
    await _connection.send({
      service: "_.GetAttendanceList",
      body: `${bodyListReturnSearch()}`,
      result: function (response, error, http) {
        // console.log(bodyListReturn());
        if (error !== null) {
          console.log('GetAttendanceListSearchErr', yearSemester);
          return 'err';
        } else {
          if (response.AttendanceList) {
            setAttSearchLists(response.AttendanceList);
          } else { setAttSearchLists([]); }
        }
      }
    });
  }

  // useEffect(() => {
  //   const source = {};
  //   studLists.forEach(v => source[v.name] = '');
  //   ([].concat(attSearchLists || [])).forEach(v => source[v.name] = v);
  //   console.log(source);
  // const merge = Object.getOwnPropertyNames(source).map(v => ({ name: v, student_number: source[v] }));
  // setStudMerged(merge);

  // }, [selClass]);



  // 取得班級
  async function GetClassName() {
    await _connection.send({
      service: "_.GetClassName",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetClassNameErr', error);
          return 'err';
        } else {
          if (response) {
            setAttClassNames(response.ClassName);
          }
        }
      }
    });
  }


  const perDate = () => {
    setAttCount(['假別', 0]);

    if (dateRangeType === 'selday') {
      setDateRange([new Date(moment(dateRange[0]).add(-1, 'd')), new Date(moment(dateRange[0]).add(-1, 'd'))]);
    }
    if (dateRangeType === 'selweek') {
      setDateRange([new Date(moment(dateRange[0]).add(-1, 'w').startOf('week')), new Date(moment(dateRange[0]).add(-1, 'w').endOf('week'))]);
    }
    if (dateRangeType === 'selmonth') {
      setDateRange([new Date(moment(dateRange[0]).add(-1, 'M').startOf('month')), new Date(moment(dateRange[0]).add(-1, 'M').endOf('month'))]);
    }

  };

  const nextDate = () => {
    setAttCount(['假別', 0]);

    if (dateRangeType === 'selday') {
      setDateRange([new Date(moment(dateRange[1]).add(1, 'd')), new Date(moment(dateRange[1]).add(1, 'd'))]);
    }
    if (dateRangeType === 'selweek') {
      setDateRange([new Date(moment(dateRange[1]).add(1, 'w').startOf('week')), new Date(moment(dateRange[1]).add(1, 'w').endOf('week'))]);
    }
    if (dateRangeType === 'selmonth') {
      setDateRange([new Date(moment(dateRange[1]).add(1, 'M').startOf('month')), new Date(moment(dateRange[1]).add(1, 'M').endOf('month'))]);
    }

  };

  const handleChangeSeme = (e) => {
    setYearSemester(e.target.value);
    setAttCount(['假別', 0]);
  }

  const handleChangeGrade = (e) => {
    if (e.target.value !== "Y") {
      setSelAttClassName(attClassNames[e.target.value].class_name.split(','));
    } else {
      setSelAttClassName([]);
    }
    setSearchName("");
    setSearchNameSend("");
    setSelGyear(e.target.value);
    setSelClass("");
  }

  const handleChangeClass = (e) => {
    setSelClass(e.target.value);
  }

  const handleInputChange = (e) => {
    setSearchName(e.target.value);
    setSelGyear("Y");
  }

  const handleButton = () => {
    if (searchName.length > 1) {
      setSearchNameSend(searchName);
    } else {
      alert("長度不夠")
    }
    // setSearchName(e.target.value);
    // setSelGyear("Y");
  }



  return (
    <div className="App">
      <div className="container px-3 px-sm-4 py-5 content-col">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 col-lg-4 mb-4 text-nowrap pe-3 ps-3 me-0 me-lg-3">
            <input type="radio" name="score" value="selday" id="score0" checked={dateRangeType === "selday"}
              onChange={() => {
                setDateRangeType('selday');
                setShowSemester(false);
                setDateRange([new Date(), new Date()]);
                setAttCount(['假別', 0]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab1" htmlFor="score0">日</label>

            <input type="radio" name="score" value="selweek" id="score1" checked={dateRangeType === "selweek"}
              onChange={() => {
                setDateRangeType('selweek');
                setShowSemester(false);
                setDateRange([new Date(moment().startOf('week')), new Date(moment().endOf('week'))]);
                setAttCount(['假別', 0]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" htmlFor="score1">周</label>

            <input type="radio" name="score" value="selmonth" id="score2" checked={dateRangeType === "selmonth"}
              onChange={() => {
                setDateRangeType('selmonth');
                setShowSemester(false);
                setDateRange([new Date(moment().startOf('month')), new Date(moment().endOf('month'))]);
                setAttCount(['假別', 0]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" htmlFor="score2">月</label>

            <input type="radio" name="score" value="selyear" id="score3" checked={dateRangeType === "selyear"}
              onChange={() => {
                setDateRangeType('selyear');
                setShowSemester(true);
                setYearSemester(`${attschoolYears[0].school_year},${attschoolYears[0].semester}`);
                setAttCount(['假別', 0]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab3" htmlFor="score3">學期</label>
          </div>

          {(showSemester === false) && <div className="col-12 col-md-6 col-lg-5 mb-4 pe-0">
            <div className="d-flex align-items-center">
              <span className="material-icons-outlined color-1 cursor-pointer"
                onClick={() => { perDate(); }}>arrow_back_ios</span>
              {/* <input type="text" name="daterange" className="daterange mx-2" /> */}
              <CustomProvider locale={zhTW}>
                <DateRangePicker format="yyyy-MM-dd" value={dateRange} locale={zhTW}
                  cleanable={false}
                  className="mx-2 height-40"
                  onChange={setDateRange} />
              </CustomProvider>
              <span className="material-icons-outlined color-1 cursor-pointer" onClick={() => { nextDate(); }}>arrow_forward_ios</span>
            </div>
          </div>}

          {(showSemester) && <div className="col-12 col-md-6 col-lg-5 mb-4 ps-3 pe-0">
            <select id='yearseme' className="form-select max-width-300" defaultValue={attschoolYears} onChange={(e) => handleChangeSeme(e)}>

              {/* <option value="110,1">110學年度第1學期</option>
              <option value="109,2">109學年度第2學期</option>
              <option value="109,1">109學年度第1學期</option> */}
              {attschoolYears.map((AttschoolYear) => {
                return <option key={`${AttschoolYear.school_year},${AttschoolYear.semester}`} value={`${AttschoolYear.school_year},${AttschoolYear.semester}`}>
                  {`${AttschoolYear.school_year}學年度第${AttschoolYear.semester}學期`}</option>
              })}
            </select>
          </div>}

          {/* <div className='d-none d-md-block col'></div> */}

        </div>

        <div className="p-2"></div>

        <ul className="nav nav-tabs flex-nowrap" id="pills-tab" role="tablist">
          <li className="nav-item w-50" role="presentation">
            <div className="nav-link active color-a fs-18 text-center" data-bs-toggle="pill" data-bs-target="#attend"
              type="button" role="tab" aria-controls="attend" aria-selected="true">缺曠</div>
          </li>
          <li className="nav-item w-50" role="presentation">
            <div className="nav-link color-a fs-18 text-center" data-bs-toggle="pill" data-bs-target="#award" type="button"
              role="tab" aria-controls="award" aria-selected="false">獎懲</div>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade show active content-col" id="attend" role="tabpanel" aria-labelledby="attend-tab">


            <div className="accordion accordion-flush" id="chart">
              <div className="accordion-item">
                <div className="accordion-header">
                  <div className="accordion-button align-items-baseline p-0 mt-5" role="button" data-bs-toggle="collapse"
                    data-bs-target="#attChart" aria-expanded="true" aria-controls="attChart">
                    <div className='fs-24 fw-600 color-32 me-3'>缺曠統計</div>
                    <i className="collapse-close fa fa-chevron-down fs-20 pt-1 me-3 color-1"
                      aria-hidden="true"></i>
                    <i className="collapse-open fa fa-chevron-up fs-20 pt-1 me-3 color-1"
                      aria-hidden="true"></i>
                  </div>
                </div>

                <div id="attChart" className="accordion-collapse collapse show" data-bs-parent="#chart">
                  <div className="card mt-4">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="row text-center">
                            {merged.map((absence) => {
                              // return <a className="col-6 col-sm-4 col-md-3 col-lg-4" href={`${(absence.count > 0) ? '#attChartName' : 'javascript:;'}`}>
                              return <a className="col-6 col-sm-4 col-md-3 col-lg-4" href={'#attChartName'} onClick={() => {
                                setAttCount([absence.name, absence.count]);
                              }}>
                                <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                                  <span className="badge rounded-pill bg-light text-dark fs-16 ">{absence.name}</span>
                                  <h4 className="font-weight-bolder mt-2"><span style={{ color: (absence.count > 0) ? '#5ec1c7' : '#a3a3a3' }}>{absence.count}</span><span className="fs-14 ms-2">人</span></h4>
                                </div>
                              </a>
                            })}

                          </div>
                        </div>
                        <div className="col-12 col-lg-6 attend-chart">
                          {/* <img src="./assets/img/chat.png" alt="" className="mt-3 mt-lg-0 w-100" /> 
                    <BarChart width={150} height={40} data={data}>
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>*/}
                          <ResponsiveContainer>
                            <BarChart width={400} height={280} data={merged} layout="vertical" margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="splitColor" x1="1" x2="0" y1="0" y2="0">
                                  <stop offset="0%" stopColor="#00ddee" />
                                  <stop offset="100%" stopColor="#2196f3" />
                                </linearGradient>
                              </defs>
                              {/* <XAxis
                          dataKey="name" tickLine={false}
                          axisLine={{ stroke: "#2196f3" }}
                          tick={{ fill: "#999" }}
                        />
                        <YAxis/> */}
                              <XAxis dateKey="count" type="number" domain={[0, () => (chartMax <= 4) ? 4 : chartMax]} />
                              <YAxis dataKey="name" type="category" axisLine={{ stroke: "#2196f3" }} />

                              {/*<Bar dataKey="count" barSize={20} label={{ position: 'right', fill: '#2196f3' }}> */}
                              <Bar dataKey="count" fill="url(#splitColor)" barSize={20} label={{ position: 'right', fill: '#2196f3' }} fillOpacity={0.8} >
                                {/* 自訂色 
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))} */}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div id='attChartName' className='fs-20 mt-4'>缺曠名單<span className='fs-16 color-8 ms-3'>({attCount[0]}：{attCount[1]}人)</span></div>
                        {(attCount[1] === 0 || attCount[1] === '0') && <h5 className='ps-4 py-2'>無資料，請點選假別</h5>}

                        <div className="accordion accordion-flush" id="att">
                          <div className="accordion-item">
                            {/* {Object.getOwnPropertyNames(tmp).map((v, index) => {
                              const g = tmp[v]; */}
                            {Object.getOwnPropertyNames(colAttLists).map((stuKey, index) => {
                              const stuAtt = colAttLists[stuKey];

                              return <>
                                {/* <div>{v}</div> */}
                                {/* {g.map((i) => {
                                  return <div>{i.occur}</div>;
                                })} */}

                                <h5 className="accordion-header">
                                  <div className="accordion-button px-0 px-md-3 pt-2 pb-0" role="button" data-bs-toggle="collapse"
                                    data-bs-target={'#studAtt' + index} aria-expanded="false" aria-controls={'studAtt' + index}>
                                    <span style={{ width: '140px' }}>{stuAtt.class_name}</span>
                                    <span>{stuAtt.name}</span>
                                    <i className="collapse-close fa fa-chevron-down fs-16 pt-1 position-absolute end-0 me-3 color-1"
                                      aria-hidden="true"></i>
                                    <i className="collapse-open fa fa-chevron-up fs-16 pt-1 position-absolute end-0 me-3 color-1"
                                      aria-hidden="true"></i>
                                  </div>
                                </h5>

                                <div id={'studAtt' + index} className="accordion-collapse collapse" data-bs-parent="#att">
                                  <div className="accordion-body pt-0 px-0 px-md-5">
                                    {Object.getOwnPropertyNames(stuAtt.seme).map((semeKey, idx) => {
                                      const semeList = stuAtt.seme[semeKey];
                                      return <>
                                        <div className="font-weight-bolder mt-3 bg-f3">{semeList.school_year}學年度第{semeList.semester}學期</div>
                                        {semeList.absence_list.map((v) => {
                                          return (
                                            <div className="d-flex flex-wrap pt-2">
                                              <div className="me-3">{v.occur}</div>
                                              <div className="me-3">{v.absence_type}</div>
                                              <div className="me-3">{v.counts}節</div>
                                              <div className="color-8">({v.periods})</div>
                                            </div>
                                          );
                                        })}
                                      </>
                                    })}
                                  </div>
                                </div>
                              </>
                            })}

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>


            <h2 className="d-flex align-items-center">
              缺曠查詢
            </h2>
            <div className="row mt-3">
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select" value={selGyear} onChange={(e) => handleChangeGrade(e)}>
                  <option value="Y" selected>(選擇年級)</option>
                  {attClassNames.map((gyear, index) => {
                    return <option key={index} value={index}>
                      {`${(gyear.grade_year) ? gyear.grade_year : "未分"}年級`}</option>
                  })}
                </select>

              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select" value={selClass} onChange={(e) => handleChangeClass(e)}>
                  <option value="" disabled selected>{selAttClassName.length ? "(選擇班級)" : "班級(請先選擇年級)"}</option>
                  {selAttClassName.map((cname, index) => {
                    return <option key={index} value={cname}>{cname}</option>
                  })}
                </select>
              </div>
              <div className='col-12 col-md-6 col-lg-4 ms-auto mb-3'>
                <div className='search'>
                  <i className='fa fa-search color-1'></i>
                  <input type="text" value={searchName} onChange={handleInputChange} autoComplete="off" className="form-control inputname" placeholder="依學生姓名或學號查詢" />
                  <input type="button" value='查詢' onClick={handleButton} className='btn btn-custom fw-600 shadow-none' />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-3">

                {/* <div className="accordion accordion-flush">
                  {[].concat(studLists || []).map((list, index) => {
                    return <div>{list.class_name}{list.name}</div>
                  })}
                </div> */}

                <div className="accordion accordion-flush" id="attSearch">
                  <div className="accordion-item">

                    {(selClass === '' && searchNameSend === '') && <h5 className='ps-3 py-2'>無資料，請選取班級或輸入查詢</h5>}
                    {(Object.keys(studLists).length === 0 && (selClass !== '' || searchNameSend !== '')) && <h5 className='ps-3 py-2'>{selClass}{searchNameSend}  無資料</h5>}

                    {(studLists) && ([].concat(studLists || [])).map((stuAtt, index) => {

                      return <>
                        <h5 className="accordion-header">
                          <div className="accordion-button px-0 px-md-3 pt-2 pb-0" role="button" data-bs-toggle="collapse"
                            data-bs-target={'#studSearchAtt' + index} aria-expanded="false" aria-controls={'studSearchAtt' + index}
                            style={{ color: Object.getOwnPropertyNames(stuAtt.seme).length ? '#1db7bd' : '#a3a3a3' }}>
                            <span className='claname'>{stuAtt.class_name}</span>
                            <span className='studname'>{stuAtt.name}</span>
                            <span>{stuAtt.student_number}</span>
                            <i className="collapse-close fa fa-chevron-down fs-16 pt-1 position-absolute end-0 me-0 me-md-3"
                              aria-hidden="true" style={{ color: Object.getOwnPropertyNames(stuAtt.seme).length ? '#1db7bd' : '#a3a3a3' }}></i>
                            <i className="collapse-open fa fa-chevron-up fs-16 pt-1 position-absolute end-0 me-0 me-md-3"
                              aria-hidden="true" style={{ color: Object.getOwnPropertyNames(stuAtt.seme).length ? '#1db7bd' : '#a3a3a3' }}></i>
                          </div>
                        </h5>

                        <div id={'studSearchAtt' + index} className="accordion-collapse collapse" data-bs-parent="#attSearch">
                          <div className="accordion-body pt-0 px-0 px-md-5">
                            {Object.getOwnPropertyNames(stuAtt.seme).map((semeKey, idx) => {
                              const semeList = stuAtt.seme[semeKey];
                              return <>
                                {(!semeList) && <div className='ps-3 py-2'>無資料缺曠資料</div>}
                                <div className="font-weight-bolder mt-3 bg-f3">{`${semeList.school_year}學年度第${semeList.semester}學期`}</div>
                                {semeList.absence_list.map((v) => {
                                  return (
                                    <div className="d-flex flex-wrap pt-2">
                                      <div className="me-3">{v.occur}</div>
                                      <div className="me-3">{v.absence_type}</div>
                                      <div className="me-3">{v.counts}節</div>
                                      <div className="color-8">({v.periods})</div>
                                    </div>
                                  );
                                })}
                              </>
                            })}
                          </div>
                        </div>
                      </>
                    })}

                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="tab-pane fade content-col" id="award" role="tabpanel" aria-labelledby="award-tab">
            <h2>獎懲</h2>
            <div className="card mt-4">
              <div className="card-body p-3">
                <div className="row text-center">
                  <div className="col-12 col-md-6">

                    <div className="row">
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">大功</span>
                          <h4 className="font-weight-bolder text-primary mt-2">1<span className="fs-14 ms-2 text-dark">人</span></h4>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">小功</span>
                          <h4 className="font-weight-bolder text-primary mt-2">23<span className="fs-14 ms-2 text-dark">人</span>
                          </h4>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">嘉獎</span>
                          <h4 className="font-weight-bolder text-primary mt-2">86<span className="fs-14 ms-2 text-dark">人</span>
                          </h4>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">大過</span>
                          <h4 className="font-weight-bolder text-warning mt-2">80<span className="fs-14 ms-2 text-dark">人</span>
                          </h4>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">小過</span>
                          <h4 className="font-weight-bolder text-warning mt-2">55<span className="fs-14 ms-2 text-dark">人</span>
                          </h4>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4 col-md-6 col-lg-4">
                        <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                          <span className="badge rounded-pill bg-light text-dark fs-16 ">警告</span>
                          <h4 className="font-weight-bolder text-warning mt-2">0<span className="fs-14 ms-2 text-dark">人</span></h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 award-chart">
                    <ResponsiveContainer>
                      <BarChart width={400} height={280} data={chartDisData} layout="vertical" margin={{ top: 30, right: 30, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="splitColor" x1="1" x2="0" y1="0" y2="0">
                            <stop offset="0%" stopColor="#00ddee" />
                            <stop offset="100%" stopColor="#2196f3" />
                          </linearGradient>
                        </defs>
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" axisLine={{ stroke: "#2196f3" }} />

                        <Bar dataKey="count" barSize={20} label={{ position: 'right', fill: '#2196f3' }}>
                          {/* <Bar dataKey="count" fill="url(#splitColor)" barSize={20} label={{ position: 'right', fill: '#2196f3' }} > */}

                          {/* {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))} */}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select" defaultValue={""}>
                  <option value="Choice 1" selected>全部年級</option>
                  <option value="Choice 2">一年級</option>
                  <option value="Choice 3">二年級</option>
                  <option value="Choice 3">三年級</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select" defaultValue={""}>
                  <option value="Choice 1" selected>全部班級</option>
                  <option value="Choice 2">資101</option>
                  <option value="Choice 3">資102</option>
                  <option value="Choice 3">普201</option>
                  <option value="Choice 3">普202</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <input type="text" className="daterange" placeholder="依學生姓名或學號查詢" />
              </div>

            </div>


            <div className="card">
              <div className="card-body p-3">

                <div className="accordion accordion-flush" id="awa">

                  <div className="accordion-item">
                    <h5 className="accordion-header">
                      查無資料，請調整查詢條件
                    </h5>
                  </div>

                  <div className="accordion-item">
                    <h5 className="accordion-header">
                      <div className="accordion-button px-0 px-md-3 py-2" role="button" data-bs-toggle="collapse"
                        data-bs-target="#studaward2" aria-expanded="false" aria-controls="studaward2">
                        <span className="pe-3">資訊忠二班</span>
                        <span>徐志明</span>
                        <i className="collapse-close fa fa-plus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                        <i className="collapse-open fa fa-minus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                      </div>
                    </h5>
                    <div id="studaward2" className="accordion-collapse collapse" data-bs-parent="#award">
                      <div className="accordion-body pt-0 px-0 px-md-5">
                        <div className="font-weight-bolder mt-3 bg-f3">110學年度第1學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/07/18</div>
                          <div className="me-3">嘉獎</div>
                          <div className="me-3">2支</div>
                          <div className="color-8">(擔任社團幹部，表現優異)</div>
                        </div>
                        <div className="font-weight-bolder mt-3 bg-f3">109學年度第2學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">小功</div>
                          <div className="me-3">1支</div>
                          <div className="color-8">(擔糾察隊揮認真負責)</div>
                        </div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">小功</div>
                          <div className="me-3">2支</div>
                          <div className="color-8">(參與科學展覽，表現優異)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
