angular.module('gradebook', ['ui.sortable', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce'])

    .controller('MainCtrl', ['$scope', '$timeout',
        function ($scope, $timeout) {

            $scope.params = gadget.params;
            $scope.params.DefaultRound = gadget.params.DefaultRound || '2';

            $scope.changeSelectMode = function (mode) {
                $scope.current.SelectMode = mode;
                $timeout(function () {
                    $('.pg-seatno-textbox:visible').select().focus();
                }, 1);
            }

            $scope.setCurrent = function (student, setCondition, setFocus) {
                $scope.current.Student = student;

                var val = (student || {})['MakeUpScore'];
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
                $scope.setCurrent(nextStudent2 || nextStudent, false, false);
                $('.pg-seatno-textbox:visible').focus();
            }

            $scope.goPrev = function () {
                var currentIndex = $scope.current.Student ? $scope.current.Student.index : 0;
                $scope.setCurrent(
                    (currentIndex == 0) ?
                        $scope.studentList[$scope.studentList.length - 1] :
                        $scope.studentList[currentIndex - 1]
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
                    var round = Math.pow(10, $scope.current.Student.subjScorePoint||0);
                    temp = (Math.round(temp * round) / round).toFixed( $scope.current.Student.subjScorePoint);
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

                $scope.setCurrent(nextStudent, true, false);

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
                        MakeUpScores: []
                    }
                };
               

                [].concat($scope.studentList || []).forEach(function (studentRec, index) {

                    // 分數有更動 才做儲存
                    if (studentRec["MakeUpScore"] !== studentRec["MakeUpScoreOrigin"]) {
                        var MakeUpScore = {
                            '@MakeUpScoreID': studentRec.MakeUpDataID
                            , '@MakeUpScore': studentRec["MakeUpScore"]
                            , '@MakeUpScoreOri': studentRec["MakeUpScoreOrigin"]
                            , '@RefStudentID': studentRec.RefStudentID
                            , '@SchoolYear': $scope.current.Batch.SchoolYear
                            , '@Semester': $scope.current.Batch.Semester
                            , '@BatchName': $scope.current.Batch.BatchName
                            , '@GroupName': $scope.current.Group.GroupName
                            , '@StudentName': studentRec.StudentName
                            , '@Department': studentRec.Department
                            , '@ClassName': studentRec.ClassName
                            , '@SeatNo': studentRec.SeatNo
                            , '@Subject': studentRec.Subject
                            , '@Level': studentRec.Level
                            , '@Credit': studentRec.Credit
                            , '@C_is_required_by': studentRec.C_is_required_by
                            , '@C_is_required': studentRec.C_is_required
                            , '@Score': studentRec.Score
                            , '@PassStandard': studentRec.PassStandard
                            , '@MakeUpStandard': studentRec.MakeUpStandard
                        };
                        //  console.log(MakeUpScore);
                        body.Content.MakeUpScores.push(MakeUpScore);

                    }
                });

                $scope.connection.send({
                    service: "SetMakeUpStudentReocrd",
                    autoRetry: true,
                    body: body,
                    result: function (response, error, http) {
                        if (error) {
                            alert("儲存失敗：SetMakeUpStudentReocrd Error");
                        } else {

                            [].concat($scope.studentList || []).forEach(function (studentRec, index) {

                                studentRec["MakeUpScoreOrigin"] = studentRec["MakeUpScore"];
                            });

                            //$scope.checkAllTable();

                            // 目前 Group 重 Load 一次
                            $scope.setCurrentGroup($scope.current.Group);

                            alert("儲存完成。");
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

                    if (!$scope.current.Student) {
                        //#region 設定預設資料顯示
                        var ts;
                        if ($scope.studentList) ts = $scope.studentList[0];

                        if (ts) {
                            $scope.setCurrent(ts, true, true);
                        }

                        //#endregion
                    }
                    else {
                        var ts = $scope.current.Student,
                            te;
                        if (!ts && $scope.studentList && $scope.studentList.length > 0) ts = $scope.studentList[0];

                        $scope.setCurrent(ts, true, true);
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

                            $scope.HasNoCourse = false;

                            [].concat(response.BatchList || []).forEach(function (batchRec, index) {

                                var repeatBatchRec = $scope.batchList.filter(_batchRec => _batchRec.BatchID == batchRec.BatchID);

                                // 梯次開放輸入期間
                                /** 因為在 Safari, new Date('2021-02-01 00:00:00') 會是 invalid date, 不認得這種時間字串，
                                 * 所以就暫時先把時間部分去掉只剩日期，之後要改成從 db 判斷時間是否過期, 不要從 client判斷。  Kevin. */
                                var startDate = new Date(batchRec.BatchStartTime.split(' ')[0]);
                                var endDate = new Date(batchRec.BatchEndTime.split(' ')[0]);
                                endDate.setDate(endDate.getDate() + 1); // 多加一天
                                //batchRec.Lock = !(new Date(batchRec.BatchStartTime) < new Date() && new Date() < new Date(batchRec.BatchEndTime));
                                var now = new Date();
                                batchRec.Lock = !(startDate < now && now < endDate);

                                // 一個 補考梯次 加入一次即可
                                if (repeatBatchRec.length == 0) {
                                    $scope.batchList.push(batchRec);
                                }
                            });

                            [].concat(response.GroupList || []).forEach(function (groupRec, index) {
                                $scope.groupList.push(groupRec);
                            });

                            if ($scope.batchList.length == 0) {
                                // 本學期沒有任何補考梯次
                                $scope.HasNoCourse = true;
                            }
                            $scope.setCurrentBatch($scope.batchList[0]);


                        });
                    }
                }
            });

               // 取得學生資料 
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
                // 取得學生資料
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
                                    MakeUpData.index = index;
                                    MakeUpData['MakeUpScore'] = MakeUpData.MakeUpScore;
                                    MakeUpData['MakeUpScoreOrigin'] = MakeUpData.MakeUpScore;
                                    $scope.studentList.push(MakeUpData);
                                    studentMapping[MakeUpData.RefStudentID] = MakeUpData;
                                });

                            });

                            // 學生資料排序: 年級 班級 座號
                            {
                                $scope.studentList.sort((a, b) => {
                                    return a.SeatNo - b.SeatNo;
                                });
                                $scope.studentList.sort((a, b) => {
                                    if (a.ClassName < b.ClassName) {
                                        return -1;
                                    }
                                    if (a.ClassName > b.ClassName) {
                                        return 1;
                                    }
                                    return 0;
                                });
                                $scope.studentList.sort((a, b) => {
                                    return a.GradeYear - b.GradeYear;
                                });
                            }

                            // 重整資料索引
                            $scope.studentList.forEach((data, index) => {
                                data.index = index;
                            });

                            // 取得學生後，初始化
                            $scope.current.Student = null;
                            $scope.setupCurrent();
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
                pass = (studentRec[examKey] === studentRec[examKey + 'Origin']) || (studentRec[examKey + 'Origin'] === undefined);
                return pass;
            }

            // 匯出
            $scope.exportGradeBook = function () {
                var trList = [];
                var thList1 = [];


                thList1 = [
                    `<td rowspan='1' width='40px'>科別</td>`,
                    `<td rowspan='1' width='20px'>年級</td>`,
                    `<td rowspan='1' width='40px'>班級</td>`,
                    `<td rowspan='1' width='20px'>座號</td>`,
                    `<td rowspan='1' width='40px'>學號</td>`,
                    `<td rowspan='1' width='40px'>姓名</td>`,
                    `<td rowspan='1' width='40px'>科目名稱</td>`,
                    `<td rowspan='1' width='20px'>科目級別</td>`,
                    `<td rowspan='1' width='30px'>分數</td>`,
                    `<td rowspan='1' width='30px'>補考分數</td>`,
                    `<td rowspan='1' width='30px'>及格標準</td>`
                ];

                trList.push(`<tr>${thList1.join('')}</tr>`);

                [].concat($scope.studentList || []).forEach(function (stuRec) {
                    var studData = [];
                    studData.push(`<td>${stuRec.Department}</td>`);
                    studData.push(`<td>${stuRec.GradeYear}</td>`);
                    studData.push(`<td>${stuRec.ClassName}</td>`);
                    studData.push(`<td>${stuRec.SeatNo}</td>`);
                    studData.push(`<td>${stuRec.StudentNumber}</td>`);
                    studData.push(`<td>${stuRec.StudentName}</td>`);
                    studData.push(`<td>${stuRec.Subject}</td>`);
                    studData.push(`<td>${stuRec.Level}</td>`);
                    studData.push(`<td>${stuRec.Score}</td>`);
                    studData.push(`<td>${stuRec['MakeUpScore']}</td>`);
                    studData.push(`<td>${stuRec.PassingStandard}</td>`);

                    trList.push(`<tr>${studData.join('')}</tr>`);
                });

                var dd = new Date();

                var html = ` <html> <head> <meta http-equiv=\'Content-Type\'
            content=\'text/html; charset=utf-8\'/> <style type="text/css"> .text {
            mso-number-format:"\@" } </style> </head> <body> <table border='1'
            cellspacing='0' cellpadding='2'> <tbody
            align='center'>${$scope.current.Batch.BatchName}    
             ${$scope.current.Group.GroupName}
            ${trList.join('')} </tbody> </table> <br/>教師簽名： <br/><br/><br/>列印日期：${dd.getFullYear() + "/" + (dd.getMonth() + 1) + "/" + dd.getDate()}</body> </html>`;

                saveAs(new Blob([html], { type: "application/octet-stream" }), $scope.current.Batch.BatchName + '.xls');

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
