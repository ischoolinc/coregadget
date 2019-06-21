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
            process: [{

            }]
        };

        $scope.params = gadget.params;

        $scope.params.DefaultRound = gadget.params.DefaultRound || '2';


        $scope.changeSelectMode = function (mode) {
            $scope.current.SelectMode = mode;
            $timeout(function () {
                $('.pg-seatno-textbox:visible').select().focus();
            }, 1);
        }

        $scope.setCurrent = function (student, exam, setCondition, setFocus) {
            $scope.current.Exam = exam;
            $scope.current.Student = student;

            var val = (student || {})['Exam' + (exam || {}).ExamID];
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

            var temp = Number($scope.current.Value);
            if (!isNaN(temp)) {
                flag = true;
                var round = Math.pow(10, $scope.current.Student.DecimalNumber || $scope.params.DefaultRound);
                temp = Math.round(temp * round) / round;
            }
            if ($scope.current.Value == "缺")
                flag = true;
            if (flag) {
                if ($scope.current.Value != "" && $scope.current.Value != "缺")
                    $scope.current.Value = temp;
            }

  
            if (flag) {
                $scope.submitGrade();
            }
        }

        gadget.onLeave(function () {
            var data_changed = !$scope.checkAllTable();

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

            $scope.Data_is_original = false;
            $scope.Data_has_changed = true;

            $scope.current.Student["MakeUpScore"] = $scope.current.Value;
            
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
                                Extension: { Score: studentRec["Exam" + examRec.ExamID] }
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

        $scope.isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/gi) ? true : false;

        $scope.filterPermission = function (examItem) {
            return (examItem.Permission == "Read" || examItem.Permission == "Editor") && ($scope.current.VisibleExam && $scope.current.VisibleExam.indexOf(examItem.Name) >= 0);
        }

        $scope.setupCurrent = function () {
            if ($scope.studentList) {
                
                if (!$scope.current.Student && !$scope.current.Exam) {
                    //#region 設定預設資料顯示
                    var ts, te;
                    if ($scope.studentList) ts = $scope.studentList[0];
                    $scope.examList.forEach(function (e) {
                        if (!te && !e.Lock && e.Permission == "Editor" && e.Type !== 'Program')
                            te = e;
                    });
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

                    if ($scope.current.Exam) {
                        var currentExamName = $scope.current.Exam.Name;
                        $scope.examList.forEach(function (e) {
                            if (currentExamName == e.Name)
                                te = e;
                        });
                    }
                    else {
                        $scope.examList.forEach(function (e) {
                            if (!te && !e.Lock && e.Permission == "Editor")
                                te = e;
                        });
                    }
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

        $scope.connection = gadget.getContract("makeUp.HS");

        $scope.connection.send({
            service: "_.GetMyMakeUpBatch",            
            body: {               

            },
            result: function (response, error, http) {

                if (error) {
                    alert("_.GetMyMakeUpBatch Error");
                } else {
                    $scope.$apply(function () {

                        $scope.batchList = [];
                        $scope.groupList = [];

                        [].concat(response.BatchList || []).forEach(function (batchRec, index) {

                            var repeatBatchRec = $scope.batchList.filter(_batchRec => _batchRec.BatchID == batchRec.BatchID);

                            // 一個 補考梯次 加入一次即可
                            if (repeatBatchRec.length == 0)
                            {
                                $scope.batchList.push(batchRec);                            
                            }                            
                        });

                        [].concat(response.GroupList || []).forEach(function (groupRec, index) {
                            $scope.groupList.push(groupRec);
                        });


                        $scope.setCurrentBatch($scope.batchList[0]);
                    });
                }
            }
        });

        
        $scope.setCurrentBatch = function (batch) {

            if ($scope.studentList) {
                var data_changed = !$scope.checkAllTable();
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動"))
                        return;
                }
            }

                        
            //$scope.current.Student = null;
            //$scope.studentList = null;

            $scope.current.Batch = batch;

            $scope.current.currentGroupList = [];

            // 篩選出 目前補考梯次的 補考群組
            var currentGroupList = $scope.groupList.filter(group => group.RefBatchID == $scope.current.Batch.BatchID);

            $scope.current.currentGroupList = currentGroupList;

            $scope.setCurrentGroup($scope.current.currentGroupList[0])

            $scope.examList = [];

                        
            
        }


        $scope.setCurrentGroup = function (group) {

            if ($scope.studentList) {
                var data_changed = !$scope.checkAllTable();
                if (data_changed) {
                    if (!window.confirm("警告:尚未儲存資料，現在離開視窗將不會儲存本次更動"))
                        return;
                }
            }

            //$scope.current.Student = null;
            //$scope.studentList = null;

            $scope.current.Group = group;

            // 抓 補考群組學生(包含補考資料)
            $scope.connection.send({
                service: "GetMakeUpStudentRecord",
                autoRetry: true,
                body: { GroupID: $scope.current.Group.GroupID },
                result: function (response, error, http) {
                    if (error) {
                        alert("GetMakeUpStudentRecord Error");
                    } else {
                        var studentMapping = {};
                        $scope.$apply(function () {
                            $scope.studentList = [];
                            [].concat(response.MakeUpDataList || []).forEach(function (MakeUpData, index) {

                                //var _MakeUpData;

                                //_MakeUpData.MakeUpDataID = MakeUpData.MakeUpDataID;

                                //_MakeUpData.RefStudentID = MakeUpData.RefStudentID;

                                //_MakeUpData.StudentName = MakeUpData.StudentName;

                                //_MakeUpData.Department = MakeUpData.Department;

                                //_MakeUpData.ClassName = MakeUpData.ClassName;

                                //_MakeUpData.SeatNo = MakeUpData.SeatNo;

                                //_MakeUpData.StudentNumber = MakeUpData.StudentNumber;

                                //_MakeUpData.Subject = MakeUpData.Subject;

                                //_MakeUpData.Level = MakeUpData.Level;

                                //_MakeUpData.Credit = MakeUpData.Credit;

                                //_MakeUpData.C_is_required_by = MakeUpData.C_is_required_by;

                                //_MakeUpData.C_is_required = MakeUpData.C_is_required;

                                //_MakeUpData.C_is_required = MakeUpData.C_is_required;

                                //_MakeUpData.Score = MakeUpData.Score;

                                //_MakeUpData.MakeUpScore = MakeUpData.MakeUpScore;

                                //_MakeUpData.PassStandard = MakeUpData.PassStandard;

                                //_MakeUpData.MakeUpStandard = MakeUpData.MakeUpStandard;

                                //_MakeUpData.DecimalNumber = MakeUpData.DecimalNumber;                                                                
                                //$scope.examList.forEach(function (examRec) {
                                //    studentRec["Exam" + examRec.ExamID] = '';
                                //});

                                MakeUpData.index = index;

                                MakeUpData['MakeUpScore'] = MakeUpData.MakeUpScore;

                                MakeUpData['MakeUpScoreOrigin'] = MakeUpData.MakeUpScore;

                                $scope.studentList.push(MakeUpData);
                                studentMapping[MakeUpData.RefStudentID] = MakeUpData;
                            });
                        });
                    }
                }
            });

        }

        $scope.checkAllTable = function () {
            var pass = true;
            if (pass)
                [].concat($scope.studentList || []).forEach(function (stuRec) {
                    if (pass)
                        pass = !!$scope.checkOneCell(stuRec, 'MakeUpScore');
                });
            return pass;
        }

        $scope.checkOneCell = function (studentRec, examKey) {
            var pass = true;
            pass = (studentRec[examKey] == studentRec[examKey + 'Origin']) || (studentRec[examKey + 'Origin'] === undefined);
            return pass;
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
