angular.module('gradebook', ['ui.sortable', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce'])

    .controller('MainCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        var $scope長這個樣子 = {
            current: {
                SelectMode: "No.",
                SelectSeatNo: "",
                Value: "",
                Student: {
                    SeatNo: "5",
                    StudentName: "凱澤",
                    StudentID: "3597",
                    //StudentScoreTag: "成績身分:一般生"
                },
                Exam: {
                    Name: 'Midterm',
                    Range: {
                        Max: 100,
                        Min: 0
                    }
                },
                // ExamOrder: [],
                Course: {},
                VisibleExam: [],
                Table: '成績管理 or 平時評量'
            },
            studentList: [
                {
                    StudentID: "3597",
                    StudentName: "凱澤",
                    SeatNo: "5",
                    Final: "",
                    Midterm: "89",
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
            }],
            haveNoCourse: true,
            examCatalogList: ['分類']
        };

        $scope.connection = gadget.getContract("ta");
        $scope.params = gadget.params;
        $scope.params.DefaultRound = gadget.params.DefaultRound || '2';
        $scope.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;
        // 四捨五入
        var rounding = function (val, precision) {
            return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
        }

        $scope.checkItemChange = false;

        // 目前物件
        $scope.current = {
            SelectMode: "Seq.",
            SelectSeatNo: "",
            Value: "",
            Student: null,
            Exam: null,
            Course: null,
            /**文字評量分類 */
            TextCatalog: '分類'
        };


              // 目前物件
              $scope.Previous = {
                SelectMode: "Seq.",
                SelectSeatNo: "",
                Value: "",
                Student: null,
                Exam: null,
                Course: null,
                /**文字評量分類 */
                TextCatalog: '分類'
            };

        // 模式清單
        $scope.modeList = ['成績管理', '平時評量'];
        // 設定目前資料顯示模式：成績管理 or 平時評量
        $scope.current.mode = $scope.modeList[0];

        /**
         * 1.取得目前學年度學期
         * 2.取得課程清單
         * courseList
         */
        $scope.connection.send({
            service: "TeacherAccess.GetCurrentSemester",
            autoRetry: true,
            body: '',
            result: function (response, error, http) {

                if (error) {
                    alert("TeacherAccess.GetCurrentSemester Error");
                } else {
                    $scope.current.schoolYear = response.Current.SchoolYear;
                    $scope.current.semester = response.Current.Semester;

                    // 取得課程清單
                    $scope.connection.send({
                        service: "TeacherAccess.GetCourses",
                        autoRetry: true,
                        body: {
                            Content: {
                                Field: { All: '' },
                                Order: { CourseName: '' }
                            }
                        },
                        result: function (response, error, http) {
                            if (error) {
                                alert("TeacherAccess.GetCourses Error");
                            } else {
                                $scope.$apply(function () {
                                    $scope.courseList = [];

                                    // 取得目前學年度學期課程
                                    [].concat(response.Courses.Course || []).forEach(function (course, index) {
                                        if ($scope.current.schoolYear == course.SchoolYear && $scope.current.semester == course.Semester) {
                                            course["Selected"] = false;
                                            $scope.courseList.push(course);
                                        }
                                    });

                                    // 資料排序 sort by name
                                    $scope.courseList.sort(function (a, b) {
                                        if (a.CourseName < b.CourseName) {
                                            return -1;
                                        }
                                        if (a.CourseName > b.CourseName) {
                                            return 1;
                                        }

                                        return 0;
                                    });

                                    $scope.haveNoCourse = false;

                                    // 設定目前課程
                                    if ($scope.courseList[0]) {
                                        $scope.setCurrentCourse($scope.courseList[0]);
                                    } else {
                                        $scope.haveNoCourse = true;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        /**文字評量分類清單 */
        $scope.examCatalogList = ['分類'];

        /**
         * 取得文字評量代碼表
         * examTextList
         */
        $scope.connection.send({
            service: "TeacherAccess.GetExamTextScoreMappingTable",
            body: {
                Content: {}
            },
            result: function (response, error, http) {
                if (error !== null) {
                    alert("TeacherAccess.GetExamTextScoreMappingTable Error");
                    $scope.examTextList = {};
                    $scope.textCodeList = [];
                    $scope.examCatalogList = ['分類'];
                } else {
                    $scope.$apply(function () {
                        if (response !== null && response.Response !== null && response.Response !== '') {

                            // 介面顯示用
                            $scope.examTextList = [].concat(response.Response.TextMappingTable.Item || []);
                            // 代碼替換用
                            $scope.textCodeList = [].concat(response.Response.TextMappingTable.Item || []);

                            // 分類清單
                            $scope.textCodeList.forEach(function (item) {
                                if ($scope.examCatalogList.indexOf(item.Catalog) === -1) {
                                    $scope.examCatalogList.push(item.Catalog);
                                }
                            });

                            // 資料排序
                            $scope.textCodeList.sort(function (a, b) {
                                return a.Code.length < b.Code.length ? 1 : -1;
                            });
                        } else {
                            $scope.examTextList = [];
                            $scope.textCodeList = {};
                            $scope.examCatalogList = ['分類'];
                        }
                    });
                }
            }
        });

        /**
         * 取得努力程度對照表
         */
        $scope.connection.send({
            service: "TeacherAccess.GetEffortDegreeMappingTable",
            autoRetry: true,
            body: {
                Content: {}
            },
            result: function (response, error, http) {
                if (error) {
                    alert("TeacherAccess.GetEffortDegreeMappingTable Error");
                } else {

                    $scope.$apply(function () {

                        $scope.effortPairList = [];

                        if (response.Response.EffortList) {
                            if (response.Response.EffortList.Effort) {

                                response.Response.EffortList.Effort.forEach(function (effortRec) {

                                    var effortItem = {
                                        Code: effortRec.Code,
                                        Score: effortRec.Score,
                                        Name: effortRec.Name
                                    }
                                    $scope.effortPairList.push(effortItem);
                                });

                                // 把分數區間 由高遞減， 避免後續輸入完成績後自動帶入 努力程度 出錯
                                $scope.effortPairList.sort(function (a, b) { return b.Score - a.Score });
                            }
                        }
                    });
                }
            }
        });

        /**
         * 1. 設定目前課程
         * 2. 評分樣板試別整理 examList
         * 3. 取得課程學生
         */
        $scope.setCurrentCourse = function (course) {
            if ($scope.studentList) {
                var data_changed = !$scope.checkAllTable($scope.current.mode);
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
                        return;
                    }
                }
            }
            // 設定目前課程
            $scope.current.Course = course;
            $scope.current.Student = null;
            $scope.studentList = null;
            $scope.current.VisibleExam = [];
            $scope.examList = [];
            $scope.gradeItemList = [];

            // 定期評量試別整理
            {
                // 學期成績
                {
                    var finalScore = {
                        ExamID: 'Exam_學期成績',
                        Name: '學期成績',
                        Type: 'Number',
                        Permission: 'Editor',
                        Lock: !(course.AllowUpload == '是' && new Date(course.InputStartTime) < new Date() && new Date() < new Date(course.InputEndTime)),
                        InputStartTime: course.InputStartTime,
                        InputEndTime: course.InputEndTime
                    };
                    var finalScorePreview = {
                        ExamID: 'Exam_學期成績_試算',
                        Name: '學期成績_試算',
                        SubName: '試算',
                        Type: 'Program',
                        Permission: 'Editor',
                        Lock: false,
                        InputStartTime: course.InputStartTime,
                        InputEndTime: course.InputEndTime,
                        Group: finalScore,
                        Fn: function (stu) {
                            var total = 0, base = 0, seed = 10000;
                            [].concat(course.Scores.Score || []).forEach(function (examRec, index) {
                                var p = Number(examRec.Percentage) || 0;
                                var score = stu['Exam_' + examRec.ExamID];
                                if (score != "缺") {
                                    if (score || score == '0') {
                                        total += seed * p * Number(score);
                                        base += p;
                                    }
                                }
                            });

                            //2017/8/4 穎驊新增  固定 將平時評量納入 試算
                            // 另外由於 高雄的 平時評量成績 與 定期評量的成績 比例為 6 : 4
                            // 比值 為 1.5
                            // 故直接 將 總加權母數base *1.5 作為 平時評量的加權數即可
                            // 如此一來可以動到最少程式碼
                            if (stu['Exam_平時評量'] != "缺") {

                                if (stu['Exam_平時評量'] || stu['Exam_平時評量'] == '0') {
                                    total += seed * base * 1.5 * Number(stu['Exam_平時評量']);
                                    base += base * 1.5;
                                }
                            }

                            if (base) {
                                var round = Math.pow(10, $scope.params[finalScorePreview.Name + 'Round'] || $scope.params.DefaultRound);
                                stu[finalScorePreview.ExamID] = Math.round((Math.floor(total / base) / seed) * round) / round;
                            }
                            else {
                                stu[finalScorePreview.ExamID] = '';
                            }
                        }
                    };

                    $scope.examList.push(finalScore, finalScorePreview);
                    $scope.current.VisibleExam.push('學期成績', '學期成績_試算');
                }

                // 定期評量
                {
                    [].concat(course.Scores.Score || []).forEach(function (examRec, index) {
                        /**
                         * 判斷定期評量是否開放成績輸入
                         * 定期評量儲存時會用到此屬性
                         */
                        examRec.Lock = !(new Date(examRec.InputStartTime) < new Date() && new Date() < new Date(examRec.InputEndTime));

                        // 定期評量
                        var exam = {
                            ExamID: 'Exam_' + examRec.ExamID,
                            Name: examRec.Name,
                            Type: 'Number',
                            Permission: 'Editor',
                            Lock: examRec.Lock,
                            InputStartTime: examRec.InputStartTime,
                            InputEndTime: examRec.InputEndTime,
                            Percentage: examRec.Percentage
                        };
                        // 努力程度 
                        var examScoreEffort = {
                            ExamID: 'Exam_' + examRec.ExamID + '_努力程度',
                            Name: '努力程度',
                            Type: 'Number',
                            Permission: 'Editor',
                            Lock: examRec.Lock,
                            Group: examRec,
                            SubVisible: false,
                            InputStartTime: examRec.InputStartTime,
                            InputEndTime: examRec.InputEndTime
                        };

                        $scope.examList.push(exam, examScoreEffort);
                        $scope.current.VisibleExam.push(examRec.Name, examScoreEffort.Name);
                    });
                }

                // 平時評量
                {
                    var usualScoreOrdinarilyStartTime = "";
                    var usualScoreOrdinarilyOrdinarilyEndTime = "";

                    if (course.TemplateExtension != "") {
                        if (course.TemplateExtension.Extension.OrdinarilyStartTime)
                            usualScoreOrdinarilyStartTime = course.TemplateExtension.Extension.OrdinarilyStartTime;

                        if (course.TemplateExtension.Extension.OrdinarilyEndTime)
                            usualScoreOrdinarilyOrdinarilyEndTime = course.TemplateExtension.Extension.OrdinarilyEndTime;

                    }

                    var usualScore = {
                        ExamID: 'Exam_平時評量',
                        Name: '平時評量',
                        Type: 'Number',
                        Permission: 'Read',
                        //  平時評量入時間為評分樣板設定
                        Lock: course.TemplateExtension == '' ? true : !(new Date(course.TemplateExtension.Extension.OrdinarilyStartTime) < new Date() && new Date() < new Date(course.TemplateExtension.Extension.OrdinarilyEndTime)),
                        InputStartTime: usualScoreOrdinarilyStartTime,//course.TemplateExtension.Extension.OrdinarilyStartTime,
                        InputEndTime: usualScoreOrdinarilyOrdinarilyEndTime//course.TemplateExtension.Extension.OrdinarilyEndTime
                    };

                    var usualSScoreOrdinarilyStartTime = "";
                    var usualSScoreOrdinarilyEndTime = "";

                    if (course.TemplateExtension != "") {
                        if (course.TemplateExtension.Extension.OrdinarilyStartTime) {
                            usualSScoreOrdinarilyStartTime = course.TemplateExtension.Extension.OrdinarilyStartTime
                        }

                        if (course.TemplateExtension.Extension.OrdinarilyEndTime) {
                            usualSScoreOrdinarilyEndTime = course.TemplateExtension.Extension.OrdinarilyEndTime
                        }
                    }

                    var usualScoreEffort = {
                        ExamID: 'Exam_平時評量_努力程度',
                        Name: '努力程度',
                        Type: 'Number',
                        Permission: 'Read',
                        Lock: course.TemplateExtension == '' ? true : !(new Date(course.TemplateExtension.Extension.OrdinarilyStartTime) < new Date() && new Date() < new Date(course.TemplateExtension.Extension.OrdinarilyEndTime)),
                        Group: usualScore,
                        SubVisible: false,
                        InputStartTime: usualSScoreOrdinarilyStartTime, //course.TemplateExtension.Extension.OrdinarilyStartTime,
                        InputEndTime: usualSScoreOrdinarilyEndTime //course.TemplateExtension.Extension.OrdinarilyEndTime
                    };

                    //usualScore.SubExamList = [usualScoreEffort];
                    $scope.examList.push(usualScore, usualScoreEffort);
                    $scope.current.VisibleExam.push('平時評量', '平時評量_努力程度');
                    // $scope.current.ExamOrder.push('平時評量', '平時評量_努力程度');
                }

                // 文字評量
                {
                    var textTextStartTime = "";
                    var textTextEndTime = "";

                    if (course.TemplateExtension != "") {
                        if (course.TemplateExtension.Extension.TextStartTime)
                            textTextStartTime = course.TemplateExtension.Extension.TextStartTime;

                        if (course.TemplateExtension.Extension.TextEndTime)
                            textTextEndTime = course.TemplateExtension.Extension.TextEndTime;
                    }

                    var textScore = {
                        ExamID: 'Exam_文字評量',
                        Name: '文字評量',
                        Type: 'Text',
                        Permission: 'Editor',
                        //  文字評量的 輸入開放與否，依照系統 評量設定的 開放時間為基準。
                        Lock: course.TemplateExtension == '' ? true : !(new Date(course.TemplateExtension.Extension.TextStartTime) < new Date() && new Date() < new Date(course.TemplateExtension.Extension.TextEndTime)),
                        InputStartTime: textTextStartTime,//course.TemplateExtension.Extension.TextStartTime,
                        InputEndTime: textTextEndTime //course.TemplateExtension.Extension.TextEndTime
                    };

                    $scope.examList.push(textScore);
                    $scope.current.VisibleExam.push('文字評量');
                    // $scope.current.ExamOrder.push('文字評量');
                }
            }

            // 取得小考資料
            $scope.getGradeItemList().then(value => {

                // 當畫面與預設成績_1，如果有需要回存資料，不然desktop小考輸入檢查無法檢查到。                                
                if ($scope.checkHasDefaultItem === 't') {


                    $scope.GradeItemConfigInit();

                    $scope.gradeItemList.forEach(function (data) {
                        $scope.gradeItemConfig.Item.push(data);
                    });

                    $scope.saveGradeItemConfig();
                    $scope.checkHasDefaultItem = "f";
                }

                // 模式切換： 1.目前選擇的試別清空 2.資料Reload 3.設定批次項目 4.設定目前學生與目前試別
                $scope.setCurrentMode($scope.current.mode);
            });

        }

        /**
         * 取得小考資料
         */
        $scope.getGradeItemList = function () {
            var course = $scope.current.Course;
            $scope.gradeItemList = [];

            // 高雄特例評分樣板一調要有成績_1
            $scope.checkHasDefaultItem = "f";

            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseExtensions",
                    body: {
                        Content: {
                            ExtensionCondition: {
                                '@CourseID': $scope.current.Course.CourseID,
                                Name: 'GradeItem'
                            }
                        }
                    },
                    result: function (response, error, http) {
                        if (error !== null) {
                            alert("TeacherAccess.GetCourseExtensions Error");
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                if (response !== null && response.Response !== null && response.Response !== '' && response.Response.CourseExtension.Extension.GradeItem) {

                                    // *註記：只能結算上來，不列入gradeItemList
                                    //     ExamID: 'QuizResult', 
                                    //     Name: '平時評量', 
                                    //     ExamID: 'QuizResult_努力程度',
                                    //     Name: '努力程度',  

                                    [].concat(response.Response.CourseExtension.Extension.GradeItem.Item || []).forEach(item => {
                                        var gradeItem = {
                                            Index: item.Index,
                                            Name: item.Name,
                                            ExamID: 'Quiz_' + item.SubExamID,
                                            SubExamID: item.SubExamID,
                                            Weight: item.Weight,
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            //  小考輸入開放與否，與平時評量相同
                                            Lock: course.TemplateExtension == '' ? true : !(new Date(course.TemplateExtension.Extension.OrdinarilyStartTime) < new Date() && new Date() < new Date(course.TemplateExtension.Extension.OrdinarilyEndTime))
                                        };

                                        $scope.gradeItemList.push(gradeItem);
                                    });
                                } else {
                                    var defaultItem = {
                                        Index: '1',
                                        Name: '成績_1',
                                        ExamID: 'Quiz_成績_1',
                                        SubExamID: '成績_1',
                                        Weight: '1',
                                        Type: 'Number',
                                        Permission: 'Editor',
                                        Lock: course.TemplateExtension == '' ? true : !(new Date(course.TemplateExtension.Extension.OrdinarilyStartTime) < new Date() && new Date() < new Date(course.TemplateExtension.Extension.OrdinarilyEndTime))
                                    };
                                    // 之後儲存預設使用
                                    $scope.checkHasDefaultItem = 't';

                                    $scope.gradeItemList.push(defaultItem);
                                }

                                r(true);
                            });
                        }
                    }
                });
            });
        }

        /**
         * 模式切換
         */
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

                // 目前選擇的試別清空
                $scope.current.Exam = null;
                // 資料Reload
                $scope.scoreDataReload();
                // 設定批次項目
                $scope.setBatchItem();
                // 設定目前學生與目前試別
                $scope.setupCurrent();
            }
        }

        /**
         * 學生、成績資料整理
         * 1. 取得課程學生
         * 2. 取得定期評量成績
         * 3. 取得課程學期成績
         * 4. 取得平時評量、文字評量
         * 5. 取得評分項目成績(小考成績)
         */
        $scope.scoreDataReload = function () {

            $scope.studentMapping = {};

            $scope.getCourseStudents().then(function () {
                Promise.all([
                    $scope.getCourseExamScore()
                    , $scope.getCourseSemesterScore()
                    , $scope.getSCAttendExtension()
                    , $scope.getSCAttendExtensions()
                ]).then(function () {
                    // 原始資料備份
                    $scope.setupOrigin();

                    // 設定目前學生、目前試別
                    $scope.setupCurrent();
                });
            });
        }

        // 取得課程學生
        $scope.getCourseStudents = function () {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseStudents2020",
                    autoRetry: true,
                    body: {
                        Content: {
                            Field: { All: '' },
                            Condition: { CourseID: $scope.current.Course.CourseID },
                            Order: {
                                GradeYear: 'asc', DisplayOrder: 'asc', ClassName: 'asc', SeatNo: 'asc', StudentNumber: 'asc'
                            }
                        }
                    },
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.GetCourseStudents2020 Error");
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                $scope.studentList = [];
                                // 學生試別資料初始化
                                [].concat(response.Students.Student || []).forEach(function (studentRec, index) {
                                    studentRec.SeatNo = studentRec.SeatNumber;
                                    studentRec.index = index;
                                    $scope.examList.forEach(function (examRec) {
                                        studentRec[examRec.ExamID] = '';
                                    });
                                    $scope.gradeItemList.forEach(function (gradeItem) {
                                        studentRec[gradeItem.ExamID] = '';
                                    });
                                    studentRec['QuizResult'] = '';
                                    studentRec['QuizResult_努力程度'] = '';
                                    $scope.studentList.push(studentRec);
                                    $scope.studentMapping[studentRec.StudentID] = studentRec;
                                });
                                r(true);
                            });
                        }
                    }
                });
            });
        }

        // 取得定期評量成績
        $scope.getCourseExamScore = function () {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseExamScore",
                    autoRetry: true,
                    body: {
                        Content: {
                            Field: { All: '' },
                            Condition: { CourseID: $scope.current.Course.CourseID },
                            Order: { SeatNumber: '' }
                        }
                    },
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.GetCourseExamScore Error");
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                [].concat(response.Scores.Item || []).forEach(function (examScoreRec, index) {

                                    $scope.studentMapping[examScoreRec.StudentID]['Exam_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.Score;
                                    $scope.studentMapping[examScoreRec.StudentID]['Exam_' + examScoreRec.ExamID + '_努力程度'] = examScoreRec.Extension.Extension.Effort;
                                });
                                r(true);
                            });
                        }
                    }
                });
            });
        }

        // 取得課程學期成績
        $scope.getCourseSemesterScore = function () {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseSemesterScore",
                    autoRetry: true,
                    body: {
                        Content: {
                            Field: {
                                All: ''
                            },
                            Condition: {
                                CourseID: $scope.current.Course.CourseID
                            },
                            Order: {
                                SeatNumber: ''
                            }
                        }
                    },
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.GetCourseSemesterScore Error");
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                [].concat(response.Scores.Item || []).forEach(function (finalScoreRec, index) {
                                    $scope.studentMapping[finalScoreRec.StudentID]['Exam_學期成績'] = finalScoreRec.Score;
                                });
                                r(true);
                            });
                        }
                    }
                });
            });
        }

        // 取得平時評量、文字評量
        $scope.getSCAttendExtension = function () {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetSCAttendExtension",
                    autoRetry: true,
                    body: {
                        Content: {
                            Field: {
                                All: ''
                            },
                            Condition: {
                                CourseID: $scope.current.Course.CourseID
                            }
                        }
                    },
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.GetSCAttendExtension Error");
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                [].concat(response.AttendExtensionList.AttendExtension || []).forEach(function (AttendExtensionRec, index) {
                                    if (AttendExtensionRec.Extension.Extension) {
                                        $scope.studentMapping[AttendExtensionRec.StudentID]['Exam_文字評量'] = AttendExtensionRec.Extension.Extension.Text;
                                        $scope.studentMapping[AttendExtensionRec.StudentID]['Exam_平時評量'] = AttendExtensionRec.Extension.Extension.OrdinarilyScore;
                                        $scope.studentMapping[AttendExtensionRec.StudentID]['Exam_平時評量_努力程度'] = AttendExtensionRec.Extension.Extension.OrdinarilyEffort;
                                    }
                                });
                                r(true);
                            });
                        }
                    }
                });
            });
        }

        // 取得評分項目成績
        $scope.getSCAttendExtensions = function () {
            return new Promise((r, j) => {
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
                            j(false);
                        } else {
                            $scope.$apply(function () {
                                [].concat(response.Response.SCAttendExtension || []).forEach(function (item, index) {
                                    if (item.Extension.Exam) {
                                        // 平時評量成績
                                        $scope.studentMapping[item.StudentID]['QuizResult'] = item.Extension.Exam.Score;
                                        $scope.studentMapping[item.StudentID]['QuizResult_努力程度'] = item.Extension.Exam.Degree;

                                        // 小考成績
                                        if (item.Extension.Exam.Item) {
                                            [].concat(item.Extension.Exam.Item || []).forEach(function (data, index) {
                                                $scope.studentMapping[item.StudentID]['Quiz_' + data.SubExamID] = data.Score;
                                            });
                                        }
                                    }
                                });
                                r(true);
                            });
                        }
                    }
                });
            });
        }

        /**
         * 設定匯入項目 
         */
        $scope.setBatchItem = function () {
            // 批次項目清單
            $scope.batchItemList = [];

            $scope.batchItemList.push({
                Name: '匯入',
                Type: 'Header',
                Disabled: true
            });

            // 成績管理
            if ($scope.current.mode == $scope.modeList[0]) {
                [].concat($scope.examList || []).forEach(function (exam) {
                    // 定期評量
                    if (exam.Type == 'Number' && exam.Permission == 'Editor' && !exam.Group && exam.Name != '學期成績') {
                        var item = {
                            Name: exam.Name,
                            Type: 'Function',
                            Fn: function () {
                                delete item.ParseString;
                                delete item.ParseValues;
                                $scope.batchItem = item;
                                $('#importModal').modal('show');
                            },
                            Parse: function () {
                                //  處理高雄特殊字
                                item.ParseString  =  item.ParseString?.replace(new RegExp(String.fromCharCode(8), "g"),'');
                                item.ParseString = item.ParseString || '';
                                item.ParseValues = item.ParseString.split("\n");
                                item.HasError = false;
                                for (var i = 0; i < item.ParseValues.length; i++) {
                                    var flag = false;
                                    var temp = Number(item.ParseValues[i]);
                                    // // 資料驗證
                                    if (!isNaN(temp) && temp <= 100 && temp >= 0 && item.ParseValues[i] != '') {
                                        flag = true;
                                        var round = Math.pow(10, $scope.params[exam.Name + 'Round'] || $scope.params.DefaultRound);
                                        item.ParseValues[i] = Math.round(temp * round) / round;
                                    }

                                    // if (!isNaN(temp) && temp <= 100 && temp >= 0 && item.ParseValues[i] != '') {
                                    //     flag = true;
                                    // }

                                    // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                                    if (item.ParseValues[i] == '-') {
                                        flag = true;
                                        item.ParseValues[i] = '';
                                    } else if (item.ParseValues[i] == '缺') {
                                        item.ParseValues[i] = '缺';
                                        flag = true;
                                    }

                                    if (!flag) {
                                        item.ParseValues[i] = '錯誤';
                                        item.HasError = true;
                                    } else {
                                        if (!isNaN(temp) && item.ParseValues[i] != '') {
                                            item.ParseValues[i] = temp;
                                        }
                                    }

                                    //  console.log(item.ParseValues[i]);
                                    // debugger;


                                }

                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (index >= item.ParseValues.length) {
                                        item.ParseValues.push('錯誤');
                                        item.HasError = true;
                                    }
                                });
                            },
                            Clear: function () {
                                delete item.ParseValues;
                            },
                            Import: function () {
                                if (item.HasError == true) {
                                    return;
                                }
                                // 資料匯入
                                [].concat($scope.studentList || []).forEach(function (studentRec, index) {
                                    // 成績
                                    if (!item.ParseValues[index] && item.ParseValues[index] !== 0) {
                                        studentRec[exam.ExamID] = '';
                                    } else if (item.ParseValues[index] == '缺') {
                                        studentRec[exam.ExamID] = '缺';
                                    }
                                    else {
                                        studentRec[exam.ExamID] = item.ParseValues[index];
                                    }
                                    // 努力程度
                                    var done = false;
                                    $scope.effortPairList.forEach(function (effortItem) {
                                        if (effortItem.Score == "") {
                                            effortItem.Score = "0";
                                        }

                                        if (studentRec[exam.ExamID] === '缺' || studentRec[exam.ExamID] === '') {
                                            studentRec[exam.ExamID + '_努力程度'] = '';
                                            done = true;
                                        }


                                        if (!done && studentRec[exam.ExamID] !== '') {
                                            if (Number(studentRec[exam.ExamID]) >= Number(effortItem.Score)) {
                                                studentRec[exam.ExamID + '_努力程度'] = effortItem.Code;
                                                done = true;
                                            }
                                        }
                                    });
                                });

                                $scope.calc();
                                $('#importModal').modal('hide');
                            },
                            Disabled: exam.Lock
                        };
                        $scope.batchItemList.push(item);
                    }
                    // 文字評量
                    if (exam.Type == 'Text' && exam.Permission == 'Editor') {
                        var item = {
                            Name: exam.Name,
                            Type: 'Function',
                            Fn: function () {
                                delete item.ParseString;
                                delete item.ParseValues;
                                $scope.batchItem = item;
                                $('#importModal').modal('show');
                            },
                            Parse: function () {
                                item.ParseString = item.ParseString || '';
                                // 處理特殊字
                                if(item.ParseString){

                                    item.ParseString  = item.ParseString.replace(new RegExp(String.fromCharCode(8), "g"),'');
                                }
                                // 2017/11/30穎驊註解，由於Excel 格子內文字若輸入" 其複製到 Web 後，會變成"" ，在此將其移除，避免後續的儲存處理問題
                                var text_trimmed = item.ParseString.replace(/""/g, "")

                                // 2017/12/1，穎驊註解， 為了要處理原始來自Excel 來源的資料會有跨行(自動換行Excel 貼出來的字會有幫前後字串加綴雙引號")
                                //、還有原始的資料會有直接輸入雙引號"等會造成parser 的讀取轉換問題，
                                //穎驊參考 java 轉CSV的檔案解法: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
                                function CSVtoArray(text) {
                                    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:\n|$)/g;

                                    var a = [];
                                    text.replace(re_value,
                                        function (m0, m1, m2, m3) {
                                            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                                            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                                            else if (m3 !== undefined) {
                                                var list_1 = [];
                                                list_1 = m3.split("\n")
                                                list_1.forEach(function (text, index) {
                                                    a.push(text);
                                                });
                                            }
                                            return '';
                                        });
                                    if (/,\s*$/.test(text)) a.push('');
                                    return a;
                                };

                                var a = CSVtoArray(text_trimmed);

                                item.ParseValues = a;
                                item.HasError = false;
                                // for (var i = 0; i < item.ParseValues.length; i++) {
                                //     var flag = false;
                                //     var temp = Number(item.ParseValues[i]);
                                //     // if (!temp == '' && temp != '-') {

                                //     //     temp = item.ParseValues[i];
                                //     // }

                                //     if (!isNaN(temp) && temp <= 100 && temp >= 0) {

                                //         if (item.ParseValues[i] != '') {
                                //             flag = true;
                                //         }
                                //     }
                                //     //     // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                                //     //     else if (temp == '-') {
                                //     //         item.ParseValues[i] = '';
                                //     //     }
                                //     //     else {
                                //     //         item.ParseValues[i] = '錯誤';
                                //     //         item.HasError = true;
                                //     //     }
                                //     // }

                                //     if (item.ParseValues[i] == '-') {
                                //         flag = true;
                                //         item.ParseValues[i] = '';
                                //     } else if (item.ParseValues[i] == '缺') {
                                //         flag = true;
                                //     }
                                //     if (flag) {
                                //         if (!isNaN(temp) && item.ParseValues[i] != '') {
                                //             item.ParseValues[i] = temp;
                                //         }
                                //     }
                                //     else {
                                //         item.ParseValues[i] = '錯誤';
                                //         item.HasError = true;
                                //     }
                                // }

                                // $scope.studentList.forEach(function (stuRec, index) {
                                //     if (index >= item.ParseValues.length) {
                                //         item.ParseValues.push('錯誤');
                                //         item.HasError = true;
                                //     }
                                // });
                            },
                            Clear: function () {
                                delete item.ParseValues;
                            },
                            Import: function () {
                                if (item.HasError == true)
                                    return;
                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (!item.ParseValues[index] && item.ParseValues[index] !== '')
                                        stuRec[exam.ExamID] = '';
                                    else
                                        stuRec[exam.ExamID] = item.ParseValues[index];
                                });

                                $('#importModal').modal('hide');
                            },
                            Disabled: exam.Lock
                        };
                        $scope.batchItemList.push(item);
                    }
                });
            }
            // 平時評量
            else if ($scope.current.mode == $scope.modeList[1]) {
                $scope.gradeItemList.forEach(function (gradeItem) {

                    // 小考項目
                    var importItem = {
                        Name: gradeItem.Name,
                        Type: 'Function',
                        Fn: function () {
                            delete importItem.ParseString;
                            delete importItem.ParseValues;
                            $scope.batchItem = importItem;
                            $('#importModal').modal('show');
                        },
                        Parse: function () {
                            importItem.ParseString = importItem.ParseString || '';
                            importItem.ParseValues = importItem.ParseString.split("\n");
                            importItem.HasError = false;
                            for (var i = 0; i < importItem.ParseValues.length; i++) {
                                var flag = false;
                                var temp = Number(importItem.ParseValues[i]);
                                if (!isNaN(temp) && temp <= 100 && temp >= 0) {

                                    if (importItem.ParseValues[i] != '') {
                                        flag = true;
                                    }
                                }
                                // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                                if (importItem.ParseValues[i] == '-') {
                                    flag = true;
                                    importItem.ParseValues[i] = '';
                                } else if (importItem.ParseValues[i] == '缺') {
                                    flag = true;
                                }
                                if (flag) {
                                    if (!isNaN(temp) && importItem.ParseValues[i] != '') {
                                        importItem.ParseValues[i] = temp;
                                    }
                                }
                                else {
                                    importItem.ParseValues[i] = '錯誤';
                                    importItem.HasError = true;
                                }
                            }
                            $scope.studentList.forEach(function (stuRec, index) {
                                if (index >= importItem.ParseValues.length) {
                                    importItem.ParseValues.push('錯誤');
                                    importItem.HasError = true;
                                }
                            });
                        },
                        Clear: function () {
                            delete importItem.ParseValues;
                        },
                        Import: function () {
                            if (importItem.HasError == true)
                                return;
                            $scope.studentList.forEach(function (stuRec, index) {
                                if (!importItem.ParseValues[index] && importItem.ParseValues[index] !== 0) {
                                    stuRec[gradeItem.ExamID] = '';
                                } else if (importItem.ParseValues[index] === '缺') {
                                    stuRec[gradeItem.ExamID] = '缺';
                                }
                                else {
                                    stuRec[gradeItem.ExamID] = importItem.ParseValues[index];
                                }
                                // 平時評量成績結算
                                $scope.calcQuizResult(stuRec);
                            });

                            $('#importModal').modal('hide');
                        },
                        Disabled: gradeItem.Lock
                    };
                    $scope.batchItemList.push(importItem);
                    //     debugger;
                });
            }

            // $scope.process = batchItemList;
        }

        // 篩選文字評量分類
        $scope.filterTextCatalog = function (text) {
            if ($scope.current.TextCatalog === '分類') {
                return text;
            } else {
                return (text.Catalog === $scope.current.TextCatalog);
            }
        }

        /**
         * 備份原始資料
         */
        $scope.setupOrigin = function () {
            $scope.studentList.forEach(function (studentRec, index) {
                var rawStudentRec = angular.copy(studentRec);
                for (var key in rawStudentRec) {
                    if (!key.match(/Origin$/gi)) {
                        studentRec[key + 'Origin'] = studentRec[key];
                    }
                }
            });
        }

        /**
         * 設定目前學生、目前試別
         */
        $scope.setupCurrent = function () {

            if ($scope.studentList && $scope.examList) {
                // 計算：學期成績試算
                $scope.calc();

                var student, exam;
                var targetExamLst = [];

                // 設定目前學生
                {
                    if (!$scope.current.Student) {
                        if ($scope.studentList) {
                            student = $scope.studentList[0];
                        }
                    } else {
                        student = $scope.current.Student;
                    }
                }

                /**
                                 * 設定目前試別
                                 * 1. 成績管理模式 試別來自 examList
                                 * 2. 平時評量模式 試別來自 gradeItemList
                                 */
                if ($scope.current.mode == $scope.modeList[0]) { // 成績管理模式
                    if (!$scope.current.Exam) {
                        [].concat($scope.current.gradeItemList || []).forEach(gradeItem => {
                            if (!exam && !gradeItem.Lock && gradeItem.Permission == 'Editor' && gradeItem.Type !== 'Program' && !gradeItem.Group) {
                                exam = gradeItem;
                            }
                        });

                    } else {
                        exam = $scope.current.Exam;
                    }
                }
                else if ($scope.current.mode == $scope.modeList[1]) { // 平時評量模式
                    if (!$scope.current.Exam) {
                        [].concat($scope.current.gradeItemList || []).forEach(gradeItem => {
                            if (!exam && !gradeItem.Lock && gradeItem.Permission == 'Editor' && gradeItem.Type !== 'Program') {
                                exam = gradeItem;
                            }
                        });
                    } else {
                        exam = $scope.current.Exam;
                    }
                }

                // // 設定目前試別
                // {
                //     if ($scope.current.mode == $scope.modeList[0]) {
                //         targetExamLst = $scope.examList;
                //     } else if ($scope.current.mode == $scope.modeList[1]) {
                //         targetExamLst = $scope.gradeItemList;
                //     }

                //     //2017/8/3 穎驊新增 !e.Group 邏輯，防止設定子成績項目(努力程度) 為起始 currentExam 
                //     //正確的邏輯 應該是選第一個在開放時間內的評量項目
                //     [].concat(targetExamLst || []).forEach(_exam => {
                //         if (!exam && !_exam.Lock && _exam.Permission == 'Editor' && _exam.Type !== 'Program' && !_exam.Group) {
                //             exam = _exam;
                //         }
                //     });
                // }

                if (student && exam) {
                    $scope.setCurrent(student, exam, true, true);
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

        /**
         * 設定目前學生、試別
         */
        $scope.setCurrent = function (student, exam, setCondition, setFocus) {
            //處理顯示
        
            
            $scope.current.Exam = exam;
            $scope.current.Student = student;
            if(student[exam.ExamID]){
                var val = student[exam.ExamID];
            }
            $scope.setfacus();

            $scope.current.Value = (angular.isNumber(val) ? val : (val || ''));
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

        /**顯示子成績項目 */
        $scope.showSubExam = function (exam) {
            $scope.examList.forEach(function (examRec, index) {
                if (examRec.Group && exam.Name != '努力程度') {

                    if (examRec.Group.Name == exam.Name) {
                        examRec.SubVisible = true;
                    }
                    else {
                        examRec.SubVisible = false;
                    }
                }
                if (examRec.Group && exam.Name == '努力程度') {
                    if (examRec.Group.Name == exam.Group.Name) {
                        examRec.SubVisible = true;
                    }
                    else {
                        examRec.SubVisible = false;
                    }
                }
            });
        }

        /**
         * 檢查資料是否更動
         * 成績管理
         * 平時評量
         */
        $scope.checkAllTable = function () {
            var pass = true;
            var targetExamList = [];

            if ($scope.current.mode == $scope.modeList[0]) {
                targetExamList = $scope.examList;
            } else if ($scope.current.mode == $scope.modeList[1]) {
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

        /**
         * 檢查資料是否更動
         */
        $scope.checkOneCell = function (studentRec, ExamID) {
            var pass = false;
            // if ($scope.current.mode == $scope.modeList[0]) {
            //     pass = (studentRec['Exam_' + ExamID] == studentRec['Exam_' + ExamID + 'Origin']) || (studentRec['Exam_' + ExamID + 'Origin'] === undefined) || (ExamID == '學期成績_試算');
            // } else if($scope.current.mode == $scope.modeList[1]) {
            //     pass = (studentRec['Quiz_' + ExamID] == studentRec['Quiz_' + ExamID + 'Origin']) || (studentRec['Quiz_' + ExamID + 'Origin'] === undefined);
            // }

            pass = (studentRec[ExamID] == studentRec[ExamID + 'Origin']) || (studentRec[ExamID + 'Origin'] === undefined) || (ExamID == 'Exam_學期成績_試算');

            return pass;
        }

        $scope.setfacus = function() {
            $scope.studentList.forEach(x=>{
           
               x.IsCurrent = false ; 
               x.CurrentExam    =  $scope.current.Exam.ExamID
               if(x.StudentID ==   $scope.current.Student.StudentID)
               {
                 x.IsCurrent = true ;
               }
     
                 });
        }




        /**
          * 成績輸入
          * 1. 資料驗證
          * 2. 執行submitGrade
          */
        $scope.enterGrade = function (event) {
         
    
            //
            $scope.setfacus()
     

            if (event && (event.keyCode !== 13 || $scope.isMobile)) {

                if(event.keyCode == 38)
                {
                    $scope.goPrev();

                }else if(event.keyCode == 40)
                {
                    $scope.goNext();
                    
                }
                return;
            }
            if ($scope.current.mode == $scope.modeList[0]) {
             
                var flag = false;
                // 成績評量輸入
                if ($scope.current.Exam.Type == 'Number' && $scope.current.Exam.SubName != '努力程度') {
                    var temp = Number($scope.current.Value);
                    // if (!isNaN(temp)
                    //     && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Max && $scope.current.Exam.Range.Max !== 0) || temp <= $scope.current.Exam.Range.Max)
                    //     && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Min && $scope.current.Exam.Range.Min !== 0) || temp >= $scope.current.Exam.Range.Min)) {
                    //     flag = true;
                    //     if (!$scope.current.Exam.Group) {
                    //         var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                    //         temp = Math.round(temp * round) / round;
                    //     }
                    // }
                    // 成績介於100 ~ 0
                    if (!isNaN(temp) && temp <= 100 && temp >= 0) {
                        flag = true;
                        if (!$scope.current.Exam.Group) {
                            var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                            temp = Math.round(temp * round) / round;
                        }
                    }
                    if ($scope.current.Value == '缺' || $scope.current.Value == '-') {
                        flag = true;
                    }
                    if (flag) {
                        if ($scope.current.Value != '' && $scope.current.Value != '缺' && $scope.current.Value != '-') {
                            $scope.current.Value = temp;
                        } else if ($scope.current.Value === '-') {
                            $scope.current.Value = '';
                        }
                    }
                }
                // 努力程度輸入 
                else if ($scope.current.Exam.Type == 'Number' && $scope.current.Exam.SubName == '努力程度') {
                    var temp = Number($scope.current.Value);
                    if (!isNaN(temp)) {
                        // 努力程度介於0~5
                        if (temp <= 5 && temp >= 0) {
                            flag = true;
                            $scope.current.Value = temp;
                        }
                    }
                }
                // 文字評量輸入
                else {
                    flag = true;
                    $scope.textChangeEvent();
                }
                if (flag) {
                    $scope.submitGrade();
                }
            }
            // 平時評量
            else {
                if (event && (event.keyCode !== 13 || $scope.isMobile)) return;
                if ($scope.current.Exam.Type == 'Number' && $scope.current.Exam.SubName != '努力程度') {
                    var temp = $scope.current.Value == '' ? '' : Number($scope.current.Value);
                    // if (!isNaN(temp)
                    //     && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Max && $scope.current.Exam.Range.Max !== 0) || temp <= $scope.current.Exam.Range.Max)
                    //     && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Min && $scope.current.Exam.Range.Min !== 0) || temp >= $scope.current.Exam.Range.Min)) {
                    //     if (!$scope.current.Exam.Group) {
                    //         $scope.current.Value = temp;
                    //         $scope.submitGrade();
                    //     }
                    // }
                    if (!isNaN(temp) && temp <= 100 && temp >= 0) {
                        if (!$scope.current.Exam.Group) {
                            $scope.current.Value = temp;
                            // $scope.submitGrade();
                            flag = true;
                        }
                    }

                    if ($scope.current.Value == '缺' || $scope.current.Value == '-') {
                        flag = true;
                    }
                    if (flag) {
                        if ($scope.current.Value != '' && $scope.current.Value != '缺' && $scope.current.Value != '-') {
                            $scope.current.Value = temp;
                        } else if ($scope.current.Value === '-') {
                            $scope.current.Value = '';
                        }
                        $scope.submitGrade();
                    }
                }
            }
        }

        /**
         * 文字評量 代碼轉換
         */
        $scope.textChangeEvent = function () {
            // 處理特殊字
            if($scope.current.Value){
                $scope.current.Value  =$scope.current.Value.replace(new RegExp(String.fromCharCode(8), "g"),'');
            }
            var codeList = $scope.current.Value.split(",")
            var valueList = [];

            codeList.forEach(function (code) {
                var result = $.map($scope.textCodeList, function (item, index) {
                    return item.Code;
                }).indexOf(code);

                if (result > -1) {
                    valueList.push($scope.textCodeList[result].Content);
                    //$scope.current.Value = $scope.examTextList[result].Content;
                }
                else {
                    valueList.push(code);
                }

                $scope.current.Value = valueList.join();
            });
        }

        /**
         * 計算加權平均 
         * 計算完成後-跳下一位學生
         * setCurrent
        */
        $scope.submitGrade = function (matchNext) {
            // 成績管理
            if ($scope.current.mode == $scope.modeList[0]) {

                $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;

                if ($scope.current.Exam.Name != '文字評量') {
                    $scope.current.Student[$scope.current.Exam.ExamID + '_努力程度'] = '';

                    var done = false;
                    // 努力程度轉換
                    if ('' + $scope.current.Value) {
                        $scope.effortPairList.forEach(function (effortItem) {
                            if (!done && $scope.current.Value >= effortItem.Score) {
                                $scope.current.Student[$scope.current.Exam.ExamID + '_努力程度'] = effortItem.Code;

                                done = true;
                            }
                        });
                    }

                }
            }
            // 平時評量
            else {
                $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;
                // 計算平時評量
                $scope.calcQuizResult($scope.current.Student);
            }
            // 學期成績試算
            $scope.calc();
            // 設定下一位學生
            {
                if ($scope.current.Student) {
                    $scope.studentList[$scope.current.Student.index] = $scope.current.Student;
                }


                var nextStudent = $scope.studentList.length > ($scope.current.Student.index + 1) ?
                    $scope.studentList[$scope.current.Student.index + 1] :
                    $scope.studentList[0];

                $scope.setCurrent(nextStudent, $scope.current.Exam, true, false);
            }

            if ($scope.current.SelectMode != 'Seq.') {
                $('.pg-seatno-textbox:visible').select().focus();
            } else {
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

        /**
         * 學期成績試算
         */
        $scope.calc = function () {
            [].concat($scope.examList).reverse().forEach(function (examItem) {
                if (examItem.Permission == 'Editor' && !!!examItem.Lock && examItem.Type == 'Program') {
                    $scope.studentList.forEach(function (stuRec) {
                        examItem.Fn(stuRec);
                    });
                }
            });
        }

        /**
         * 計算平時評量
         */
        $scope.calcQuizResult = function (student) {
            var totalWeight = 0;
            var totalWeightScore = 0;
            var done = false;

            student['QuizResult'] = '';
            student['QuizResult_努力程度'] = '';

            $scope.gradeItemList.forEach(function (item) {
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
                // $scope.$apply(function() {

                // });
                // 四捨五入取小數第二位
                var round = Math.pow(10, $scope.params.DefaultRound);
                student['QuizResult'] = Math.round((Math.floor(totalWeightScore / totalWeight) / 100000) * round) / round;
                //student['QuizResult'] = rounding((totalWeightScore / totalWeight / 100000), 2);
                $scope.effortPairList.forEach(function (effortItem) {
                    if (!done && Number(student['QuizResult']) >= Number(effortItem.Score)) {
                        student['QuizResult_努力程度'] = effortItem.Code;
                        done = true;
                    }
                });
            }
        }

        /**
         * 儲存
         */
        $scope.save = function () {
            if ($scope.current.mode == $scope.modeList[0]) {
                // 成績管理
                $scope.saveAll();
            } else if ($scope.current.mode == $scope.modeList[1]) {
                // 平時評量
                $scope.saveGradeItemScore();
            }
        }

        /**
         * 1.儲存定期評量
         * 2.儲存文字評量 
        */
        $scope.saveAll = function () {
            var saveScoreFinish = false;
            var saveTextFinish = false;

            /**
             * 儲存定期評量
             * service會判斷此定期評量是否在成績輸入時間內
             * 如果request有未在成績輸入時間內的資料會 throw error
             */
            {
                // 資料整理
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
                                '@Score': 0,
                                Extension: {
                                    Extension: {
                                        Score: studentRec['Exam_' + examRec.ExamID],
                                        Effort: studentRec['Exam_' + examRec.ExamID + '_努力程度']
                                    }
                                }
                            };
                            eItem.Student.push(obj);
                        });
                        body.Content.Exam.push(eItem);
                    }
                });
                // 儲存
                $scope.connection.send({
                    service: "TeacherAccess.SetCourseExamScoreWithExtension",
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.SetCourseExamScoreWithExtension Error");
                        } else {
                            saveScoreFinish = true;

                            if (saveScoreFinish && saveTextFinish) {
                                // 重新取得成績資料
                                $scope.scoreDataReload();
                                alert("儲存完成。");
                            }
                        }
                    }
                });
            }

            // 儲存文字評量
            {
                // 資料整理
                var text_body = {
                    Content:
                    {
                        AttendExtension: []
                    }
                };
                [].concat($scope.studentList || []).forEach(function (studentRec, index) {

                  // 去除 ',"
                  // 如果不是空值
                  if(studentRec['Exam_文字評量']){
                      var t1 = studentRec['Exam_文字評量'].replace(/'/g, "''");
                  }
                    //   var t2 = t1.replace(/"/g, '""');

                    var obj = {
                        Extension: {
                            Extension: {
                                Text: t1
                                //Text: studentRec['Exam_文字評量'],
                                //2018/1/11 穎驊新增，平時評量 上傳邏輯
                                // OrdinarilyEffort: studentRec['Exam_平時評量_努力程度'],
                                // OrdinarilyScore: studentRec['Exam_平時評量']
                            }
                        },
                        Condition: {
                            StudentID: studentRec.StudentID,
                            CourseID: $scope.current.Course.CourseID,
                        }
                    };

                    text_body.Content.AttendExtension.push(obj);
                });
                // 儲存
                $scope.connection.send({
                    service: "TeacherAccess.SetSCAttendExtensionKH",
                    autoRetry: true,
                    body: text_body,
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.SetSCAttendExtensionKH Error");
                        } else {

                            saveTextFinish = true;
                            if (saveScoreFinish && saveTextFinish) {
                                // 重新取得成績資料
                                $scope.scoreDataReload();
                                alert("儲存完成。");
                            }
                        }
                    }
                });
            }
        }

        /**
         * 儲存平時評量
         * 1. 儲存平時評量成績、努力程度
         * 2. 儲存小考成績
         */
        $scope.saveGradeItemScore = function () {
            $scope.SetSCAttendExtensions().then(function (result1) {
                return $scope.SetSCAttendExtensionKH().then(function (result2) {
                    // 處理小考不一致
                    if ($scope.checkItemChange)
                        $scope.saveGradeItemConfigA();

                    // 資料Reload
                    $scope.scoreDataReload();




                    $scope.checkItemChange = false;
                    alert("儲存成功。");
                });
            }).catch((reason) => {
                alert(reason);
            });
        }

        // 1. 平時評量分數
        $scope.SetSCAttendExtensions = function () {
            return new Promise(function (resolve, reject) {
                var extensionsBody = {
                    Request: {
                        SCAttendExtension: []
                    }
                };
                [].concat($scope.studentList || []).forEach(function (stuRec, index) {

                    var objs = {
                        '@CourseID': $scope.current.Course.CourseID,
                        '@StudentID': stuRec.StudentID,
                        Extension: {
                            '@Name': 'GradeBook',
                            Exam: {
                                '@Score': stuRec['QuizResult'] == undefined ? '' : stuRec['QuizResult'],
                                '@Degree': stuRec['QuizResult_努力程度'] == undefined ? '' : stuRec['QuizResult_努力程度'],
                                Item: []
                            }
                        }
                    };
                    [].concat($scope.gradeItemList || []).forEach(function (item) {
                        var obj = {
                            '@SubExamID': item.SubExamID,
                            '@Score': stuRec[item.ExamID] == undefined ? '' : stuRec[item.ExamID]
                        }

                        objs.Extension.Exam.Item.push(obj);
                    });

                    extensionsBody.Request.SCAttendExtension.push(objs);
                });
                $scope.connection.send({
                    service: "TeacherAccess.SetSCAttendExtensions",
                    autoRetry: true,
                    body: extensionsBody,
                    result: function (response, error, http) {
                        if (error) {
                            reject("TeacherAccess.SetSCAttendExtensions Error");
                        } else {
                            resolve("平時評量儲存成功");
                        }
                    }
                });
            });
        }

        // 2. 儲存小考分數
        $scope.SetSCAttendExtensionKH = function () {
            return new Promise(function (resolve, reject) {
                var body = {
                    SetSCAttendExtensionRequest: {
                        AttendExtension: []
                    }
                };
                [].concat($scope.studentList || []).forEach(function (stuRec, index) {
                    var data = {
                        Extension: {
                            Extension: {
                                OrdinarilyEffort: stuRec['QuizResult_努力程度'],
                                OrdinarilyScore: stuRec['QuizResult'],
                            }
                        },
                        Condition: {
                            StudentID: stuRec.StudentID,
                            CourseID: $scope.current.Course.CourseID
                        }
                    };

                    body.SetSCAttendExtensionRequest.AttendExtension.push(data);
                });
                $scope.connection.send({
                    service: "TeacherAccess.SetSCAttendExtensionKH",
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            reject("TeacherAccess.SetSCAttendExtensionKH 平時 Error");
                        } else {
                            resolve("平時評量結算成功。");
                        }
                    }
                });
            });
        }

        /**開啟文字代碼表畫面 */
        $scope.openCommentCode = function () {

            [].concat($scope.examTextList || []).forEach(function (ext) {
                ext.Selected = false;
            });

            $('#textCodeModal').modal('show');
            // var commentCode = window.open("commentCode.html", "commentCode", "width=600,height=500");

            // // commentCode.setMappingTable($scope.examTextList);

            // $scope.connection.send({
            //     service: "TeacherAccess.GetExamTextScoreMappingTable",
            //     body: {
            //         Content: {}
            //     },
            //     result: function (response, error, http) {
            //         if (error !== null) {
            //             alert("TeacherAccess.GetExamTextScoreMappingTable Error");
            //             commentCode.close();
            //         } else {
            //             if (response !== null && response.Response !== null && response.Response !== ''){
            //                 commentCode.setMappingTable(response.Response.TextMappingTable);
            //             }   
            //             else {
            //                 commentCode.close();
            //             }
            //         }
            //     }
            // });
        }

        // 取得評量小考設定
        getCourseExam2020 = function (course) {
            return new Promise((r, j) => {
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
                        var ItemList = [];
                        if (error) {
                            alert("TeacherAccess.GetCourseExtensions Error");
                            j(false);
                        } else {
                            [].concat(response.Response.CourseExtension.Extension || []).forEach(function (extensionRec) {


                                // 平時評量項目 gradeItemList
                                if (extensionRec.Name == 'GradeItem') {
                                    // 檢查課程是否有設定小考試別
                                    if (extensionRec.GradeItem) {
                                        [].concat(extensionRec.GradeItem.Item || []).forEach((item) => {
                                            var targetExam = $scope.examList.find(exam => exam.ExamID == item.ExamID);
                                            var gradeItem = {
                                                RefExamID: item.ExamID, // 定期評量編號
                                                ExamID: `Exam_${item.ExamID}_Quiz_${item.SubExamID}`,
                                                SubExamID: item.SubExamID, // 平時評量編號
                                                Name: item.Name,
                                                Index: item.Index,
                                                Weight: item.Weight,
                                                Type: 'Number',
                                                Permission: 'Editor',
                                                Lock: targetExam ? targetExam.Lock : false,
                                                SubVisible: true
                                            };
                                            if (item.Name != '成績_1') {
                                                ItemList.push(gradeItem);
                                            }

                                        });
                                    }
                                }

                            });

                            var value = {
                                CourseID: course.CourseID,
                                CourseName: course.CourseName,
                                Scores: course.Scores,
                                ItemList: ItemList
                            }
                            r(value);
                        }
                    }
                });
            });
        }

        $scope.openCopyModal = function () {
            $scope.CourseExamList = [];
            $scope.CanSelectCourseExamList = [];
            var currItemName = $scope.current.Course.CourseName
            var idx = 1;

            // 取得教師所屬所有課程的小考
            const coArray = $scope.courseList.map(course => {
                return getCourseExam2020(course);
            });

            Promise.all(coArray).then(val => {
                $scope.$apply(function () {
                    val.forEach(function (courseRec) {
                        var itemName = courseRec.CourseName
                        var itemDisable = false;

                        if (courseRec.ItemList && courseRec.ItemList.length > 0) {
                            itemDisable = true;
                        }

                        var item = {
                            id: idx,
                            CourseID: courseRec.CourseID,
                            CourseName: courseRec.CourseName,
                            Name: itemName,
                            SubItemLst: courseRec.ItemList,
                            Selected: false,
                            ItemDisable: itemDisable
                        }
                        if (currItemName !== itemName) {
                            $scope.CanSelectCourseExamList.push(item);
                        }

                        $scope.CourseExamList.push(item);
                        idx = idx + 1;



                    });
                    $('#copyModal').modal('show');
                });
            });

            // $('#copyModal').modal('show');
        }

        $scope.closeCopyModal = function () {
            this.CanSelectCourseExamList.forEach(function (course) {
                course.Selected = false;
            });
            $('#copyModal').modal('hide');
        }

        $scope.copyGradeItemConfig = function () {
            var selectedCourse = [];
            // 取得勾選的課程清單
            [].concat($scope.CanSelectCourseExamList || []).forEach(function (course) {
                if (course.Selected) {
                    selectedCourse.push(course.CourseID);
                }
            });

            selectedCourse.forEach(function (courseID) {
                // 資料整理
                var body = {
                    Content: {
                        CourseExtension: {
                            '@CourseID': courseID
                            , Extension: {
                                '@Name': 'GradeItem'
                                , GradeItem: {
                                    Item: []
                                }
                            }
                        }
                    }
                };
                $scope.gradeItemList.forEach(function (item) {
                    body.Content.CourseExtension.Extension.GradeItem.Item.push({
                        '@SubExamID': item.SubExamID == '' ? item.Name : item.SubExamID,
                        '@Name': item.Name,
                        '@Weight': item.Weight,
                        '@Index': item.Index
                    });
                });
                saveGradeItem(body).then();
            });

            $scope.closeCopyModal();
            $('#saveSuccessModal').modal('show');
        }

        saveGradeItem = function (body) {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.SetCourseExtensions",
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            alert("TeacherAccess.SetCourseExtensions Error");
                            j(false);
                        } else {
                            r(true);
                        }
                    }
                });
            });
        }

        /**
         * 選擇文字代碼
         * 1. 代碼轉換
        */
        $scope.selectCode = function (ext) {
            ext.Selected = true;
            if ($scope.current.Value) {
                $scope.current.Value += `,${ext.Code}`;
            } else {
                $scope.current.Value = ext.Code;
            }

            $scope.textChangeEvent();
            $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;
        }

        /**試別篩選 */
        $scope.filterPermission = function (examItem) {
            return (examItem.Permission == 'Read' || examItem.Permission == 'Editor') && ($scope.current.VisibleExam && $scope.current.VisibleExam.indexOf(examItem.Name) >= 0);
        }

        // 小考選項初始化
        $scope.GradeItemConfigInit = function () {
            $scope.gradeItemConfig = {
                Item: []
                , OriginItem: []
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
                        Name: ''
                        , Weight: '1'
                        , SubExamID: ''
                        , Index: $scope.gradeItemConfig.Item.length + 1
                        , ExamID: ''
                        , isNewOne :true
                    });
                }
                , JSONMode: function () {
                    $scope.gradeItemConfig.Mode = 'JSON';
                    var jsonList = [];
                    $scope.gradeItemConfig.Item.forEach(function (item) {
                        jsonList.push({
                            Name: item.Name
                            , Weight: item.Weight
                            , SubExamID: item.Name
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
                , CheckConfig: function () {
                    var jsonCode = angular.toJson($scope.gradeItemConfig.Item);
                    var originJsonCode = angular.toJson($scope.gradeItemConfig.OriginItem);

                    return jsonCode === originJsonCode;
                }
            };
        }
        /**
         * 顯示編輯評分項目
         */
        $scope.showGradeItemConfig = function () {

            $scope.GradeItemConfigInit();

            // $scope.gradeItemConfig = {
            //     Item: []
            //     , OriginItem: []
            //     , Mode: 'Editor'
            //     , JSONCode: ''
            //     , DeleteItem: function (item) {
            //         var index = $scope.gradeItemConfig.Item.indexOf(item);
            //         if (index > -1) {
            //             $scope.gradeItemConfig.Item.splice(index, 1);
            //         }
            //     }
            //     , AddItem: function () {
            //         $scope.gradeItemConfig.Item.push({
            //             Name: ''
            //             , Weight: '1'
            //             , SubExamID: ''
            //             , Index: $scope.gradeItemConfig.Item.length + 1
            //         });
            //     }
            //     , JSONMode: function () {
            //         $scope.gradeItemConfig.Mode = 'JSON';
            //         var jsonList = [];
            //         $scope.gradeItemConfig.Item.forEach(function (item) {
            //             jsonList.push({
            //                 Name: item.Name
            //                 , Weight: item.Weight
            //                 , SubExamID: item.SubExamID
            //                 , Index: item.Index
            //             });
            //         });
            //         $scope.gradeItemConfig.JSONCode = JSON.stringify(jsonList, null, '    ');
            //     }
            //     , CommitJSON: function () {
            //         var jsonParse;
            //         var jsonList = [];
            //         try {
            //             jsonParse = JSON.parse($scope.gradeItemConfig.JSONCode);
            //         }
            //         catch (error) {
            //             alert('Syntax Error' + error);
            //             return;
            //         }
            //         if (jsonParse.length || jsonParse.length === 0) {
            //             jsonList = [].concat(jsonParse);
            //         }
            //         else {
            //             alert('Parse Error');
            //             return;
            //         }
            //         $scope.gradeItemConfig.Item = [];
            //         jsonList.forEach(function (item) {
            //             $scope.gradeItemConfig.Item.push({
            //                 Name: item.Name
            //                 , Weight: item.Weight
            //                 , SubExamID: item.SubExamID
            //                 , Index: item.Index
            //             });
            //         });
            //         $scope.gradeItemConfig.Mode = 'Editor';
            //     }
            //     , CheckConfig: function () {
            //         var jsonCode = angular.toJson($scope.gradeItemConfig.Item);
            //         var originJsonCode = angular.toJson($scope.gradeItemConfig.OriginItem);

            //         return jsonCode === originJsonCode;
            //     }
            // };

            // 整理小考資料
            [].concat($scope.gradeItemList || []).forEach(function (item) {
                $scope.gradeItemConfig.Item.push(angular.copy(item));
                $scope.gradeItemConfig.OriginItem.push(angular.copy(item));
            });
            $('#editScoreItemModal').modal('show');
        }

        /**
         * 儲存評分項目A
         */
        $scope.saveGradeItemConfigA = function () {
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

            // 當都沒有資料，預設成績1
            if ($scope.gradeItemConfig.Item.length === 0) {
                var item = {
                    ExamID: "Quiz_成績_1",
                    Index: "1",
                    Lock: false,
                    Name: "成績_1",
                    Permission: "Editor",
                    SubExamID: "成績_1",
                    Type: "Number",
                    Weight: "1"
                };
                $scope.gradeItemConfig.Item.push(item);
            }

            $scope.gradeItemConfig.Item.forEach(function (item) {

                if (item.ExamID == '') {
                    item.ExamID = "Quiz_" + item.Name;
                }

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

                    if (examNameList.indexOf(item.Name) > -1) {
                        dataRepeat = true;
                        repeatExamName = item.Name;
                    }
                    examNameList.push(item.Name);

                    body.Content.CourseExtension.Extension.GradeItem.Item.push({
                        '@SubExamID': item.SubExamID == '' ? item.Name : item.SubExamID,
                        '@Name': item.Name,
                        '@Weight': item.Weight,
                        '@Index': item.Index,
                        '@ExamID': 'Quiz_' + item.Name
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
                                // 重新取得平時評量項目，並重新結算平時評量成績                                
                                $scope.getGradeItemList().then(value => {
                                    //   console.log(value);
                                    $scope.$apply(function () {
                                        $scope.studentList.forEach(stuRec => {
                                            $scope.calcQuizResult(stuRec);
                                        });
                                    });
                                });
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

            // 當都沒有資料，預設成績1
            if ($scope.gradeItemConfig.Item.length === 0) {
                var item = {
                    ExamID: "Quiz_成績_1",
                    Index: "1",
                    Lock: false,
                    Name: "成績_1",
                    Permission: "Editor",
                    SubExamID: "成績_1",
                    Type: "Number",
                    Weight: "1"
                };
                $scope.gradeItemConfig.Item.push(item);
            }

            $scope.gradeItemConfig.Item.forEach(function (item) {

                if (item.ExamID == '') {
                    item.ExamID = "Quiz_" + item.Name;
                }

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

                    if (examNameList.indexOf(item.Name) > -1) {
                        dataRepeat = true;
                        repeatExamName = item.Name;
                    }
                    examNameList.push(item.Name);

                    body.Content.CourseExtension.Extension.GradeItem.Item.push({
                        '@SubExamID': item.SubExamID == '' ? item.Name : item.SubExamID,
                        '@Name': item.Name,
                        '@Weight': item.Weight,
                        '@Index': item.Index,
                        '@ExamID': item.ExamID
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
                                // 重新取得平時評量項目，並重新結算平時評量成績                                
                                $scope.getGradeItemList().then(value => {
                                    //   console.log(value);
                                    $scope.$apply(function () {
                                        $scope.studentList.forEach(stuRec => {
                                            $scope.calcQuizResult(stuRec);
                                        });
                                    });
                                });

                                // 檢查小考項目是否有變動
                                $scope.checkItemChange = !$scope.gradeItemConfig.CheckConfig();

                                $scope.batchItemList = [];
                                $scope.gradeItemConfig.Item.forEach(function (gradeItem) {

                                    // 小考項目
                                    var importItem = {
                                        Name: gradeItem.Name,
                                        Type: 'Function',
                                        Fn: function () {
                                            delete importItem.ParseString;
                                            delete importItem.ParseValues;
                                            $scope.batchItem = importItem;
                                            $('#importModal').modal('show');
                                        },
                                        Parse: function () {
                                            importItem.ParseString = importItem.ParseString || '';
                                            importItem.ParseValues = importItem.ParseString.split("\n");
                                            importItem.HasError = false;
                                            for (var i = 0; i < importItem.ParseValues.length; i++) {
                                                var flag = false;
                                                var temp = Number(importItem.ParseValues[i]);
                                                if (!isNaN(temp) && temp <= 100 && temp >= 0) {

                                                    if (importItem.ParseValues[i] != '') {
                                                        flag = true;
                                                    }
                                                }
                                                // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                                                if (importItem.ParseValues[i] == '-') {
                                                    flag = true;
                                                    importItem.ParseValues[i] = '';
                                                } else if (importItem.ParseValues[i] == '缺') {
                                                    flag = true;
                                                }
                                                if (flag) {
                                                    if (!isNaN(temp) && importItem.ParseValues[i] != '') {
                                                        importItem.ParseValues[i] = temp;
                                                    }
                                                }
                                                else {
                                                    importItem.ParseValues[i] = '錯誤';
                                                    importItem.HasError = true;
                                                }
                                            }
                                            $scope.studentList.forEach(function (stuRec, index) {
                                                if (index >= importItem.ParseValues.length) {
                                                    importItem.ParseValues.push('錯誤');
                                                    importItem.HasError = true;
                                                }
                                            });
                                        },
                                        Clear: function () {
                                            delete importItem.ParseValues;
                                        },
                                        Import: function () {
                                            if (importItem.HasError == true)
                                                return;
                                            $scope.studentList.forEach(function (stuRec, index) {
                                                if (!importItem.ParseValues[index] && importItem.ParseValues[index] !== 0) {
                                                    stuRec[gradeItem.ExamID] = '';
                                                } else if (importItem.ParseValues[index] === '缺') {
                                                    stuRec[gradeItem.ExamID] = '缺';
                                                }
                                                else {
                                                    stuRec[gradeItem.ExamID] = importItem.ParseValues[index];
                                                }
                                                // 平時評量成績結算
                                                $scope.calcQuizResult(stuRec);
                                            });

                                            $('#importModal').modal('hide');
                                        }
                                    };

                                    $scope.batchItemList.push(importItem);

                                });
                                $scope.checkAllTable();
                                $('#editScoreItemModal').modal('hide');
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

        /**
         * 匯出成績單
         */
        $scope.exportExcel = function () {
            // 檢查資料是否更動
            var data_changed = !$scope.checkAllTable($scope.current.mode);
            if (data_changed) {
                alert("資料尚未儲存，無法匯出報表。");
            }
            else {

                var trList = [];
                var thList1 = [];
                // 欄位資料整理
                thList1 = [
                    `<td rowspan="1" width="40px">班級</td>`,
                    `<td rowspan="1" width="40px">座號</td>`,
                    `<td rowspan="1" width="70px">姓名</td>`,
                    `<td rowspan="1" width="70px">學期成績</td>`,
                    `<td rowspan="1" width="70px">學期成績_試算</td>`,
                ];

                // 評量名稱
                if ($scope.current.Course.Scores.Score) {
                    [].concat($scope.current.Course.Scores.Score || []).forEach(function (exam) {

                        var str = `<td rowspan="1" width="70px">${exam.Name}<span style="color: #ff0000">(${exam.Percentage})</span></td>`
                        thList1.push(str)
                    });
                }

                thList1.push(`<td rowspan="1" width="70px">平時評量</td>`);
                thList1.push(`<td rowspan="1" width="70px">文字評量</td>`);


                trList.push(`<tr>${thList1.join('')}</tr>`);


                // 學生資料整理
                [].concat($scope.studentList || []).forEach(student => {
                    var studentData = [
                        `<td>${student.ClassName}</td>`,
                        `<td>${student.SeatNo}</td>`,
                        `<td>${student.StudentName}</td>`
                    ];

                    if (student['Exam_學期成績']) {
                        studentData.push(`<td>${student['Exam_學期成績']}</td>`);
                    } else {
                        studentData.push(`<td></td>`);
                    }
                    if (student['Exam_學期成績_試算']) {
                        studentData.push(`<td>${student['Exam_學期成績_試算']}</td>`);
                    } else {
                        studentData.push(`<td></td>`);
                    }

                    if ($scope.current.Course.Scores.Score) {
                        [].concat($scope.current.Course.Scores.Score || []).forEach(function (exam) {
                            var score = `<td></td>`;
                            if (student['Exam_' + exam.ExamID]) {
                                score = `<td>${student['Exam_' + exam.ExamID]}</td>`;
                            }
                            studentData.push(score);
                        });
                    }

                    if (student['Exam_平時評量']) {
                        studentData.push(`<td>${student['Exam_平時評量']}</td>`);
                    } else {
                        studentData.push(`<td></td>`);
                    }

                    if (student['Exam_文字評量']) {
                        studentData.push(`<td>${student['Exam_文字評量']}</td>`);
                    } else {
                        studentData.push(`<td></td>`);
                    }

                    trList.push(`<tr>${studentData.join('')}</tr>`);
                });

                var html = `
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    </head>
    <body>
        <table border="1" cellspacing="0" cellpadding="2">
            <tbody align="center">
                ${$scope.current.Course.SchoolYear}學年度第${$scope.current.Course.Semester}學期 ${$scope.current.Course.CourseName}
                ${trList.join('')}
            </tbody>
        </table>
        <br/>教師簽名：
    </body>
</html>`;

                saveAs(new Blob([html], { type: "application/octet-stream" }), $scope.current.Course.CourseName + '_定期評量.xls');
            }
        }

        /**
 * 匯出成績單(平時評量)
 */
        $scope.exportExcelA = function () {
            // 檢查資料是否更動
            var data_changed = !$scope.checkAllTable($scope.current.mode);
            if (data_changed) {
                alert("資料尚未儲存，無法匯出報表。");
            }
            else {

                var trList = [];
                var thList1 = [];
                // 欄位資料整理
                thList1 = [
                    `<td rowspan="1" width="40px">班級</td>`,
                    `<td rowspan="1" width="40px">座號</td>`,
                    `<td rowspan="1" width="70px">姓名</td>`,
                    `<td rowspan="1" width="70px">平時評量成績</td>`,
                ];

                // 平時評量項目
                if ($scope.gradeItemList) {
                    [].concat($scope.gradeItemList || []).forEach(function (exam) {

                        var str = `<td rowspan="1" width="70px">${exam.Name}</td>`
                        thList1.push(str)
                    });
                }

                trList.push(`<tr>${thList1.join('')}</tr>`);


                // 學生資料整理
                [].concat($scope.studentList || []).forEach(student => {
                    var studentData = [
                        `<td>${student.ClassName}</td>`,
                        `<td>${student.SeatNo}</td>`,
                        `<td>${student.StudentName}</td>`
                    ];

                    if (student['QuizResult']) {
                        studentData.push(`<td>${student['QuizResult']}</td>`);
                    } else {
                        studentData.push(`<td></td>`);
                    }

                    if ($scope.gradeItemList) {
                        [].concat($scope.gradeItemList || []).forEach(function (exam) {
                            var score = `<td></td>`;
                            if (student[exam.ExamID]) {
                                score = `<td>${student[exam.ExamID]}</td>`;
                            }
                            studentData.push(score);
                        });
                    }

                    trList.push(`<tr>${studentData.join('')}</tr>`);
                });

                var html = `
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    </head>
    <body>
        <table border="1" cellspacing="0" cellpadding="2">
            <tbody align="center">
                ${$scope.current.Course.SchoolYear}學年度第${$scope.current.Course.Semester}學期 ${$scope.current.Course.CourseName}
                ${trList.join('')}
            </tbody>
        </table>
        <br/>教師簽名：
    </body>
</html>`;

                saveAs(new Blob([html], { type: "application/octet-stream" }), $scope.current.Course.CourseName + '_平時評量.xls');
            }
        }

        $scope.checkSaveD = function () {
            var value = $scope.checkAllTable();
            if ($scope.current.mode === '平時評量') {
                // 需要再檢查評分項目
                if (value) {
                    value = !$scope.checkItemChange;
                }

                //  console.log($scope.checkItemChange);
            }

            return value;
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

        $scope.changeSelectMode = function (mode) {
            $scope.current.SelectMode = mode;
            $timeout(function () {
                $('.pg-seatno-textbox:visible').select().focus();
            }, 1);
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
            }, 100);
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

        gadget.onLeave(function () {
            var data_changed = !$scope.checkAllTable($scope.current.mode);

            if (data_changed) {
                return "尚未儲存資料，現在離開視窗將不會儲存本次更動";
            }
            else {
                return "";
            }
        });

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
    })
    .directive('scoreStress', function () {
        return {
            restrict: 'A',
            scope: {
                'score-type': '=',
                'score-background': '=',
                'score-name': '='
            },
            link: function (scope, element, attrs) {
                const funChangeCSS = function () {
                    element.removeClass('score-red');
                    element.removeClass('text-red');
                    element.removeClass('backgroud-pink');

                    if (attrs.scoreName === '學期成績' || attrs.scoreName === '學期成績_試算' || (attrs.scoreName === '成績_1' && attrs.scoreType === 'Number')) {
                        element.addClass('backgroud-pink');
                    }
                    if (attrs.scoreType !== 'Text') {
                        if ($.isNumeric(attrs.scoreStress)) {
                            if (Number(attrs.scoreStress) < 60 || Number(attrs.scoreStress) > 100) {
                                element.removeClass('backgroud-pink');
                                if (attrs.scoreBackground === 'none') {
                                    element.addClass('text-red');
                                } else {
                                    element.addClass('score-red');
                                }
                            }
                        }
                    }
                };

                attrs.$observe('scoreType', function (newValue) {
                    funChangeCSS();
                });
                attrs.$observe('scoreStress', function (newValue) {
                    funChangeCSS();
                });
                attrs.$observe('scoreBackground', function (newValue) {
                    funChangeCSS();
                });
                attrs.$observe('scoreName', function (newValue) {
                    funChangeCSS();
                });
            }
        };
    });

