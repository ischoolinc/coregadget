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
                VisibleExam: [],
                Table: '成績管理 or 平時評量',
                TextCatalog: '分類',
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
            }],
            haveNoCourse: true,
            examCatalogList: ['分類'],
            copyGradeItemSaving: false,
        };
        // 目前學年度
        var crrSchoolYear;
        // 目前學期
        var crrSemester;

        // 四捨五入
        function rounding(val, precision) {
            return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
        }

        $scope.isInit = true;
        $scope.connection = gadget.getContract("ta");
        $scope.params = gadget.params;
        // 成績計算取小數後第幾位
        $scope.params.DefaultRound = gadget.params.DefaultRound || '2';
        $scope.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;
        $scope.sortList = [
            {name: '班座排序', code: 'cs'}
            , {name: '學號排序', code: 'sn'}
        ];
        $scope.curSort = $scope.sortList[0];
        // Init Current 物件
        $scope.current = {
            /** */
            SelectMode: "Seq.",
            /** */
            SelectSeatNo: "",
            /** */
            Value: "",
            /**目前學生 */
            Student: null,
            /**目前試別 */
            Exam: null,
            /**目前課程 */
            Course: null,
            /**文字評量分類 */
            TextCatalog: '分類',
        };

        /**模式清單 */
        $scope.modeList = ['成績管理','平時評量'];
        // 設定目前資料顯示模式：成績管理 or 平時評量
        $scope.current.mode = $scope.modeList[0];
        /**選擇模式 */
        $scope.modeClick = function (_mode) {
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
            }
            else {
                execute = true;
            }
            if (execute) {
                $scope.current.mode = _mode;
                // 資料Reload
                // 目前選擇的試別清空
                $scope.current.Exam = null;
                // 設定目前學生與目前試別
                $scope.setupCurrent();
                // 取得課程學生以及學生成績資料
                $scope.dataReload();
            }
        }

        $scope.setSortMode = function(sort) {
            $scope.curSort = sort;
            $scope.dataReload();
        }

        /**文字評量分類清單 */
        $scope.examCatalogList = ['分類'];

        /**複製評分項目用 */
        copyGradeItemSaving = false;

        /**代碼替換對照表 */
        $scope.examTextList = {};

        /**
         * 設定目前定期評量
         */
        $scope.setCurrentTemplate = function (template, needCheckChanged) {
            var execute = true;
            if (needCheckChanged) {
                // 檢查資料是否更動
                var data_changed = !$scope.checkAllTable($scope.current.mode);
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
                        execute = false;
                        return;
                    }
                }
            }
            if (execute) {
                $scope.current.template = template;
                $scope.current.gradeItemList = [];
                // 篩選出目前定期的平時評量項目
                $scope.gradeItemList.forEach(item => {
                    if (item.TemplateID == $scope.current.template.ExamID) {
                        $scope.current.gradeItemList.push(item);
                    }
                });
                // 重新設定目前匯入的項目
                $scope.getImportList();

                // 定期評量改變後：目前學生不變、目前試別改變
                $scope.current.Exam = null;

                // 設定目前學生與目前試別
                $scope.setupCurrent();

                // 取得課程學生以及學生成績資料
                $scope.dataReload();
            }
        }

        /**
         * 取得學年度學期 、 課程清單 、定期評量成績輸入時間
         * 1. Service: 取得目前學年度學期
         * 2. Service: 取得所有授課課程(課程資料、評量比例、定期評量、定期評量成績輸入時間)
        */
        $scope.connection.send({
            service: "TeacherAccess.GetCurrentSemester",
            autoRetry: true,
            body: '',
            result: function (response, error, http) {

                if (error) {
                    alert("TeacherAccess.GetCurrentSemester Error");
                } else {
                    crrSchoolYear = response.Current.SchoolYear;
                    crrSemester = response.Current.Semester;

                    // 取得目前學年度學期課程清單
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

                                    [].concat(response.Courses.Course || []).forEach(function (courseRec, index) {
                                        if (courseRec.SchoolYear == crrSchoolYear && courseRec.Semester == crrSemester) {
                                            $scope.courseList.push(courseRec);
                                        }
                                    });

                                    // 課程資料排序 sort by name
                                    $scope.courseList.sort(function(a, b){
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
                                    }
                                    else {
                                        $scope.haveNoCourse = true;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        /**
         * 設定目前課程資料： 整理試別
        */
        $scope.setCurrentCourse = function (course) {
            $scope.isInit = true;
            if ($scope.studentList) {
                var data_changed = !$scope.checkAllTable($scope.current.Table);
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動")) {
                        return;
                    }
                }
            }
            $scope.current.Student = null;
            $scope.studentList = null;
            $scope.current.Course = course;
            /**課程評分樣板：定期評量清單 */
            $scope.templateList = [];
            $scope.examList = [];
            /**定期、平時比例 */
            course.courseScorePercentage = Number(course.TemplateExtension.Extension.ScorePercentage || 0);
            course.courseAssignmentPercentage = 100 - course.courseScorePercentage;

            /**
             * 定期評量資料整理
             * templateList、examList
             */
            {
                // 課程是否指定平分樣版
                if (course.Scores.Score) {
                    [].concat(course.Scores.Score || []).forEach(function (template, index) {
                        template.Type = 'Number';
                        template.Permission = "Editor";
                        template.IsSubScoreMode = false;
                        // 判斷此定期評量是否在成績輸入時間內
                        template.Lock = !(new Date(template.InputStartTime) < new Date() && new Date() < new Date(template.InputEndTime));

                        // 定期評量
                        var score = {
                            TemplateID: template.ExamID, // 定期評量ID
                            ExamID: 'Score_' + template.ExamID,
                            Name: '定期評量',
                            Type: 'Number',
                            Permission: 'Editor',
                            Lock: template.Extension.Extension.UseScore !== '是' || template.Lock,
                        };
                        // 平時評量
                        var assignmentScore = {
                            TemplateID: template.ExamID, // 定期評量ID
                            ExamID: 'AssignmentScore_' + template.ExamID,
                            Name: '平時評量',
                            Type: 'Number',
                            Permission: 'Editor', // 平時評量分數 可直接輸入或手動帶入小考結算成績
                            Lock: template.Extension.Extension.UseAssignmentScore !== '是' || template.Lock,
                        };
                        // 文字評量
                        var text = {
                            TemplateID: template.ExamID, // 定期評量ID
                            ExamID: 'Text_' + template.ExamID,
                            Name: '文字評量',
                            Type: 'Text',
                            Permission: 'Editor',
                            Lock: template.Extension.Extension.UseText !== '是' || template.Lock,
                        };

                        $scope.templateList.push(template);
                        $scope.examList.push(score, assignmentScore, text);
                    });
                    // console.log($scope.examList);

                    // 設定目前定期評量
                    $scope.current.template = $scope.templateList[0];

                    // 學期成績
                    var finalScore = {
                        ExamID: '學期成績',
                        Name: '學期成績',
                        Type: 'Number',
                        Permission: 'Editor',
                        Lock: true
                        };
                    // 學期成績試算
                    var finalScorePreview = {
                        ExamID: '學期成績_試算',
                        Name: '學期成績_試算',
                        SubName: '試算',
                        Type: 'Program',
                        Permission: 'Editor',
                        Lock: false,
                        /**學期成績試算 */
                        Fn: function (stu) {
                            // 評量成績加總
                            var total = 0;
                            // 評量權重加總
                            var base = 0;
                            var seed = 10000;
                            [].concat(course.Scores.Score || []).forEach(function (template, index) {
                                /** 定期比例
                                 *  平時比例：(100 - 定期比例)%
                                */
                                var ScorePercentage = Number(course.TemplateExtension.Extension.ScorePercentage)/100 || 0;
                                // 評量比重
                                var p = Number(template.Percentage) || 0;
                                // 定期評量成績
                                var score = stu['Score_' + template.ExamID];

                                // 平時評量成績
                                var assignmentScore = stu['AssignmentScore_' + template.ExamID];

                                // 是否採計定期評量成績、平時評量成績
                                if ((score != '缺' && (score || score == '0'))
                                    && (assignmentScore != '缺' && (assignmentScore || assignmentScore == '0'))) {

                                    var tpScore = score * ScorePercentage + assignmentScore * (1 - ScorePercentage);
                                    total +=  seed * p *tpScore;
                                    base += p;
                                }
                                else if((score != '缺' && (score || score == '0'))
                                    && !(assignmentScore != '缺' && (assignmentScore || assignmentScore == '0'))) {

                                    var tpScore = score * 1;
                                    total +=  seed * p *tpScore;
                                    base += p;
                                }
                                else if(!(score != '缺' && (score || score == '0'))
                                    && (assignmentScore != '缺' && (assignmentScore || assignmentScore == '0'))) {

                                    var tpScore = assignmentScore * 1;
                                    total +=  seed * p *tpScore;
                                    base += p;
                                }
                            });

                            if (base) {
                                var round = Math.pow(10, $scope.params[finalScorePreview.Name + 'Round'] || $scope.params.DefaultRound);
                                stu[finalScorePreview.ExamID] = Math.round((Math.floor(total / base) / seed) * round) / round;
                            }
                            else {
                                stu[finalScorePreview.ExamID] = "";
                            }
                        }
                    };

                    $scope.examList.splice(0, 0, finalScore, finalScorePreview);
                }
            }

            /**
             * 1. 取得小考資料 $scope.getGradeItemList()
             * 2. 取得定期評量子成績項目 $scope.getSubExamList()
             * 3. 設定目前定期評量 $scope.setCurrentTemplate()
             */
            Promise.all([$scope.getGradeItemList(), $scope.getSubExamList()]).then(v => {
                // 設定目前定期評量
                if($scope.current.template) {
                    $scope.setCurrentTemplate($scope.current.template, true);
                } else{
                    $scope.setCurrentTemplate($scope.templateList[0], true);
                }
                $scope.isInit = false;
            });
        }

        /**
         * 取得小考資料 gradeItemList
         */
        $scope.getGradeItemList = function() {
            return new Promise((r,j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseExtensions",
                    body: {
                        Content: {
                            ExtensionCondition: {
                                '@CourseID': '' + $scope.current.Course.CourseID,
                                Name: 'GradeItem'
                            }
                        }
                    },
                    result: function (response, error, http) {
                        $scope.gradeItemList = [];
                        if (error !== null) {
                            alert("TeacherAccess.GetCourseExtensions Error");
                            // promise 回傳錯誤
                            j(error);
                        } else {
                            // 課程是否有設定小考試別
                            if (response.Response.CourseExtension.Extension.GradeItem) {
                                $scope.$apply(function () {
                                    // 小考試別整理
                                    [].concat(response.Response.CourseExtension.Extension.GradeItem.Item || []).forEach(item => {

                                        var gradeItem = {
                                            TemplateID: item.ExamID, // 定期評量ID
                                            ExamID: `${item.ExamID}_Quiz_${item.SubExamID}`,
                                            SubExamID: item.SubExamID,
                                            Name: item.Name,
                                            Weight: item.Weight,
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            /**
                                             * Lock條件
                                             * 1. 平時評量是否在成績輸入時間內
                                             * 2. 是否啟用平時評量 => 依照教務做作業評分樣板設定
                                             */
                                            Lock: $scope.examList.filter(exam => exam.ExamID == `AssignmentScore_${item.ExamID}`)[0].Lock
                                        };

                                        $scope.gradeItemList.push(gradeItem);
                                    });
                                    // 各定期評量的平時評量整理
                                    [].concat($scope.templateList || []).forEach(template => {
                                        var quizResult = {
                                            TemplateID: template.ExamID,
                                            ExamID: 'QuizResult_' + template.ExamID,
                                            Name: '平時評量',
                                            Type: 'Number',
                                            Permission: 'Program',
                                            // 取得平時評量是否在成績輸入時間內，並且啟用
                                            Lock:  $scope.examList.filter(exam => exam.ExamID == `AssignmentScore_${template.ExamID}`)[0].Lock
                                        };
                                        $scope.gradeItemList.splice(0, 0, quizResult);
                                    });
                                    if (!$scope.isInit) {
                                        $scope.setCurrentTemplate($scope.current.template, true);
                                    }
                                });
                            }
                            // promise 回傳結果成功
                            r(true);
                        }
                    }
                });
            });
        }

        /** 取得定期評量子成績項目 並加入到 examList */
        $scope.getSubExamList = function() {
            return new Promise((r, j) => {
                $scope.connection.send({
                    service: "TeacherAccess.GetCourseExtensions",
                    body: {
                        Content: {
                            ExtensionCondition: {
                                '@CourseID': '' + $scope.current.Course.CourseID,
                                Name: 'GradeItemExtension'
                            }
                        }
                    },
                    result: function (response, error, http) {
                        if (error !== null) {
                            alert("TeacherAccess.GetCourseExtensions Error");
                            // promise 回傳結果失敗
                            j(error);
                        } else {
                            // 課程是否有設定定期評量子成績項目
                            if (response.Response.CourseExtension.Extension.GradeItemExtension) {
                                // mapping 定期評量子成績項目
                                // 調整 exam list
                                [].concat(response.Response.CourseExtension.Extension.GradeItemExtension || []).forEach(template => {

                                    var index = $scope.examList.findIndex(exam => exam.TemplateID == template.ExamID);
                                    var index2 = $scope.templateList.findIndex(tp => tp.ExamID == template.ExamID);

                                    if (index2 > -1) {
                                        $scope.templateList[index2].isSubScoreMode = true;
                                    }

                                    if (index > -1) {
                                        var exam = $scope.examList[index];

                                        var tpSubExamPs = {
                                            TemplateID: exam.TemplateID, // 定期評量ID
                                            ExamID: 'Score_PS_' + exam.TemplateID,
                                            Name: '試卷',
                                            Type: 'Number',
                                            Permission: 'Editor',
                                            isSubItem: true,
                                            Lock: exam.Lock
                                        };
                                        var tpSubExamCs = {
                                            TemplateID: exam.TemplateID, // 定期評量ID
                                            ExamID: 'Score_CS_' + exam.TemplateID,
                                            Name: '讀卡',
                                            Type: 'Number',
                                            Permission: 'Read',
                                            isSubItem: true,
                                            Lock: exam.Lock
                                        };

                                        // 如果有子成績項目：定期評量 = 試卷 + 評量
                                        // 定期評量權限：唯讀
                                        var targetExam = $scope.examList[index];
                                        targetExam.Permission = 'Read';

                                        $scope.examList.splice(index + 1, 0, tpSubExamCs, tpSubExamPs);
                                    }
                                })
                            }
                            // promise 回傳結果成功
                            r(true);
                        }
                    }
                });
            });
        }

        /**
         * 取得課程學生以及學生成績資料
         * 1. Service： 取得課程學生
         * 2. Service： 取得定期評量分數
         * 3. Service： 取得學期成績
         * 4. Service： 取得平時評量分數
         * 執行setupCurrent
         */
        $scope.dataReload = function() {
            const optionOrder = ($scope.curSort.code === 'sn' ? { StudentNumber: '' } : { GradeYear: '', DisplayOrder: '', ClassName: '',  SeatNo: '' });
            $scope.connection.send({
                service: "TeacherAccess.GetCourseStudents2020",
                autoRetry: true,
                body: {
                    Content: {
                        Field: { All: '' },
                        Condition: { CourseID: $scope.current.Course.CourseID },
                        Order: optionOrder
                    }
                },
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.GetCourseStudents2020 Error");
                    } else {
                        var studentMapping = {};
                        // studentList 學生試別資料初始化
                        {
                            $scope.$apply(function () {
                                $scope.studentList = [];
                                [].concat(response.Students.Student || []).forEach(function (studentRec, index) {
                                    studentRec.SeatNo = studentRec.SeatNumber;
                                    studentRec.index = index;
                                    $scope.examList.forEach(function (examRec) {
                                        studentRec[examRec.ExamID] = '';
                                    });
                                    $scope.gradeItemList.forEach(function(gradeItem) {
                                        studentRec[gradeItem.ExamID] = '';
                                    });
                                    $scope.studentList.push(studentRec);
                                    studentMapping[studentRec.StudentID] = studentRec;
                                });
                            });
                        }

                        var getCourseExamScoreFinish = false;
                        var getCourseSemesterScore = false;
                        var getCourseAssignmentScore = false;

                        /**取得在成績輸入時間內的定期評量分數 */
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
                                } else {
                                    $scope.$apply(function () {
                                        [].concat(response.Scores.Item || []).forEach(function (examScoreRec, index) {

                                            // 定期評量
                                            studentMapping[examScoreRec.StudentID]['Score_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.Score;
                                            // 平時評量
                                            studentMapping[examScoreRec.StudentID]['AssignmentScore_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.AssignmentScore;
                                            // 文字評量
                                            studentMapping[examScoreRec.StudentID]['Text_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.Text;
                                            // 定期評量：試卷成績
                                            studentMapping[examScoreRec.StudentID]['Score_PS_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.PScore == undefined ? '' : examScoreRec.Extension.Extension.PScore;
                                            // 定期評量：讀卡成績
                                            studentMapping[examScoreRec.StudentID]['Score_CS_' + examScoreRec.ExamID] = examScoreRec.Extension.Extension.CScore == undefined ? '' : examScoreRec.Extension.Extension.CScore;

                                        });
                                        getCourseExamScoreFinish = true;
                                        // 定期、學期、平時資料都讀取完後：備份原始資料
                                        if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                            $scope.studentList.forEach(function (studentRec, index) {
                                                var rawStudentRec = angular.copy(studentRec);
                                                for (var key in rawStudentRec) {
                                                    if (!key.match(/Origin^/gi)) {
                                                        studentRec['Origin_' + key] = studentRec[key];
                                                    }
                                                }
                                            });
                                            $scope.setupCurrent();
                                        }
                                    });
                                }
                            }
                        });

                        /**取得學期成績 */
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
                                } else {
                                    $scope.$apply(function () {
                                        [].concat(response.Scores.Item || []).forEach(function (finalScoreRec, index) {
                                            studentMapping[finalScoreRec.StudentID]['學期成績'] = finalScoreRec.Score;
                                        });

                                        getCourseSemesterScore = true;
                                        // 定期、學期、平時資料都讀取完後：備份原始資料
                                        if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                            $scope.studentList.forEach(function (studentRec, index) {
                                                var rawStudentRec = angular.copy(studentRec);
                                                for (var key in rawStudentRec) {
                                                    if (!key.match(/Origin^/gi))
                                                        studentRec['Origin_' + key] = studentRec[key];
                                                }
                                            });
                                            $scope.setupCurrent();
                                        }
                                    });
                                }
                            }
                        });

                        /**取得所有定期評量的小考分數 */
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
                                                    studentMapping[item.StudentID][`${exam.ExamID}_Quiz_${e.SubExamID}`] = (e.Score || '');
                                                });

                                            });
                                        });
                                        getCourseAssignmentScore = true;
                                        // 定期、學期、平時資料都讀取完後：備份原始資料
                                        if (getCourseExamScoreFinish && getCourseSemesterScore && getCourseAssignmentScore) {
                                            $scope.studentList.forEach(function (studentRec, index) {
                                                var rawStudentRec = angular.copy(studentRec);
                                                for (var key in rawStudentRec) {
                                                    if (!key.match(/Origin^/gi)) {
                                                        studentRec['Origin_' + key] = rawStudentRec[key];
                                                    }
                                                }
                                            });
                                            $scope.setupCurrent();
                                        }
                                    });
                                }
                            }
                        });

                        // 檢查是否有修課學生以及課程設定評分樣板
                        {
                            $scope.errMsg = '';
                            if (!$scope.examList || $scope.examList.length == 0) {
                                $scope.errMsg += '此課程尚未設定評分樣板';
                            }
                            if (!$scope.studentList || $scope.studentList.length == 0) {
                                $scope.errMsg += ' 此課程無修課學生';
                            }
                        }

                    }
                }
            });
        };

        /**
         * 設定目前畫面資料、學生、試別
         * 執行setCurrent
         */
        $scope.setupCurrent = function () {

            if ($scope.studentList && $scope.examList) {
                // 計算：學期成績試算
                $scope.calc();
                var student, exam;

                /**設定目前學生 */
                if (!$scope.current.Student) {
                    student = $scope.studentList[0];
                } else {
                    student = $scope.current.Student;
                }
                /**
                 * 設定目前試別
                 * 1. 成績管理模式 試別來自 examList
                 * 2. 平時評量模式 試別來自 gradeItemList
                 */
                if ($scope.current.mode == $scope.modeList[0]) { // 成績管理模式
                    if (!$scope.current.Exam) {
                        $scope.examList.filter(exam => exam.TemplateID == $scope.current.template.ExamID).forEach(e => {
                            if (!exam && !e.Lock && e.Permission == 'Editor' && e.Type !== 'Program') {
                                exam = e;
                            }
                        });
                    } else {
                        exam = $scope.current.Exam;
                    }
                }
                else if($scope.current.mode == $scope.modeList[1]) { // 平時評量模式
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

            $scope.current.Exam = exam;
            $scope.current.Student = student;

            var val = (student || {})[(exam || {}).ExamID];
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

        /**
         * 取得文字評量代碼表
         */
        $scope.connection.send({
            service: "TeacherAccess.GetExamTextScoreMappingTable",
            body: {
                Content: {}
            },
            result: function (response, error, http) {
                if (error !== null) {
                    alert("取得「文字評量代碼表」出現錯誤。");
                    $scope.examTextList = {};
                    $scope.examCodeList = [];
                    $scope.examCatalogList = ['分類'];
                } else {
                    $scope.$apply(function () {
                        if (response !== null && response.Response !== null && response.Response !== '') {

                            // 資料顯示用
                            $scope.examCodeList = [].concat(response.Response.TextMappingTable.Item || []);

                            // 資料替換用
                            $scope.examCodeList.forEach(function(item) {
                                if (item.Code) { $scope.examTextList[item.Code] = item.Content || ''; }
                            });

                            // 分類清單
                            $scope.examCodeList.forEach(function(item) {
                                if ($scope.examCatalogList.indexOf(item.Catalog) === -1) {
                                    $scope.examCatalogList.push(item.Catalog);
                                }
                            });
                        } else {
                            $scope.examTextList = [];
                            $scope.examCodeList = {};
                            $scope.examCatalogList = ['分類'];
                        }
                    });
                }
            }
        });

        // 篩選文字評量分類
        $scope.filterTextCatalog = function (text) {
            if ($scope.current.TextCatalog === '分類') {
                return text;
            } else {
                return (text.Catalog === $scope.current.TextCatalog);
            }
        }

         /**
          * 成績輸入
          * 輸入完成後
          * 執行submitGrade
          */
         $scope.enterGrade = function (event) {
            if (event && (event.keyCode !== 13 || $scope.isMobile)) return;
            var flag = false;
            if ($scope.current.Exam.Type == 'Number') {
                var temp = Number($scope.current.Value);
                if (!isNaN(temp) && temp <= 100 && temp >= 0) {

                    flag = true;
                    var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                    temp = Math.round(temp * round) / round;
                }
                if ($scope.current.Value == "缺") {
                    flag = true;
                }
                if (flag) {
                    if ($scope.current.Value != "" && $scope.current.Value != "缺"){
                        $scope.current.Value = temp;
                    }
                }
            }
            else {
                flag = true;
                $scope.textChangeEvent();
            }
            if (flag) {
                $scope.submitGrade();
            }
        }

        /**
         * 計算加權平均
         * 計算完成後-跳下一位學生
         * setCurrent
        */
        $scope.submitGrade = function (matchNext) {
            if ($scope.current.mode == '成績管理') {
                $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;
                if ($scope.current.template.isSubScoreMode) {
                    var ps = $scope.current.Student['Score_PS_' + $scope.current.Exam.TemplateID] * 1;
                    var cs = $scope.current.Student['Score_CS_' + $scope.current.Exam.TemplateID] * 1;
                    $scope.current.Student['Score_' + $scope.current.Exam.TemplateID] = ps + cs;
                }
                // 資料同步
                const targetStu = $scope.studentList.find(stu => stu.StudentID === $scope.current.Student.StudentID);
                targetStu[$scope.current.Exam.ExamID] = $scope.current.Value;
                $scope.calc();
            }
            else { // 平時評量
                $scope.current.Student[$scope.current.Exam.ExamID] = $scope.current.Value;
                // 資料同步
                const targetStu = $scope.studentList.find(stu => stu.StudentID === $scope.current.Student.StudentID);
                targetStu[$scope.current.Exam.ExamID] = $scope.current.Value;
                // 計算平時評量
                $scope.calcQuizResult($scope.current.Student);
            }
            // 目前學生換下一位
            {
                var nextStudent = $scope.studentList.length > ($scope.current.Student.index + 1) ?
                $scope.studentList[$scope.current.Student.index + 1] :
                $scope.studentList[0];

                $scope.setCurrent(nextStudent, $scope.current.Exam, true, false);
            }

            // DOM focus
            if ($scope.current.SelectMode != 'Seq.') {
                $('.pg-seatno-textbox:visible').select().focus();
            }
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

        /**
         * 學期成績試算
         */
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
         * 計算平時評量
         */
        $scope.calcQuizResult = function(student) {
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

        /**
         * 檢查資料是否更動
         * 成績管理
         * 平時評量
         * 編輯評分項目
         */
        $scope.checkAllTable = function (target) {
            var pass = true;
            var targetExamList = [];

            if (target == $scope.modeList[0]) {
                targetExamList = $scope.examList;
            } else if(target == $scope.modeList[1]) {
                targetExamList = $scope.gradeItemList;
                targetExamList = targetExamList.filter(exam => {
                    return exam.TemplateID === $scope.current.template.ExamID;
                });
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

        // 檢查資料是否變更
        $scope.checkOneCell = function (studentRec, examID) {
            var pass = true;
            if (studentRec[examID] === 0) {
                pass = ('' + studentRec[examID] === '' + studentRec['Origin_' + examID]) || (studentRec['Origin_' + examID] === undefined) || (examID == "學期成績_試算");
            } else {
                pass = (studentRec[examID] == studentRec['Origin_' + examID]) || (studentRec['Origin_' + examID] === undefined) || (examID == "學期成績_試算");
            }
            // console.log(studentRec[examID] + '===' + studentRec['Origin_' + examID] + ' ==> ' + pass);
            return pass;

        }

        /**儲存定期評量 */
        $scope.saveAll = function () {

            // 未在成績輸入時間內的定期評量不可儲存
            if ($scope.current.template.Lock) {
                alert(`尚未開放${$scope.current.template.Name}成績輸入。 成績輸入時間${$scope.current.template.InputStartTime} ~ ${$scope.current.template.InputEndTime}`);
                return;
            }
            var body = {
                Content: {
                    '@CourseID': $scope.current.Course.CourseID,
                    Exam: []
                }
            };
            // 取得目前定期評量資料
            var eItem = {
                '@ExamID': $scope.current.template.ExamID,
                Student: []
            };
            [].concat($scope.studentList || []).forEach(function (studentRec, index) {

                var examID = $scope.current.template.ExamID;

                var obj = {
                    '@StudentID': studentRec.StudentID,
                    '@Score': 0,
                    Extension: {
                        Extension: {
                            /**定期評量 */
                            // $scope.current.template.isSubScoreMode ? studentRec['Score_PS_' + examID] + studentRec['Score_CS_' + examID] : studentRec['Score_' + examID]
                            Score: studentRec['Score_' + examID],
                            /**平時評量 */
                            AssignmentScore: studentRec['AssignmentScore_' + examID],
                            /**文字評量 */
                            Text: studentRec['Text_' + examID],
                            /** 定期評量：試卷成績 */
                            PScore: studentRec['Score_PS_' + examID],
                            /** 定期評量：讀卡成績*/
                            CScore: studentRec['Score_CS_' + examID]
                        }
                    }
                };
                eItem.Student.push(obj);
            });
            body.Content.Exam.push(eItem);

            /**Service */
            $scope.connection.send({
                /**儲存定期評量成績 */
                service: "TeacherAccess.SetCourseExamScoreWithExtension",
                autoRetry: true,
                body: body,
                result: function (response, error, http) {
                    if (error) {
                        alert("TeacherAccess.SetCourseExamScoreWithExtension Error");
                    } else {

                        $scope.$apply(function () {
                            $scope.studentList.forEach(function (studentRec, index) {
                                var rawStudentRec = angular.copy(studentRec);
                                for (var key in rawStudentRec) {
                                    if (!key.match(/(學期成績|Origin)^/gi))
                                        studentRec['Origin_' + key] = studentRec[key];
                                }
                            });
                        });

                        // 資料Reload
                        $scope.dataReload();
                        alert('儲存完成。');
                    }
                }
            });
        }

        /**儲存平時評量 */
        $scope.saveGradeItemScore = function (showFinishMsg) {

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
                [].concat($scope.templateList || []).forEach(template =>{
                    var exam = {
                        '@ExamID': template.ExamID,
                        '@Score': stuRec['QuizResult_' + template.ExamID] == undefined ? '' : stuRec['QuizResult_' + template.ExamID],
                        Item: []
                    };

                    // 小考成績
                    var targetItemList = $scope.gradeItemList.filter(item => item.Name !== '平時評量' && item.TemplateID == template.ExamID);
                    [].concat(targetItemList || []).forEach(item => {
                        var item = {
                            '@SubExamID': item.SubExamID,
                            '@Score': stuRec[item.ExamID] == undefined ? '' : stuRec[item.ExamID]
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
                                    stuRec['Origin' + item.SubExamID] = stuRec[item.SubExamID];
                                });
                            });
                        });

                        // 資料Reload
                        $scope.dataReload();
                        if (showFinishMsg) { alert('儲存完成。'); }
                    }
                }
            });
        }

        // 帶入小考成績
        $scope.ImportCourseExtensions = function() {
            $scope.studentList.forEach(student => {
                student['AssignmentScore_' + $scope.current.template.ExamID] =  student['QuizResult_' + $scope.current.template.ExamID];
            });
        }

        /**設定匯入項目 */
        $scope.getImportList = function () {
            // 試別匯入清單
            $scope.importExamList = [];
            // 小考匯入清單
            $scope.importGradeItemList = [];

            // 整理試別匯入清單
            {
                // 取得目前定期評量的試別
                var targetExamList = $scope.examList.filter(exam => exam.TemplateID == $scope.current.template.ExamID);

                [].concat(targetExamList || []).forEach(exam => {
                    var importExam = {
                        Name: '匯入_' + exam.Name,
                        Type: 'Function',
                        ScoreType: exam.Type,
                        Fn: function() {
                            delete importExam.ParseString;
                            delete importExam.ParseValues;
                            $scope.importTarget = importExam;
                            $('#importModal').modal('show');
                        },
                        Parse: function() {
                            // 成績
                            if (exam.Type == 'Number') {
                                importExam.ParseString = importExam.ParseString || '';
                                importExam.ParseValues = importExam.ParseString.split("\n");
                                importExam.HasError = false;
                                for (var i = 0; i < importExam.ParseValues.length; i++) {
                                    var flag = false;
                                    var temp = Number(importExam.ParseValues[i]);
                                    if (!isNaN(temp)
                                        && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Max && $scope.current.Exam.Range.Max !== 0) || temp <= $scope.current.Exam.Range.Max)
                                        && (!$scope.current.Exam.Range || (!$scope.current.Exam.Range.Min && $scope.current.Exam.Range.Min !== 0) || temp >= $scope.current.Exam.Range.Min)) {

                                        if (importExam.ParseValues[i] != '') {
                                            flag = true;
                                        }
                                        var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                        temp = Math.round(temp * round) / round;
                                    }
                                    // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值
                                    if (importExam.ParseValues[i] == '-') {
                                        flag = true;
                                        importExam.ParseValues[i] = '';
                                    }
                                    // 缺
                                    if (importExam.ParseValues[i] == '缺') {
                                        flag = true;
                                        importExam.ParseValues[i] = '缺';
                                    }
                                    if (flag) {
                                        if (!isNaN(temp) && importExam.ParseValues[i] != '') {
                                            importExam.ParseValues[i] = temp;
                                        }
                                    }
                                    else {
                                        importExam.ParseValues[i] = '錯誤';
                                        importExam.HasError = true;
                                    }
                                }

                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (index >= importExam.ParseValues.length) {
                                        importExam.ParseValues.push('錯誤');
                                        importExam.HasError = true;
                                    }
                                });
                            }
                            // 文字評量
                            else if(exam.Type == 'Text') {
                                importExam.ParseString = importExam.ParseString || '';

                                // 2017/11/30穎驊註解，由於Excel 格子內文字若輸入" 其複製到 Web 後，會變成"" ，在此將其移除，避免後續的儲存處理問題
                                var text_trimmed = importExam.ParseString.replace(/""/g, "")

                                // 2017/12/1，穎驊註解， 為了要處理原始來自Excel 來源的資料會有跨行(自動換行Excel 貼出來的字會有幫前後字串加綴雙引號")
                                //、還有原始的資料會有直接輸入雙引號"等會造成parser 的讀取轉換問題，
                                //穎驊參考 java 轉CSV的檔案解法: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data

                                // Return array of string values, or NULL if CSV string not well formed.
                                function CSVtoArray(text) {
                                    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:\n|$)/g;

                                    // 本案不需要驗證
                                    // Return NULL if input string is not well formed CSV string.
                                    //if (!re_valid.test(text)) return null;
                                    var a = [];                     // Initialize array to receive values.
                                    text.replace(re_value, // "Walk" the string using replace with callback.
                                        function (m0, m1, m2, m3) {
                                            // Remove backslash from \' in single quoted values.
                                            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                                            // Remove backslash from \" in double quoted values.
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
                                    // Handle special case of empty last value.
                                    if (/,\s*$/.test(text)){
                                        a.push('');
                                    }
                                    return a;
                                };

                                var a = CSVtoArray(text_trimmed);

                                importExam.ParseValues = a;
                                importExam.HasError = false;
                                for (var i = 0; i < importExam.ParseValues.length; i++) {
                                    var flag = false;
                                    var temp = importExam.ParseValues[i];
                                    if (!temp == '' && temp != '-') {
                                        temp = importExam.ParseValues[i];
                                    }
                                    // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值
                                    else if (temp == '-') {
                                        importExam.ParseValues[i] = '';
                                    }
                                    else {
                                        importExam.ParseValues[i] = '錯誤';
                                        importExam.HasError = true;
                                    }
                                }

                                $scope.studentList.forEach(function (stuRec, index) {
                                    if (index >= importExam.ParseValues.length) {
                                        importExam.ParseValues.push('錯誤');
                                        importExam.HasError = true;
                                    }
                                });
                            }

                        },
                        Clear: function() {
                            delete importExam.ParseValues;
                        },
                        Import: function() {
                            if (importExam.HasError == true) {
                                return;
                            }

                            $scope.studentList.forEach(function (stuRec, index) {
                                if (!importExam.ParseValues[index] && importExam.ParseValues[index] !== 0){
                                    stuRec[exam.ExamID] = '';
                                } else {
                                    stuRec[exam.ExamID] = importExam.ParseValues[index];
                                }
                            });

                            // 匯入試卷成績 更新定期評量成績
                            if ($scope.current.template.isSubScoreMode && exam.Name === '試卷') {
                                $scope.studentList.forEach(function(stuRec) {
                                    var ps = stuRec['Score_PS_' + $scope.current.Exam.TemplateID] * 1;
                                    var cs = stuRec['Score_CS_' + $scope.current.Exam.TemplateID] * 1;
                                    stuRec['Score_' + $scope.current.Exam.TemplateID] = ps + cs;
                                });
                            }

                            // 學期成績試算
                            $scope.calc();
                            $('#importModal').modal('hide');
                        },
                        Code2Text: function() {
                            // 找出符合規則的字串，進行取代
                            importExam.ParseString = $scope.codeConvertText(importExam.ParseString || '');
                        },
                        Disabled: exam.Lock || exam.Permission === 'Read'
                    };

                    $scope.importExamList.push(importExam);
                });
            }

            // 整理小考匯入清單
            {
                var targetGradeItemList = $scope.current.gradeItemList.filter(item => item.Permission !== 'Program');

                [].concat(targetGradeItemList || []).forEach(item => {
                    var importItem = {
                        Name: '匯入_' + item.Name,
                        Type: 'Function',
                        Fn: function() {
                            delete importItem.ParseString;
                            delete importItem.ParseValues;
                            $scope.importTarget = importItem;
                            $('#importModal').modal('show');
                        },
                        Parse: function() {
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
                                    // if (!$scope.current.Exam.Group) {
                                    //    var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                    //    temp = Math.round(temp * round) / round;
                                    // }
                                    var round = Math.pow(10, $scope.params[$scope.current.Exam.Name + 'Round'] || $scope.params.DefaultRound);
                                    temp = Math.round(temp * round) / round;
                                }
                                // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值
                                if (importItem.ParseValues[i] == '-') {
                                    flag = true;
                                    importItem.ParseValues[i] = '';
                                }
                                // 缺
                                if (importExam.ParseValues[i] == '缺') {
                                    flag = true;
                                    importExam.ParseValues[i] = '缺';
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
                        Clear: function() {
                            delete importItem.ParseValues;
                        },
                        Import: function() {
                            if (importItem.HasError == true) {
                                return;
                            }
                            $scope.studentList.forEach(function (stuRec, index) {
                                if (!importItem.ParseValues[index] && importItem.ParseValues[index] !== 0) {
                                    stuRec[item.ExamID] = '';
                                }
                                else {
                                    stuRec[item.ExamID] = importItem.ParseValues[index];
                                }
                            });

                            $scope.studentList.forEach(student => {
                                $scope.calcQuizResult(student);
                            });

                            $('#importModal').modal('hide');
                        },
                        Disabled: item.Lock
                    };

                    $scope.importGradeItemList.push(importItem);
                });
            }

        }

        /**顯示複製評量至其他課程的視窗 */
        $scope.openCopyModal = function() {
            $scope.copyGradeItemSaving = false;
            $scope.CourseExamList = [];
            $scope.CanSelectCourseExamList = [];
            var currItemName = $scope.current.Course.CourseName + ":" + $scope.current.template.Name;
            var idx = 1;

            // 取得教師所屬所有課程的小考
            const coArray = $scope.courseList.map(course => {
                return getCourseExam2020(course);
            });

            Promise.all(coArray).then(val => {
                $scope.$apply(function () {
                    val.forEach(function (courseRec) {
                        if (courseRec.Scores) {
                            courseRec.Scores.Score.forEach(function (scs) {
                                //       console.log(scs.Name);
                                var itemName = courseRec.CourseName + ":" + scs.Name;

                                // 取得相對小考
                                var subItemList = [];
                                courseRec.ItemList.forEach(function (subItem) {
                                    if (subItem.RefExamID === scs.ExamID) {
                                        subItemList.push(subItem);
                                    }
                                });

                                var itemDisable = false;
                                // 檢查如果有設評分項目就無法勾選
                                if (subItemList.length > 0) {
                                    itemDisable = true;
                                }


                                var item = {
                                    id: idx,
                                    CourseID: courseRec.CourseID,
                                    CourseName: courseRec.CourseName,
                                    Name: itemName,
                                    ExamID: scs.ExamID,
                                    ExamName: scs.Name,
                                    SubItemLst: subItemList,
                                    Selected: false,
                                    ItemDisable: itemDisable
                                }
                                if (currItemName !== itemName) {
                                    $scope.CanSelectCourseExamList.push(item);
                                }

                                $scope.CourseExamList.push(item);
                                idx = idx + 1;

                            });
                        }
                    });
                    $('#copyModal').modal('show');
                });
            });
        }

        /**關閉複製評量至其他課程的視窗 */
        $scope.closeCopyModal = function() {
            $scope.CanSelectCourseExamList.forEach(function (course) {
                course.Selected = false;
            });
            $('#copyModal').modal('hide');
        }

        /**複製評量至其他課程中 */
        const saveGradeItem = function(body) {
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

        /**取得評量小考設定 */
        const getCourseExam2020 = function (course) {
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

                                            ItemList.push(gradeItem);
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
                            // console.log(value);
                            r(value);
                        }
                    }
                });
            });
        }

        /**整理要複製評量的課程 */
        $scope.copyGradeItemConfig = function() {
            if ($scope.copyGradeItemSaving) return;

            var selectedCourseExam = [];

            // 取得勾選課程試別
            [].concat($scope.CanSelectCourseExamList || []).forEach(function (course) {
                if (course.Selected) {
                    selectedCourseExam.push(course);
                }
            });

            var SendData = [];

            // 整理 select
            var selectedCourseID = [];
            var selectedCourse = [];
            selectedCourseExam.forEach(function (course) {
                if (!selectedCourseID.includes(course.CourseID)) {
                    selectedCourseID.push(course.CourseID);
                    selectedCourse.push(course);
                }
            });

            selectedCourse.forEach(function (course) {
                // 資料整理
                var body = {
                    Content: {
                        CourseExtension: {
                            '@CourseID': course.CourseID
                            , Extension: {
                                '@Name': 'GradeItem'
                                , GradeItem: {
                                    Item: []
                                }
                            }
                        }
                    }
                };

                // 複製到所選新的
                selectedCourseExam.forEach(function (selCourse) {
                    if (selCourse.CourseID === course.CourseID) {
                        $scope.current.gradeItemList.forEach(function (item) {
                            if (item.SubExamID) {
                                body.Content.CourseExtension.Extension.GradeItem.Item.push({
                                    '@ExamID': selCourse.ExamID,
                                    '@SubExamID': item.Name,
                                    '@Name': item.Name,
                                    '@Weight': item.Weight
                                });
                            }
                        });
                    }
                });

                // 將原本課程有的其他評量小考項目再放填入回存
                $scope.CourseExamList.forEach(function (source) {
                    if (source.CourseID === course.CourseID && source.ExamID !== course.ExamID) {
                        // 原本就有小考項目
                        if (source.SubItemLst.length > 0) {
                            source.SubItemLst.forEach(function (item) {
                                body.Content.CourseExtension.Extension.GradeItem.Item.push({
                                    '@ExamID': item.RefExamID,
                                    '@SubExamID': item.SubExamID,
                                    '@Name': item.Name,
                                    '@Weight': item.Weight
                                });
                            });
                        }
                    }
                });

                //console.log(body);
                SendData.push(body);
            });

            const sdArray = SendData.map(data => {
                return saveGradeItem(data);
            });

            if (sdArray.length) {
                $scope.copyGradeItemSaving = true;
                Promise.all(sdArray).then(val => {
                    // console.log(val);

                    $scope.$apply(function () {

                        $scope.isInit = true; // 不要觸發 setCurrentTemplate，改為手動

                        $scope.getGradeItemList().then(function() {
                            $scope.isInit = false; // 要改回 false

                            $scope.copyGradeItemSaving = false;
                            $scope.closeCopyModal();
                            if (selectedCourseExam.length > 0) {
                                $('#saveSuccessModal').modal('show');
                            }
                        });
                    });
                });
            }
        }

        /**
         * 顯示編輯評分項目
         */
        $scope.showGradeItemConfig = function () {
            $scope.gradeItemConfig = {
                Item: []
                , OriginItem: []
                , Mode: "Editor"
                , JSONCode: ""
                , DeleteItem: function (item) {
                    var index = $scope.gradeItemConfig.Item.indexOf(item);
                    if (index > -1) {
                        $scope.gradeItemConfig.Item.splice(index, 1);
                    }
                    // 重新整理評分項目索引
                    {
                        // $scope.gradeItemConfig.Item.forEach((item, index) => {
                        //     item.Index = index;
                        // });
                    }
                }
                , AddItem: function () {
                    $scope.gradeItemConfig.Item.push({
                        ExamID: $scope.current.template.ExamID // 定期評量ID
                        , Name: ""
                        , Weight: "1"
                        , SubExamID: ""
                    });
                }
                , JSONMode: function () {
                    $scope.gradeItemConfig.Mode = "JSON";
                    var jsonList = [];
                    $scope.gradeItemConfig.Item.forEach(function (item) {
                        /**
                         * 篩選目前定期評量 的平時評量項目
                         * 定期評量ID、平時評量ID不可給使用者調整
                         */
                        if($scope.current.template.ExamID == item.ExamID) {
                            jsonList.push({
                                ExamID: item.ExamID
                                , Name: item.Name
                                , Weight: item.Weight
                                , SubExamID: item.Name
                            });
                        }
                    });
                    $scope.gradeItemConfig.JSONCode = JSON.stringify(jsonList, null, "    ");
                }
                , CommitJSON: function () {
                    var jsonParse;
                    var jsonList = [];
                    try {
                        jsonParse = JSON.parse($scope.gradeItemConfig.JSONCode);
                    }
                    catch (error) {
                        alert("Syntax Error" + error);
                        return;
                    }
                    if (jsonParse.length || jsonParse.length === 0) {
                        jsonList = [].concat(jsonParse);
                    }
                    else {
                        alert("Parse Error");
                        return;
                    }

                    /**
                     * ExamID 不可更動
                     * SubExamID = Name
                     * 由於 jsonParse只有目前評量的評分項目，所以清空後最後還要補上其他評量的評分項目
                     */
                    {
                        // 1. json parse
                        $scope.gradeItemConfig.Item = [];
                        jsonList.forEach(function (item) {
                            $scope.gradeItemConfig.Item.push({
                                ExamID: $scope.current.template.ExamID
                                , Name: item.Name
                                , Weight: item.Weight
                                , SubExamID: item.Name
                            });
                        });
                        // 2. 小考設定資料整理
                        var itemList = $scope.gradeItemList.filter(item =>
                            (item.TemplateID !== $scope.current.template.ExamID)
                            && (item.Permission == 'Editor'));
                        itemList.forEach(item => {
                            $scope.gradeItemConfig.Item.push(angular.copy(item));
                        });
                        $scope.gradeItemConfig.Mode = "Editor";
                    }
                }
                , CheckConfig: function () {
                    // 由於 Item 在畫面上binding，angular 為了做變更偵測，會在 Item 裡面加上 $$hashKey 這樣在比對 json code 會出現問題
                    // 解決方式： 使用 anular.toJson() 取代 JSON.stringify()，anular.toJson() 會過濾這樣的資料
                    var targetConfigList = $scope.gradeItemConfig.Item.filter(item => item.ExamID === $scope.current.template.ExamID);
                    var originTargetConfigList = $scope.gradeItemConfig.OriginItem.filter(item => item.ExamID === $scope.current.template.ExamID);

                    var jsonCode = angular.toJson(targetConfigList);
                    var originJsonCode = angular.toJson(originTargetConfigList);

                    return jsonCode === originJsonCode;
                }
            };
            // 如果沒有評分項目的話，初始化。
            var item = {
                ExamID: $scope.current.template.ExamID,
                Name: '成績_1',
                SubExamID: '成績_1',
                Weight: '1',
            };

            // 整理小考資料
            var targetGradeItem = $scope.gradeItemList.filter(item => item.Permission == 'Editor');
            [].concat(targetGradeItem || item).forEach(function (item) {
                $scope.gradeItemConfig.Item.push(angular.copy({
                    ExamID: item.TemplateID,
                    Name: item.Name,
                    SubExamID: item.SubExamID,
                    Weight: item.Weight,
                }));
                $scope.gradeItemConfig.OriginItem.push(angular.copy({
                    ExamID: item.TemplateID,
                    Name: item.Name,
                    SubExamID: item.SubExamID,
                    Weight: item.Weight,
                }));
            });
            $('#GradeItemModal').modal('show');
        }

        /**
         * 儲存評分項目
         * 1.平時評量成績重新計算
         * 2.儲存平時評量成績
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
            var examKeyList = [];
            var dataRepeat = false;
            var repeatExamName = '';
            $scope.gradeItemConfig.Item.forEach(function (item) {

                var pass = true;
                // 驗證名稱
                if (!item.Name) {
                    namePass = false;
                    pass = false;
                }
                // 驗證權重
                if (!item.Weight || Number.isNaN(+item.Weight)) {
                    weightPass = false;
                    pass = false;
                }
                // 名稱不可重複
                if (pass && !dataRepeat) {
                    // Key: ExamID(評量) + QuizName
                    var key = `${item.ExamID}_${item.Name}`;
                    if(examKeyList.indexOf(key) > -1){
                        dataRepeat = true;
                        repeatExamName = item.Name;
                    }
                    examKeyList.push(key);

                    // '@Index': item.Index
                    body.Content.CourseExtension.Extension.GradeItem.Item.push({
                        '@ExamID': item.ExamID, // 定期評量ID
                        '@SubExamID': item.SubExamID == "" ? item.Name : item.SubExamID, // 平時評量ID
                        '@Name': item.Name,
                        '@Weight': item.Weight,
                    });
                }
            });
            if (namePass && weightPass && !dataRepeat) {
                // 先確認是否有未儲存的成績
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
                    $scope.connection.send({
                        service: "TeacherAccess.SetCourseExtensions",
                        autoRetry: true,
                        body: body,
                        result: function (response, error, http) {
                            if (error) {
                                alert("TeacherAccess.SetCourseExtensions Error");
                            } else {
                                $('#GradeItemModal').modal('hide');

                                $scope.isInit = true; // 不要觸發 setCurrentTemplate，改為手動
                                // 重新取得評分項目(小考)資料
                                $scope.getGradeItemList().then(function() {
                                    // 重算平時評量成績
                                    $scope.studentList.forEach(student => {
                                        $scope.calcQuizResult(student);
                                    });

                                    // 強迫儲存平時評量成績
                                    $scope.saveGradeItemScore(false);

                                    // 重算後，成績來源已不同，不要讀取異動驗證，直接重整資料
                                    // 設定目前定期評量
                                    if($scope.current.template) {
                                        $scope.setCurrentTemplate($scope.current.template, false);
                                    } else{
                                        $scope.setCurrentTemplate($scope.templateList[0], false);
                                    }
                                    $scope.isInit = false; // 要改回 false
                                });
                            }
                        }
                    });
                }
            }
            else {
                var errMsg = "";
                if (!namePass)
                    errMsg += (errMsg ? "\n" : "") + "評分名稱不可空白。";
                if (!weightPass)
                    errMsg += (errMsg ? "\n" : "") + "權重不可空白且必須為數值。";
                if(dataRepeat){
                    errMsg += (errMsg ? "\n" : "") + "評分項目名稱：「"+repeatExamName+"」重複! 資料無法儲存。";
                }
                alert(errMsg);
            }
        }

        // 篩選試別
        $scope.filterPermission = function (examItem) {
            // return (examItem.Permission == "Read" || examItem.Permission == "Editor") &&
            //     ($scope.current.VisibleExam && $scope.current.VisibleExam.indexOf(examItem.Name) >= 0) &&
            //     ($scope.current.template.ExamID == examItem.TemplateID || examItem.Name == '學期成績');
            return (examItem.Permission == "Read" || examItem.Permission == "Editor") &&
                ($scope.current.template.ExamID == examItem.TemplateID || examItem.Name == '學期成績' || examItem.Name == '學期成績_試算');
        }

        // 篩選目前選擇的定期評量
        // $scope.filterTemplate = function (template) {
        //     return $scope.current.template == template;
        // }

        // 篩選評分項目 - 編輯評分項目
        $scope.filterGradeItem = function (item) {
            return $scope.current.template.ExamID == item.ExamID
        }

        // 文字評量輸入
        $scope.textChangeEvent = function () {
            $scope.current.Value = $scope.codeConvertText($scope.current.Value);
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
            var data_changed = !$scope.checkAllTable($scope.current.Table);

            if (data_changed) {
                return "尚未儲存資料，現在離開視窗將不會儲存本次更動";
            }
            else {
                return "";
            }
        });

        /**匯出定期評量成績單 */
        const exportGradeBookA = function() {

            var trList = [];
            var thList1 = [];
            var thList2 = [];
            // 欄位資料整理
            thList1 = [
                `<td rowspan="2" width="40px">學號</td>`,
                `<td rowspan="2" width="40px">班級</td>`,
                `<td rowspan="2" width="40px">座號</td>`,
                `<td rowspan="2" width="70px">姓名</td>`,
                `<td rowspan="2">學期成績</td>`,
                `<td rowspan="2">學期成績_試算</td>`,

            ];

            [].concat($scope.templateList || []).forEach(template => {
                thList1.push(`<td colspan="3">${template.Name} <span style="color: #ff0000">(${template.Percentage})</span></td>`);
                thList2.push(`<td>定期<br/>評量<br/><span style="color: #ff0000">${$scope.current.Course.courseScorePercentage}%</span></td>`);
                thList2.push(`<td>平時<br/>評量<br/><span style="color: #ff0000">${$scope.current.Course.courseAssignmentPercentage}%</span></td>`);
                thList2.push(`<td>文字<br/>評量</td>`);
            });

            trList.push(`<tr>${thList1.join('')}</tr>`);
            trList.push(`<tr>${thList2.join('')}</tr>`);


            // 學生資料整理
            [].concat($scope.studentList || []).forEach(student => {
                var studentData = [
                    `<td class="text">${student.StudentNumber} </td>`,
                    `<td>${student.ClassName}</td>`,
                    `<td>${student.SeatNumber}</td>`,
                    `<td>${student.StudentName}</td>`,
                ];

                studentData.push(`<td>${student['學期成績']}</td>`);
                studentData.push(`<td>${student['學期成績_試算']}</td>`);

                [].concat($scope.templateList || []).forEach(template => {
                    studentData.push(`<td>${student['Score_' + template.ExamID]}</td>`);
                    studentData.push(`<td>${student['AssignmentScore_' + template.ExamID]}</td>`);
                    studentData.push(`<td>${student['Text_' + template.ExamID]}</td>`);
                });

                trList.push(`<tr>${studentData.join('')}</tr>`);
            });

            var html = `
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
            .text {
                mso-number-format:"\@"
            }
        </style>
    </head>
    <body>
        <table border="1" cellspacing="0" cellpadding="2">
            <tbody align="center">
                ${crrSchoolYear}學年度第${crrSemester}學期 ${$scope.current.Course.CourseName}
                ${trList.join('')}
            </tbody>
        </table>
        <br/>教師簽名：
    </body>
</html>`;

            saveAs(new Blob([html], { type: "application/octet-stream" }), $scope.current.Course.CourseName + '_定期評量.xls');
        }

        /**匯出平時評量成績單 */
        const exportGradeBookB = function() {

            var trList = [];
            var thList1 = [];
            var thList2 = [];
            var thList3 = [];
            // 欄位資料整理
            thList1 = [
                `<td rowspan="3" width="40px">學號</td>`,
                `<td rowspan="3" width="40px">班級</td>`,
                `<td rowspan="3" width="40px">座號</td>`,
                `<td rowspan="3" width="70px">姓名</td>`,
            ];

            [].concat($scope.templateList || []).forEach(template => {
                let itemCount = 0;
                [].concat($scope.gradeItemList || []).forEach(item => {
                    if (item.TemplateID == template.ExamID && item.Name !== '平時評量') {
                        itemCount += 1;
                        thList3.push(`<td>${item.Name}</td>`);
                    }
                });
                thList1.push(`<td colspan="${Math.max(itemCount + 1, 2)}">${template.Name}</td>`);
                thList2.push(`<td rowspan="2">平時評量</td>`);
                thList2.push(`<td colspan="${Math.max(itemCount, 1)}">評分項目</td>`);
                if (itemCount == 0) { thList3.push(`<td></td>`); }
            });

            trList.push(`<tr>${thList1.join('')}</tr>`);
            trList.push(`<tr>${thList2.join('')}</tr>`);
            trList.push(`<tr>${thList3.join('')}</tr>`);


            // 學生資料整理
            [].concat($scope.studentList || []).forEach(student => {
                var studentData = [
                    `<td class="text">${student.StudentNumber} </td>`,
                    `<td>${student.ClassName}</td>`,
                    `<td>${student.SeatNumber}</td>`,
                    `<td>${student.StudentName}</td>`,
                ];

                [].concat($scope.templateList || []).forEach(template => {
                    let itemCount = 0;
                    [].concat($scope.gradeItemList || []).forEach(item => {
                        if (item.TemplateID == template.ExamID && item.Name === '平時評量') {
                            studentData.push(`<td>${student[item.ExamID]}</td>`); // 平時評量成績
                        }
                    });
                    [].concat($scope.gradeItemList || []).forEach(item => {
                        if (item.TemplateID == template.ExamID && item.Name !== '平時評量') {
                            itemCount += 1;
                            studentData.push(`<td>${student[item.ExamID]}</td>`);
                        }
                    });
                    if (itemCount == 0) { studentData.push(`<td></td>`); }
                });
                trList.push(`<tr>${studentData.join('')}</tr>`);
            });

            var html = `
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
            .text {
                mso-number-format:"\@"
            }
        </style>
    </head>
    <body>
        <table border="1" cellspacing="0" cellpadding="2">
            <tbody align="center">
                ${crrSchoolYear}學年度第${crrSemester}學期 ${$scope.current.Course.CourseName}
                ${trList.join('')}
            </tbody>
        </table>
        <br/>教師簽名：
    </body>
</html>`;

            saveAs(new Blob([html], { type: "application/octet-stream" }), $scope.current.Course.CourseName + '_平時評量.xls');
        }

        /**匯出成績單 */
        $scope.exportGradeBook = function() {
            ($scope.current.mode === '成績管理') ? exportGradeBookA() : exportGradeBookB();
        };


        // 找出符合規則的字串，將文字代碼取代成文字
        $scope.codeConvertText = function(value) {
            debugger
            const re = new RegExp(/([\d\w]+)/, 'g');
            return (value || '').replace(re, function(match, g1) { return $scope.examTextList[g1] || g1 });
        };

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
                'score-background': '='
            },
            link: function(scope, element, attrs) {
                const funChangeCSS = function() {
                    element.removeClass('score-red');
                    element.removeClass('text-red');

                    if (attrs.scoreType !== 'Text') {
                        if ($.isNumeric(attrs.scoreStress)) {
                            if (Number(attrs.scoreStress) < 60 || Number(attrs.scoreStress) > 100) {
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
            }
        };
    });
