angular.module('gradebook', ['ui.sortable', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce'])

.controller('MainCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        var $scope長這個樣子 = {
            current: {
                SelectMode: "No.",
                SelectSeatNo: "",
                Value: "",
                Student: {
                    SeatNo: "5",
                    StudentName: "凱澤",
                    StudentID: "3597",
                    StudentScoreTag :"成績身分:一般生"
                },
                Exam: {
                    Name: 'Midterm',
                    Range: {
                        Max: 100,
                        Min: 0
                    }
                },
                ExamOrder: [],
                Course: {},
                VisibleExam: []
            },
            studentList: [
                {
                    StudentID: "3597",
                    StudentName: "凱澤",
                    SeatNo: "5",
                    Final: "",
                    Midterm: "89",
                    StudentScoreTag: "成績身分:一般生",
                    index: 0
                }
            ],
            examList: [
                {
                    Name: 'Midterm',
                    Type: 'Number',
                    Range: {
                        Max: 100,
                        Min: 0
                    },
                    Lock: true
                },
                {
                    Name: 'Final',
                    Type: 'Number'
                },
                {
                    Name: 'Level',
                    Type: 'Enum',
                    Option: [
                        { Label: 'A' },
                        { Label: 'B' },
                        { Label: 'C' }
                    ]
                },
                {
                    Name: 'Comment',
                    Type: 'Text'
                },
				{
				    Name: 'Avg',
				    Type: 'Function',
				    Fn: function (obj) {
				        return ((obj.Midterm || 0) + (obj.Final || 0)) / 2;
				    }
				}
            ],
            process: [{

            }]
        };


        // 目前試別的切換
        $scope.setCurrentTemplate = function (template) {
            var execute = false;
            // 檢查資料是否更動
            var data_changed = !$scope.checkAllTable($scope.current.mode);
            if (data_changed) {
                if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
                    return;
                }
                else {
                    execute = true;
                }
            } else {
                execute = true;
            }
            if (execute) {
                $scope.current.template = template;
                $scope.current.gradeItemList = [];
                // 篩選出目前定期的平時評量項目
                $scope.gradeItemList.forEach(item => {
                    if (item.RefExamID == $scope.current.template.ExamID) {
                        $scope.current.gradeItemList.push(item);
                    }
                });
                // 重新設定目前匯入的項目
                //$scope.getImportList();

                // 定期評量改變後：目前學生不變、目前試別改變
                $scope.current.Exam = null;

                // 設定目前學生與目前試別
                $scope.setupCurrent();

                // 取得課程學生以及學生成績資料
                //$scope.dataReload();
            }
        }


        // 模式清單
        $scope.modeList = ['成績管理', '平時評量'];

        /**
        * 模式切換
        */// 成績管理模式、平時評量模式
        $scope.setCurrentMode = function (_mode) {
            var execute = false;
            // 檢查資料是否更動
            var data_changed = !$scope.checkAllTable($scope.current.mode);
            if (data_changed) {
                if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
                    return;
                }
                else {
                    execute = true;
                }
            } else {
                execute = true;
            }
            if (execute) {
                $scope.current.mode = _mode;

                // 假如切回去 成績管理模式 ， 把目前的 template 設回空，讓下次切換時，在下面重抓
                if ($scope.current.mode == $scope.modeList[0]) {

                    $scope.current.template = null;
                }

                               
                // 資料Reload (模式切換，依然是目前的課程，會自動帶入目前第一個開放的試別)
                $scope.setCurrentCourse($scope.current.Course);

                // 設定目前定期評量 
                if (!$scope.current.template && $scope.current.Exam)
                {
                    var template = $scope.templateList.filter(template => template.ExamID == $scope.current.Exam.ExamID)[0];

                    $scope.setCurrentTemplate(template);
                }
                
                // 目前選擇的試別清空
                $scope.current.Exam = null;

                //$scope.scoreDataReload();
                //// 設定批次項目
                //$scope.setBatchItem();
                //// 設定目前學生與目前試別

                

                $scope.setupCurrent();
            }
        }


        /**
        * 顯示編輯評分項目
        */
        $scope.showGradeItemConfig = function () {
            $scope.gradeItemConfig = {
                Item: []
                , Mode: 'Editor'
                , JSONCode: ''
                , DeleteItem: function (item) {
                    var index = $scope.gradeItemConfig.Item.indexOf(item);
                    if (index > -1) {
                        $scope.gradeItemConfig.Item.splice(index, 1);
                    }
                }
                , AddItem: function () {
                    $scope.gradeItemConfig.Item.push({
                        RefExamID: $scope.current.template.ExamID // 定期評量ID
                        , Name: ''
                        , Weight: '1'
                        , ExamID: 'Quiz_' + item.SubExamID
                        , SubExamID: ''
                        , Index: $scope.gradeItemConfig.Item.length + 1                                                                                                                                               
                    });
                }
                , JSONMode: function () {
                    $scope.gradeItemConfig.Mode = 'JSON';
                    var jsonList = [];
                    $scope.gradeItemConfig.Item.forEach(function (item) {
                        jsonList.push({
                            Name: item.Name
                            , Weight: item.Weight
                            , SubExamID: item.SubExamID
                            , Index: item.Index
                        });
                    });
                    $scope.gradeItemConfig.JSONCode = JSON.stringify(jsonList, null, '    ');
                }
                , CommitJSON: function () {
                    var jsonParse;
                    var jsonList = [];
                    try {
                        jsonParse = JSON.parse($scope.gradeItemConfig.JSONCode);
                    }
                    catch (error) {
                        alert('Syntax Error' + error);
                        return;
                    }
                    if (jsonParse.length || jsonParse.length === 0) {
                        jsonList = [].concat(jsonParse);
                    }
                    else {
                        alert('Parse Error');
                        return;
                    }
                    $scope.gradeItemConfig.Item = [];
                    jsonList.forEach(function (item) {
                        $scope.gradeItemConfig.Item.push({
                            Name: item.Name
                            , Weight: item.Weight
                            , SubExamID: item.SubExamID
                            , Index: item.Index
                        });
                    });
                    $scope.gradeItemConfig.Mode = 'Editor';
                }
            };
            // 如果沒有評分項目的話，初始化。
            var item = {
                Index: '1',
                Name: '成績_1',
                SubExamID: '成績_1',
                Weight: '1'
            };

            // 篩選出目前定期評量的小考項目
            var targetGradeItem = $scope.gradeItemList.filter(item => item.Permission == 'Editor');
            [].concat(targetGradeItem || item).forEach(function (item) {
                $scope.gradeItemConfig.Item.push(angular.copy(item));
            });
            $('#editScoreItemModal').modal('show');
        }

        /**
         * 儲存評分項目
         */
        $scope.saveGradeItemConfig = function () {

            var body = {
                Content: {
                    CourseExtension: {
                        '@CourseID': '' + $scope.current.Course.CourseID
                        , Extension: {
                            '@Name': 'GradeItem'
                            , GradeItem: {
                                Item: []
                            }
                        }
                    }
                }
            };

            var namePass = true;
            var weightPass = true;
            var examNameList = [];
            var dataRepeat = false;
            var repeatExamName = '';
            $scope.gradeItemConfig.Item.forEach(function (item) {

                var pass = true;
                if (!item.Name) {
                    namePass = false;
                    pass = false;
                }
                if (!item.Weight || Number.isNaN(+item.Weight)) {
                    weightPass = false;
                    pass = false;
                }

                if (pass && !dataRepeat) {

                    // 再一個試別 Exam 下 小考試別不能重覆
                    if (examNameList.indexOf(item.RefExamID + '_' + item.Name) > -1) {
                        dataRepeat = true;
                        repeatExamName = item.Name;
                    }
                    examNameList.push(item.RefExamID + '_' + item.Name);

                    body.Content.CourseExtension.Extension.GradeItem.Item.push({
                        '@ExamID': item.RefExamID,
                        '@SubExamID': item.SubExamID == '' ? item.Name : item.SubExamID,
                        '@Name': item.Name,
                        '@Weight': item.Weight,
                        //'@Index': item.Index
                    });
                }
            });
            if (namePass && weightPass && !dataRepeat) {
                $scope.connection.send({
                    service: "TeacherAccess.SetCourseExtensions",
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.SetCourseExtensions Error");
                        } else {
                            $scope.$apply(function () {
                                $('#editScoreItemModal').modal('hide');
                                // 資料Reload

                                $scope.setCurrentMode($scope.current.mode);
                                
                            });
                        }
                    }
                });
            }
            else {
                var errMsg = '';
                if (!namePass) {
                    errMsg += (errMsg ? '\n' : '') + '評分名稱不可空白。';
                }
                if (!weightPass) {
                    errMsg += (errMsg ? '\n' : '') + '權重不可空白且必須為數值。';
                }
                if (dataRepeat) {
                    errMsg += (errMsg ? '\n' : '') + `評分項目名稱：「 ${repeatExamName}」重複! 資料無法儲存。`;
                }
                alert(errMsg);
            }
        }

        // 2019/06/14 穎驊 優化高中成績Web輸入， 自羿均改的優化國中Web 輸入 功能移植過來 Excel 輸出
        // 資料結構 小差別 高中版: stuRec['Exam' + exam.ExamID]、 國中版 有底線 stuRec['Exam_' + exam.ExamID];
        /**
        * 匯出excel
        */
        $scope.exportExcel = function () {
            // 檢查資料是否更動
            var data_changed = !$scope.checkAllTable($scope.current.mode);
            if (data_changed) {
                alert("資料尚未儲存，無法匯出報表。");
            }
            else {
                var wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: '成績單',
                    Subject: '',
                    Author: 'ischool',
                };
                wb.SheetNames.push('成績單');

                // 資料整理
                var ws_data = [];
                // 自訂欄寬
                var wscols = [
                    { wch: 10 },
                    { wch: 8 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 15 }
                ];
                $scope.studentList.forEach(function (stuRec) {
                    var data = {
                        班級: stuRec.ClassName,
                        座號: stuRec.SeatNo,
                        姓名: stuRec.StudentName
                    }
                    data['學期成績'] = stuRec['Exam學期成績'];
                    if ($scope.current.Course.Scores.Score) {
                        $scope.current.Course.Scores.Score.forEach(function (exam) {
                            data[exam.Name] = stuRec['Exam' + exam.ExamID];
                            wscols.push({ wch: 15 });
                        });
                    }
                 
                    ws_data.push(data);
                });

                var ws = XLSX.utils.json_to_sheet(ws_data);

                ws['!cols'] = wscols;

                wb.Sheets[wb.SheetNames[0]] = ws;
                // export the workbook as xlsx binary
                var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), $scope.current.Course.CourseName + '.xlsx');
            }
        }

        /**
         * convert the binary data into octet
         */
        var s2ab = function (s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        // 2019/06/14 穎驊 優化高中成績Web輸入， 將小考成績 轉換為本次的評量成績，
        //輸入規則為， 在一次的評量輸入截止前，都可以編輯該評量的所有小考項目， 在評量輸入的期間 可以進行結算
        /**
        * 匯出成績單
        */
        $scope.importAssessmentScore = function ()
        {
            // 將入目標exam 的 分數 通通換成之前試算出來儲存的
            $scope.studentList.forEach(function (stuRec) {
                stuRec["Exam" + $scope.current.Exam.ExamID] = stuRec['QuizResult_' + $scope.current.Exam.ExamID]
            });
        }


        $scope.params = gadget.params;

        $scope.params.DefaultRound = gadget.params.DefaultRound || '2';

        $scope.calc = function () {
            [].concat($scope.examList).reverse().forEach(function (examItem) {
                if (examItem.Permission == "Editor" && !!!examItem.Lock && examItem.Type == "Program") {
                    $scope.studentList.forEach(function (stuRec) {
                        examItem.Fn(stuRec);
                    });
                }
            });
        }

        $scope.changeSelectMode = function (mode) {
            $scope.current.SelectMode = mode;
            $timeout(function () {
                $('.pg-seatno-textbox:visible').select().focus();
            }, 1);
        }

        $scope.setCurrent = function (student, exam, setCondition, setFocus) {
            $scope.current.Exam = exam;
            $scope.current.Student = student;

            //// 設定目前的 試別 其下的 子項目成績
            //$scope.current.gradeItemList = [];
            //[].concat($scope.gradeItemList|| []).forEach(function (item) {
            //    if (item.RefExamID == $scope.current.template.ExamID)
            //    {
            //        $scope.current.gradeItemList.push(item);
            //    }                              
            //});

            

            var val;

            if ($scope.current.mode == $scope.modeList[0]) { // 成績管理模式

                val = (student || {})['Exam' + (exam || {}).ExamID];
            }
            else if ($scope.current.mode == $scope.modeList[1]) { // 平時評量模式
                
                val = (student || {})[(exam || {}).ExamID];
            }

                        
            $scope.current.Value = (angular.isNumber(val) ? val : (val || ""));


            if (setCondition && student) {
                $scope.current.SelectSeatNo = student.SeatNo;
            }
            if (setFocus) {
                $('.pg-grade-textbox:visible').focus()
                $timeout(function () {
                    $('.pg-grade-textbox:visible').select();
                }, 1);
            }
        }

        $scope.submitStudentNo = function (event) {
            if (event && (event.keyCode !== 13 || $scope.isMobile)) return; // 13是enter按鈕的代碼，return是跳出
            if (!$scope.current.Student) return;
            $('.pg-grade-textbox:visible').focus();
            $timeout(function () {
                $('.pg-grade-textbox:visible').select();
            }, 1);
        }

        $scope.typeStudentNo = function () {
            var currentIndex = $scope.current.Student ? $scope.current.Student.index : 0;

            var nextStudent = null;
            var nextStudent2 = null;
            angular.forEach($scope.studentList, function (item, index) {
                if (item.SeatNo == $scope.current.SelectSeatNo) {
                    if (index > currentIndex) {
                        if (nextStudent2 == null)
                            nextStudent2 = item;
                    }
                    else {
                        if (nextStudent == null)
                            nextStudent = item;
                    }
                }
            });
            $scope.setCurrent(nextStudent2 || nextStudent, $scope.current.Exam, false, false);
            $('.pg-seatno-textbox:visible').focus();
        }

        $scope.goPrev = function () {
            var currentIndex = $scope.current.Student ? $scope.current.Student.index : 0;
            $scope.setCurrent(
                (currentIndex == 0) ?
                    $scope.studentList[$scope.studentList.length - 1] :
                    $scope.studentList[currentIndex - 1]
                , $scope.current.Exam
                , true
                , true);
            $('.pg-grade-textbox:visible').focus();
            $timeout(function () {
                $('.pg-grade-textbox:visible').select();
            }, 1);
        }

        $scope.goNext = function () {
            var currentIndex = $scope.current.Student ? $scope.current.Student.index : 0;
            $scope.setCurrent(
                (currentIndex == $scope.studentList.length - 1) ?
                    $scope.studentList[0] :
                    $scope.studentList[currentIndex + 1]
                , $scope.current.Exam
                , true
                , true);
            $('.pg-grade-textbox:visible').focus();
            $timeout(function () {
                $('.pg-grade-textbox:visible').select();
            }, 1);
        }

        $scope.enterGrade = function (event) {

            if (event && (event.keyCode !== 13 || $scope.isMobile)) return;
            var flag = false;
            if ($scope.current.Exam.Type == 'Number') {
                var temp = Number($scope.current.Value);
                if (!isNaN(temp)
                    && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Max && $scope.current.Exam.Range.Max !== 0) || temp <= $scope.current.Exam.Range.Max)
                    && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Min && $scope.current.Exam.Range.Min !== 0) || temp >= $scope.current.Exam.Range.Min)) {
                    flag = true;
                    if (!$scope.current.Exam.Group) {
                        var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                        temp = Math.round(temp * round) / round;
                    }
                }
                if ($scope.current.Value == "缺")
                    flag = true;
                if (flag) {
                    if ($scope.current.Value != "" && $scope.current.Value != "缺")
                        $scope.current.Value = temp;
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                $scope.submitGrade();
            }
        }

        gadget.onLeave(function () {
            var data_changed = !$scope.checkAllTable($scope.current.mode);

            if (data_changed) {
                return "尚未儲存資料，現在離開視窗將不會儲存本次更動";
            }
            else {
                return "";
            }

        });

        $scope.selectValue = function (val) {
            $scope.current.Value = val;
            $scope.submitGrade();
        }

        $scope.submitGrade = function (matchNext) {

            if ($scope.current.mode == '成績管理') {
                $scope.Data_is_original = false;
                $scope.Data_has_changed = true;

                $scope.current.Student["Exam" + $scope.current.Exam.ExamID] = $scope.current.Value;
                $scope.calc();
                var nextStudent =
                    $scope.studentList.length > ($scope.current.Student.index + 1) ?
                        $scope.studentList[$scope.current.Student.index + 1] :
                        $scope.studentList[0];

                $scope.setCurrent(nextStudent, $scope.current.Exam, true, false);

                if ($scope.current.SelectMode != 'Seq.')
                    $('.pg-seatno-textbox:visible').select().focus();
                else {
                    $('.pg-grade-textbox:visible').select().focus();
                }
                $timeout(function () {
                    if ($scope.current.SelectMode != 'Seq.')
                        $('.pg-seatno-textbox:visible').select();
                    else {
                        $('.pg-grade-textbox:visible').select();
                    }
                }, 1);

            }
            else
            {
                // 平時評量成績
                $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;

                // 計算平時評量
                $scope.calcQuizResult($scope.current.Student);
                // 目前學生換下一位
                var nextStudent = $scope.studentList.length > ($scope.current.Student.index + 1) ?
                    $scope.studentList[$scope.current.Student.index + 1] :
                    $scope.studentList[0];

                $scope.setCurrent(nextStudent, $scope.current.Exam, true, true);
            }            
        }

        $scope.saveAll = function () {
            var body = {
                Content: {
                    '@CourseID': $scope.current.Course.CourseID,
                    Exam: []
                }
            };
            [].concat($scope.current.Course.Scores.Score || []).forEach(function (examRec, index) {
                if (!examRec.Lock) {
                    var eItem = {
                        '@ExamID': examRec.ExamID,
                        Student: []
                    };
                    [].concat($scope.studentList || []).forEach(function (studentRec, index) {
                        var obj = {
                            '@StudentID': studentRec.StudentID,
                            '@Score': studentRec["Exam" + examRec.ExamID],
                            Extension: {
                                Extension: {
                                    Score: studentRec["Exam" + examRec.ExamID]
                                    , Text: studentRec["Exam" + examRec.ExamID + "_" + "文字評量"]
                                }
                            }
                        };
                        [].concat(examRec.SubExamList || []).forEach(function (subExamRec) {
                            if (subExamRec.ExtName) {
                                obj.Extension.Extension[subExamRec.ExtName] = studentRec["Exam" + subExamRec.ExamID];
                            }
                        });
                        eItem.Student.push(obj);
                    });
                    body.Content.Exam.push(eItem);
                }
            });

            $scope.connection.send({
                service: "TeacherAccess.SetCourseExamScoreWithExtension",
                autoRetry: true,
                body: body,
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.SetCourseExamScoreWithExtension Error");
                    } else {
                        if ($scope.current.Course.AllowUpload == '是' && new Date($scope.current.Course.InputStartTime) < new Date() && new Date() < new Date($scope.current.Course.InputEndTime)) {
                            //#region 儲存學期成績
                            var body = {
                                Content: {
                                    Course: {
                                        '@CourseID': $scope.current.Course.CourseID,
                                        Student: []
                                    }
                                }
                            };
                            [].concat($scope.studentList || []).forEach(function (studentRec, index) {
                                var obj = {
                                    '@StudentID': studentRec.StudentID,
                                    '@Score': studentRec["Exam" + '學期成績']
                                };
                                body.Content.Course.Student.push(obj);
                            });
                            $scope.connection.send({
                                service: "TeacherAccess.SetCourseSemesterScore",
                                autoRetry: true,
                                body: body,
                                result: function (response, error, http) {
                                    if (error) {
                                        //失敗但評量成績已儲存
                                        $scope.$apply(function () {
                                            $scope.studentList.forEach(function (studentRec, index) {
                                                var rawStudentRec = angular.copy(studentRec);
                                                for (var key in rawStudentRec) {
                                                    if (!key.match(/(學期成績|Origin)$/gi))
                                                        studentRec[key + 'Origin'] = studentRec[key];
                                                }
                                            });
                                        });
                                        alert("TeacherAccess.SetCourseSemesterScore Error");
                                    } else {
                                        $scope.$apply(function () {
                                            $scope.studentList.forEach(function (studentRec, index) {
                                                var rawStudentRec = angular.copy(studentRec);
                                                for (var key in rawStudentRec) {
                                                    if (!key.match(/Origin$/gi))
                                                        studentRec[key + 'Origin'] = studentRec[key];
                                                }
                                            });
                                        });
                                        alert("儲存完成。");
                                    }
                                }
                            });
                            //#endregion
                        }
                        else {
                            $scope.$apply(function () {
                                $scope.studentList.forEach(function (studentRec, index) {
                                    var rawStudentRec = angular.copy(studentRec);
                                    for (var key in rawStudentRec) {
                                        if (!key.match(/(學期成績|Origin)$/gi))
                                            studentRec[key + 'Origin'] = studentRec[key];
                                    }
                                });
                            });
                            alert("儲存完成。");
                        }
                    }
                }
            });
        }


        /**儲存平時評量 */
        $scope.saveGradeItemScore = function () {

            var body = {
                Request: {
                    SCAttendExtension: []
                }
            };
            // 資料整理
            [].concat($scope.studentList || []).forEach(function (stuRec, index) {

                // 學生
                var student = {
                    '@CourseID': $scope.current.Course.CourseID,
                    '@StudentID': stuRec.StudentID,
                    Extension: {
                        '@Name': 'GradeBook',
                        Exam: []
                    }
                };

                // 平時評量成績
                [].concat($scope.templateList || []).forEach(template => {
                    var exam = {
                        '@ExamID': template.ExamID,
                        '@Score': stuRec['QuizResult_' + template.ExamID] == undefined ? '' : stuRec['QuizResult_' + template.ExamID],
                        Item: []
                    };

                    // 小考成績
                    var targetItemList = $scope.gradeItemList.filter(item => item.Name !== '平時評量' && item.RefExamID == template.ExamID && item.Permission !=='Program');
                    [].concat(targetItemList || []).forEach(item => {
                        var item = {
                            '@SubExamID': item.SubExamID,
                            '@Score': stuRec['Quiz_' + item.SubExamID] == undefined ? '' : stuRec['Quiz_' + item.SubExamID]
                        }

                        exam.Item.push(item);
                    });

                    student.Extension.Exam.push(exam);
                });

                body.Request.SCAttendExtension.push(student);
            });
            $scope.connection.send({
                service: "TeacherAccess.SetSCAttendExtensions",
                autoRetry: true,
                body: body,
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.SetSCAttendExtensions Error");
                    } else {
                        $scope.$apply(function () {

                            $scope.studentList.forEach(function (stuRec, index) {
                                // 原始資料更新
                                $scope.gradeItemList.forEach(function (item) {
                                    stuRec[item.ExamID + 'Origin'] = stuRec[item.ExamID];
                                });
                            });
                        });

                        // 下列 是只有新竹國中有的邏輯， 每次輸完小考成績 自動 結算回 評量成績， 高中評量成績輸入不需要這個情境
                        // 高中的情境為， 在該次的評量輸入期間之內， 使用者自己點選 結算功能， 將 評量之下 的]小考結算成績帶入
                        // 當然使用者也可以自行輸入 每一次評量成績的結果。
                        ///**
                        // * 將平時評量分數結算至定期評量
                        // * 條件：
                        // * 1. 成績輸入時間內
                        // * 2. 是否啟用平時評量 => 依照教務做作業評分樣板設定
                        // */
                        //{
                        //    $scope.studentList.forEach(student => {
                        //        student['AssignmentScore_' + $scope.current.template.ExamID] = student['QuizResult_' + $scope.current.template.ExamID];
                        //    });
                        //    $scope.saveAll();
                        //}


                        // 資料Reload
                        //$scope.dataReload();
                        $scope.setCurrentCourse($scope.current.Course);

                        alert('儲存完成。');
                    }
                }
            });
        }

        $scope.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;

        $scope.filterPermission = function (examItem) {
            return (examItem.Permission == "Read" || examItem.Permission == "Editor") && ($scope.current.VisibleExam && $scope.current.VisibleExam.indexOf(examItem.Name) >= 0);
        }

        $scope.setupCurrent = function () {

            if ($scope.studentList && $scope.examList && $scope.current.ExamOrder) {
               
                $scope.calc();
                if (!$scope.current.Student && !$scope.current.Exam) {
                    //#region 設定預設資料顯示
                    var ts, te;
                    if ($scope.studentList) ts = $scope.studentList[0];

                    //$scope.examList.forEach(function (e) {
                    //    if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program')
                    //        te = e;
                    //});

                 /**
                * 設定目前試別 
                * 1. 成績管理模式 試別來自 examList
                * 2. 平時評量模式 試別來自 gradeItemList
                */
                    if ($scope.current.mode == $scope.modeList[0]) { // 成績管理模式
                        $scope.examList.forEach(function (e) {
                        if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program')
                                te = e;                        
                    });
                    }
                    else if ($scope.current.mode == $scope.modeList[1]) { // 平時評量模式

                        // 平時評量模式 te 還是來自於 examList 
                        //$scope.examList.forEach(function (e) {
                        //    if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program')
                        //        te = e;

                        $scope.current.gradeItemList.forEach(function (e) {
                        if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program')
                            te = e;
                    });                       
                   }


                    if (ts && te) {
                        $scope.setCurrent(ts, te, true, true);
                    }
                    if ($scope.examList.length == 0) {
                        $scope.showCreateModal();
                    }
                    //#endregion
                }
                else {
                    var ts = $scope.current.Student,
                        te;
                    if (!ts && $scope.studentList && $scope.studentList.length > 0) ts = $scope.studentList[0];


                    //if ($scope.current.Exam) {
                    //    var currentExamName = $scope.current.Exam.Name;
                    //    $scope.examList.forEach(function (e) {
                    //        if (currentExamName == e.Name)
                    //            te = e;
                    //    });
                    //}
                    //else {
                    //    $scope.examList.forEach(function (e) {
                    //        if (!te && !e.Lock && e.Permission == "Editor")
                    //            te = e;
                    //    });
                    //}

                    te = $scope.current.Exam;

                    $scope.setCurrent(ts, te, true, true);
                }


                $(function () {
                    $("#affixPanel").affix({
                        offset: {
                            top: 100,
                            bottom: function () {
                                return (this.bottom = $('.footer').outerHeight(true));
                            }
                        }
                    });
                });
            }


        }

        $scope.current = {
            SelectMode: "Seq.",
            SelectSeatNo: "",
            Value: "",
            Student: null,
            Exam: null,
            Course: null
        };

        // 設定目前資料顯示模式：成績管理 or 平時評量
        $scope.current.mode = $scope.modeList[0];

        $scope.connection = gadget.getContract("ta");

        $scope.connection.send({
            service: "TeacherAccess.GetCurrentSemester",
            autoRetry: true,
            body: '',
            result: function (response, error, http) {

                if (error) {
                    alert("TeacherAccess.GetCurrentSemester Error");
                } else {
                    var schoolYear = response.Current.SchoolYear;
                    var semester = response.Current.Semester;

                    $scope.connection.send({
                        service: "TeacherAccess.GetMyCourses",
                        autoRetry: true,
                        body: {
                            Content: {
                                Field: { All: '' },
                                Order: { CourseName: '' }
                            }
                        },
                        result: function (response, error, http) {

                            if (error) {
                                alert("TeacherAccess.GetMyCourses Error");
                            } else {
                                $scope.$apply(function () {

                                    $scope.courseList = [];
                                    $scope.HasNoCourse = false;
                                        
                                    [].concat(response.Courses.Course || []).forEach(function (courseRec, index) {
                                        if (courseRec.SchoolYear == schoolYear && courseRec.Semester == semester) {
                                            $scope.courseList.push(courseRec);
                                        }
                                    });

                                    if ($scope.courseList.length == 0)
                                    {
                                        // 本學期沒有任何課程
                                        $scope.HasNoCourse = true;
                                    }

                                    $scope.setCurrentCourse($scope.courseList[0]);
                                });
                            }
                        }
                    });
                }
            }
        });

        $scope.getProcess = function () {
            if ($scope.examList && $scope.examList.length > 0 && $scope.examList[0].ExamID == '學期成績') {
                var process = [
                    {
                        Name: '學期成績',
                        Type: 'Header'
                    },
                    {
                        Name: '代入試算成績->學期成績',
                        Type: 'Function',
                        Fn: function () {
                            [].concat($scope.studentList || []).forEach(function (studentRec, index) {
                                studentRec["Exam" + '學期成績'] = studentRec["Exam" + '學期成績_試算'];
                            });
                            alert('學期成績已代入');
                        },
                        Disabled: $scope.examList[0].Lock
                    }
                ];

                // 小考匯入清單
                $scope.importGradeItemList = [];

                //#region 匯入 (評量)
                var importProcesses = [];
                [].concat($scope.examList).forEach(function (examRec, index) {
                    if (examRec.Type == 'Number' && examRec.Permission == "Editor") {
                        var importProcess = {
                            Name: '匯入' + examRec.Name,
                            Type: 'Function',
                            Fn: function () {
                                delete importProcess.ParseString;
                                delete importProcess.ParseValues;
                                $scope.importProcess = importProcess;
                                $('#importModal').modal('show');
                            },
                            Parse: function () {
                                importProcess.ParseString = importProcess.ParseString || '';
                                importProcess.ParseValues = importProcess.ParseString.split("\n");
                                importProcess.HasError = false;
                                for (var i = 0; i < importProcess.ParseValues.length; i++) {
                                    var flag = false;
                                    var temp = Number(importProcess.ParseValues[i]);
                                    if (!isNaN(temp)
                                        && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Max && $scope.current.Exam.Range.Max !== 0) || temp <= $scope.current.Exam.Range.Max)
                                        && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Min && $scope.current.Exam.Range.Min !== 0) || temp >= $scope.current.Exam.Range.Min)) {
                                        flag = true;
                                        if (!$scope.current.Exam.Group) {
                                            var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                            temp = Math.round(temp * round) / round;
                                        }
                                    }
                                    if (importProcess.ParseValues[i] == "缺")
                                        flag = true;
                                    if (flag) {
                                        if (!isNaN(temp) && importProcess.ParseValues[i] != "")
                                            importProcess.ParseValues[i] = temp;
                                    }
                                    else {
                                        importProcess.ParseValues[i] = '錯誤';
                                        importProcess.HasError = true;
                                    }
                                }

                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (index >= importProcess.ParseValues.length) {
                                        importProcess.ParseValues.push('錯誤');
                                        importProcess.HasError = true;
                                    }
                                });

                            },
                            Clear: function () {
                                delete importProcess.ParseValues;
                            },
                            Import: function () {
                                if (importProcess.HasError == true)
                                    return;
                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (!importProcess.ParseValues[index] && importProcess.ParseValues[index] !== 0)
                                        stuRec['Exam' + examRec.ExamID] = '';
                                    else
                                        stuRec['Exam' + examRec.ExamID] = importProcess.ParseValues[index];
                                });
                                $scope.calc();
                                $('#importModal').modal('hide');
                            },
                            Disabled: examRec.Lock
                        };

                        importProcesses.push(importProcess);
                    }
                });
                if (importProcesses.length > 0) {
                    process = process.concat({
                        Name: '匯入',
                        Type: 'Header'
                    }).concat(importProcesses);
                }
                //#endregion


                $scope.process = process;

                // 整理小考匯入清單
                {
                    var targetGradeItemList = $scope.current.gradeItemList.filter(item => item.Permission !== 'Program');

                    [].concat(targetGradeItemList || []).forEach(item => {
                        var importProcess = {
                            Name: '匯入_' + item.Name,
                            Type: 'Function',
                            Fn: function () {
                                delete importProcess.ParseString;
                                delete importProcess.ParseValues;
                                $scope.importProcess = importProcess;
                                $('#importModal').modal('show');
                            },
                            Parse: function () {
                                importProcess.ParseString = importProcess.ParseString || '';
                                importProcess.ParseValues = importProcess.ParseString.split("\n");
                                importProcess.HasError = false;
                                for (var i = 0; i < importProcess.ParseValues.length; i++) {
                                    var flag = false;
                                    var temp = Number(importProcess.ParseValues[i]);
                                    if (!isNaN(temp) && temp <= 100 && temp >= 0) {

                                        if (importProcess.ParseValues[i] != '') {
                                            flag = true;
                                        }
                                        // if (!$scope.current.Exam.Group) {
                                        //    var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                        //    temp = Math.round(temp * round) / round;
                                        // }
                                        var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                        temp = Math.round(temp * round) / round;
                                    }
                                    // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                                    if (importProcess.ParseValues[i] == '-') {
                                        flag = true;
                                        importProcess.ParseValues[i] = '';
                                    }
                                    if (flag) {
                                        if (!isNaN(temp) && importProcess.ParseValues[i] != '') {
                                            importProcess.ParseValues[i] = temp;
                                        }
                                    }
                                    else {
                                        importProcess.ParseValues[i] = '錯誤';
                                        importProcess.HasError = true;
                                    }
                                }
                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (index >= importProcess.ParseValues.length) {
                                        importProcess.ParseValues.push('錯誤');
                                        importProcess.HasError = true;
                                    }
                                });
                            },
                            Clear: function () {
                                delete importProcess.ParseValues;
                            },
                            Import: function () {
                                if (importProcess.HasError == true) {
                                    return;
                                }
                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (!importProcess.ParseValues[index] && importProcess.ParseValues[index] !== 0) {
                                        stuRec[item.ExamID] = '';
                                    }
                                    else {
                                        stuRec[item.ExamID] = importProcess.ParseValues[index];
                                    }
                                });

                                $scope.studentList.forEach(student => {
                                    $scope.calcQuizResult(student);
                                });

                                $('#importModal').modal('hide');
                            },
                            Disabled: item.Lock
                        };

                        $scope.importGradeItemList.push(importProcess);
                    });
                }
            }
            else {
                $scope.process = [];
            }
        }

        $scope.setCurrentCourse = function (course) {
            if ($scope.studentList) {
                var data_changed = !$scope.checkAllTable($scope.current.mode);
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動"))
                        return;
                }
            }

            $scope.current.Student = null;
            $scope.studentList = null;
            $scope.current.VisibleExam = [];
            $scope.current.ExamOrder = [];
            $scope.current.Course = course;
            /**課程評分樣板：定期評量清單 */
            $scope.templateList = [];
            $scope.examList = [];
            $scope.gradeItemList = []; // 全部評量Exam的 子項目
            $scope.current.gradeItemList = []; // 目前評量Exam 的子項目
            

            //$scope.gradeItemList = [{ Name: "Q1" }, { Name: "Q2" }, { Name: "Q3" }];

            

            [].concat(course.Scores.Score || []).forEach(function (examRec, index) {
                examRec.Type = 'Number';
                examRec.Permission = "Editor";
                examRec.Lock = !(new Date(examRec.InputStartTime) < new Date() && new Date() < new Date(examRec.InputEndTime));
                $scope.examList.push(examRec);
                $scope.current.VisibleExam.push(examRec.Name);
                $scope.current.ExamOrder.push(examRec.Name);

                //templateList 另外存一份
                $scope.templateList.push(examRec);

                //// 平時評量
                //var assignmentScore = {
                //    RefExamID: examRec.ExamID, // 定期評量ID
                //    ExamID: 'AssignmentScore_' + examRec.ExamID,
                //    Name: '平時評量',
                //    Type: 'Number',
                //    Permission: 'Read', // 平時評量分數 調整為小考成績結算後帶入分數
                //    //Lock: template.Extension.Extension.UseAssignmentScore !== '是' || template.Lock,
                //};

                //// 每一次的試別 都有一個 平時評量 試算成績
                //$scope.examList.push(assignmentScore);

            });
            var finalScore = { ExamID: '學期成績', Name: '學期成績', Type: 'Number', Permission: 'Editor', Lock: !(course.AllowUpload == '是' && new Date(course.InputStartTime) < new Date() && new Date() < new Date(course.InputEndTime)) };
            var finalScorePreview = {
                ExamID: '學期成績_試算',
                Name: '學期成績_試算',
                SubName: '試算',
                Type: 'Program',
                Permission: 'Editor',
                Lock: false,
                Group: finalScore,
                Fn: function (stu) {
                    var total = 0, base = 0, seed = 10000;
                    [].concat(course.Scores.Score || []).forEach(function (examRec, index) {
                        var p = Number(examRec.Percentage) || 0;
                        var s = stu["Exam" + examRec.ExamID];
                        if (stu["Exam" + examRec.ExamID] != "缺")
                            if (stu["Exam" + examRec.ExamID] || stu["Exam" + examRec.ExamID] == "0") {
                                total += seed * p * Number(stu["Exam" + examRec.ExamID]);
                                base += p;
                            }
                    });
                    if (base) {
                        var round = Math.pow(10, $scope.params[finalScorePreview.Name + 'Round'] || $scope.params.DefaultRound);
                        stu["Exam" + finalScorePreview.ExamID] = Math.round((Math.floor(total / base) / seed) * round) / round;
                    }
                    else {
                        stu["Exam" + finalScorePreview.ExamID] = "";
                    }
                }
            };

            finalScore.SubExamList = [finalScorePreview];

            $scope.examList.splice(0, 0, finalScore, finalScorePreview);
            $scope.current.VisibleExam.push('學期成績', '學期成績_試算');
            $scope.current.ExamOrder.push('學期成績', '學期成績_試算');

            // 2019/06/14  穎驊備註 ，執行 [190426-04][12] 高中-1campus 新版成績輸入優化執行  項目
            // 需要 將 平時成績輸入情境，導入高中的Web成績輸入
            // 每一次評量小考成績 結構(名稱、比重、ID) 定義在 Course 的 extensions 欄位中 ，結構如下
            // 	<Extension Name="GradeItem">
            //          <GradeItem>
            //              <Item ExamID="1" Name="Q1" SubExamID="525476DD-8FCD-0945-F160-547D0AA8D2A6" Weight="1" />
            //              <Item ExamID="1" Name="Q2" SubExamID="3FE0E67C-4604-84B3-7E86-547D19B8C1EC" Weight="1" />
            //              <Item ExamID="1" Name="Q3" SubExamID="A2B7A3BF-6ECD-97D7-614F-547D2B613705" Weight="1" />
            //          </GradeItem>
	        //  </Extension >

            // 但是在穎驊 執行本項目之前， 就發現 本程式已經有 呼叫  GetCourseExtensions Service
            // 檢查發現， 其為要抓 高中 期中  讀卡情境模組的 資料， 截至目前為止(2019/06/14)， 只有文華在 在使用
            // 其儲存的結構如下
            //<Extension Name="GradeItemExtension">
            //    <GradeItemExtension Calc="SUM" ExamID="2">
            //        <SubExam ExtName="CScore" Permission="Read" SubName="讀卡" Type="Number" />
            //        <SubExam ExtName="PScore" Permission="Editor" SubName="試卷" Type="Number" />
            //    </GradeItemExtension>
            //    <GradeItemExtension Calc="SUM" ExamID="3">
            //        <SubExam ExtName="CScore" Permission="Read" SubName="讀卡" Type="Number" />
            //        <SubExam ExtName="PScore" Permission="Editor" SubName="試卷" Type="Number" />
            //    </GradeItemExtension>
            //    <GradeItemExtension Calc="SUM" ExamID="4">
            //        <SubExam ExtName="CScore" Permission="Read" SubName="讀卡" Type="Number" />
            //        <SubExam ExtName="PScore" Permission="Editor" SubName="試卷" Type="Number" />
            //    </GradeItemExtension>
            //</Extension>

            //  總結， 日後開發者要抓 老師在本課程設定 的小考資料 請抓  Name="GradeItem" ， 要抓 高中讀卡模組的設定 請抓  Name="GradeItemExtension"
            //  升級更新 都要小心分清楚兩者 不要互相動到，  否則會造成 奇怪的結果。
            $scope.connection.send({
                service: "TeacherAccess.GetCourseExtensions",
                autoRetry: true,
                body: {
                    Content: {
                        ExtensionCondition: {
                            '@CourseID': '' + course.CourseID,
                            Name: ['GradeItemExtension', 'GradeItem']
                        }
                    }
                },
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.GetCourseExtensions Error");
                    } else {
                        
                        [].concat(response.Response.CourseExtension.Extension || []).forEach(function (extensionRec) {

                            // 平時成績 項目
                            if (extensionRec.Name == 'GradeItem')
                            {
                                [].concat(extensionRec.GradeItem || []).forEach(function (gradeItemRec) {
                                    [].concat(gradeItemRec.Item || []).forEach(function (item) {


                                        // 篩選此評量成績 對應的 試別  以對應出 輸入時間
                                        var template = $scope.templateList.filter(template => template.ExamID == item.ExamID)[0];

                                        var gradeItem = {
                                            RefExamID: item.ExamID, // 是哪一次試別Exam 的 子成績
                                            ExamID: 'Quiz_' + item.SubExamID, // 作為儲存識別使用
                                            SubExamID: item.SubExamID,
                                            Name: item.Name,
                                            Index: item.Index,
                                            Weight: item.Weight,
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            //  小考輸入開放與否，在該次評量 結束前都可以
                                            Lock : !(new Date() < new Date(template.InputEndTime))
                                            //Lock: false
                                        };

                                        $scope.gradeItemList.push(gradeItem);                                       
                                    });
                                });
                                // 各定期評量的平時評量整理
                                [].concat($scope.examList || []).forEach(exam => {
                                    var quizResult = {
                                        RefExamID: exam.ExamID,
                                        ExamID: 'QuizResult_' + exam.ExamID,
                                        Name: '平時評量_試算',
                                        Type: 'Number',
                                        Permission: 'Program',
                                        // 取得平時評量是否在成績輸入時間內，並且啟用
                                        //Lock: $scope.examList.filter(exam => exam.ExamID == `AssignmentScore_${template.ExamID}`)[0].Lock
                                        Lock: false
                                    };
                                    $scope.gradeItemList.splice(0, 0, quizResult);
                                });
                            }

                            // 高中讀卡成績 項目
                            if (extensionRec.Name == 'GradeItemExtension') {
                                 [].concat(extensionRec.GradeItemExtension || []).forEach(function (gradeItemExtensionRec) {
                                    $scope.examList.forEach(function (examRec, examIndex) {
                                        if (examRec.ExamID == gradeItemExtensionRec.ExamID) {
                                            examRec.SubExamList = [];
                                            [].concat(gradeItemExtensionRec.SubExam || []).forEach(function (subExamRec) {
                                                subExamRec.ExamID = examRec.ExamID + "_" + subExamRec.SubName;
                                                subExamRec.Name = examRec.Name + "_" + subExamRec.SubName;
                                                subExamRec.Lock = examRec.Lock;
                                                subExamRec.Group = examRec;
                                                examRec.SubExamList.push(subExamRec);


                                                $scope.examList.splice(examIndex + examRec.SubExamList.length, 0, subExamRec);
                                                $scope.current.VisibleExam.splice(examIndex + examRec.SubExamList.length, 0, subExamRec.Name);
                                            });
                                            if (gradeItemExtensionRec.Calc == 'SUM') {
                                                examRec.Type = 'Program';
                                                examRec.Fn = function (stu) {
                                                    var sum = 0;
                                                    var hasVal = false;
                                                    var isAbsent = false;
                                                    var seed = 10000;
                                                    examRec.SubExamList.forEach(function (subExamRec) {

                                                        if (subExamRec.Type == "Text")
                                                        {
                                                            return;
                                                        }

                                                        if (stu["Exam" + subExamRec.ExamID] || stu["Exam" + subExamRec.ExamID] == "0") {
                                                            hasVal = true;
                                                            if (stu["Exam" + subExamRec.ExamID] == "缺") {
                                                                isAbsent = true;
                                                            }
                                                            else {
                                                                sum += Number(stu["Exam" + subExamRec.ExamID] * seed || 0);
                                                            }

                                                        }
                                                    });
                                                    if (isAbsent) {
                                                        stu["Exam" + examRec.ExamID] = "缺";
                                                    }
                                                    else {
                                                        if (hasVal) {
                                                            var round = Math.pow(10, $scope.params[examRec.Name + 'Round'] || $scope.params.DefaultRound);
                                                            stu["Exam" + examRec.ExamID] = Math.round((Math.floor(sum) / seed) * round) / round;
                                                        }
                                                        else {
                                                            if (stu["Exam" + examRec.ExamID] !== "缺")
                                                                stu["Exam" + examRec.ExamID] = '';
                                                        }

                                                    }
                                                };
                                            }
                                            return;
                                        }
                                    });
                                });
                            }



                        });

                        // 2019/6/26 穎驊 因應 高中評量成績辦法 2019/06/18 調整 (http://edu.law.moe.gov.tw/LawContent.aspx?id=GL001247)
                        // 增加支援 高中評量成績 輸入文字評量， 目前先初步做 web 前端 處理儲存編輯
                        // 後續 ischool DeskTop 端 的UI 編輯、 報表輸出 等等 還有待後人 補做
                        $scope.examList.forEach(function (examRec, examIndex) {
                            if (examRec.Extension) {
                                if (examRec.Extension.Extension.UseText == "是") {
                                    var subExamRec = {};

                                    subExamRec.ExamID = examRec.ExamID + "_" + "文字評量";
                                    subExamRec.Name = examRec.Name + "_" + "文字評量";
                                    subExamRec.SubName = "文字評量";
                                    subExamRec.Lock = examRec.Lock;
                                    subExamRec.Group = examRec;
                                    subExamRec.Permission = "Editor";
                                    subExamRec.Type = "Text";

                                    //如果原來 沒有 子評量 幫新增，(子評量除了 文字評量之外， 只有 讀卡模組來的 CSCORE 、PSCORE 會建立)
                                    if (!examRec.SubExamList)
                                    {
                                        examRec.SubExamList = [];
                                    }

                                    examRec.SubExamList.push(subExamRec);

                                    $scope.examList.splice(examIndex + examRec.SubExamList.length, 0, subExamRec);
                                    $scope.current.VisibleExam.splice(examIndex + examRec.SubExamList.length, 0, subExamRec.Name);
                                }
                            }
                        });


                        $scope.connection.send({
                            service: "TeacherAccess.GetCourseStudents",
                            autoRetry: true,
                            body: {
                                Content: {
                                    Field: { All: '' },
                                    Condition: { CourseID: course.CourseID },
                                    Order: { SeatNumber: '' }
                                }
                            },
                            result: function (response, error, http) {
                                if (error) {
                                    alert("TeacherAccess.GetCourseStudents Error");
                                } else {
                                    var studentMapping = {};
                                    $scope.$apply(function () {
                                        $scope.studentList = [];
                                        [].concat(response.Students.Student || []).forEach(function (studentRec, index) {
                                            studentRec.SeatNo = studentRec.SeatNumber;

                                            studentRec.StudentScoreTag = "預設";

                                            //2017/6/15 穎驊新增，因應 [A09][06] 子成績輸入-顯示成績身分 項目 ，加入顯示身分類別 ，以利老師在輸入成績時作為判別資訊。
                                            if (studentRec.Tags) {
                                                [].concat(studentRec.Tags.Tag || []).forEach(function (tag) {

                                                    if (tag.Name.includes("成績身分")) {
                                                        studentRec.StudentScoreTag = tag.Name;
                                                    }

                                                    // 列出所有類別(沒道理...)
                                                    //studentRec.StudentScoreTag += tag.Name;
                      
                                                });
                                            }
                                            
                                            studentRec.index = index;
                                            $scope.examList.forEach(function (examRec) {
                                                studentRec["Exam" + examRec.ExamID] = '';
                                            });
                                            $scope.studentList.push(studentRec);
                                            studentMapping[studentRec.StudentID] = studentRec;
                                        });
                                    });
                                    var getCourseExamScoreFinish = false;
                                    var getCourseSemesterScore = false;
                                    var getCourseAssignmentScore = false;

                                    //抓定期評量成績
                                    $scope.connection.send({
                                        service: "TeacherAccess.GetCourseExamScore",
                                        autoRetry: true,
                                        body: {
                                            Content: {
                                                Field: { All: '' },
                                                Condition: { CourseID: course.CourseID },
                                                Order: { SeatNumber: '' }
                                            }
                                        },
                                        result: function (response, error, http) {
                                            if (error) {
                                                alert("TeacherAccess.GetCourseExamScore Error");
                                            } else {
                                                $scope.$apply(function () {
                                                    [].concat(response.Scores.Item || []).forEach(function (examScoreRec, index) {

                                                        // 評量分數
                                                        studentMapping[examScoreRec.StudentID]["Exam" + examScoreRec.ExamID] = examScoreRec.Score;

                                                        // 文字評量
                                                        if (examScoreRec.Extension.Extension.Text) {
                                                            studentMapping[examScoreRec.StudentID]["Exam" + examScoreRec.ExamID + "_" + "文字評量"] = examScoreRec.Extension.Extension.Text;
                                                        }
                                                        else
                                                        {
                                                            studentMapping[examScoreRec.StudentID]["Exam" + examScoreRec.ExamID + "_" + "文字評量"] = "";
                                                        }
                                                        

                                                        // 子評量分數 (讀卡)
                                                        $scope.examList.forEach(function (examRec) {
                                                            if (examRec.ExamID == examScoreRec.ExamID) {
                                                                [].concat(examRec.SubExamList || []).forEach(function (subExamRec) {
                                                                    if (subExamRec.ExtName && examScoreRec.Extension && examScoreRec.Extension.Extension && examScoreRec.Extension.Extension[subExamRec.ExtName]) {
                                                                        studentMapping[examScoreRec.StudentID]["Exam" + subExamRec.ExamID] = examScoreRec.Extension.Extension[subExamRec.ExtName];
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    });
                                                    getCourseExamScoreFinish = true;
                                                    // 定期、學期、平時資料都讀取完後：備份原始資料
                                                    if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                                        $scope.studentList.forEach(function (studentRec, index) {
                                                            var rawStudentRec = angular.copy(studentRec);
                                                            for (var key in rawStudentRec) {
                                                                if (!key.match(/Origin$/gi))
                                                                    studentRec[key + 'Origin'] = studentRec[key];
                                                            }
                                                        });
                                                        $scope.setupCurrent();
                                                    }
                                                });
                                            }
                                        }
                                    });

                                    //抓課程總成績
                                    $scope.connection.send({
                                        service: "TeacherAccess.GetCourseSemesterScore",
                                        autoRetry: true,
                                        body: {
                                            Content: {
                                                Field: {
                                                    All: ''
                                                },
                                                Condition: {
                                                    CourseID: course.CourseID
                                                },
                                                Order: {
                                                    SeatNumber: ''
                                                }
                                            }
                                        },
                                        result: function (response, error, http) {
                                            if (error) {
                                                alert("TeacherAccess.GetCourseSemesterScore Error");
                                            } else {
                                                $scope.$apply(function () {
                                                    [].concat(response.Scores.Item || []).forEach(function (finalScoreRec, index) {
                                                        studentMapping[finalScoreRec.StudentID]["Exam" + finalScore.ExamID] = finalScoreRec.Score;
                                                    });

                                                    getCourseSemesterScore = true;
                                                    // 定期、學期、平時資料都讀取完後：備份原始資料
                                                    if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                                        $scope.studentList.forEach(function (studentRec, index) {
                                                            var rawStudentRec = angular.copy(studentRec);
                                                            for (var key in rawStudentRec) {
                                                                if (!key.match(/Origin$/gi))
                                                                    studentRec[key + 'Origin'] = studentRec[key];
                                                            }
                                                        });
                                                        $scope.setupCurrent();
                                                    }
                                                });
                                            }
                                        }
                                    });



                                    /**取得所有定期評量的小考分數 */
                                    // 抓下來的格式如下 <Exam ExamID="1" Score="86"> 的 86 分 是上次試算 的儲存成績
                                    //<SCAttendExtension CourseID="719" StudentID="335"><Extension Name="GradeBook">
                                    //    <Exam ExamID="1" Score="86">
                                    //        <Item Score="92" SubExamID="Exam1_Q1" />
                                    //        <Item Score="83" SubExamID="Exam1_Q2" />
                                    //        <Item Score="83" SubExamID="Exam1_Q3" />
                                    //    </Exam>
                                    //    <Exam ExamID="2" Score="85">
                                    //        <Item Score="77" SubExamID="Exam2_Q1" />
                                    //        <Item Score="89" SubExamID="Exam2_Q2" />
                                    //        <Item Score="97" SubExamID="Exam2_Q3" />
                                    //    </Exam>
                                    //    <Exam ExamID="7" Score="" />
                                    //    <Exam ExamID="3" Score="" />
                                    //</Extension></SCAttendExtension>
                                    $scope.connection.send({
                                        service: "TeacherAccess.GetSCAttendExtensions",
                                        autoRetry: true,
                                        body: {
                                            Content: {
                                                ExtensionCondition: {
                                                    '@CourseID': $scope.current.Course.CourseID,
                                                    Name: 'GradeBook'
                                                }
                                            }
                                        },
                                        result: function (response, error, http) {
                                            if (error) {
                                                alert("TeacherAccess.GetSCAttendExtensions Error");
                                            } else {
                                                $scope.$apply(function () {
                                                    [].concat(response.Response.SCAttendExtension || []).forEach(function (item, index) {

                                                        [].concat(item.Extension.Exam || []).forEach(exam => {
                                                            // 平時評量成績：為小考結算後分數
                                                            studentMapping[item.StudentID]['QuizResult_' + exam.ExamID] = (exam.Score || '');

                                                            // 平時評量-小考成績
                                                            [].concat(exam.Item || []).forEach(e => {
                                                                studentMapping[item.StudentID]['Quiz_' + e.SubExamID] = (e.Score || '');
                                                            });

                                                        });
                                                    });
                                                    getCourseAssignmentScore = true;
                                                    // 定期、學期、平時資料都讀取完後：備份原始資料
                                                    if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                                        $scope.studentList.forEach(function (studentRec, index) {
                                                            var rawStudentRec = angular.copy(studentRec);
                                                            for (var key in rawStudentRec) {
                                                                if (!key.match(/Origin^/gi))
                                                                    studentRec[key + 'Origin'] = rawStudentRec[key];
                                                            }
                                                        });
                                                        $scope.setupCurrent();
                                                    }
                                                });
                                            }
                                        }
                                    });

                                }
                            }
                        });
                    }

                    // 設定目前定期評量
                    if($scope.current.template) {
                        $scope.setCurrentTemplate($scope.current.template);
                    } else{
                        //var template = $scope.templateList.filter(template => template.ExamID == $scope.current.Exam.ExamID)[0];

                        //$scope.setCurrentTemplate(template);
                    }
                }
            });



        }

        $scope.checkAllTable = function (target) {
            //var pass = true;
            //[].concat($scope.examList || []).forEach(function (examRec) {
            //    if (pass)
            //        [].concat($scope.studentList || []).forEach(function (stuRec) {
            //            if (pass)
            //                pass = !!$scope.checkOneCell(stuRec, 'Exam' + examRec.ExamID);
            //        });
            //});
            //return pass;

            var pass = true;
            var targetExamList = [];

            if (target == $scope.modeList[0]) {
                targetExamList = $scope.examList;
            } else if (target == $scope.modeList[1]) {
                targetExamList = $scope.gradeItemList;
            }

            [].concat(targetExamList || []).forEach(exam => {
                if (pass) {
                    [].concat($scope.studentList || []).forEach(function (stuRec) {
                        if (pass) {
                            pass = !!$scope.checkOneCell(stuRec, exam.ExamID);
                        }
                    });
                }
            });
            return pass;
        }

        // 註記 高中版的  'Origin' 是加在 key 值後， 新竹國中版是 studentRec['Origin_' + examID])
        $scope.checkOneCell = function (studentRec, examKey) {
            var pass = true;
            pass = (studentRec[examKey] == studentRec[examKey + 'Origin']) || (studentRec[examKey + 'Origin'] === undefined) || (examKey == "Exam學期成績_試算");
            return pass;
        }

        // 篩選評分項目 - 編輯評分項目
        $scope.filterGradeItem = function (item) {
            if ($scope.current.template)
            {
                return $scope.current.template.ExamID == item.RefExamID
            }            
        }

        /**
        * 計算平時評量
        */
        $scope.calcQuizResult = function (student) {

            var totalWeight = 0;
            var totalWeightScore = 0;
            $scope.current.gradeItemList.forEach(item => {
                if (student[item.ExamID] || ('' + student[item.ExamID]) == '0') {

                    var score = Number(student[item.ExamID]);
                    var weight = Number(item.Weight);
                    if (!isNaN(score) && !isNaN(weight)) {
                        //處理javascript精度問題
                        score = score * 100000;
                        weight = weight * 100000;
                        totalWeightScore += score * weight;
                        totalWeight += weight;
                    }
                }
            });
            if (totalWeight) {
                /**
                 * 計算平時評量分數
                 * 透過round function執行四捨五入取小數第二位
                 */
                student['QuizResult_' + $scope.current.template.ExamID] = rounding((totalWeightScore / totalWeight / 100000), 2);
            } else {
                student['QuizResult_' + $scope.current.template.ExamID] = '';
            }
        }

        // 四捨五入
        function rounding(val, precision) {
            return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
        }
        //#endregion
        //#endregion

    }
])
.provider('$affix', function () {

    var defaults = this.defaults = {
        offsetTop: 'auto'
    };

    this.$get = function ($window, debounce, dimensions) {

        var bodyEl = angular.element($window.document.body);
        var windowEl = angular.element($window);

        function AffixFactory(element, config) {

            var $affix = {};

            // Common vars
            var options = angular.extend({}, defaults, config);
            var targetEl = options.target;

            // Initial private vars
            var reset = 'affix affix-top affix-bottom',
                initialAffixTop = 0,
                initialOffsetTop = 0,
                offsetTop = 0,
                offsetBottom = 0,
                affixed = null,
                unpin = null;

            var parent = element.parent();
            // Options: custom parent
            if (options.offsetParent) {
                if (options.offsetParent.match(/^\d+$/)) {
                    for (var i = 0; i < (options.offsetParent * 1) - 1; i++) {
                        parent = parent.parent();
                    }
                }
                else {
                    parent = angular.element(options.offsetParent);
                }
            }

            $affix.init = function () {

                $affix.$parseOffsets();
                initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;

                // Bind events
                targetEl.on('scroll', $affix.checkPosition);
                targetEl.on('click', $affix.checkPositionWithEventLoop);
                windowEl.on('resize', $affix.$debouncedOnResize);

                // Both of these checkPosition() calls are necessary for the case where
                // the user hits refresh after scrolling to the bottom of the page.
                $affix.checkPosition();
                $affix.checkPositionWithEventLoop();

            };

            $affix.destroy = function () {

                // Unbind events
                targetEl.off('scroll', $affix.checkPosition);
                targetEl.off('click', $affix.checkPositionWithEventLoop);
                windowEl.off('resize', $affix.$debouncedOnResize);

            };

            $affix.checkPositionWithEventLoop = function () {

                setTimeout($affix.checkPosition, 1);

            };

            $affix.checkPosition = function () {
                // if (!this.$element.is(':visible')) return

                var scrollTop = getScrollTop();
                var position = dimensions.offset(element[0]);
                var elementHeight = dimensions.height(element[0]);

                // Get required affix class according to position
                var affix = getRequiredAffixClass(unpin, position, elementHeight);

                // Did affix status changed this last check?
                if (affixed === affix) return;
                affixed = affix;

                // Add proper affix class
                element.removeClass(reset).addClass('affix' + ((affix !== 'middle') ? '-' + affix : ''));

                if (affix === 'top') {
                    unpin = null;
                    element.css('position', (options.offsetParent) ? '' : 'relative');
                    element.css('top', '');
                } else if (affix === 'bottom') {
                    if (options.offsetUnpin) {
                        unpin = -(options.offsetUnpin * 1);
                    }
                    else {
                        // Calculate unpin threshold when affixed to bottom.
                        // Hopefully the browser scrolls pixel by pixel.
                        unpin = position.top - scrollTop;
                    }
                    element.css('position', (options.offsetParent) ? '' : 'relative');
                    element.css('top', (options.offsetParent) ? '' : ((bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop) + 'px'));
                } else { // affix === 'middle'
                    unpin = null;
                    element.css('position', 'fixed');
                    element.css('top', initialAffixTop + 'px');
                }

            };

            $affix.$onResize = function () {
                $affix.$parseOffsets();
                $affix.checkPosition();
            };
            $affix.$debouncedOnResize = debounce($affix.$onResize, 50);

            $affix.$parseOffsets = function () {

                // Reset position to calculate correct offsetTop
                element.css('position', (options.offsetParent) ? '' : 'relative');

                if (options.offsetTop) {
                    if (options.offsetTop === 'auto') {
                        options.offsetTop = '+0';
                    }
                    if (options.offsetTop.match(/^[-+]\d+$/)) {
                        initialAffixTop = -options.offsetTop * 1;
                        if (options.offsetParent) {
                            offsetTop = dimensions.offset(parent[0]).top + (options.offsetTop * 1);
                        }
                        else {
                            offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + (options.offsetTop * 1);
                        }
                    }
                    else {
                        offsetTop = options.offsetTop * 1;
                    }
                }

                if (options.offsetBottom) {
                    if (options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
                        // add 1 pixel due to rounding problems...
                        offsetBottom = getScrollHeight() - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + (options.offsetBottom * 1) + 1;
                    }
                    else {
                        offsetBottom = options.offsetBottom * 1;
                    }
                }

            };

            // Private methods

            function getRequiredAffixClass(unpin, position, elementHeight) {

                var scrollTop = getScrollTop();
                var scrollHeight = getScrollHeight();

                if (scrollTop <= offsetTop) {
                    return 'top';
                } else if (unpin !== null && (scrollTop + unpin <= position.top)) {
                    return 'middle';
                } else if (offsetBottom !== null && (position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom)) {
                    return 'bottom';
                } else {
                    return 'middle';
                }

            }

            function getScrollTop() {
                return targetEl[0] === $window ? $window.pageYOffset : targetEl[0].scrollTop;
            }

            function getScrollHeight() {
                return targetEl[0] === $window ? $window.document.body.scrollHeight : targetEl[0].scrollHeight;
            }

            $affix.init();
            return $affix;

        }

        return AffixFactory;

    };

})
.directive('bsAffix', function ($affix, $window) {
    return {
        restrict: 'EAC',
        require: '^?bsAffixTarget',
        link: function postLink(scope, element, attr, affixTarget) {

            var options = { scope: scope, offsetTop: 'auto', target: affixTarget ? affixTarget.$element : angular.element($window) };
            angular.forEach(['offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin'], function (key) {
                if (angular.isDefined(attr[key])) options[key] = attr[key];
            });

            var affix = $affix(element, options);
            scope.$on('$destroy', function () {
                affix && affix.destroy();
                options = null;
                affix = null;
            });

        }
    };

})
.directive('bsAffixTarget', function () {
    return {
        controller: function ($element) {
            this.$element = $element;
        }
    };
})
.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});
