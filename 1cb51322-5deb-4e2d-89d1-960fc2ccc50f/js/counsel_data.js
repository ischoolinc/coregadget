_gg.col_Question = {
        //'區塊編號' : [
        // {   ID: 區塊編號
        //     GroupName: 對照題目及存檔用
        //     Name: 對照題目及存檔用
        //     Alias: 瀏覽用標題
        //     Title: 編輯用標題，若未填寫以 Alias 為主
        //     ControlType: [radio | checkbox | select | textarea | text(預設值)]
        //       只對 QuestionType=SINGLE_ANSWER、MULTI_ANSWER 有用
        //     TagName: 存檔的欄位名稱
        //       只對 QuestionType=Relative、Sibling、SEMESTER、YEARLY有用
        //     Limit: 優先順序數量上限
        //       只對 QuestionType=PRIORITY有用
        //     Placeholder: 若未填寫以 Alias 為主，Name 次之
        // }
        'A1' : [
            { ID: 'A1', GroupName: '本人概況', Name: '血型', Alias: '血型', ControlType: 'radio' },
            { ID: 'A1', GroupName: '本人概況', Name: '宗教', Alias: '宗教', ControlType: 'radio' },
            { ID: 'A1', GroupName: '本人概況', Name: '生理缺陷', Alias: '生理缺陷', ControlType: 'checkbox' },
            { ID: 'A1', GroupName: '本人概況', Name: '曾患特殊疾病', Alias: '曾患特殊疾病', ControlType: 'checkbox' }
        ],
        'A2' : [
            { ID: 'A2', GroupName: '家庭狀況', Name: '監護人_姓名', Alias: '姓名' },
            { ID: 'A2', GroupName: '家庭狀況', Name: '監護人_性別', Alias: '性別', ControlType: 'select' },
            { ID: 'A2', GroupName: '家庭狀況', Name: '監護人_關係', Alias: '關係' },
            { ID: 'A2', GroupName: '家庭狀況', Name: '監護人_電話', Alias: '電話' },
            { ID: 'A2', GroupName: '家庭狀況', Name: '監護人_通訊地址', Alias: '地址' }
        ],
        'A3' : [
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_稱謂', Alias: '稱謂', TagName: 'Title' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_姓名', Alias: '姓名', TagName: 'Name' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_出生年', Alias: '出生年', TagName: 'BirthYear', Validator: '{number:true, range:[1, ' + (new Date().getFullYear()-1911) + ']}' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_存、歿', Alias: '存歿', TagName: 'IsAlive', ControlType: 'select' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_電話', Alias: '電話', TagName: 'Phone' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_職業', Alias: '職業', TagName: 'Job' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_工作機構', Alias: '工作機構', TagName: 'Institute' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_職稱', Alias: '職稱', TagName: 'JobTitle' },
            { ID: 'A3', GroupName: '家庭狀況', Name: '直系血親_教育程度', Alias: '教育程度', TagName: 'EduDegree', ControlType: 'select' }
        ],
        'A4' :[
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_排行', Alias: '排行' },
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_稱謂', Alias: '稱謂', TagName: 'Title' },
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_姓名', Alias: '姓名', TagName: 'Name', Validator: 'required="true"' },
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_出生年次', Alias: '出生年次', TagName: 'BirthYear', Validator: '{number:true, range:[1, ' + (new Date().getFullYear()-1911) + ']}' },
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_畢肆業學校', Alias: '畢業學校', TagName: 'SchoolName' },
            { ID: 'A4', GroupName: '家庭狀況', Name: '兄弟姊妹_備註', Alias: '備註', TagName: 'Remark' }
        ],
        'A5' :[
            { ID: 'A5', GroupName: '本人概況', Name: '身高', Alias: '身高', Validator: '{number:true, min:0}' },
            { ID: 'A5', GroupName: '本人概況', Name: '體重', Alias: '體重', Validator: '{number:true, min:0}' }
        ],
        'B1' :[
            { ID: 'B1', GroupName: '家庭狀況', Name: '父母關係', Alias: '父母關係', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '家庭氣氛', Alias: '家庭氣氛', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '父親管教方式', Alias: '父親管教方式', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '母親管教方式', Alias: '母親管教方式', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '居住環境', Alias: '居住環境', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '本人住宿', Alias: '本人住宿', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '經濟狀況', Alias: '家庭經濟概況', ControlType: 'select' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '每星期零用錢', Alias: '每星期零用錢(元)' },
            { ID: 'B1', GroupName: '家庭狀況', Name: '我覺得是否足夠', Alias: '零用金是否足夠', ControlType: 'select' }
        ],
        'B2' :[
            { ID: 'B2', GroupName: '學習狀況', Name: '最喜歡的學科', Alias: '最喜歡的學科' },
            { ID: 'B2', GroupName: '學習狀況', Name: '最感困難的學科', Alias: '最困難的學科' },
            { ID: 'B2', GroupName: '學習狀況', Name: '特殊專長', Alias: '特殊專長', ControlType: 'checkbox' },
            { ID: 'B2', GroupName: '學習狀況', Name: '休閒興趣', Alias: '休閒興趣', ControlType: 'checkbox' }
        ],
        'B3' :[
            { ID: 'B3', GroupName: '學習狀況', Name: '班級幹部', Alias: '班級幹部' },
            { ID: 'B3', GroupName: '學習狀況', Name: '社團幹部', Alias: '社團幹部' }
        ],
        'B4' :[
            { ID: 'B4', GroupName: '自我認識', Name: '個性_1', Alias: '個性' },
            { ID: 'B4', GroupName: '自我認識', Name: '優點_1', Alias: '優點' },
            { ID: 'B4', GroupName: '自我認識', Name: '需要改進的地方_1', Alias: '需要改進', ControlType: 'textarea' },
            { ID: 'B4', GroupName: '自我認識', Name: '填寫日期_1', Alias: '填寫日期' },
            { ID: 'B4', GroupName: '自我認識', Name: '個性_2', Alias: '個性' },
            { ID: 'B4', GroupName: '自我認識', Name: '優點_2', Alias: '優點' },
            { ID: 'B4', GroupName: '自我認識', Name: '需要改進的地方_2', Alias: '需要改進', ControlType: 'textarea' },
            { ID: 'B4', GroupName: '自我認識', Name: '填寫日期_2', Alias: '填寫日期' },
            { ID: 'B4', GroupName: '自我認識', Name: '個性_3', Alias: '個性' },
            { ID: 'B4', GroupName: '自我認識', Name: '優點_3', Alias: '優點' },
            { ID: 'B4', GroupName: '自我認識', Name: '需要改進的地方_3', Alias: '需要改進', ControlType: 'textarea' },
            { ID: 'B4', GroupName: '自我認識', Name: '填寫日期_3', Alias: '填寫日期' }
        ],
        'B5' :[
            { ID: 'B5', GroupName: '生活感想', Name: '內容1_1', Alias: '期望', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '內容2_1', Alias: '為達理想，所需要的努力', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '內容3_1', Alias: '期望師長給幫助', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '填寫日期_1', Alias: '填寫日期' },
            { ID: 'B5', GroupName: '生活感想', Name: '內容1_2', Alias: '一年來的感想', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '內容2_2', Alias: '今後努力的目標', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '內容3_2', Alias: '期望師長給幫助', ControlType: 'textarea' },
            { ID: 'B5', GroupName: '生活感想', Name: '填寫日期_2', Alias: '填寫日期' }
        ],
        'C1' :[
            { ID: 'C1', GroupName: '畢業後計畫', Name: '升學意願', Alias: '升學意願', ControlType: 'checkbox' },
            { ID: 'C1', GroupName: '畢業後計畫', Name: '就業意願', Alias: '就業意願', ControlType: 'checkbox' },
            { ID: 'C1', GroupName: '畢業後計畫', Name: '參加職業訓練', Alias: '希望參加職業訓練種類', ControlType: 'checkbox' },
            { ID: 'C1', GroupName: '畢業後計畫', Name: '受訓地區', Alias: '希望參加職業訓練地區', ControlType: 'checkbox' },
            { ID: 'C1', GroupName: '畢業後計畫', Name: '將來職業', Alias: '將來職業意願', ControlType: 'select', Limit: '3' },
            { ID: 'C1', GroupName: '畢業後計畫', Name: '就業地區', Alias: '將來就業地區', ControlType: 'select', Limit: '3' }
        ],
        'D1' :[
            { ID: 'D1', GroupName: '自傳', Name: '家中最了解我的人', Alias: '家中最了解我的人' },
            { ID: 'D1', GroupName: '自傳', Name: '常指導我做功課的人', Alias: '常指導我做功課的人' },
            { ID: 'D1', GroupName: '自傳', Name: '讀過且印象最深刻的課外書', Alias: '讀過印象最深的課外讀物' },
            { ID: 'D1', GroupName: '自傳', Name: '喜歡的人', Alias: '最喜歡的人是', Title: '最喜歡的人' },
            { ID: 'D1', GroupName: '自傳', Name: '喜歡的人_因為', Alias: '，因為', Title: '因為', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '最要好的朋友', Alias: '最要好的朋友是',Title: '最要好的朋友' },
            { ID: 'D1', GroupName: '自傳', Name: '他是怎樣的人', Alias: '，他', Title: '他是怎樣的人？<br/>（請加描述）', Placeholder: '他是怎樣的人？（請加描述）', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '最喜歡做的事', Alias: '最喜歡做的事是', Title: '最喜歡做的事' },
            { ID: 'D1', GroupName: '自傳', Name: '最喜歡做的事_因為', Alias: '，因為', Title: '因為', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '最不喜歡做的事', Alias: '最不喜歡做的事是', Title: '最不喜歡做的事' },
            { ID: 'D1', GroupName: '自傳', Name: '最不喜歡做的事_因為', Alias: '，因為', Title: '因為', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '國中時的學校生活', Alias: '國中時的學校生活是', Title: '國中時的學校生活' },
            { ID: 'D1', GroupName: '自傳', Name: '最快樂的回憶', Alias: '最快樂的回憶是', Title: '最快樂的回憶',  ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '最痛苦的回憶', Alias: '最痛苦的回憶是', Title: '最痛苦的回憶', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '最足以描述自己的幾句話', Alias: '最足以描述自己的幾句話是', ControlType: 'textarea' },
            { ID: 'D1', GroupName: '自傳', Name: '填寫日期', Alias: '填寫日期' }
        ]
};

