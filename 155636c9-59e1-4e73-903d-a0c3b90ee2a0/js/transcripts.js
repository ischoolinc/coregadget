var _gg = _gg || {};
_gg.connection = gadget.getContract("ischool.transcript.student");
_gg.Students = [];
_gg.Student = '';
_gg.schoolYear = '';
_gg.semester = '';


$(document).ready(function () {
    // TODO: 切換學年度學期
    $('.my-schoolyear-semester-widget').on("click", ".btn", function () {
        _gg.schoolYear = $(this).attr("school-year");
        _gg.semester = $(this).attr("semester");
        // console.log('呼叫1') ;
        _gg.SetScoreData();
    });

    // TODO: 取得學生資料
    _gg.connection.send({
        service: "_.GetStudentInfo",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                _gg.set_error_message('#mainMsg', 'GetStudentInfo', error);
            } else {
                $(response.Student).each(function (index, item) {
                    if (!$.isArray(item.SemsHistory.History)) {
                        item.SemsHistory.History = [item.SemsHistory.History];
                    }

                    if (index === 0) { _gg.Student = item; }

                    if (!_gg.Students[item.StudentID]) {
                        _gg.Students[item.StudentID] = item;
                    }
                });
                _gg.GetSemsSubjScore();                          // TODO: 取得學期成績
            }
        }
    });
});

// TODO: 處理畢業條件、各項學分資訊
_gg.SetStudentCreditData = function () {
    var student = _gg.Student;
    if (student.MySemsSubjScore) {
        var _ref, items = [], _schoolYear, _semester;

        if (((_ref = student.SemsHistory) != null ? _ref.History : void 0) != null) {
            // TODO: 學期對照表
            $(student.SemsHistory.History.sort($.by('desc', 'SchoolYear', $.by('desc', 'Semester')))).each(function (key, item) {
                items.push("<button class='btn btn-large' grade-year='" + item.GradeYear + "' school-year='" + item.SchoolYear + "' semester='" + item.Semester + "'>" + item.SchoolYear + item.Semester + "</button>");
            });
        } else if (student.MySemsSubjScore.length > 0) {
            _schoolYear = student.MySemsSubjScore[0].SchoolYear;
            _semester = student.MySemsSubjScore[0].Semester;
            items.push("<button class='btn btn-large active' school-year='" + _schoolYear + "' semester='" + _semester + "'>" + (_schoolYear + '' + _semester) + "</button>");
        }
        $(".my-schoolyear-semester-widget div").html(items.join(""));
        $(".my-schoolyear-semester-widget button:first").addClass("active").trigger('click');

        // console.log('呼叫2...')
        //    _gg.SetScoreData(); // TODO: 學年度成績資訊
    }
};


