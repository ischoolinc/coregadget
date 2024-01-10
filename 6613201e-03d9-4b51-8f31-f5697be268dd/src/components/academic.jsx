import React, { Component } from 'react';
import classNames from 'classnames';
import { contract } from '../utility';

export default class Academic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: []
    };

    this.getSemester = this.getSemester.bind(this);
    this.getCurrentCourse = this.getCurrentCourse.bind(this);
  }

  render() {
    return (
      <div>
        <div id="current-course" className='text-sm'>
          <div className="card flex justify-between items-center heard-table cursor-pointer md:cursor-auto p-2"
            style={{ background: '#dddde1', borderBottom: '1px solid #ACACAC' }}
            data-toggle="collapse"
            data-target="#classlist" aria-expanded="true" aria-controls="classlist">
            <div><i className="glyphicon glyphicon-tag"></i> <span>本學期修課</span></div>
            <div className="block md:hidden text-xl px-4">
              <i className="collapse-close fa fa-angle-down font-bold text-xl" aria-hidden="true"></i>
              <i className="collapse-open fa fa-angle-up font-bold text-xl" aria-hidden="true"></i>
            </div>
          </div>
          <div className="collapse in" id="classlist" aria-expanded="true">
            <div className="dis-show mt-4">
              {(this.state.currentData.length) ? this.state.currentData : <div>目前無資料</div>}
            </div>

          </div>
          <table className="table my-table dis-none">
            <thead>
              <tr>
                <th>流水號</th>
                <th>學年度</th>
                <th>學期</th>
                <th>課程識別碼</th>
                <th>課程名稱</th>
                <th>班次</th>
                <th>類別</th>
                <th>必選修</th>
                <th>學分數</th>
                <th>授課教師</th>
                <th>成績</th>
              </tr>
            </thead>
            {(this.state.currentData.length) ? this.state.currentData : <tr><td colSpan="11">目前無資料</td></tr>}
          </table>
        </div>
      </div>
    );
  }

  getSemester() {
    return new Promise((resolve, reject) => {
      contract.send({
        service: "default.GetSemester",
        body: {},
        result: (response, error, http) => {
          if (!error) {
            if (response.Result) {
              let schoolYear = response.Result.SystemConfig.DefaultSchoolYear;
              let semester = response.Result.SystemConfig.DefaultSemester;
              resolve({ schoolYear: schoolYear, semester: semester })
            } else {
              console.log('default.GetSemester 查無學年期');
              reject();
            }
          } else {
            console.log(error);
            reject();
          }
        }
      });
    });

  };

  // 取得當學期修課課程
  getCurrentCourse(schoolYear, semester) {
    return new Promise((resolve, reject) => {
      contract.send({
        service: "default.GetCurrentCourse",
        body: {
          Request: {
            SchoolYear: schoolYear,
            Semester: semester
          }
        },
        result: (response, error, http) => {
          if (!error) {
            if (response.Result) {
              resolve([].concat(response.Result.Course || []));
            } else {
              resolve([]);
            }
          } else {
            console.log(error);
            reject();
          }
        }
      });
    });
  };

  componentWillMount() {
    let self = this;
    this.getSemester().then((data) => {
      // console.log(data);
      this.getCurrentCourse(data.schoolYear, data.semester).then((lists) => {
        // console.log(lists);
        let items = [];
        if (lists.length) {
          lists.forEach((item, idx) => {
            items.push(
              <tbody className='contents'>
                <tr key={idx} className="dis-none">
                  <td>{item.SerialNo}</td>
                  <td>{item.SchoolYear}</td>
                  <td>{(item.Semester === "0" ? "夏季" : `第${item.Semester}學期`)}</td>
                  <td>{item.NewSubjectCode}</td>
                  <td>{item.SubjectName}</td>
                  <td>{item.ClassName}</td>
                  <td>{item.CourseType}</td>
                  <td>{(item.IsRequired == "t") ? "必修" : "選修"}</td>
                  <td>{item.Credit}</td>
                  <td>{item.TeacherName}</td>
                  <td>{item.IsCancel == 't' ? "停修" : item.Score}</td>
                </tr>
                <div className='dis-show'>
                  <div className={`bd-callout px-4 pt-3 mb-5 ${(item.IsRequired == "t") ? 'requiredt' : 'requiredf'}`} >
                    <div className="card text-muted cursor-pointer collapsed" aria-expanded="false" data-toggle="collapse" data-target="#classlist0" aria-controls="classlist0">
                      <div className="flex justify-center items-center gap-x-2 pb-3">
                        <div className={`text-nowrap ${(item.IsRequired == "t") ? 'requiredt' : 'requiredf'}`}>{(item.IsRequired == "t") ? "必修" : "選修"}</div>
                        <div className="flex flex-col">
                          <div className="text-base font-semibold color-blue">{item.SubjectName} {item.ClassName}</div>
                          <div className="whitespace-pre-line">{item.SchoolYear}學年度 {(item.Semester === "0" ? "夏季" : `第${item.Semester}學期`)} ({item.IsCancel == 't' ? "停修" : item.Score})</div>
                        </div>
                        <div className="flex-grow text-xl text-right pr-2">
                          <i className="collapse-close fa fa-angle-down font-bold text-xl" aria-hidden="true"></i>
                          <i className="collapse-open fa fa-angle-up font-bold text-xl" aria-hidden="true"></i>

                        </div>
                      </div>
                    </div>
                    <div className="text-muted -mx-4 px-4 collapse" style={{ background: 'rgb(250, 250, 250)' }} id="classlist0" aria-expanded="false">
                      <hr className="mb-2 mt-0" />
                      <div className="flex justify-between mb-3">
                        <div className="text-center">
                          <div>流水號</div>
                          <div className="font-bold">{item.SerialNo}</div>
                        </div>
                        <div className="text-center">
                          <div>學分</div>
                          <div className="font-bold">{item.Credit}</div>
                        </div>
                        <div className="text-center">
                          <div>課程識別碼</div>
                          <div className="font-bold">{item.NewSubjectCode}</div>
                        </div>
                        <div className="text-center">
                          <div>班次</div>
                          <div className="font-bold">{item.ClassName}</div>
                        </div>
                      </div>
                      <div className="flex justify-start mb-3">
                        <div className="mr-2">教師</div>
                        <div>{item.TeacherName}</div>
                      </div>
                      <div className='grid grid-cols-2'>
                        <div className="flex justify-start mb-3">
                          <div className="mr-2">類別</div>
                          <div className="font-bold">{item.CourseType}</div>
                        </div>
                        <div className="flex justify-start mb-3">
                          <div className="mr-2">成績</div>
                          <div className="font-bold">{item.IsCancel == 't' ? "停修" : item.Score}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </tbody>
            );
          });
        }
        self.setState((prevState, props) => {
          return { currentData: items };
        });
      })
        .catch((err) => { });
    })
      .catch((err) => { });
  };
}