_gg.loadCounselData = function () {
    // TODO: 取得單一紀錄
    _gg.connection.send({
        service: "_.GetSingleRecord",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetSingleRecord)\n</div>");
            } else {
                if (!_gg.singleRecord) { _gg.singleRecord = {}; }
                $(response.Response.SingleRecord).each(function (index, item) {
                    if (!_gg.singleRecord[item.Key]) {
                        _gg.singleRecord[item.Key] = item;
                    }
                    _gg.singleRecord[item.Key] = item;
                });
                _gg.GetData();
            }
        }
    });

    // TODO: 取得每學期資料
    _gg.connection.send({
        service: "_.GetSemesterData",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetSemesterData)\n</div>");
            } else {
                if (!_gg.semesterData) { _gg.semesterData = {}; }
                $(response.Response.SemesterData).each(function (index, item) {
                    if (!_gg.semesterData[item.Key]) {
                        _gg.semesterData[item.Key] = item;
                    }
                    _gg.semesterData[item.Key] = item;
                });
                _gg.GetData();
            }
        }
    });

    // TODO: 取得複選紀錄
    _gg.connection.send({
        service: "_.GetMultipleRecord",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetMultipleRecord)\n</div>");
            } else {
                if (!_gg.multipleRecord) { _gg.multipleRecord = {}; }
                $(response.Response.MultipleRecord).each(function (index, item) {
                    if (!_gg.multipleRecord[item.Key]) {
                        _gg.multipleRecord[item.Key] = [];
                    }
                    _gg.multipleRecord[item.Key].push(item);
                });
                _gg.GetData();
            }
        }
    });

    // TODO: 取得每年資料
    _gg.connection.send({
        service: "_.GetYearlyData",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetGetYearlyData)\n</div>");
            } else {
                if (!_gg.yearlyData) { _gg.yearlyData = {}; }
                $(response.Response.YearlyData).each(function (index, item) {
                    if (!_gg.yearlyData[item.Key]) {
                        _gg.yearlyData[item.Key] = item;
                    }
                    _gg.yearlyData[item.Key] = item;
                });
                _gg.GetData();
            }
        }
    });

    // TODO: 取得親屬資訊
    _gg.connection.send({
        service: "_.GetRelative",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetRelative)\n</div>");
            } else {
                if (!_gg.relative) { _gg.relative = []; }
                $(response.Response.Relative).each(function (index, item) {
                    _gg.relative.push(item);
                });

                if (_gg.relative.length === 0) {
                    _gg.connection.send({
                        service: "_.GetQuestionsData",
                        body: '<Request><Condition><GroupName>家庭狀況</GroupName><Name>直系血親_稱謂</Name></Condition></Request>',
                        result: function (response, error, http) {
                            if (error !== null) {
                                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetQuestionsData)\n</div>");
                            } else {
                                debugger
                                if (response.Response.QuestionsData && response.Response.QuestionsData.Items && response.Response.QuestionsData.Items.Items && response.Response.QuestionsData.Items.Items.item) {
                                    var tmp_str = '';
                                    $(response.Response.QuestionsData.Items.Items.item).each(function(key, value) {
                                        tmp_str += '<Relative><Title>' + value.key + '</Title><IsAlive>true</IsAlive></Relative>';
                                    });
                                    if (tmp_str) {
                                        _gg.connection.send({
                                            service: "_.InsertRelative",
                                            body: '<Request>' + tmp_str + '</Request>',
                                            result: function (response, error, http) {
                                                if (error !== null) {
                                                    $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(InsertRelative)\n</div>");
                                                } else {
                                                     _gg.connection.send({
                                                        service: "_.GetRelative",
                                                        body: '',
                                                        result: function (response, error, http) {
                                                            if (error !== null) {
                                                                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetRelative)\n</div>");
                                                            } else {
                                                                $(response.Response.Relative).each(function (index, item) {
                                                                    _gg.relative.push(item);
                                                                });
                                                                _gg.GetData();
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }

                            }
                        }
                    });
                } else {
                    _gg.GetData();
                }
            }
        }
    });

    // TODO: 取得兄弟姐妹資訊
    _gg.connection.send({
        service: "_.GetSibling",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetSibling)\n</div>");
            } else {
                if (!_gg.sibling) { _gg.sibling = []; }
                $(response.Response.Sibling).each(function (index, item) {
                    _gg.sibling.push(item);
                });
                _gg.GetData();
            }
        }
    });

    // TODO: 取得優先順序資訊
    _gg.connection.send({
        service: "_.GetPriorityData",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetPriorityData)\n</div>");
            } else {
                if (!_gg.priorityData) { _gg.priorityData = {}; }
                $(response.Response.PriorityData).each(function (index, item) {
                    if (!_gg.priorityData[item.Key]) {
                        _gg.priorityData[item.Key] = item;
                    }
                    _gg.priorityData[item.Key] = item;
                });
                _gg.GetData();
            }
        }
    });

    _gg.GetData = function () {
        if (_gg.singleRecord &&  _gg.semesterData && _gg.multipleRecord &&
            _gg.yearlyData && _gg.relative && _gg.sibling && _gg.priorityData) {
            _gg.connection.send({
                service: "_.GetQuestionsData",
                body: '',
                result: function (response, error, http) {
                    if (error !== null) {
                        $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetQuestionsData)\n</div>");
                    } else {
                        var tmp_data = {};
                        var tmp_use_orign;
                        $(response.Response.QuestionsData).each(function (index, item) {
                            // TODO: 生活感想題目由學校自行設定問題內容
                            // if (item.GroupName === '生活感想') {
                            //     tmp_data = {
                            //         ID             : 'B5',
                            //         GroupName      : '生活感想',
                            //         Name           : item.Name,
                            //         Alias          : item.Name,
                            //         ControlType    : 'textarea'
                            //     };
                            //     _gg.col_Question.B5.push(tmp_data);
                            // }

                            $.each(_gg.col_Question, function (key, values) {
                                $(values).each(function (g_index, g_item) {
                                    if (item.GroupName === g_item.GroupName && item.Name === g_item.Name) {
                                        g_item.CanStudentEdit = item.CanStudentEdit;
                                        g_item.QuestionType   = item.QuestionType;
                                        g_item.Options        = item.Items.Items;

                                        switch (item.QuestionType.toUpperCase()) {
                                            case 'SINGLE_ANSWER' :
                                                tmp_use_orign = _gg.singleRecord;
                                                break;
                                            case 'MULTI_ANSWER' :
                                                tmp_use_orign = _gg.multipleRecord;
                                                break;
                                            case 'SEMESTER' :
                                                tmp_use_orign = _gg.semesterData;
                                                break;
                                            case 'YEARLY' :
                                                tmp_use_orign = _gg.yearlyData;
                                                break;
                                            case 'PRIORITY' :
                                                tmp_use_orign = _gg.priorityData;
                                                break;
                                        }


                                        if (tmp_use_orign) {
                                            g_item.SelectValue = (tmp_use_orign[item.GroupName + '_' + item.Name] || '');
                                        } else {
                                            g_item.SelectValue = '';
                                        }

                                        return false;
                                    }
                                });
                            });
                        });
                        _gg.init = true;
                        _gg.SetData("All");
                    }
                }
            });
        }
    };

    // TODO: 取得目前學年度
    _gg.connection.send({
        service: "_.GetCurrentSemester",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetCurrentSemester)\n</div>");
            } else {
                $(response.Result.SystemConfig).each(function (index, item) {
                    _gg.schoolYear = item.DefaultSchoolYear;
                });

                // TODO: 取得個人資料
                _gg.connection.send({
                    service: "_.GetMyBaseInfo",
                    body: '',
                    result: function (response, error, http) {
                        if (error !== null) {
                            $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetMyBaseInfo)\n</div>");
                        } else {
                            $(response.Response.Student).each(function (index, item) {
                                _gg.student = {
                                    StudentID   : item.StudentID,
                                    Name        : item.Name,
                                    GradeYear   : item.GradeYear,
                                    SemsHistory : {}
                                };

                                _gg.student.SemsHistory['GS'+item.GradeYear] = _gg.schoolYear; // TODO: 學期對照表不包含現在學期，所以先加入現在學年度、年級

                                // TODO: 覆寫年級對應學年度，處理學生重讀
                                var tmp_alias;
                                $(item.SemsHistory.History).each(function (index, item) {
                                    tmp_alias = 'GS' + item.GradeYear;
                                    _gg.student.SemsHistory[tmp_alias] = _gg.student.SemsHistory[tmp_alias] || 0;
                                    if (parseInt(item.SchoolYear, 10) > parseInt(_gg.student.SemsHistory[tmp_alias], 10)) {
                                        _gg.student.SemsHistory[tmp_alias] = item.SchoolYear;
                                    }
                                });
                                var tmp_html = '', tmp_school_year = 0, tmp_chinese_grade = '';
                                for (var i=1; i<=3; i++) {
                                    if (_gg.student.SemsHistory['GS'+i]) {
                                        tmp_school_year = _gg.student.SemsHistory['GS'+i];
                                        switch (i) {
                                            case 1:
                                                tmp_chinese_grade = "一";
                                                break;
                                            case 2:
                                                tmp_chinese_grade = "二";
                                                break;
                                            case 3:
                                                tmp_chinese_grade = "三";
                                                break;
                                        }
                                        _gg.grade = i + '';
                                        _gg.chineseGrade = tmp_chinese_grade;

                                        tmp_html += '<button class="btn btn-large" grade="' +i+ '" chinese-grade="' +tmp_chinese_grade+ '">' +tmp_chinese_grade+ '年級(' +tmp_school_year+ ')</button>';
                                    }
                                }

                                $(".my-schoolyear-semester-widget").html(tmp_html);
                                $(".my-schoolyear-semester-widget button:last").addClass("active");


                                // TODO: 開放時間
                                _gg.connection.send({
                                    service: "_.GetOpeningHours",
                                    body: '',
                                    result: function (response, error, http) {
                                        if (error !== null) {
                                            $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetMyBaseInfo)\n</div>");
                                        } else {
                                            if (response.Response.OpeningHours && response.Response.OpeningHours.Content && response.Response.OpeningHours.Content.Content) {
                                                $(response.Response.OpeningHours.Content.Content.Item).each(function (index, item) {
                                                    if (item.GradeYear === _gg.student.GradeYear) {
                                                        var tmp_Date  = new Date();
                                                        var Startdate = new Date(item.StartDateTime);
                                                        var Enddate   = new Date(item.EndDateTime);

                                                        if (Startdate <= tmp_Date && Enddate >= tmp_Date) {
                                                            _gg.Opening = "yes";
                                                        } else {
                                                            _gg.Opening = "no";
                                                        }

                                                        var tmp_html = '' +
                                                            '<div class="alert alert-error">' +
                                                                '開放填寫時間： ' + item.StartDateTime + ' ~  ' + item.EndDateTime +
                                                            '</div>';
                                                        $('#opening').html(tmp_html);

                                                        return false;
                                                    }
                                                });
                                                _gg.SetData("All");
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    }
                });

            }
        }
    });
};