// TODO: 學年度成績資訊
_gg.SetScoreData = function () {
    _gg.ResetData();

    var student = _gg.Student;
    var SemsSubjScore = student.MySemsSubjScore;

    var items = [], itemNoDoamin = [], totalscore = [];

    // TODO: 本學期科目成績
    $.each(SemsSubjScore, function (index, item) {
        // TODO: 目前要顯示的學年度學期
        if (_gg.schoolYear === item.SchoolYear && _gg.semester === item.Semester) {

            var col_score = {};
            $(item.ScoreInfo.Domains.Domain).each(function (domainIndex, domainItem) {
                if (!col_score[domainItem.領域]) {
                    domainItem.subject = [];
                    col_score[domainItem.領域] = domainItem;
                }
            });

            $(item.ScoreInfo.SemesterSubjectScoreInfo.Subject).each(function (subjectIndex, subjectItem) {
                var domainName = subjectItem.領域;
                if (!domainName) {
                    domainName = '無領域';
                }

                if (!col_score[domainName]) {
                    col_score[domainName] = {
                        '領域': domainName,
                        subject: []
                    }
                    col_score[domainName].subject = [];
                }

                col_score[domainName].subject.push(subjectItem);
            });

            var getLevel = function (val) {
                if (val >= 90)
                    return '優';
                else if (val >= 80)
                    return '甲';
                else if (val >= 70)
                    return '乙';
                else if (val >= 60)
                    return '丙';
                else if (val >= 0)
                    return '丁';
                return '';

            }

            // TODO: 領域成績
            $.each(col_score, function (domainIndex, domainItem) {
                var intDomainScore = parseInt((domainItem.成績 || '0'), 10);

                var domainScore, domainPass, domainLevel;
                var showScore;
                if (domainItem.成績) {
                    domainLevel = getLevel(intDomainScore);//對應等第
                    if (parseInt(domainItem.補考成績 || '0', 10) >= intDomainScore) {
                        showScore = "*" + domainItem.成績;

                    } else {

                        showScore = "" + domainItem.成績;
                    }
                    if (intDomainScore >= 60) {
                        domainScore = '<td>' + (showScore || '') + '</td>';
                        domainPass = '<i class="icon-ok"></i>';
                    } else {
                        domainScore = '<td class="my-lost-credit">' + (showScore || '') + '</td>';
                        domainPass = '<i class="icon-remove"></i>';
                    }
                } else {
                    domainScore = '<td></td>';
                    domainPass = '';
                    domainLevel = '';
                }

                var domainPeriod = (domainItem.節數 || '');
                var domainWeight = (domainItem.權數 || '');
                var domainPeriod_Weight = domainPeriod;

                if ($.trim(domainPeriod) !== $.trim(domainWeight)) {
                    domainPeriod_Weight += '/' + domainWeight;
                }

                var domainName = domainItem.領域;

                if (domainName === '無領域') {
                    itemNoDoamin.push('<thead><tr><td colspan="6">以下為彈性課程</td></tr></thead>');
                } else {

                    var show_grade = gadget.params.show_grade || "true";

                    //2017/12/1 由於康橋要求國小部不要顯示成績數值，穎驊在此新增邏輯，
                    //會依據發佈時  paramValues: { "show_grade": "false",}的設定，動態改變成績顯示與否
                    if (show_grade == 'true') {
                        items.push(
                            '<thead>' +
                            '    <tr>' +
                            '        <td><i class="icon-book"></i> ' + (domainItem.領域 || '') + '</td>' +
                            '        <td>&nbsp;</td>' +
                            '        <td>' + domainPeriod_Weight + '</td>' +
                            domainScore +
                            '        <td>' + domainLevel + '</td>' +
                            '        <td>' + (domainItem.文字描述 || '') + '</td>' +
                            '        <td>' + domainPass + '</td>' +
                            '    </tr>' +
                            '</thead>'
                        );
                    }
                    else {
                        items.push(
                            '<thead>' +
                            '    <tr>' +
                            '        <td><i class="icon-book"></i> ' + (domainItem.領域 || '') + '</td>' +
                            '        <td>&nbsp;</td>' +
                            '        <td>' + domainPeriod_Weight + '</td>' +
                            //domainScore +
                            '        <td>' + domainLevel + '</td>' +
                            '        <td>' + (domainItem.文字描述 || '') + '</td>' +
                            '        <td>' + domainPass + '</td>' +
                            '    </tr>' +
                            '</thead>'
                        );
                    }
                }


                // TODO: 科目成績
                $.each(domainItem.subject, function () {
                    var tmp_item = [];
                    var tmp_semsSubjScore = {};

                    // TODO: 實際學期科目成績內容
                    tmp_semsSubjScore = {
                        Areas: (this.領域 || ''),
                        SubjectName: (this.科目 || ''),
                        Weight: (this.權數 || ''),
                        Period: (this.節數 || ''),
                        Score: (this.成績 || ''),
                        Description: (this.文字描述 || '')
                    };

                    var intScore = parseInt((tmp_semsSubjScore.Score || '0'), 10);

                    var score = '', pass = '', level = getLevel(intScore);

                    if (parseInt(this.補考成績 || '0', 10) >= intScore)
                        tmp_semsSubjScore.Score = "*" + tmp_semsSubjScore.Score;
                    if (intScore >= 60) {
                        score = '<td>' + (tmp_semsSubjScore.Score || '') + '</td>';
                        pass = '<i class="icon-ok"></i>';
                    } else {
                        score = '<td class="my-lost-credit">' + (tmp_semsSubjScore.Score || '') + '</td>';
                        pass = '<i class="icon-remove"></i>';
                    }

                    var period_Weight = tmp_semsSubjScore.Period;

                    if ($.trim(tmp_semsSubjScore.Period) !== $.trim(tmp_semsSubjScore.Weight)) {
                        period_Weight += '/' + tmp_semsSubjScore.Weight;
                    }

                    var show_grade = gadget.params.show_grade || "true";

                    tmp_item.push('<tbody>');
                    tmp_item.push('<tr>');
                    tmp_item.push('<td>&nbsp;</td>');
                    tmp_item.push('<td>' + (tmp_semsSubjScore.SubjectName || '') + '</td>');
                    tmp_item.push('<td>' + period_Weight + '</td>');

                    //2017/12/1 由於康橋要求國小部不要顯示成績數值，穎驊在此新增邏輯，
                    //會依據發佈時  paramValues: { "show_grade": "false",}的設定，動態改變成績顯示與否
                    if (show_grade == 'true') {
                        tmp_item.push(score);
                    }

                    tmp_item.push('<td>' + level + '</td>');
                    tmp_item.push('<td>' + (tmp_semsSubjScore.Description || '') + '</td>');
                    tmp_item.push('<td>' + pass + '</td>');
                    tmp_item.push('</tr>');
                    tmp_item.push('</tbody>');

                    if (domainName === '無領域') {
                        itemNoDoamin.push(tmp_item.join(''));
                    } else {
                        items.push(tmp_item.join(''));
                    }
                });
            });

            // TODO: 總成績
            var LearnDomainScore = item.ScoreInfo.LearnDomainScore;
            var CourseLearnScore = item.ScoreInfo.CourseLearnScore;
            var intLearnDomainScore = parseInt((LearnDomainScore || '0'), 10);
            var intCourseLearnScore = parseInt((CourseLearnScore || '0'), 10);

            var css1 = '', css2 = '';
            if (intLearnDomainScore < 60) {
                css1 = ' my-lost-credit';
            }
            if (intCourseLearnScore < 60) {
                css2 = ' my-lost-credit';
            }

            totalscore.push(
                '<table class="my-table my-table-bordered my-well-table-striped">' +
                '  <tbody>' +
                '    <tr>' +
                '      <th class="my-scorename">學期領域成績(七大學習領域)</th>' +
                '      <td class="my-totalscore' + css1 + '">' + (LearnDomainScore || '') + '</td>' +
                '      <th class="my-scorename">課程學習成績(含彈性課程)</th>' +
                '      <td class="my-totalscore' + css2 + '">' + (CourseLearnScore || '') + '</td>' +
                '    </tr>' +
                '  </tbody>' +
                '</table>'
            );

            return false; // TODO: 跳出each
        }
    });


    //2017/12/1 由於康橋要求國小部不要顯示成績數值，穎驊在此新增邏輯，
    //會依據發佈時  paramValues: { "show_grade": "false",}的設定，動態改變成績顯示與否

    var main_thead = '';

    var show_grade = gadget.params.show_grade || "true";

    if (show_grade == 'true') {
        main_thead = '<thead>' +
            '  <tr>' +
            '    <th width="20%"><span>領域</span></th>' +
            '    <th width="20%"><span>科目</span></th>' +
            '    <th width="10%"><span>節/權數</span></th>' +
            '    <th width="10%"><span>成績</span></th>' +
            '    <th width="10%"><span>等第</span></th>' +
            '    <th><span>文字描述</span></th>' +
            '    <th width="7%"><span>及格</span></th>' +
            '  </tr>' +
            '</thead>';
    }
    else {
        main_thead = '<thead>' +
            '  <tr>' +
            '    <th width="20%"><span>領域</span></th>' +
            '    <th width="20%"><span>科目</span></th>' +
            '    <th width="10%"><span>節/權數</span></th>' +
            //'    <th width="10%"><span>成績</span></th>' +
            '    <th width="10%"><span>等第</span></th>' +
            '    <th><span>文字描述</span></th>' +
            '    <th width="7%"><span>及格</span></th>' +
            '  </tr>' +
            '</thead>';
    }

    var html = items.join('') + itemNoDoamin.join('');

    if (html) {
        html = main_thead + html;
    } else {
        html = main_thead + '<tbody><tr><td colspan="6">無資料</td></tr></tbody>';
    }

    $("#SubjectScore table").html(html);

    //2017/12/1 由於康橋要求國小部不要顯示成績數值，穎驊在此新增邏輯，
    //會依據發佈時  paramValues: { "show_grade": "false",}的設定，動態改變成績顯示與否
    if (show_grade == 'true') {
        $("#SubjectTotalScore").html(totalscore.join(''));
    }
    else {
        $("#MakeUpText").hide();
    }

};


