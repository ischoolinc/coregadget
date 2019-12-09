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
                    StudentScoreTag: "成績身分:一般生"
                },
                Exam: {
                    Name: 'Midterm',
                    Range: {
                        Max: 100,
                        Min: 0
                    }
                },
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
            process: [{}]
        };

        $scope.current = {
            SelectMode: "Seq.",
            SelectSeatNo: "",
            Value: "",
            Student: null,
            Exam: null,
            Course: null
        };
        $scope.params = gadget.params;
        $scope.params.DefaultRound = gadget.params.DefaultRound || '2';
        $scope.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;
        $scope.modeList = ['成績管理', '平時評量'];
        $scope.current.mode = '成績管理';
        $scope.connection = gadget.getContract("ta");

        // 四捨五入
        function rounding(val, precision) {
            return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
        }

        /** 
         * 1. 取得目前學年度學期 GetCurrentSemester
         * 2. 取得授課課程 GetMyCourses
         * 3. 設定目前課程 SetCurrentCourse
         */
        new Promise((r, j) => {
            $scope.connection.send({
                service: "TeacherAccess.GetCurrentSemester",
                autoRetry: true,
                body: '',
                result: function (response, error, http) {

                    if (error) {
                        alert("TeacherAccess.GetCurrentSemester Error");
                        j(error);
                    } else {
                        r(response);
                    }
                }
            });
        }).then((rsp) => {
            var schoolYear = rsp.Current.SchoolYear;
            var semester = rsp.Current.Semester;

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

                            if ($scope.courseList.length == 0) {
                                // 本學期沒有任何課程
                                $scope.HasNoCourse = true;
                            } else {
                                $scope.setCurrentCourse($scope.courseList[0]);
                            }
                        });
                    }
                }
            });
        });

        /**
         * 設定目前課程
         * 整理試別項目 examList
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

            $scope.current.Student = null;
            $scope.studentList = null;
            $scope.current.VisibleExam = [];
            $scope.current.Course = course;
            // 課程評分樣板：定期評量清單
            $scope.templateList = [];
            $scope.examList = [];
            // 全部評量Exam的 子項目
            $scope.gradeItemList = [];
            // 目前評量Exam 的子項目
            $scope.current.gradeItemList = [];

            // --?
            // 假如有目前試別的話 先將平均分數歸零
            // if ($scope.current.Exam) {
            //     $scope.current.Exam.avgScore = '';
            // }

            // 學期成績
            {
                var finalScore = {
                    ExamID: '學期成績',
                    Name: '學期成績',
                    Type: 'Number',
                    Permission: 'Editor',
                    Lock: !(course.AllowUpload == '是' && new Date(course.InputStartTime) < new Date() 
                        && new Date() < new Date(course.InputEndTime)), 
                    totalScore: 0, 
                    totalStudent: 0
                };
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
                            var s = stu['Exam' + examRec.ExamID];
                            if (stu['Exam' + examRec.ExamID] != '缺')
                                if (stu['Exam' + examRec.ExamID] || stu['Exam' + examRec.ExamID] == '0') {
                                    total += seed * p * Number(stu['Exam' + examRec.ExamID]);
                                    base += p;
                                }
                        });
                        if (base) {
                            var round = Math.pow(10, $scope.params[finalScorePreview.Name + 'Round'] || $scope.params.DefaultRound);
                            stu['Exam' + finalScorePreview.ExamID] = Math.round((Math.floor(total / base) / seed) * round) / round;
                        } else {
                            stu['Exam' + finalScorePreview.ExamID] = "";
                        }
                    }
                };

                $scope.examList.push(finalScore, finalScorePreview);
                $scope.current.VisibleExam.push('學期成績', '學期成績_試算');
            }

            // 定期評量
            {
                $scope.templateList = [].concat(course.Scores.Score || []).map((temp) => {
                    temp.isSubScoreMode = false;
                    return temp;
                });
                $scope.templateList.forEach(function (examRec) {
                    // 定期評量
                    var exam = {
                        ExamID: examRec.ExamID,
                        Name: examRec.Name,
                        Type: 'Number',
                        Permission: 'Editor',
                        Lock: !(new Date(examRec.InputStartTime) < new Date() && new Date() < new Date(examRec.InputEndTime)),
                        totalStudent: 0,
                        totalScore: 0,
                        avgScore: '',
                        InputStartTime: examRec.InputStartTime,
                        InputEndTime: examRec.InputEndTime,
                        isSubScoreMode: false
                    };
                    $scope.examList.push(exam);
                    $scope.current.VisibleExam.push(examRec.Name);

                    // 文字評量
                    if (examRec.Extension) {
                        if (examRec.Extension.Extension.UseText == "是") {
                            var subExamRec = {
                                ExamID: examRec.ExamID + '_文字評量',
                                Name: examRec.Name + '_文字評量',
                                SubName: '文字評量',
                                Type: 'Text',
                                Group: examRec,
                                Permission: 'Editor',
                                Lock: examRec.Lock
                            };
                            // exam.SubExamList.push(subExamRec)
                            $scope.examList.push(subExamRec);
                            $scope.current.VisibleExam.push(subExamRec.Name);
                        }
                    }   

                    // 平時評量
                    var quizResult = {
                        RefExamID: examRec.ExamID,
                        ExamID: 'QuizResult_' + examRec.ExamID,
                        Name: '平時評量_試算',
                        Type: 'Number',
                        Permission: 'Program',
                        Lock: false
                    };
                    $scope.gradeItemList.push(quizResult);
                    // $scope.examList.push(quizResult);
                });
            }

            $scope.getGradeItemList();
        }

        /**
         * service GetCourseExtensions
         * 平時評量成績 Name="GradeItem"
         * 高中讀卡模組設定 Name="GradeItemExtension"
         */
        $scope.getGradeItemList = function () {
            $scope.connection.send({
                service: "TeacherAccess.GetCourseExtensions",
                autoRetry: true,
                body: {
                    Content: {
                        ExtensionCondition: {
                            '@CourseID': '' + $scope.current.Course.CourseID,
                            Name: ['GradeItemExtension', 'GradeItem']
                        }
                    }
                },
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.GetCourseExtensions Error");
                    } else {
                        [].concat(response.Response.CourseExtension.Extension || []).forEach(function (extensionRec) {
                            // 平時評量項目 gradeItemList
                            if (extensionRec.Name == 'GradeItem') {
                                // 檢查課程是否有設定小考試別
                                // extensionRec.GradeItem.Item
                                if (extensionRec.GradeItem) {
                                    [].concat(extensionRec.GradeItem.Item || []).forEach((item) => {
                                        var targetExam = $scope.examList.find(exam => exam.ExamID == item.ExamID);
                                        var gradeItem = {
                                            RefExamID: item.ExamID, // 定期評量編號
                                            ExamID: 'Quiz_' + item.SubExamID, 
                                            SubExamID: item.SubExamID, // 平時評量編號
                                            Name: item.Name,
                                            Index: item.Index,
                                            Weight: item.Weight,
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            Lock: targetExam ? targetExam.Lock : false
                                        };
    
                                        $scope.gradeItemList.push(gradeItem);
                                    });    
                                }
                            }
                            // 讀卡成績項目 examList
                            if (extensionRec.Name == 'GradeItemExtension') {
                                [].concat(extensionRec.GradeItemExtension || []).forEach((item) => {
                                    var index = $scope.examList.findIndex((exam) => exam.ExamID == item.ExamID);
                                    var index2 = $scope.templateList.findIndex((temp) => temp.ExamID == item.ExamID);
                                    if (index > -1) {

                                        var targetExam = $scope.examList[index];
                                        var examCScore = {
                                            ExamID: targetExam.ExamID + 'CScore',
                                            Name: targetExam.Name + '讀卡',
                                            SubName: '讀卡',
                                            Group: targetExam,
                                            Type: 'Number',
                                            Permission: 'Read',
                                            Lock: targetExam.Lock
                                        };
                                        var examPScore = {
                                            ExamID: targetExam.ExamID + 'PScore',
                                            Name: targetExam.Name + '試卷',
                                            SubName: '試卷',
                                            Group: targetExam,
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            Lock: targetExam.Lock
                                        };

                                        $scope.examList.splice(index + 1, 0, examCScore, examPScore);
                                        $scope.current.VisibleExam.splice(index + 1, 0, examCScore.Name, examPScore.Name);
                                    }
                                    if(index2 > -1) {
                                        $scope.templateList[index2].isSubScoreMode = true;
                                    }
                                });
                            }
                        });

                        $scope.dataReload();
                    }

                    // --?
                    // 設定目前定期評量 
                    if ($scope.current.mode == '平時評量') {
                        $scope.setCurrentTemplate($scope.templateList[0]);
                    }
                }
            });
        }

        /** 
         * GetCourseStudents 取得課程學生
         * GetCourseExamScore 取得定期評量成績
         * GetCourseSemesterScore 取得學期成績
         * GetSCAttendExtensions 取得小考成績
         * setupCurrent
         */
        $scope.dataReload = function() {
            // Init avgScore
            $scope.examList = $scope.examList.map((exam) => {
                exam.totalScore = 0;
                exam.totalStudent = 0;
                exam.avgScore = '';
                return exam;
            });
            // 取得課程學生
            $scope.connection.send({
                service: "TeacherAccess.GetCourseStudents",
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
                                // studentRec Init
                                {
                                    $scope.examList.forEach(function (examRec) {
                                        studentRec['Exam' + examRec.ExamID] = '';
                                    });
                                    $scope.gradeItemList.forEach((item) => {
                                        studentRec[item.ExamID] = '';
                                    });
                                }
                                $scope.studentList.push(studentRec);
                                studentMapping[studentRec.StudentID] = studentRec;
                            });

                            // 學生排序
                            $scope.studentList.sort((a, b) => {
                                if (Number(a.SeatNo) > Number(b.SeatNo)) {
                                    return 1;
                                }
                                if (Number(a.SeatNo) < Number(b.SeatNo)) {
                                    return -1;
                                }
                                return 0;
                            });
                            $scope.studentList.sort((a, b) => {
                                if (a.ClassName > b.ClassName) {
                                    return 1;
                                }
                                if (a.ClassName < b.ClassName) {
                                    return -1;
                                }
    
                                return 0;
                            });
    
                            // 取得定期評量成績
                            var getCourseExamScore = new Promise((r, j) => {
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
                                                [].concat(response.Scores.Item || []).forEach(function (examScoreRec) {
                                                    // 評量分數
                                                    studentMapping[examScoreRec.StudentID]['Exam' + examScoreRec.ExamID] = examScoreRec.Score;
                                                    // 文字評量
                                                    studentMapping[examScoreRec.StudentID]['Exam' + examScoreRec.ExamID + '_文字評量'] = examScoreRec.Extension.Extension.Text == undefined ? '' : examScoreRec.Extension.Extension.Text;

                                                    // 子評量分數 (讀卡)
                                                    $scope.examList.forEach(function (examRec) {
                                                        if (examRec.ExamID == examScoreRec.ExamID) {
                                                            studentMapping[examScoreRec.StudentID]['Exam' + examScoreRec.ExamID + 'PScore'] = examScoreRec.Extension.Extension.PScore == undefined ? '' : examScoreRec.Extension.Extension.PScore;
                                                            studentMapping[examScoreRec.StudentID]['Exam' + examScoreRec.ExamID + 'CScore'] = examScoreRec.Extension.Extension.CScore == undefined ? '' : examScoreRec.Extension.Extension.CScore;
                                                        }
                                                    });
                                                    // 分數加總、人數加總
                                                    var index = $scope.examList.findIndex((exam) => exam.ExamID == examScoreRec.ExamID);
                                                    if (index > -1) {
                                                        var totalScore = Number(examScoreRec.Score);
                                                        $scope.examList[index].totalStudent += 1;
                                                        $scope.examList[index].totalScore += totalScore;
                                                    }
                                                });
                                            });
                                            r(true);
                                        }
                                    }
                                });
                            });
                            // 取得學期成績
                            var getCourseSemesterScore = new Promise((r, j) => {
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
                                                [].concat(response.Scores.Item || []).forEach(function (finalScoreRec) {
                                                    studentMapping[finalScoreRec.StudentID]['Exam學期成績'] = finalScoreRec.Score;
                                                    // 分數加總、人數加總
                                                    var index = $scope.examList.findIndex((exam) => exam.ExamID == '學期成績');
                                                    if (index > -1) {
                                                        var totalScore = Number(finalScoreRec.Score);
                                                        $scope.examList[index].totalStudent += 1;
                                                        $scope.examList[index].totalScore += totalScore;
                                                    }
                                                });
                                            });
                                            r(true);
                                        }
                                    }
                                });
                            });
                            // 取得小考分數
                            var getScAttendExtensions = new Promise((r, j) => {
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
                                                [].concat(response.Response.SCAttendExtension || []).forEach(function (item) {
                                                    [].concat(item.Extension.Exam || []).forEach((exam) => {
                                                        // 平時評量成績：為小考結算後分數
                                                        studentMapping[item.StudentID]['QuizResult_' + exam.ExamID] = (exam.Score || '');
                                                        // 平時評量-小考成績
                                                        [].concat(exam.Item || []).forEach(e => {
                                                            studentMapping[item.StudentID]['Quiz_' + e.SubExamID] = (e.Score || '');
                                                        });
                                                    });
                                                });
                                                r(true);
                                            });
                                        }
                                    }
                                });
                            });
                            
                            // 備份學生原始資料
                            Promise.all([getCourseExamScore, getCourseSemesterScore, getScAttendExtensions]).then(() => {
                                // 成績資料讀取完後計算平均 avgScore
                                $scope.examList.forEach(function (examRec) {
                                    if (examRec.totalStudent > 0) {
                                        examRec.avgScore = rounding((examRec.totalScore / examRec.totalStudent), 2)
                                    }
                                    else {
                                        examRec.avgScore = '';
                                    }
                                });
                                $scope.dataBackUp();
                            });
                        });
                    }
                }
            });
        } 

        /** 
         * 1. 備份學生原始資料
         * 2. setupCurrent 
         */
        $scope.dataBackUp = function () {
            $scope.studentList.forEach(function (studentRec) {
                var rawStudentRec = angular.copy(studentRec);
                for (var key in rawStudentRec) {
                    if (!key.match(/Origin$/gi)) {
                        studentRec[key + 'Origin'] = studentRec[key];
                    }
                }
            });
            // 設定目前資料項目
            $scope.setupCurrent();
        }

        $scope.setupCurrent = function () {
            if ($scope.studentList && $scope.examList) {
                $scope.calc();
                if (!$scope.current.Student && !$scope.current.Exam) {
                    // 設定預設資料顯示
                    var ts, te;
                    if ($scope.studentList) {
                        ts = $scope.studentList[0];
                    }

                    /**
                     * 設定目前試別 
                     * 1. 成績管理模式 試別來自 examList
                     * 2. 平時評量模式 試別來自 gradeItemList
                     */
                    // 成績管理模式
                    if ($scope.current.mode == '成績管理') {
                        $scope.examList.forEach(function (e) {
                            if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program') {
                                te = e;
                            }
                        });
                    }
                    // 平時評量模式
                    else if ($scope.current.mode == '平時評量') {
                        $scope.current.gradeItemList.forEach(function (e) {
                            if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program') {
                                te = e;
                            }
                        });
                    }

                    if (ts && te) {
                        $scope.setCurrent(ts, te, true, true);
                    }
                }
                else {
                    var ts = $scope.current.Student;
                    var te;
                    if (!ts && $scope.studentList && $scope.studentList.length > 0) {
                        ts = $scope.studentList[0];
                    }

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

        $scope.setCurrent = function (student, exam, setCondition, setFocus) {
            $scope.current.Exam = exam;
            $scope.current.Student = student;

            var val;

            if ($scope.current.mode == '成績管理') { // 成績管理模式
                val = (student || {})['Exam' + (exam || {}).ExamID];
            }
            else if ($scope.current.mode == '平時評量') { // 平時評量模式
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

        /** 學期成績試算 */
        $scope.calc = function () {
            [].concat($scope.examList).reverse().forEach(function (examItem) {
                if (examItem.Permission == "Editor" && !!!examItem.Lock && examItem.Type == "Program") {
                    $scope.studentList.forEach(function (stuRec) {
                        examItem.Fn(stuRec);
                    });
                }
            });
        }

        /**
        * 模式切換
        * 成績管理模式、平時評量模式
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

                // 假如切回去 成績管理模式 ， 把目前的 template 設回空，讓下次切換時，在下面重抓
                if ($scope.current.mode == '成績管理') {
                    $scope.current.template = null;
                }

                // 資料Reload (模式切換，依然是目前的課程，會自動帶入目前第一個開放的試別)
                $scope.setCurrentCourse($scope.current.Course);

                // 設定目前定期評量 
                if ($scope.current.mode == '平時評量') {
                    var template = $scope.templateList.filter(template => template.ExamID == $scope.current.Exam.ExamID)[0];
                    $scope.setCurrentTemplate(template);
                }

                // 目前選擇的試別清空
                $scope.current.Exam = null;
                $scope.setupCurrent();
            }
        }

        /** 
         * 儲存定期評量成績 SetCourseExamScoreWithExtension
         * 儲存學期成績(課程成績) SetCourseSemesterScore
         */
        $scope.saveAll = function () {
            // 儲存定期評量成績
            var SetCourseExamScoreWithExtension = new Promise((r, j) => {
                var body = {
                    Content: {
                        '@CourseID': $scope.current.Course.CourseID,
                        Exam: []
                    }
                };
                $scope.templateList.forEach(function (examRec, index) {
                    if (!examRec.Lock) {
                        var eItem = {
                            '@ExamID': examRec.ExamID,
                            Student: []
                        };
                        [].concat($scope.studentList || []).forEach(function (studentRec) {
                            var data = {
                                '@StudentID': studentRec.StudentID,
                                '@Score': studentRec['Exam' + examRec.ExamID],
                                Extension: {
                                    Extension: {
                                        Score: studentRec['Exam' + examRec.ExamID]
                                        , Text: studentRec['Exam' + examRec.ExamID + '_文字評量']
                                    }
                                }
                            };
                            // 是否為讀卡子成績項目
                            if (examRec.isSubScoreMode) {
                                data.Extension.Extension['CScore'] = studentRec['Exam' + examRec.ExamID + 'CScore'];
                                data.Extension.Extension['PScore'] = studentRec['Exam' + examRec.ExamID + 'PScore'];
                            }
                            eItem.Student.push(data);
                        });
                        body.Content.Exam.push(eItem);
                    }
                });
                $scope.connection.send({
                    service: 'TeacherAccess.SetCourseExamScoreWithExtension',
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            alert('TeacherAccess.SetCourseExamScoreWithExtension Error');
                            j(false);
                        } else {
                            r(true);
                        }
                    }
                });
            });
            // 儲存學期成績(課程成績)
            var SetCourseSemesterScore = new Promise((r, j) => {
                var body = {
                    Content: {
                        Course: {
                            '@CourseID': $scope.current.Course.CourseID,
                            Student: []
                        }
                    }
                };
                [].concat($scope.studentList || []).forEach(function (studentRec) {
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
                            alert("TeacherAccess.SetCourseSemesterScore Error");
                            j(false);
                        } else {
                            r(true);
                        }
                    }
                });
            });

            if ($scope.current.Course.AllowUpload == '是' 
                && new Date($scope.current.Course.InputStartTime) < new Date() 
                && new Date() < new Date($scope.current.Course.InputEndTime)) {
                Promise.all([SetCourseSemesterScore, SetCourseExamScoreWithExtension]).then(() => {
                    $scope.dataReload();
                    alert("儲存完成。");
                });
            } else {
                SetCourseExamScoreWithExtension.then(() => {
                    $scope.dataReload();
                    alert("儲存完成。");
                });
            }
        }

        /** 顯示子成績項目 */
        $scope.showSubExam = function (exam) {
            $scope.examList.forEach((examRec) => {
                if (examRec.Group) {
                    if (examRec.Group.ExamID == exam.ExamID) {
                        examRec.SubVisible = !examRec.SubVisible;
                    }
                }
            });
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
                if ($scope.current.Value == "缺") {
                    flag = true;
                }
                if (flag) {
                    if ($scope.current.Value != "" && $scope.current.Value != "缺") {
                        $scope.current.Value = temp;
                    }
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                $scope.submitGrade();
            }
        }

        $scope.submitGrade = function (matchNext) {
            if ($scope.current.mode == '成績管理') {

                $scope.current.Student['Exam' + $scope.current.Exam.ExamID] = $scope.current.Value;

                if ($scope.current.Exam.Group) {
                    var examRec = $scope.current.Exam.Group;
                    // 取得定期評量
                    var template = $scope.templateList.find((temp) => temp.ExamID == examRec.ExamID) || {};
                    if (template && template.isSubScoreMode) {
                        var ps = $scope.current.Student['Exam' + template.ExamID + 'PScore'] * 1;
                        var cs = $scope.current.Student['Exam' + template.ExamID + 'CScore'] * 1;
                        $scope.current.Student['Exam' + template.ExamID] = ps + cs;    
                    }
                }

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
            else {
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

        // -------- *

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

                // 定期評量改變後：目前學生不變、目前試別改變
                $scope.current.Exam = null;

                // 設定目前學生與目前試別
                $scope.setupCurrent();

                // 切換試別  要帶出不同的 功能
                $scope.getProcess();
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
                        , SubExamID: ''
                    });
                }
                , JSONMode: function () {
                    $scope.gradeItemConfig.Mode = 'JSON';
                    var jsonList = [];
                    $scope.gradeItemConfig.Item.forEach(function (item) {
                        /**
                         * 篩選目前定期評量 的平時評量項目
                         * 定期評量ID、平時評量ID不可給使用者調整
                         */
                        if ($scope.current.template.ExamID == item.RefExamID) {
                            jsonList.push({
                                RefExamID: item.RefExamID
                                , Name: item.Name
                                , Weight: item.Weight
                                , SubExamID: item.Name
                            });
                        }
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
                    // 1. json parse 
                    $scope.gradeItemConfig.Item = [];
                    jsonList.forEach(function (item) {
                        $scope.gradeItemConfig.Item.push({
                            RefExamID: item.RefExamID
                            , Name: item.Name
                            , Weight: item.Weight
                            , SubExamID: item.SubExamID
                        });
                    });
                    // 2. 小考設定資料整理
                    var itemList = $scope.gradeItemList.filter(item =>
                        (item.RefExamID !== $scope.current.template.ExamID)
                        && (item.Permission == 'Editor'));
                    itemList.forEach(item => {
                        $scope.gradeItemConfig.Item.push(angular.copy(item));
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

        /**
        * 匯出成績單
        */
        $scope.importAssessmentScore = function () {
            // 將入目標exam 的 分數 通通換成之前試算出來儲存的
            $scope.studentList.forEach(function (stuRec) {
                stuRec["Exam" + $scope.current.Exam.ExamID] = stuRec['QuizResult_' + $scope.current.Exam.ExamID]
            });
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
                        if (nextStudent2 == null) {
                            nextStudent2 = item;
                        }
                    }
                    else {
                        if (nextStudent == null) {
                            nextStudent = item;
                        }
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

        /** 儲存平時評量 */
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
                    var targetItemList = $scope.gradeItemList.filter(item => item.Name !== '平時評量' && item.RefExamID == template.ExamID && item.Permission !== 'Program');
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

                        // 資料Reload
                        $scope.setCurrentCourse($scope.current.Course);

                        alert('儲存完成。');
                    }
                }
            });
        }

        $scope.filterPermission = function (examItem) {
            return (examItem.Permission == "Read" || examItem.Permission == "Editor") && ($scope.current.VisibleExam && $scope.current.VisibleExam.indexOf(examItem.Name) >= 0);
        }

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

                // 匯入 (評量)
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

                // 成績管理模式  可以帶入平時成績
                if ($scope.current.mode == '成績管理') {
                    // 帶入平時成績
                    var importAssessmentScoreProcesses = [];

                    [].concat($scope.examList).forEach(function (examRec, index) {
                        if (examRec.Type == 'Number' && examRec.Permission == "Editor" && examRec.Name != '學期成績' && examRec.SubName != '試卷') {
                            var importProcess = {
                                Name: '帶入' + examRec.Name + '平時成績',
                                Type: 'Function',
                                ExamID: examRec.ExamID,
                                Fn: function () {
                                    // 將入目標exam 的 分數 通通換成之前試算出來儲存的
                                    $scope.studentList.forEach(function (stuRec) {
                                        stuRec["Exam" + importProcess.ExamID] = stuRec['QuizResult_' + importProcess.ExamID]
                                    });
                                },
                                Disabled: examRec.Lock
                            };

                            importAssessmentScoreProcesses.push(importProcess);
                        }
                    });

                    process = process.concat({
                        Name: '帶入平時成績',
                        Type: 'Header'
                    }).concat(importAssessmentScoreProcesses);

                }

                $scope.process = process;

            }
            else {
                $scope.process = [];
            }
        }

        $scope.checkAllTable = function (target) {
            var pass = true;
            var targetExamList = [];

            if (target == '成績管理') {
                targetExamList = $scope.examList;
            } else if (target == '平時評量') {
                targetExamList = $scope.gradeItemList;
            }

            [].concat(targetExamList || []).forEach(exam => {
                if (pass) {
                    [].concat($scope.studentList || []).forEach(function (stuRec) {
                        // 成績管理 的驗證
                        if (pass && target == '成績管理') {
                            pass = !!$scope.checkOneCell(stuRec, 'Exam' + exam.ExamID);
                        }

                        // 平時評量 的驗證
                        if (pass && target == '平時評量') {
                            pass = !!$scope.checkOneCell(stuRec, exam.ExamID);
                        }
                    });
                }
            });
            return pass;
        }

        $scope.checkOneCell = function (studentRec, examKey) {
            var pass = true;
            pass = (studentRec[examKey] == studentRec[examKey + 'Origin']) || (studentRec[examKey + 'Origin'] === undefined) || (examKey == "Exam學期成績_試算");
            return pass;
        }

        // 篩選評分項目 - 編輯評分項目
        $scope.filterGradeItem = function (item) {
            if ($scope.current.template) {
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
