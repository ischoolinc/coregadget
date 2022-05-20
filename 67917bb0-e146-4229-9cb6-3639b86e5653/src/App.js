// import logo from './logo.svg';
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
  const [schoolYears, setSchoolYears] = useState([]);
  const [showSemester, setShowSemester] = useState(false);
  const [yearSemester, setYearSemester] = useState(''); //'107,2'
  const [absenceLists, setAbsenceLists] = useState([]); // 假別
  const [attSum, setAttSum] = useState([]); // 
  const [merged, setMerged] = useState([]); // 

  useEffect(() => {
    GetSchoolYear();
    GetAbsenceList();
    GetAttendanceSummary();
  }, []);

  useEffect(() => {
    // bodyReturn();
    GetAttendanceSummary();    
  }, [dateRange, yearSemester, showSemester]);


  const bodyReturn = () => {
    if (showSemester) {
      return `<Request><YearSemester>${yearSemester}</YearSemester></Request>`
    } else {
      console.log(yearSemester, dateRange);
      return `<Request><BeginDate>${moment(dateRange[0]).format('YYYY-MM-DD')}</BeginDate><EndDate>${moment(dateRange[1]).format('YYYY-MM-DD')}</EndDate></Request>`;
    }
  }

  // console.log(bodyReturn());

  // 呼叫 Service
  var _connection = window.gadget.getContract("1campus.affairs.teacher");

  // 取得缺曠統計數據
  async function GetAttendanceSummary() {
    console.log(bodyReturn());
    await _connection.send({
      service: "_.GetAttendanceSummary",
      body: `${bodyReturn()}`,
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetAttendanceSummaryErr', yearSemester);
          return 'err';
        } else {
          if (response) {
            setAttSum(response.Discipline);
          }
        }
      }
    });
  }

  useEffect(() => {
    const source = {};
    absenceLists.forEach(v => source[v.name] = v.count);
    ([].concat(attSum || [])).forEach(v => source[v.name] = v.count);
    const merge = Object.getOwnPropertyNames(source).map(v => ({ name: v, count: source[v] }));
    setMerged(merge);
  }, [attSum]);

  // 取得學期
  async function GetSchoolYear() {
    await _connection.send({
      service: "_.GetSchoolYear",
      body: {},
      result: function (response, error, http) {
        if (error !== null) {
          console.log('GetSchoolYearErr', error);
          return 'err';
        } else {
          if (response) {

            // console.log('GetSchoolYear', response);
            setSchoolYears(response.SchoolYear);
            console.log(yearSemester);
          }
        }
      }
    });
  }

  // 取得學期
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
            console.log(absenceLists);

          }
        }
      }
    });
  }
  
  const perDate = () => {

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

  const handleChange = (e) => {
    setYearSemester(e.target.value)
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
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab1" htmlFor="score0">日</label>

            <input type="radio" name="score" value="selweek" id="score1" checked={dateRangeType === "selweek"}
              onChange={() => {
                setDateRangeType('selweek');
                setShowSemester(false);
                setDateRange([new Date(moment().startOf('week')), new Date(moment().endOf('week'))]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" htmlFor="score1">周</label>

            <input type="radio" name="score" value="selmonth" id="score2" checked={dateRangeType === "selmonth"}
              onChange={() => {
                setDateRangeType('selmonth');
                setShowSemester(false);
                setDateRange([new Date(moment().startOf('month')), new Date(moment().endOf('month'))]);
              }} />
            <label className="btn p-0 m-0 fs-14 color-8 btn-g-custom lab2" htmlFor="score2">月</label>

            <input type="radio" name="score" value="selyear" id="score3" checked={dateRangeType === "selyear"}
              onChange={() => {
                setDateRangeType('selyear');
                setShowSemester(true);
                setYearSemester(`${schoolYears[0].school_year},${schoolYears[0].semester}`);
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
            <select id='yearseme' className="form-select max-width-300" onChange={(e) => handleChange(e)}>

              {/* <option value="110,1">110學年度第1學期</option>
              <option value="109,2">109學年度第2學期</option>
              <option value="109,1">109學年度第1學期</option> */}
              {schoolYears.map((schoolYear) => {
                return <option key={`${schoolYear.school_year},${schoolYear.semester}`} value={`${schoolYear.school_year},${schoolYear.semester}`}>
                  {`${schoolYear.school_year}學年度第${schoolYear.semester}學期`}</option>
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
            <h2 className="d-flex align-items-center">
              缺曠
            </h2>
            <div className="card mt-4">
              <div className="card-body p-3">
                <div className="row text-center">
                  <div className="col-12 col-lg-6">
                    <div className="row">
                      {merged.map((absence) => {
                        return <div className="col-6 col-sm-4 col-md-3 col-lg-4">
                          <div className="bg-gray-100 border-radius-md p-3 my-2 btn-total cursor-pointer">
                            <span className="badge rounded-pill bg-light text-dark fs-16 ">{absence.name}</span>
                            <h4 className="font-weight-bolder mt-2">{absence.count}<span className="fs-14 ms-2">人</span></h4>
                          </div>
                        </div>
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
                        <XAxis type="number" />
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
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select">
                  <option value="Choice 1" selected="">全部年級</option>
                  <option value="Choice 2">一年級</option>
                  <option value="Choice 3">二年級</option>
                  <option value="Choice 3">三年級</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select">
                  <option value="Choice 1" selected="">全部班級</option>
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

                <div className="accordion accordion-flush" id="att">

                  <div className="accordion-item">
                    <h5 className="accordion-header">
                      <div className="accordion-button px-0 px-md-3 py-2" role="button" data-bs-toggle="collapse"
                        data-bs-target="#studAtt1" aria-expanded="false" aria-controls="studAtt1">
                        <span className="pe-3">普202</span>
                        <span>劉珮如</span>
                        <i className="collapse-close fa fa-plus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                        <i className="collapse-open fa fa-minus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                      </div>
                    </h5>
                    <div id="studAtt1" className="accordion-collapse collapse" data-bs-parent="#att">
                      <div className="accordion-body pt-0 px-0 px-md-5">
                        <div className="font-weight-bolder mt-3 bg-f3">110學年度第1學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/07/18</div>
                          <div className="me-3">公假</div>
                          <div className="me-3">4節</div>
                          <div className="color-8">(二，三，四)</div>
                        </div>
                        <div className="font-weight-bolder mt-3 bg-f3">109學年度第2學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">公假</div>
                          <div className="me-3">8節</div>
                          <div className="color-8">(一，二，三，四，五，六，七，八)</div>
                        </div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">防疫假</div>
                          <div className="me-3">6節</div>
                          <div className="color-8">(一，二，三，四，五，六)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h5 className="accordion-header">
                      <div className="accordion-button px-0 px-md-3 py-2" role="button" data-bs-toggle="collapse"
                        data-bs-target="#studAtt2" aria-expanded="false" aria-controls="studAtt2">
                        <span className="pe-3">普202</span>
                        <span>徐志明</span>
                        <i className="collapse-close fa fa-plus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                        <i className="collapse-open fa fa-minus text-xs pt-1 position-absolute end-0 me-3"
                          aria-hidden="true"></i>
                      </div>
                    </h5>
                    <div id="studAtt2" className="accordion-collapse collapse" data-bs-parent="#att">
                      <div className="accordion-body pt-0 px-0 px-md-5">
                        <div className="font-weight-bolder mt-3 bg-f3">110學年度第1學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/07/18</div>
                          <div className="me-3">公假</div>
                          <div>4節</div>
                          <div className="color-8">(二，三，四)</div>
                        </div>
                        <div className="font-weight-bolder mt-3 bg-f3">109學年度第2學期</div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">公假</div>
                          <div>8節</div>
                          <div className="color-8">(一，二，三，四，五，六，七，八)</div>
                        </div>
                        <div className="d-flex flex-wrap pt-2">
                          <div className="me-3">2021/01/18</div>
                          <div className="me-3">防疫假</div>
                          <div>6節</div>
                          <div className="color-8">(一，二，三，四，五，六)</div>
                        </div>
                      </div>
                    </div>
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
                <select className="form-select">
                  <option value="Choice 1" selected="">全部年級</option>
                  <option value="Choice 2">一年級</option>
                  <option value="Choice 3">二年級</option>
                  <option value="Choice 3">三年級</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mb-3">
                <select className="form-select">
                  <option value="Choice 1" selected="">全部班級</option>
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
    </div>
  );
}

export default App;
