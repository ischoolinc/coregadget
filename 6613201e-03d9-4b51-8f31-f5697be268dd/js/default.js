// Generated by CoffeeScript 1.6.2
(function() {
	var bind_academic, getCourseTeacherList, getCurrentCourse, getGraduationRequirement, getGraduationSubjectList, getCourseSemesterScore, getSubjectSemesterScore;

  $(function() {
    return bind_academic();
  });

  bind_academic = function() {
    getCurrentCourse();
    getGraduationRequirement();
    return getGraduationSubjectList();
  };

  getCurrentCourse = function() {
    return gadget.getContract("emba.student").send({
      service: "default.GetSemester",
      body: "",
      result: function(response, error, http) {
        var currentSemester;

        if (response.Result != null) {
          currentSemester = {
            SchoolYear: response.Result.SystemConfig.DefaultSchoolYear,
            Semester: response.Result.SystemConfig.DefaultSemester
          };
          return gadget.getContract("emba.student").send({
            service: "default.GetCurrentCourse",
            body: {
              Request: {
                SchoolYear: currentSemester.SchoolYear,
                Semester: currentSemester.Semester
              }
            },
            result: function(response, error, http) {
              if (response.Result != null) {
                return $(response.Result.Course).each(function(index, item) {
                	$("#academic #current-course tbody").append("<tr>\n	<td>" + item.SerialNo + "</td>\n	<td>" + item.SchoolYear + "</td>\n	<td>" + (item.Semester === "0" ? "夏季" : "第" + item.Semester) + "學期" + "</td>\n	<td>" + item.NewSubjectCode + "</td><td>" + item.SubjectName + "</td>\n	<td>" + item.ClassName + "</td>\n	<td>" + item.CourseType + "</td>\n	<td>" + (item.IsRequired === "t" ? "必修" : "選修") + "</td>\n	<td>" + item.Credit + "</td>\n	<td course-id=\"" + item.CourseID + "\">" + item.TeacherName + "</td>\n	<td>" + item.Score + "</td>\n</tr>");
                  //return getCourseTeacherList(item.CourseID);
                });
              }
            }
          });
        }
      }
    });
  };

  getCourseTeacherList = function(course_id) {
    return gadget.getContract("emba.student").send({
      service: "default.GetCourseTeacherList",
      body: {
        Request: {
          CourseID: course_id
        }
      },
      result: function(response, error, http) {
        var teacher_name;

        if (response.Result != null) {
          teacher_name = [];
          $(response.Result.Teacher).each(function() {
            return teacher_name.push(this.TeacherName);
          });
          return $("#academic #current-course td[course-id=" + course_id + "]").html(teacher_name.join(","));
        }
      }
    });
  };

  getGraduationRequirement = function() {
    return gadget.getContract("emba.student").send({
      service: "default.GetGraduationRequirement",
      body: "",
      result: function(response, error, http) {
        var _ref, _ref1, _ref2;

        if (response.Result != null) {
          return $("#academic #credit-info-title").html("畢業應修科目及學分表：系訂必修： " + ((_ref = response.Result.DepartmentCredit) != null ? _ref : "") + " 學分、選修： " + ((_ref1 = response.Result.ElectiveCredit) != null ? _ref1 : "") + " 學分、應修最低畢業學分： " + ((_ref2 = response.Result.RequiredCredit) != null ? _ref2 : ""));
        }
      }
    });
  };

  getGraduationSubjectList = function() {
    return gadget.getContract("emba.student").send({
      service: "default.GetGraduationSubjectList",
      body: "",
      result: function(response, error, http) {
        var items;

        items = [];
        if (response.Result != null) {
          $(response.Result.Subject).each(function(index, item) {
            return items.push("<tr class='info'>\n	<td>" + item.NewSubjectCode + "</td>\n	<td>" + item.SubjectCode + "</td>\n	<td>" + item.ChineseName + "<br/>" + item.EnglishName + "</td>\n	<td>" + item.Credit + "</td>\n	<td>" + item.GroupName + "</td>\n	<td graduation-subject-uid='" + item.SubjectID + "'></td>\n</tr>");
          });
        }
        $("#academic #graduation-info tbody").html(items.join(""));

        getSubjectSemesterScore();
        return getCourseSemesterScore();
      }
    });
  };

  getCourseSemesterScore = function () {
	return gadget.getContract("emba.student").send({
  		service: "default.GetSemester",
  		body: "",
  		result: function(response, error, http) {
  			var currentSemester;

  			if (response.Result != null) {
  				currentSemester = {
  					SchoolYear: response.Result.SystemConfig.DefaultSchoolYear,
  					Semester: response.Result.SystemConfig.DefaultSemester
  				};
  				return gadget.getContract("emba.student").send({
  					service: "default.GetCourseSemesterScore",
  					body: {
  						Request: {
  							SchoolYear: currentSemester.SchoolYear,
  							Semester: currentSemester.Semester
  						}
  					},
  					result: function (response, error, http) {
  						var items;
			
  						//流水號	學年度	學期	課程識別碼	課程名稱	班次	類別	必選修	學分數	成績
  						items = [];
  						if (response.Result != null) {
  							$(response.Result.Score).each(function (index, item) {
  								items.push("<tr>\n	<td>" + item.SerialNo + "</td>\n	<td>" + item.SchoolYear + "</td>\n	<td>" + (item.Semester ? (item.Semester === "0" ? "夏季" : "第" + item.Semester) + "學期" : "") + "</td>\n	<td>" + item.NewSubjectCode + "</td>\n	<td>" + item.SubjectName + "</td><td>" + item.ClassName + "</td>\n	<td>" + item.CourseType + "</td>\n	<td>" + (item.IsRequired === "t" ? "必修" : "選修") + "</td><td>" + ((item.IsPass === "t" && item.ScoreConfirmed === "t") ? item.Credit : "(" + item.Credit + ")") + "</td>\n	<td>" + item.Score + "</td>\n</tr>");
  							});
  							return $("#academic #subject-semester-score tbody").html(items.join(""));
  							//(item.Semester === "0" ? "夏季學期" : (item.Semester === "1" ? "第一學期" : (item.Semester === "2" ? "第二學期" : item.Semester)))
  						}
  					}
  				});
  			}
  		}
	});
  };

  getSubjectSemesterScore = function() {
    return gadget.getContract("emba.student").send({
      service: "default.GetSubjectSemesterScore",
      body: "",
      result: function(response, error, http) {
        var items;

        items = [];
        if (response.Result != null) {
          $(response.Result.Score).each(function(index, item) {
          	if (item.IsPass === 't' && (item.ScoreConfirmed === "" || item.ScoreConfirmed === "t")) {
				return $("td[graduation-subject-uid='" + this.SubjectID + "']").html('已取得學分');
            }
          });
        }
      }
    });
  };

}).call(this);
