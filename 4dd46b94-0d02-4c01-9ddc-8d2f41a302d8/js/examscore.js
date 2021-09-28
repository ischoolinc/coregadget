// Generated by CoffeeScript 1.6.3
(function () {

  jQuery(function () {
    gadget.onSizeChanged(function (size) {
      return $("#container-main").height(size.height - 47);
    });
    $("#ExamScore tbody").html("<tr><td>載入中...</td></tr>");

    $("#children-list").on("click", "a", function (evnet) {
      $('#children-list li[class=active]').removeClass('active');
      $(this).parent().addClass('active');
      Exam.onChangeStudent($(this).attr("children-index"));
      return $('.tooltip').remove();
    });
    return $("#Semester").on("click", ".btn", function (event) {
      var schoolYear = $(this).attr("school-year");
      var semester = $(this).attr("semester");
      $("#ExamScore").find('thead').html('').end().find('tbody').html("<tr><td>載入中...</td></tr>");
      $("#ScoreInterval tbody").html("<tr><td colspan=\"12\">載入中...</td></tr>");
      $("#ExamDropDown").find("ul").html("").end().find("a[data-toggle='dropdown']").html("");
      Exam.score(schoolYear, semester);
      return $(".tooltip").remove();
    });
  });

  var Exam = (function () {
    // 2021-09 裝「成績輸入截止後查看」模式，是否開放顯示平均
    var isShowExamInfo = null;
    // 2021-09 GetViewerConfig 取得使用者設定的試別開放時間
    var ViewTimeConfig;

    var _system_exam_must_enddate = gadget.params.system_exam_must_enddate || "true";
    var _system_position = gadget.params.system_position || "student";
    var _students = null;
    var _student = null;
    // 目前學年度
    var _curr_schoolyear = null;
    // 目前學期
    var _curr_semester = null;
    var _exam_score = {};
    var _places = null;
    var _math_type = null;
    var _keys = ["國文", "國語", "英文", "英語", "數學", "理化", "生物", "社會", "物理", "化學", "歷史", "地理", "公民"];
    // 介面目前學年度
    var _schoolYear = null;
    // 介面目前學期
    var _semester = null;
    var _connection = null;

    //目前排名顯示設定
    var _curr_arithmeticaveset = null;
    var _curr_weightedaveset = null;


    if (_system_position === "parent") {
      _connection = gadget.getContract("ischool.exam.parent");
    } else {
      _connection = gadget.getContract("ischool.exam.student");
    }

    /** 取得目前學年度學期 */
    getCurrSemester = function () {
      return _connection.send({
        service: "_.GetCurrentSemester",
        body: {},
        result: function (response, error, http) {
          if (error !== null) {
            return set_error_message("#mainMsg", "GetCurrentSemester", error);
          } else {
            if (response.Current) {
              _curr_schoolyear = response.Current.SchoolYear || "";
              return _curr_semester = response.Current.Semester || "";
            }
          }
        }
      });
    };

    /**取得設定檔 */
    getRankViewerConfig = function () {
      return _connection.send({
        service: "_.GetViewerConfig",
        body: {},
        result: function (response, error, http) {
          if (error !== null) {
            return set_error_message('#mainMsg', 'GetViewerConfig', error);
          } else {
            if (response.Item) {
              _curr_arithmeticaveset = response.Item.ArithmeticAveSet || "";
              _curr_weightedaveset = response.Item.WeightedAveSet || "";
              _system_exam_must_enddate = response.Item.EndDataSet || _system_exam_must_enddate.toLowerCase();
              _system_exam_must_enddate = _system_exam_must_enddate.toLowerCase();

              ViewTimeConfig = response.Item;
            }
          }
        }
      });
    };
    getRankViewerConfig();
    /** 取得小孩學生資訊(家長用) */
    getStudentInfo = function () {
      return _connection.send({
        service: "_.GetStudentInfo",
        body: {},
        result: function (response, error, http) {
          var items;
          if (error !== null) {
            return set_error_message('#mainMsg', 'GetStudentInfo', error);
          } else {
            items = [];
            if (response.Result && response.Result.Student) {
              _students = $(response.Result.Student);
              return _students.each(function (index, student) {
                items.push("<li " + (index === 0 ? 'class="active"' : void 0) + ">\n  <a href=\"#\" children-index=\"" + index + "\">" + student.StudentName + "</a>\n</li>");
                return $("#children-list").html(items.join("")).find('a:first').trigger('click');
              });
            }
          }
        }
      });
    };

    /** 取得成績計算規則 */
    getStudentRuleSeme = function () {
      var request = {};
      if (_system_position === "parent") {
        request.Request = {
          Condition: {
            StudentID: _student.StudentID
          }
        };
      }
      return _connection.send({
        service: "_.GetScoreCalcRule",
        body: request,
        result: function (response, error) {
          var obj, _ref, _ref1, _ref2, _ref3;
          if (error !== null) {
            return set_error_message("#mainMsg", "GetScoreCalcRule", error);
          } else {
            if ((_ref = response.ScoreCalcRule) != null ? (_ref1 = _ref.Content) != null ? (_ref2 = _ref1.ScoreCalcRule) != null ? (_ref3 = _ref2["各項成績計算位數"]) != null ? _ref3["科目成績計算位數"] : void 0 : void 0 : void 0 : void 0) {
              var obj = response.ScoreCalcRule.Content.ScoreCalcRule["各項成績計算位數"]["科目成績計算位數"];
              _places = obj["位數"] || 0;
              if (obj["四捨五入"] === "True") {
                _math_type = "round";
              }
              if (obj["無條件捨去"] === "True") {
                _math_type = "floor";
              }
              if (obj["無條件進位"] === "True") {
                _math_type = "ceil";
              }
            }
            /** 取得所有課程學年度學期 */
            return _connection.send({
              service: "_.GetAllCourseSemester",
              body: request,
              result: function (response, error) {
                var _ref4;
                if (error !== null) {
                  return set_error_message("#mainMsg", "GetAllCourseSemester", error);
                } else {
                  if (((_ref4 = response.Course) != null ? _ref4.Semester : void 0) != null) {
                    var items = [];
                    // 建立學年度學期按鈕
                    [].concat(response.Course.Semester || []).forEach((data) => {
                      return items.push("<button class=\"btn btn-large\" school-year=\"" + data.SchoolYear + "\" semester=\"" + data.Semester + "\">\n  " + data.SchoolYear + data.Semester + "\n</button>");
                    });
                    return $("#Semester .btn-group").html(items.join("")).find(".btn:first").trigger("click");
                  } else {
                    return $("#ExamScore tbody").html("<tr><td>目前無資料</td></tr>");
                  }
                }
              }
            });
          }
        }
      });
    };

    resetData = function () {
      $("#ExamScore thead").html("");
      $("#ExamScore tbody").html("");
      $("#ScoreInterval tbody").html("");
      return $("#ExamDropDown").find("ul").html("").end().find("a[data-toggle='dropdown']").html("");
    };

    /** 載入資料 */
    loadScore = function (schoolYear, semester) {
      var isCurrSemester = schoolYear === _curr_schoolyear && semester === _curr_semester;
      _schoolYear = schoolYear;
      _semester = semester;
      rankList = [];

      var request = {
        Content: {
          Condition: {
            SchoolYear: schoolYear,
            Semester: semester
          }
        }
      };
      var request2 = {
        SchoolYear: schoolYear,
        Semester: semester
      };
      if (_system_position === "parent") {
        request.Content.Condition.StudentID = _student.StudentID;
        request2.StudentID = _student.StudentID;
      }

      // 取得課程成績
      const getCourseExamScore = new Promise((r, j) => {
        _connection.send({
          service: "_.GetCourseExamScore",
          body: request,
          result: function (response, error) {
            if (error !== null) {
              j(set_error_message("#mainMsg", "GetCourseExamScore", error));
            } else {
              if (response.ExamScoreList && response.ExamScoreList.Seme && response.ExamScoreList.Seme.Course) {
                // _exam_score[schoolYear + semester] = myHandleArray(response.ExamScoreList.Seme.Course).sort(Comparer);
                _exam_score[schoolYear + semester] = [].concat(response.ExamScoreList.Seme.Course || []).sort(Comparer);
              } else {
                _exam_score[schoolYear + semester] = null;
              }

              r(true);
            }
          }
        });
      });

      // 取得固定排名資料
      const getRank = new Promise((r, j) => {
        _connection.send({
          service: "_.GetRank",
          body: request2,
          result: function (response, error) {
            if (error !== null) {
              j(set_error_message("#mainMsg", "GetRank", error));
            } else {
              rankList = [].concat(response.RankMatrix || []);
              r(true);
            }
          }
        });
      });

      Promise.all([getCourseExamScore, getRank]).then(() => {
        if ($("#Semester button.active").attr("school-year") === schoolYear
          && $("#Semester button.active").attr("semester") === semester) {

          return showScore(_exam_score[schoolYear + semester], isCurrSemester);
        }
      });
      return;
    };

    /** 
     * 畫面呈現 
     * exam_data 學年度學期課程評量分數
     * isCurrSemester 是否為系統學年度學期
     */
    showScore = function (exam_data, isCurrSemester) {
      var curMatrix = '班級';
      var now = new Date();
      var exam_list = [];
      exam_isShow_list = [];
      var thead1 = [];
      var thead2 = [];
      var dropdownList = [];
      var levelList = ["level_lt10", "level_10", "level_20", "level_30", "level_40"
        , "level_50", "level_60", "level_70", "level_80", "level_90", "level_gte100"];

      $("#Matrix").html("排名：" + curMatrix);

      if (exam_data) {
        [].concat(exam_data || []).forEach((course) => {
          [].concat(course.Exam || []).forEach((exam) => {
            if (exam.ExamID) {
              if (exam_list.findIndex((id) => id == exam.ExamID) === -1) {
                exam_list.push(exam.ExamID); 
                exam_isShow_list.push({
                  examID: exam.ExamID,
                  isAvgShow: true
                })
                thead1.push("<th colspan=\"3\">" + exam.ExamName + "</th>");
                thead2.push("<th colspan=\"2\">成績</th>");
                thead2.push("<th colspan=\"1\">排名</th>");
                return dropdownList.push("<li><a href=\"#\" my-examid=\"" + exam.ExamID + "\">" + exam.ExamName + "</a></li>");
              }
            }
          });
        });
      }

      // 切換定期評量
      $("#ExamDropDown").find("ul").html(dropdownList.join("")).end().find("a[data-toggle='dropdown']").html("");
      $("#ExamDropDown .dropdown-menu a").click(function () {
        $("#ScoreInterval tbody").html("<tr><td colspan=\"12\">載入中...</td></tr>");
        $("#ExamDropDown a[data-toggle='dropdown']").html($(this).text()).attr('my-examid', $(this).attr('my-examid'));
        return interval_process();
      });

      // 切換排名母群
      $("#MatrixMenu").on("click", "a", function (event) {
        var matrix = $(this).text();
        $("#Matrix").html("排名：" + matrix);
        curMatrix = matrix;
        return exam_process(_exam_score[_schoolYear + _semester]);
      });

      getIndex = function (cid, exams) {
        var ret;
        ret = null;
        $(exams).each(function (index, item) {
          if (item.ExamID === cid) {
            return ret = item;
          }
        });
        return ret;
      };

      getNow = function (callBack) {
        return _connection.send({
          service: "_.GetNow",
          body: {},
          result: function (response, error, http) {
            if (error !== null) {
              return set_error_message("#mainMsg", "GetNow", error);
            } else {
              if (callBack && $.isFunction(callBack)) {
                return callBack(new Date(response.Now));
              }
            }
          }
        });
      };

      /**
       * 顯示課程評量成績與排名資料
       * 有課程評量成績的話顯示評量排名組距
       */
      exam_process = function () {
        var thead_html = "";
        var tbody1 = [];
        var subBody = [];
        var tbody_html = "";

        if (exam_data) {
          $(exam_data).each(function (index, course) {
            var pre_score;
            tbody1.push("<tr><th>" + course.Subject + "</th>");
            pre_score = -999;
            $(exam_list).each(function (key, value) {
              var exam = getIndex(value, course.Exam);

              var _ref;
              var endtime = null;
              var show_data = true;
              var extension = null;
              var ext_score = null;
              var ext_text = null;
              var ext_assignmentScore = null;
              var avg_score = null;
              var td_score = null;

              if (exam) {
                isShowExamInfo = exam_isShow_list.find(x => x.examID == exam.ExamID);
                // 判斷成績是否開放查看
                if (isCurrSemester) {
                  if (_system_exam_must_enddate === "viewtime") { //2021-09增加可依據評量所設定的開放查詢時間判斷是否顯示成績
                    var ExamOpenTimes = ViewTimeConfig.Exams;

                    var ExamOpenTime = ExamOpenTimes.find(x => x.ExamID == exam.ExamID)

                    if (((_ref = exam.ScoreDetail) != null ? ExamOpenTime.ViewTime : void 0) != null) {
                      if (new Date(ExamOpenTime.ViewTime) >= now) {
                        show_data = false;
                      }
                      endtime = ExamOpenTime.ViewTime;
                    }
                  }
                  else if (_system_exam_must_enddate === "true") { //成績輸入截止後
                    if (((_ref = exam.ScoreDetail) != null ? _ref.EndTime : void 0) != null) {
                      if (new Date(exam.ScoreDetail.EndTime) >= now) {
                        show_data = false;
                        isShowExamInfo.isAvgShow = false; //只要有一個科目是未開放 平均之分數就未開放
                      }
                      endtime = exam.ScoreDetail.EndTime;
                    }
                  }
                }
  
                if (exam.ScoreDetail && show_data) {
                  // 成績資料
                  {
                    ext_score = exam.ScoreDetail.Score || "";
                    if (ext_score === "缺") {
                      avg_score = "";
                      td_score = "缺";
                    } else {
                      avg_score = parseFloat(ext_score, 10);
                      //td_score = ext_score ?  Number(avg_score).toFixed(_places) : "";
                      td_score = ext_score ? FloatMath(Number(avg_score), _math_type, _places) : "";
                    }
                    if (avg_score && avg_score < 60) {
                      tbody1.push("<td class=\"my-fail\" my-data=\"" + exam.ExamID + "\">" + td_score + "</td>");
                    } else {
                      tbody1.push("<td my-data=\"" + exam.ExamID + "\">" + td_score + "</td>");
                    }
                    if (course.Subject === "體育" || pre_score === -999) {
                      tbody1.push("<td>&nbsp;</td>");
                    } else {
                      if (avg_score) {
                        if (avg_score > pre_score) {
                          tbody1.push("<td><span class=\"my-progress\">↑</span></td>");
                        } else if (avg_score < pre_score) {
                          tbody1.push("<td><span class=\"my-regress\">↓</span></td>");
                        } else {
                          tbody1.push("<td>&nbsp;</td>");
                        }
                      } else {
                        tbody1.push("<td>&nbsp;</td>");
                      }
                    }
                  }
                  // 排名資料
                  {
                    // data.school_year == _curr_schoolyear
                    //   && data.semester == _curr_semester && 
                    // 取得排名資料
                    const data = rankList.find((data) => data.item_name == course.Subject
                      && data.ref_exam_id == exam.ExamID && data.rank_type == switchMatrix(curMatrix));

                    if (data) {

                      tbody1.push("<td my-data=\"" + exam.ExamID + "\">" + data.rank + "</td>");
                    } else {
                      tbody1.push("<td my-data=\"" + exam.ExamID + "\"></td>");
                    }
                  }
                  if (avg_score) {
                    return pre_score = avg_score;
                  }
                } else if (show_data === false) {

                  return tbody1.push("<td colspan=\"3\" rel=\"tooltip\"\n  title=\"" + (endtime ? endtime + "後開放" : "尚未開放") + "\">\n  未開放</td>");
                } else {
                  return tbody1.push("<td></td> <td></td> <td></td>");
                }
              } else {
                return tbody1.push("<td></td> <td></td> <td></td>");
              }
            });

            return tbody1.push("</tr>");
          });
          //--
          if (_curr_arithmeticaveset === 'True') {

            subBody.push("<tr><th>" + "算術平均及排名" + "</th>");

            exam_list.forEach(examID => {
              // 固定排名：算術平均＆排名
              {
                const data = rankList.find(data => data.item_type == '定期評量/總計成績' && data.item_name == '平均'
                  && data.ref_exam_id == examID && data.rank_type == switchMatrix(curMatrix));

                if (data) {
                  if (isCurrSemester && _system_exam_must_enddate === "viewtime") {
                    var ExamOpenTimes = ViewTimeConfig.Exams;
                    var ExamOpenTime = ExamOpenTimes.find(x => x.ExamID == examID)
                    if (new Date(ExamOpenTime.ViewTime) >= now) {
                      subBody.push(`<td colspan="3">未開放</td>`);
                    }
                    else {
                      subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                    }
                  } else if (isCurrSemester && _system_exam_must_enddate === 'true') {
                    if (isShowExamInfo.isAvgShow == false) {
                      subBody.push(`<td colspan="3">未開放</td>`);
                    } else {
                      subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                    }
                  }
                  else {
                    subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                  }
                } else {
                  subBody.push(`<td colspan="2"></td><td colspan="1"></td>`);
                }
              }
            });
            subBody.push(`</tr>`)
          } else if (_curr_weightedaveset === 'True') {
            subBody.push("<tr><th>" + "加權平均及排名" + "</th>");

            exam_list.forEach(examID => {
              // 固定排名：加權平均＆排名
              {
                const data = rankList.find(data => data.item_type == '定期評量/總計成績' && data.item_name == '加權平均'
                  && data.ref_exam_id == examID && data.rank_type == switchMatrix(curMatrix));

                if (data) {
                  if (isCurrSemester && _system_exam_must_enddate === "viewtime") {
                    var ExamOpenTimes = ViewTimeConfig.Exams;
                    var ExamOpenTime = ExamOpenTimes.find(x => x.ExamID == examID)
                    if (new Date(ExamOpenTime.ViewTime) >= now) {
                      subBody.push(`<td colspan="3">未開放</td>`);
                    } else {
                      subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                    }
                  } else if (isCurrSemester && _system_exam_must_enddate === 'true') {
                    //todo

                    if (isShowExamInfo.isAvgShow == false) {
                      subBody.push(`<td colspan="3">未開放</td>`);
                    } else {
                      subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                    }
                  } else {
                    subBody.push(`<td colspan="2">${Number.parseFloat(data.score).toFixed(2)}</td><td colspan="1">${data.rank}</td>`);
                  }
                } else {
                  subBody.push(`<td colspan="2"></td><td colspan="1"></td>`);
                }
              }
            });
            subBody.push(`</tr>`)
          }


          //--
          thead_html = "<tr class=\"my-nofill\"><th rowspan=\"2\">科目名稱</th>" + (thead1.join("")) + "</tr>\n<tr class=\"my-nofill\">" + (thead2.join("")) + "</tr>";
          tbody_html = tbody1.join("");

          $("#ExamScore")
            .find("thead").html(thead_html).end()
            .find("#BodyOne").html(tbody_html).end()
            .find("#BodyTwo").html(subBody.join("")).end()
            .find("td[rel='tooltip']").tooltip();
          return $("#ExamDropDown .dropdown-menu a:first").trigger("click");
        } else {
          $("#ExamScore").find("thead").html("").end().find("tbody").html("<tr><td>目前無資料</td></tr>");
          return $("#ScoreInterval tbody").html("<tr><td colspan=\"12\">目前無資料</td></tr>");
        }
      };

      switchLevel = function (score) {
        if (score >= 0 && score < 10) {
          return "level_lt10";
        } else if (score >= 10 && score < 20) {
          return "level_10";
        } else if (score >= 20 && score < 30) {
          return "level_20";
        } else if (score >= 30 && score < 40) {
          return "level_30";
        } else if (score >= 40 && score < 50) {
          return "level_40";
        } else if (score >= 50 && score < 60) {
          return "level_50";
        } else if (score >= 60 && score < 70) {
          return "level_60";
        } else if (score >= 70 && score < 80) {
          return "level_70";
        } else if (score >= 80 && score < 90) {
          return "level_80";
        } else if (score >= 90 && score < 100) {
          return "level_90";
        } else if (score >= 100) {
          return "level_gte100";
        } else {
          return "";
        }
      };

      switchMatrix = (matrix) => {
        switch (matrix) {
          case '班級':
            return '班排名';
          case '年級':
            return '年排名';
          case '類一':
            return '類別1排名';
          case '類二':
            return '類別2排名';
          case '科系':
            return '科排名';
          default:
            return '';
        }
      };

      /** 試別 排名組距 */
      interval_process = function () {
        var tbody1 = [];
        var tbody_html = "";
        var curr_examid = $("#ExamDropDown a[data-toggle='dropdown']").attr('my-examid');

        if (curr_examid) {
          exam_data.forEach((course) => {
            var endtime, ext_score, my_level;
            var show_data = true;
            tbody1.push("<tr><th>" + course.Subject + "</th>");
            {
              // 檢查課程試別是否有排名資料 
              var exam = [].concat(course.Exam || []).find((data) => data.ExamID == curr_examid);
              var rank = rankList.find((data) => data.item_name == course.Subject
                && data.ref_exam_id == curr_examid && data.rank_type == switchMatrix(curMatrix));
              if (rank) {
                // 判斷成績是否開放查看
                if (isCurrSemester) {
                  if (exam && _system_exam_must_enddate === 'viewtime') {
                    var ExamOpenTimes = ViewTimeConfig.Exams;
                    var ExamOpenTime = ExamOpenTimes.find(x => x.ExamID == exam.ExamID)
                    if (new Date(ExamOpenTime.ViewTime) >= now) {
                      show_data = false;
                    }
                    endtime = ExamOpenTime.ViewTime;
                  }
                  else if (exam && _system_exam_must_enddate === 'true') {
                    if (new Date(exam.ScoreDetail.EndTime) >= now) {
                      show_data = false;
                    }
                    endtime = exam.ScoreDetail.EndTime;
                  }
                }
                if (show_data) {
                  ext_score = rank.score || '';
                  if (ext_score && ext_score !== "缺") {
                    my_level = switchLevel(Number(ext_score));
                    levelList.forEach((level) => {
                      if (level == my_level) {
                        tbody1.push("<td class=\"my-fail\">" + rank[level] + "</td>")
                      } else {
                        tbody1.push("<td>" + rank[level] + "</td>")
                      }
                    });
                  }
                } else {
                  tbody1.push("<td colspan=\"11\">\n  " + (endtime ? endtime + "後開放" : "尚未開放") + "\n</td>");
                }
              } else {
                tbody1.push("<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>");
              }
            }
            tbody1.push("</tr>");
          });
          tbody_html = tbody1.join("");
          $("#ScoreInterval tbody").html(tbody_html);

        } else {
          $("#ScoreInterval tbody").html("<tr><td colspan=\"12\">目前無資料</td></tr>");
        }
      };

      if (isCurrSemester && (_system_exam_must_enddate === "true" || _system_exam_must_enddate === "viewtime")) {
        return getNow(function (d1) {
          now = d1;
          return exam_process();
        });
      } else {
        return exam_process();
      }
    };

    set_error_message = function (select_str, serviceName, error) {
      var tmp_msg;
      tmp_msg = "<i class=\"icon-white icon-info-sign my-err-info\"></i><strong>呼叫服務失敗</strong>(" + serviceName + ")";
      if (error !== null) {
        if (error.dsaError) {
          if (error.dsaError.status === "504") {
            switch (error.dsaError.message) {
              case "501":
                tmp_msg = "<strong>很抱歉，您無讀取資料權限！</strong>";
            }
          } else {
            if (error.dsaError.message) {
              tmp_msg = error.dsaError.message;
            }
          }
        } else if (error.loginError.message) {
          tmp_msg = error.loginError.message;
        } else {
          if (error.message) {
            tmp_msg = error.message;
          }
        }
        $(select_str).html("<div class=\"alert alert-error\"><button class=\"close\" data-dismiss=\"alert\">×</button>" + tmp_msg + "</div>");
        return $(".my-err-info").click(function () {
          return alert("請拍下此圖，並與客服人員連絡，謝謝您。\n" + JSON.stringify(error, null, 2));
        });
      }
    };

    FloatAdd = function (arg1, arg2) {
      var e, m, r1, r2;
      r1 = null;
      r2 = null;
      m = null;
      try {
        r1 = arg1.toString().split(".")[1].length;
      } catch (_error) {
        e = _error;
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      } catch (_error) {
        e = _error;
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      return (FloatMul(arg1, m) + FloatMul(arg2, m)) / m;
    };

    FloatDiv = function (arg1, arg2) {
      var r1, r2, t1, t2;
      t1 = 0;
      t2 = 0;
      r1 = null;
      r2 = null;
      try {
        t1 = arg1.toString().split(".")[1].length;
      } catch (_error) { }
      try {
        t2 = arg2.toString().split(".")[1].length;
      } catch (_error) { }
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * Math.pow(10, t2 - t1);
    };

    FloatMul = function (arg1, arg2) {
      var m, s1, s2;
      m = 0;
      s1 = arg1.toString();
      s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (_error) { }
      try {
        m += s2.split(".")[1].length;
      } catch (_error) { }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };

    FloatMath = function (arg1, type, places) {
      places = places || 0;
      switch (type) {
        case "ceil":
          return (Math.ceil(arg1 * Math.pow(10, places))) / Math.pow(10, places);
        case "floor":
          return (Math.floor(arg1 * Math.pow(10, places))) / Math.pow(10, places);
        case "round":
          return (Math.round(arg1 * Math.pow(10, places))) / Math.pow(10, places);
        default:
          return arg1;
      }
    };

    Comparer = function (s1, s2) {
      var ComparerWithKeys;
      ComparerWithKeys = null;
      ComparerWithKeys = function (s1, s2) {
        var b1, b2, i, index, key, maxLength;
        b1 = null;
        b2 = null;
        i = null;
        index = null;
        key = null;
        maxLength = null;
        if (s1 === s2) {
          return 0;
        }
        if (s1.length === 0) {
          return 1;
        }
        if (s2.length === 0) {
          return -1;
        }
        maxLength = (s1.length > s2.length ? s2.length : s1.length);
        i = 0;
        while (i < maxLength) {
          for (index in _keys) {
            b1 = false;
            b2 = false;
            key = _keys[index];
            b1 = (s1.indexOf(key) === 0 ? true : false);
            b2 = (s2.indexOf(key) === 0 ? true : false);
            if (b1 && !b2) {
              return -1;
            }
            if (b2 && !b1) {
              return 1;
            }
          }
          if (s1.substring(0, 1) === s2.substring(0, 1)) {
            s1 = s1.substring(1, s1.length);
            s2 = s2.substring(1, s2.length);
          } else {
            return (s1.substring(0, 1) < s2.substring(0, 1) ? -1 : 1);
          }
          i++;
        }
        if (s1 === s2) {
          return 0;
        }
        if (!s1) {
          return -1;
        }
        if (!s2) {
          return 1;
        }
        return ComparerWithKeys(s1, s2);
      };
      return ComparerWithKeys(s1.Subject, s2.Subject);
    };

    myHandleArray = function (obj) {
      var result;
      result = null;
      result = null;
      if (!$.isArray(obj)) {
        result = [];
        if (obj) {
          result.push(obj);
        }
      } else {
        result = obj;
      }
      return result;
    };

    getCurrSemester();

    if (_system_position === "parent") {
      getStudentInfo();
    } else {
      getStudentRuleSeme();
    }
    return {
      'score': function (schoolYear, semester) {
        return loadScore(schoolYear, semester);
      }, 'onChangeStudent': function (index) {
        resetData();
        _student = _students[index];
        return getStudentRuleSeme();
      }
    };
  })();

}).call(this);