// TODO: 取得學期成績
_gg.GetSemsSubjScore = function (schoolYear, semester) {
    var student = _gg.Student;
    _gg.connection.send({
        service: "_.GetSemsSubjScore",
        body: '<Request><Condition></Condition></Request>',
        result: function (response, error, http) {
            if (error !== null) {
                _gg.set_error_message('#mainMsg', 'GetSemsSubjScore', error);
            } else {
                student.MySemsSubjScore = [];
                var _ref;
                if (((_ref = response.Students) != null ? _ref.SemsSubjScore : void 0) != null) {
                    $(response.Students.SemsSubjScore).each(function (index, item) {
                        student.MySemsSubjScore.push(item);
                    });
                }
                _gg.SetStudentCreditData();
            }
        }
    });
};

// TODO: 清除資訊
_gg.ResetData = function () {
    // TODO: 本學期科目成績
    $("#SubjectScore tbody").html('');
    $('#SubjectTotalScore').html('');
};

// TODO: 錯誤訊息
_gg.set_error_message = function (select_str, serviceName, error) {
    var tmp_msg = '<i class="icon-white icon-info-sign my-err-info"></i><strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(' + serviceName + ')';
    if (error !== null) {
        if (error.dsaError) {
            if (error.dsaError.message) {
                tmp_msg = error.dsaError.message;
            }
        } else if (error.loginError.message) {
            tmp_msg = error.loginError.message;
        } else if (error.message) {
            tmp_msg = error.message;
        }
        $(select_str).html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  " + tmp_msg + "\n</div>");
        $('.my-err-info').click(function () { alert('請拍下此圖，並與客服人員連絡，謝謝您。\n' + JSON.stringify(error, null, 2)) });
    }
};