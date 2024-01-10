import React, { Component } from 'react';
import classNames from 'classnames';
import { contract } from '../utility';

export default class GraduationRequirement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: '',
      list: []
    };

    this.getRaduationRequirement = this.getRaduationRequirement.bind(this);
    this.getGraduationSubjectList = this.getGraduationSubjectList.bind(this);
    this.getSubjectSemesterScore = this.getSubjectSemesterScore.bind(this);
  };

  render() {
    return (
      <div className='text-sm mt-4'>
        <div className="card flex justify-between items-center heard-table cursor-pointer md:cursor-auto p-2"
          style={{ background: '#dddde1', borderBottom: '1px solid #ACACAC' }}
          data-toggle="collapse"
          data-target="#leaveSchool" aria-expanded="true" aria-controls="leaveSchool">
          <div className='flex'><i className="glyphicon glyphicon-tag"></i> <pre className='p-0 pl-1'>{this.state.info}</pre></div>
          <div className="block md:hidden text-xl pr-4">
            <i className="collapse-close fa fa-angle-down font-bold text-xl" aria-hidden="true"></i>
            <i className="collapse-open fa fa-angle-up font-bold text-xl" aria-hidden="true"></i>
          </div>
        </div>
        <div className="collapse in" id="leaveSchool" aria-expanded="true">
          <div className="dis-show mt-4">
            {(this.state.list.length) ? this.state.list : <tr><td colSpan="6">目前無資料</td></tr>}
          </div>

        </div>
        <table className="table my-table dis-none">
          <thead>
            <tr>
              <th>課程識別碼</th>
              <th>課號</th>
              <th>課程名稱</th>
              <th>學分數</th>
              <th>群組別</th>
              <th>備註</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.list.length) ? this.state.list : <tr><td colSpan="6">目前無資料</td></tr>}
          </tbody>
        </table>
      </div>
    );
  };

  // 取得畢業學分表
  getRaduationRequirement() {
    contract.send({
      service: "default.GetGraduationRequirement",
      body: {},
      result: (response, error, http) => {
        if (!error) {
          if (response.Result) {
            this.setState((prevState, props) => {
              return {
                info: 
                `畢業應修科目及學分表：
                系訂必修：${response.Result.DepartmentCredit || ''} 學分、選修：${response.Result.ElectiveCredit || ''} 學分、
                應修最低畢業學分： ${response.Result.RequiredCredit || ''}
                `
              };
            });
          }
        }
      }
    });
  };

  // 取得畢業應修科目
  getGraduationSubjectList() {
    return new Promise((resolve, reject) => {
      contract.send({
        service: "default.GetGraduationSubjectList",
        body: {},
        result: (response, error, http) => {
          if (!error) {
            if (response.Result) {
              resolve([].concat(response.Result.Subject || []));
            } else {
              resolve([]);
            }
          } else {
            console.log(error)
            reject();
          }
        }
      });
    });
  };

  // 取得所修課程成績
  getSubjectSemesterScore() {
    return new Promise((resolve, reject) => {
      contract.send({
        service: "default.GetSubjectSemesterScore",
        body: {},
        result: (response, error, http) => {
          if (!error) {
            if (response.Result) {
              let scoreTexts = {};

              ([].concat(response.Result.Score || [])).forEach((item, idx) => {
                if (item.IsPass === 't' && (item.ScoreConfirmed === "" || item.ScoreConfirmed === "t")) {
                  scoreTexts['subjectId_' + item.SubjectID] = '已取得學分';
                } else {
                  scoreTexts['subjectId_' + item.SubjectID] = '';
                }
              });
              resolve(scoreTexts);
            } else {
              resolve({});
            }
          } else {
            reject();
          }
        }
      });
    });
  };

  componentWillMount() {
    // 取得畢業學分表
    this.getRaduationRequirement();

    Promise.all([this.getGraduationSubjectList(), this.getSubjectSemesterScore()]).then((data) => {
      let items = [];
      if (data[0].length) {
        data[0].forEach((item, idx) => {
          items.push(
            <tbody className='contents'>
              <tr key={idx} className="info dis-none">
                <td>{item.NewSubjectCode}</td>
                <td>{item.SubjectCode}</td>
                <td>
                  {item.ChineseName}<br />{item.EnglishName}
                </td>
                <td>{item.Credit}</td>
                <td>{item.GroupName}</td>
                <td>
                  {data[1]['subjectId_' + item.SubjectID]}
                </td>
              </tr>
              <div className='dis-show'>
                <div className="bd-callout requiredt info px-4 pt-3 mb-5" >
                  <div className="card text-muted cursor-pointer collapsed" aria-expanded="false" data-toggle="collapse" data-target={`#leaveSchool${idx}`} aria-controls={`leaveSchool${idx}`}>
                    <div className="flex justify-center items-center gap-x-2 pb-3">
                      <div className="requiredt w-8" style={{flexShrink: '0'}}>{item.GroupName}</div>
                      <div className="flex flex-col">
                        <div className="text-base font-semibold color-blue">{item.ChineseName}</div>
                        <div className="whitespace-pre-line">{item.EnglishName}</div>
                      </div>
                      <div className="flex-grow text-xl text-right pr-2">
                        <i className="collapse-close fa fa-angle-down font-bold text-xl" aria-hidden="true"></i>
                        <i className="collapse-open fa fa-angle-up font-bold text-xl" aria-hidden="true"></i>

                      </div>
                    </div>
                  </div>
                  <div className="text-muted -mx-4 px-4 collapse" style={{ background: 'rgb(250, 250, 250)' }} id={`leaveSchool${idx}`} aria-expanded="false">
                    <hr className="mb-2 mt-0" />
                    <div className="flex justify-between mb-3">
                      <div className="text-center">
                        <div>課號</div>
                        <div className="font-bold">{item.SubjectCode}</div>
                      </div>
                      <div className="text-center">
                        <div>學分</div>
                        <div className="font-bold">{item.Credit}</div>
                      </div>
                      <div className="text-center">
                        <div>課程識別碼</div>
                        <div className="font-bold">{item.NewSubjectCode}</div>
                      </div>
                    </div>
                    <div className="flex justify-start mb-3">
                      <div className="mr-2">群組別</div>
                      <div className="font-bold">{item.GroupName}</div>
                    </div>
                    <hr className="my-2" />
                    <div className="font-bold pb-2">{data[1]['subjectId_' + item.SubjectID]}</div>

                  </div>
                </div>
              </div>
            </tbody>
          )
        });
      }
      this.setState((prevState, props) => {
        return { list: items };
      });

    }, (err) => {
      // console.log(err);
    });
  }
}