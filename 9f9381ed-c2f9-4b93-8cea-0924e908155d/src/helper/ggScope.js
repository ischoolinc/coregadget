//import { useState } from 'react';

const ggScope = async (react_schoolYear, react_semester, setCredits, setMySemsSubjScore, setSemsEntryScore, setStudentInfo) => {
    let credits = [];
    //const [credits, setCredits] = useState([]);
    let _gg = {};
    _gg.connection = await window.gadget.getContract("ischool.transcript.student");
    _gg.Students = [];
    _gg.ScoreRules = [];
    _gg.GraduationPlans = [];
    _gg.Student = '';
    _gg.schoolYear = '';
    _gg.semester = '';
  
    // TODO: 清除資訊
    _gg.ResetData = function () {
        //   $("#Credit .my-slate-number").html("尚無資料"); // TODO: 實得
        //   $("#Credit .my-slate-total").html("");  // TODO: 已修
        //   $("#Credit tbody").html("");
      
        //   // TODO: 本學期分項成績
        //   $("#EntryScore span[entry-type=academic]").html("");
        //   $("#EntryScore span[entry-type=internship]").html("");
      
        //   // TODO: 本學期科目成績
        //   $("#SubjectScore tbody").html("");
        };
        // 浮點運算
        _gg.FloatMath = function (x, operators, y) {
            var arg1, arg2, e, m, r1, r2;

            x = Number(x);
            y = Number(y);
            arg1 = x + '';
            arg2 = y + '';
            try {
            r1 = arg1.split(".")[1].length;
            } catch (_error) {
            e = _error;
            r1 = 0;
            }
            try {
            r2 = arg2.split(".")[1].length;
            } catch (_error) {
            e = _error;
            r2 = 0;
            }
            m = Math.max(r1, r2);
            switch (operators) {
            case "+":
                return (_gg.FloatMath(x, '*', Math.pow(10, m)) + _gg.FloatMath(y, '*', Math.pow(10, m))) / Math.pow(10, m);
            case "-":
                return (_gg.FloatMath(x, '*', Math.pow(10, m)) - _gg.FloatMath(y, '*', Math.pow(10, m))) / Math.pow(10, m);
            case "*":
                m = r1 + r2;
                return (Number(arg1.replace(".", "")) * Number(arg2.replace(".", ""))) / Math.pow(10, m);
            case "/":
                return _gg.FloatMath(x, '*', Math.pow(10, m)) / _gg.FloatMath(y, '*', Math.pow(10, m));
            default:
                return '';
            }
        };
    // TODO: 取得學生資料
    const getStudentData = () => {

            _gg.connection.send({
            service: "_.GetStudentInfo",
            body: '',
            result: function (response, error, http) {
            if (error !== null) {
                return error;
                //return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetStudentInfo)\n</div>");
            } else {
                console.log('response', response);
                //$(response.Student).each(function (index, item) {
                [].concat(response.Student || []).forEach(function (item, index) {
                if (index === 0) { 
                    console.log('student item', item)
                    _gg.Student = item;
                    }
    
                if (!_gg.Students[item.StudentID]) {
                    _gg.Students[item.StudentID] = item;
    
                    // TODO: 設定學生使用的畢業條件，以學生優先，班級次之
                    if (item.StudentScoreCalcRuleID) {
                    _gg.Students[item.StudentID].ScoreCalcRuleID = item.StudentScoreCalcRuleID;
                    } else {
                    _gg.Students[item.StudentID].ScoreCalcRuleID = item.ClassScoreCalcRuleID;
                    }
    
                    // TODO: 設定學生使用的課程規範，以學生優先，班級次之
                    if (item.StudentGraduationPlanID) {
                    _gg.Students[item.StudentID].GraduationPlanID = item.StudentGraduationPlanID;
                    } else {
                    _gg.Students[item.StudentID].GraduationPlanID = item.ClassGraduationPlanID;
                    }
                }
                });
    
                let student = _gg.Student;
                setStudentInfo(student);
                //console.log('_gg student', student);
                _gg.GetSemsEntryScore();                         // TODO: 取得學期成績
                _gg.GetSemsSubjScore();                          // TODO: 取得分項成績
                _gg.GetScoreRule(student.ScoreCalcRuleID);       // TODO: 取得畢業條件
                _gg.GetGraduationPlan(student.GraduationPlanID); // TODO: 取得課規

            }
            }
        });


    }

    getStudentData();
    
    

  // TODO: 處理畢業條件、各項學分資訊
  _gg.SetStudentCreditData = function () {
    let student = _gg.Student;
    //console.log(student, _gg.Student);
    if (_gg.ScoreRules[student.ScoreCalcRuleID] &&
      _gg.GraduationPlans[student.GraduationPlanID] &&
      student.MySemsSubjScore &&
      student.MySemsEntryScore) {

      student.MyScoreRule = (_gg.ScoreRules[student.ScoreCalcRuleID] || '');            // TODO: 設定全域學生畢業條件
      student.MyGraduationPlan = (_gg.GraduationPlans[student.GraduationPlanID] || '');  // TODO: 設定全域學生課規表
      student.CreditCount = {
        Credits: []   //各學期學分數
      };

      var SemsSubjScore = student.MySemsSubjScore;

      //$(SemsSubjScore).each(function (index, item) {
      SemsSubjScore.forEach(function (item, index) {

        var tmp_SemsCredit = {
          SchoolYear: item.SchoolYear,
          Semester: item.Semester,
          S_Total_Credit: 0,                //單一學期已修總學分
          S_True_Credit: 0,                //單一學期實得總學分
          S_Required: 0,                //單一學期必修
          S_Choose: 0,                //單一學期選修
          S_Required_By_Edu: 0,                //單一學期部定必修
          S_Required_By_School: 0,                //單一學期校訂必修
          S_Choose_By_Edu: 0,                //單一學期部定選修
          S_Choose_By_School: 0,                //單一學期校訂選修
          S_Internships: 0                 //單一學期實習
        };

        // TODO: 實際學期科目成績內容
        var tmp_semsSubjScore = {};

        //$(item.ScoreInfo.SemesterSubjectScoreInfo.Subject).each(function () {
        item.ScoreInfo.SemesterSubjectScoreInfo.Subject.forEach(function (value, index) {    
            //console.log('value: ', value)
          // TODO: 實際學期科目成績內容
          tmp_semsSubjScore = {
            Entry: value.開課分項類別,
            Credit: value.開課學分數,
            RequiredBy: value.修課校部訂,
            Required: value.修課必選修,
            NotIncludedInCredit: (value.不計學分 === "否") ? "False" : "True"
          };

          // TODO: 採計方式以學生個人修習為主
          var tmp_use_data = tmp_semsSubjScore;
          // TODO: 學分數轉數字
          var tmp_credit = parseFloat(tmp_use_data.Credit, 10) || 0;

          if (tmp_use_data.NotIncludedInCredit === "False") {
            // TODO: 單一學期
            //2014/10/16 改為支援小數點。
            //tmp_SemsCredit.S_Total_Credit += tmp_credit;
            tmp_SemsCredit.S_Total_Credit = _gg.FloatMath(tmp_SemsCredit.S_Total_Credit, "+", tmp_credit);

            if (value.是否取得學分 === "是") {
              //tmp_SemsCredit.S_True_Credit += tmp_credit;
              tmp_SemsCredit.S_True_Credit = _gg.FloatMath(tmp_SemsCredit.S_True_Credit, "+", tmp_credit);

              //tmp_SemsCredit.S_Required += (tmp_use_data.Required === "必修") ? tmp_credit : 0;
              tmp_SemsCredit.S_Required = _gg.FloatMath(tmp_SemsCredit.S_Required, "+", (tmp_use_data.Required === "必修") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Choose += (tmp_use_data.Required === "選修") ? tmp_credit : 0;
              tmp_SemsCredit.S_Choose = _gg.FloatMath(tmp_SemsCredit.S_Choose, "+", (tmp_use_data.Required === "選修") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Required_By_Edu += (tmp_use_data.Required === "必修" && tmp_use_data.RequiredBy === "部訂") ? tmp_credit : 0;
              tmp_SemsCredit.S_Required_By_Edu = _gg.FloatMath(tmp_SemsCredit.S_Required_By_Edu, "+", (tmp_use_data.Required === "必修" && tmp_use_data.RequiredBy === "部訂") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Required_By_School += (tmp_use_data.Required === "必修" && tmp_use_data.RequiredBy === "校訂") ? tmp_credit : 0;
              tmp_SemsCredit.S_Required_By_School = _gg.FloatMath(tmp_SemsCredit.S_Required_By_School, "+", (tmp_use_data.Required === "必修" && tmp_use_data.RequiredBy === "校訂") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Choose_By_Edu += (tmp_use_data.Required === "選修" && tmp_use_data.RequiredBy === "部訂") ? tmp_credit : 0;
              tmp_SemsCredit.S_Choose_By_Edu = _gg.FloatMath(tmp_SemsCredit.S_Choose_By_Edu, "+", (tmp_use_data.Required === "選修" && tmp_use_data.RequiredBy === "部訂") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Choose_By_School += (tmp_use_data.Required === "選修" && tmp_use_data.RequiredBy === "校訂") ? tmp_credit : 0;
              tmp_SemsCredit.S_Choose_By_School = _gg.FloatMath(tmp_SemsCredit.S_Choose_By_School, "+", (tmp_use_data.Required === "選修" && tmp_use_data.RequiredBy === "校訂") ? tmp_credit : 0);

              //tmp_SemsCredit.S_Internships += (tmp_use_data.Entry === "實習科目") ? tmp_credit : 0;
              tmp_SemsCredit.S_Internships = _gg.FloatMath(tmp_SemsCredit.S_Internships, "+", (tmp_use_data.Entry === "實習科目") ? tmp_credit : 0);
            }
          }
        });

        student.CreditCount.Credits.push(tmp_SemsCredit);

      });


      // TODO: 學期對照表
      var items = [];
      //$(student.SemsHistory.History).each(function (key, item) {
      console.log('ww student', student);
      student.SemsHistory.History.forEach(function (item, key) {
        items.push("<button class='btn btn-large' grade-year='" + item.GradeYear + "' school-year='" + item.SchoolYear + "' semester='" + item.Semester + "'>" + item.SchoolYear + item.Semester + "</button>");
      });

      // $(".my-schoolyear-semester-widget div").html(items.reverse().join(""));
      // $(".my-schoolyear-semester-widget button:first").addClass("active").trigger('click');

      _gg.SetScoreData(student); // TODO: 學年度成績資訊
    }
  };

    // TODO: 取得分項成績
    _gg.GetSemsEntryScore = async function (schoolYear, semester) {
        let student = _gg.Student;
        await _gg.connection.send({
        service: "_.GetSemsEntryScore",
        body: '<Request><Condition></Condition></Request>',
        result: function (response, error, http) {
            if (error !== null) {
            return error;
            //return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetSemsEntryScore)\n</div>");
            } else {
            if (response.Students) {
                student.MySemsEntryScore = response.Students;
            } else {
                student.MySemsEntryScore = [];
            }
            _gg.SetStudentCreditData();
            }
        }
        });
    };
    
    // TODO: 取得學期成績
    _gg.GetSemsSubjScore = async function (schoolYear, semester) {
        let student = _gg.Student;
        await _gg.connection.send({
          service: "_.GetSemsSubjScore",
          body: '<Request><Condition></Condition></Request>',
          result: function (response, error, http) {
            if (error !== null) {
                return error;
              //return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetSemsSubjScore)\n</div>");
            } else {
              if (response.Students.SemsSubjScore) {
                student.MySemsSubjScore = response.Students.SemsSubjScore;
                console.log('MySemsSubjScore', response.Students.SemsSubjScore);
                setMySemsSubjScore(response.Students.SemsSubjScore)
              } else {
                student.MySemsSubjScore = [];
              }
              _gg.SetStudentCreditData();
            }
          }
        });
      };

    // TODO: 取得畢業條件
    _gg.GetScoreRule = async function (id) {
        await _gg.connection.send({
          service: "_.GetScoreRule",
          body: "<Request><Condition><Id>" + id + "</Id></Condition></Request>",
          result: function (response, error, http) {
            if (error !== null) {
                return error;
                //return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetScoreRule)\n</div>");
            } else {
              //$(response.ScoreCalcRule).each(function (index, item) {
                [].concat(response.ScoreCalcRule || []).forEach(function (item, index) {
                if (!_gg.ScoreRules[item.Id]) {
                  _gg.ScoreRules[item.Id] = item;
                }
              });
              _gg.SetStudentCreditData();
            }
          }
        });
      };

    
    // TODO: 取得課規
    _gg.GetGraduationPlan = async function (id) {
        // 學生、班級都可以不設定課規
        if (id) {
          await _gg.connection.send({
            service: "_.GetGraduationPlan",
            body: "<Request><Condition><Id>" + id + "</Id></Condition></Request>",
            result: function (response, error, http) {
              if (error !== null) {
                  return error;
                  //return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetGraduationPlan)\n</div>");
              } else {
                console.log('GraduationPlan response: ', response);   
                [].concat(response.GraduationPlan || []).forEach(function (item, index) {
                ////$(response.GraduationPlan).each(function (index, item) {
                  if (!_gg.GraduationPlans[item.Id]) {
                    _gg.GraduationPlans[item.Id] = item;
                  }
                });
                _gg.SetStudentCreditData();
              }
            }
          });
        } else {
          _gg.GraduationPlans[id] = {};
        }
      };
    
  
    //$(document).ready(function () {
  
      //$('.my-schoolyear-semester-widget').on("click", ".btn", function () {
        _gg.schoolYear = react_schoolYear;//$(this).attr("school-year");
        _gg.semester = react_semester;//$(this).attr("semester");
        // TODO: 學年度成績資訊
    _gg.SetScoreData = function (student) {
        //_gg.ResetData();
    
        //let student = _gg.Student;
        //var ScoreRule = student.MyScoreRule.Content.ScoreCalcRule;
        var GraduationPlan = (student.MyGraduationPlan
          && student.MyGraduationPlan.Content
          && student.MyGraduationPlan.Content.GraduationPlan
          && student.MyGraduationPlan.Content.GraduationPlan.Subject
        ) ? student.MyGraduationPlan.Content.GraduationPlan.Subject : '';
        var SemsSubjScore = student.MySemsSubjScore;
        var SemsEntryScore = student.MySemsEntryScore;
        console.log('student', student)
        // TODO: 本學期分項成績
        var tmp_academic = '--'
        var tmp_internship = '--';
        //$(SemsEntryScore.SemsEntryScore).each(function (index, item) {
          console.log('SemsEntryScore: ', [].concat(SemsEntryScore.SemsEntryScore || []));
          setSemsEntryScore([].concat(SemsEntryScore.SemsEntryScore || []));
          [].concat(SemsEntryScore.SemsEntryScore || []).forEach(function (item, index) {
            

          // TODO: 目前要顯示的學年度學期
          if (_gg.schoolYear === item.SchoolYear && _gg.semester === item.Semester) {
            //$(this.ScoreInfo.SemesterEntryScore.Entry).each(function (key, value) {
            
            item.ScoreInfo.SemesterEntryScore.Entry.forEach(function (value, key) {
              if (value.分項 === "學業") {
                tmp_academic = value.成績;
              };
              if (value.分項 === "實習科目") {
                tmp_internship = value.成績;
              };
            });
          };
        });
        console.log('tmp_academic', tmp_academic);
        console.log('tmp_internship', tmp_internship);
      //   $("#EntryScore span[entry-type=academic]").html(tmp_academic);
      //   $("#EntryScore span[entry-type=internship]").html(tmp_internship);
    
        // TODO: 處理分項成績中與課程規劃表的差異 Tooltip
        var fun_SubjectScore_tooltip = function (mainData, compareData) {
          if (compareData) {
            if (mainData !== compareData) {
              return '<td rel="tooltip" data-original-title="課程規劃表「' + (student.MyGraduationPlan.Name || '') + '」<br/>設定為' + compareData + '">' + mainData + '</td>';
            } else {
              return '<td>' + mainData + '</td>';
            }
          } else {
            return '<td>' + mainData + '</td>';
          }
        };
    
        // TODO: 本學期科目成績
        //$(SemsSubjScore).each(function (index, item) {
        SemsSubjScore.forEach(function (item, index) {
          // TODO: 目前要顯示的學年度學期
          var items = [];
          if (_gg.schoolYear === item.SchoolYear && _gg.semester === item.Semester) {
            //$(item.ScoreInfo.SemesterSubjectScoreInfo.Subject).each(function () {
            item.ScoreInfo.SemesterSubjectScoreInfo.Subject.forEach(function (item, index) {
              // TODO: 取得學分
              var tmp_credit = '不列入';
              if (item.不計學分 === "否") {
                tmp_credit = (item.是否取得學分 === "是" ? '<i class="icon-ok"></i>' : '<i class="icon-remove"></i>');
              }
    
              if (tmp_credit === '不列入') {
                items.push('<tr class="my-ignore">');
              } else {
                items.push('<tr>');
              }
    
              var tmp_graduationPlan = {};
              var tmp_semsSubjScore = {};
    
              // TODO: 課程規劃表
              var that = this;
              //$(GraduationPlan).each(function () {
              GraduationPlan.forEach(function (item, index) {
                if (item.科目 === item.SubjectName && item.科目級別 === item.Level) {
                  tmp_graduationPlan = {
                    Entry: item.Entry,
                    SubjectName: item.SubjectName,
                    Level: item.Level,
                    Credit: item.Credit,
                    RequiredBy: item.RequiredBy,
                    Required: item.Required,
                    NotIncludedInCredit: item.NotIncludedInCredit,
                    NotIncludedInCalc: item.NotIncludedInCalc
                  };
                  return false; // TODO: 跳出each
                }
              });
    
              // TODO: 實際學期科目成績內容
              tmp_semsSubjScore = {
                Entry: item.開課分項類別,
                SubjectName: item.科目,
                Level: item.科目級別,
                Credit: item.開課學分數,
                RequiredBy: item.修課校部訂,
                Required: item.修課必選修,
                NotIncludedInCredit: (item.不計學分 === "否") ? "False" : "True",
                NotIncludedInCalc: (item.不需評分 === "否") ? "False" : "True"
              };
    
              // TODO: 以實際學期科目成績內容為準
              //var tmp_use_data = (ScoreRule.學期科目成績屬性採計方式 === "以課程規劃表內容為準") ? this : tmp_graduationPlan;
              var tmp_use_data = tmp_semsSubjScore;
    
    
              // TODO: 成績擇優顯示，不需評分顯示空白
              var tmp_score = '';
              if (tmp_use_data.NotIncludedInCalc === "False") {
                if (item.原始成績 === '' && item.學年調整成績 === '' && item.擇優採計成績 === '' && item.補考成績 === '' && item.重修成績 === '') {
                  tmp_score = '';
                } else {
                  tmp_score = Math.max(item.原始成績, item.學年調整成績, item.擇優採計成績, item.補考成績, item.重修成績, 0);
                  if (parseInt(item.補考成績, 10) === tmp_score) { tmp_score += '(補)'; }
                  if (parseInt(item.重修成績, 10) === tmp_score) { tmp_score += '(重)'; }
                  if (parseInt(item.擇優採計成績, 10) === tmp_score) { tmp_score += '(手)'; }
                  if (parseInt(item.學年調整成績, 10) === tmp_score) { tmp_score += '(調)'; }
                }
                tmp_score = (item.是否取得學分 === "是" ? tmp_score : '<span class="my-lost-credit">' + tmp_score + '</span>');
              }
    
              // TODO: 分項類別   ,科目,級別,學分,校訂/部定,必修/選修
              //$.each(tmp_semsSubjScore, function (name, value) {
                [].concat(tmp_semsSubjScore || []).forEach( function (value, name) {
                if (name !== "NotIncludedInCredit" && name !== "NotIncludedInCalc") {
                  items.push(fun_SubjectScore_tooltip(tmp_semsSubjScore[name], tmp_graduationPlan[name]));
                }
              });
    
              items.push('<td>' + tmp_score + '</td>');
    
              var originScore = (item.是否取得學分 === "是" ? item.原始成績 : '<span class="my-lost-credit">' + item.原始成績 + '</span>');
              items.push('<td>' + originScore + '</td>');
    
              items.push('<td>' + tmp_credit + '</td>');
              items.push('</tr>');
    
            });
          //   $("#SubjectScore tbody").html(items.join(""));
          //   $('td[rel=tooltip]').tooltip("show").tooltip("toggle");
    
            return false; // TODO: 跳出each
          }
        });
    
        // TODO: 本學期學分資訊
        //$(student.CreditCount.Credits).each(function (index, item) {
        credits = ([].concat(student.CreditCount.Credits || []));
        setCredits([].concat(student.CreditCount.Credits || []));
        console.log('gg credits', credits);
        [].concat(student.CreditCount.Credits || []).forEach(function (item, index) {
            console.log('item www', item);

          if (_gg.schoolYear === item.SchoolYear && _gg.semester === item.Semester) {
            var items = '<tr>' +
              '<th><span>必修</span> </th><td><span>' + item.S_Required + '</span></td>' +
              '<td>&nbsp;</td>' +
              '<th><span>選修</span> </th><td><span>' + item.S_Choose + '</span></td>' +
              '<td>&nbsp;</td>' +
              '</tr>' +
              '<tr>' +
              '<th><span>部定必修</span> </th><td><span>' + item.S_Required_By_Edu + '</span></td>' +
              '<td>&nbsp;</td>' +
              '<th><span>部定選修</span> </th><td><span>' + item.S_Choose_By_Edu + '</span></td>' +
              '<td>&nbsp;</td>' +
              '</tr>' +
              '<tr>' +
              '<th><span>校定必修</span> </th><td><span>' + item.S_Required_By_School + '</span></td>' +
              '<td>&nbsp;</td>' +
              '<th><span>校定選修</span> </th><td><span>' + item.S_Choose_By_School + '</span></td>' +
              '<td>&nbsp;</td>' +
              '</tr>' +
              '<tr>' +
              '<th><span>實習</span> </th><td><span>' + item.S_Internships + '</span></td>' +
              '<td colspan="4">&nbsp;</td>' +
              '</tr>';
  
          //   $("#Credit .my-slate-number").html(item.S_True_Credit); // TODO: 實得
          //   $("#Credit .my-slate-total").html(item.S_Total_Credit);  // TODO: 已修
          //   $("#Credit tbody").html(items);
  
            console.log('實得', item.S_True_Credit);
            console.log('已修', item.S_Total_Credit);
            console.log('items', items)
    
            return false; // TODO: 跳出each
          }
        });
      };

        

      //});
  
      
  
    //});
  
    return {credits: credits};
  }

  export { ggScope }