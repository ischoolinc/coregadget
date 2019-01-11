$(document).ready(function() {
    $(window).resize(function() {
        $("#container-nav, #container-main").height($(window).height() - 50);
        //console.log($(window).height() - 50);
    });
});

function parseDateUTC(input) {
    var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    var parts = reg.exec(input);
    return parts ? (new Date(Date.UTC(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]))) : null
};
//Expect input as y/m/d
//http://stackoverflow.com/questions/5812220/how-to-validate-a-date
function isValidDate2(s) {
    if (s == '-'){
        return true;
    }
    else {
        var bits = s.split('/');
        var y = bits[0],
            m = bits[1],
            d = bits[2];
        // Assume not leap year by default (note zero index for Jan)
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // If evenly divisible by 4 and not evenly divisible by 100,
        // or is evenly divisible by 400, then a leap year
        if ((!(y % 4) && y % 100) || !(y % 400)) {
            daysInMonth[1] = 29;
        }
        return d <= daysInMonth[--m]
    }
}
var app = angular
    .module("app", ['ui.bootstrap'])
    .filter('myDateFormat', function($filter) {
        return function(text, format) {
            var tempdate = new Date(text.replace(/-/g, "/"));
            // //console.log(tempdate);
            if (tempdate && tempdate != 'Invalid Date' && !isNaN(tempdate))
                return $filter('date')(tempdate, format);
        };
    })
    .directive('selectOnFocus', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('focus', function(e) {
                    $timeout(function() {
                        elem.select();
                    }, 1);
                });
            }
        };
    })
    .directive('keyFocus', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('keyup', function(e) {
                    // up arrow
                    if (e.keyCode == 38) {
                        if (!scope.$first) {
                            angular.element(elem[0]).parent().parent().prev().find('input').focus();
                            //elem[0].previousElementSibling.focus();
                        }
                    }
                    // down arrow
                    else if (e.keyCode == 40 || e.keyCode == 13) {
                        if (!scope.$last) {
                            angular.element(elem[0]).parent().parent().next().find('input').focus();
                            //elem[0].nextElementSibling.focus();
                        }
                    }
                });
            }
        };
        // $('input').on('keydown', function(e) {
        //         var current_td_index = $(this).closest('td').index();
        //         if (e.which === 13 || e.which === 40) {
        //             $(this).closest('td').closest('tr').next().find('td:nth-child(' + (current_td_index + 1) + ')>input').focus();
        //             e.preventDefault();
        //         }
        //         if (e.which === 38) {
        //             $(this).closest('td').closest('tr').prev().find('td:nth-child(' + (current_td_index + 1) + ')>input').focus();
        //             e.preventDefault();
        //         }
        //     });
    })
    .directive('initFocus', function() {
        var timer;
        return function(scope, elm, attr) {
            if (timer) clearTimeout(timer);

            timer = setTimeout(function() {
                elm.focus();
                //console.log('focus', elm);
            }, 0);
        }
    })
    .controller("Ctrl", function($scope, $modal, $filter) {
        $scope.showRule = function() {
            var modalInstance = $modal.open({
                templateUrl: 'myModalRule.html',
                controller: ModalRuleCtrl,
            });
        }
        $scope.ngObjFixHack = function(ngObj) {
            var output;

            output = angular.toJson(ngObj);
            output = angular.fromJson(output);

            return output;
        }
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $scope.datePickerOpen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
        $scope.contract = gadget.getContract("ischool.fitness.input.peteacher");
        $scope.menu = [];
        $scope.checkListBool = false;
        $scope.init = function() {
            $scope.getMenu();
        }
        $scope.getMenu = function() {
            $scope.contract.send({
                service: "GetMenu",
                body: {},
                result: function(response, error, http) {
                    //console.log(response.data);
                    //console.log(response.error);
                    if (!error) {
                        if (response.data)
                            $scope.menu = [].concat(response.data);
                    } else {
                        $scope.icon_css = "icon-warning-sign";
                        set_error_message("#mainMsg", "GetMenu", error);
                    }
                    $scope.safeApply();
                    CurrentChanged();
                }
            });
        }
        $scope.setCurrent = function(m) {
            $scope.current = m;
            CurrentChanged();
        }
        $scope.getList = function($course_id) {
            $scope.list = [];
            $scope.contract.send({
                service: "GetList",
                body: {
                    course_id: $course_id
                },
                result: function(response, error, http) {
                    //console.log(response);
                    //console.log(error);
                    if (!error) {
                        if (response.data)
                            $scope.list = [].concat(response.data);
                        listCheck();
                    } else {
                        $scope.icon_css = "icon-warning-sign";
                        set_error_message("#mainMsg", "GetList", error);
                    }
                    $scope.safeApply();
                }
            });
        }
        $scope.refresh = function() {
            $scope.init();
        }
        function listCheck() {
            //for (var i = 0; i < $scope.list.length; i++) {
            //    if ( !$scope.list[i].test_date ) {
            //        $scope.checkListBool = false;
            //        return false;
            //    }
            //};
            $scope.checkListBool = true;
            return true ;
        }
        $scope.showEditForm = function(column, defaultValue) {
            if ( $scope.saving )
                return;
            if (!$scope.current || !$scope.current.id)
                return;
            if ($scope.current.start_time && $scope.current.end_time && (
                (new Date($scope.current.start_time)).getTime() >= (new Date()).getTime() ||
                (new Date($scope.current.end_time)).getTime() <= (new Date()).getTime()
            ))
                return;
            if (column != "test_date" && !listCheck())
                return;
            if (Object.prototype.toString.call(defaultValue) === '[object Date]')
                defaultValue = $filter('date')(defaultValue, 'yyyy/M/d');
            var tmplist = [];
            for (var i = 0; i < $scope.list.length; i++) {
                tmplist.push({
                    uid: $scope.list[i].uid,
                    student_id: $scope.list[i].student_id,
                    seat_no: $scope.list[i].seat_no,
                    name: $scope.list[i].name,
                    value: defaultValue || $scope.list[i][column],
                });
            };
            if (column == "test_date" && defaultValue && !isValidDate2(defaultValue)) {
                return;
            }
            if (defaultValue) {
                $scope.save({
                    column: column,
                    course_id: $scope.current.id,
                    detail: tmplist
                });
            } else {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        column: function() {
                            return column;
                        },
                        tmplist: function() {
                            return tmplist;
                        }
                    }
                });
                modalInstance.result.then(function(tmplist) {
                    $scope.save({
                        column: column,
                        course_id: $scope.current.id,
                        detail: tmplist
                    });
                }, function() {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            }
        }
        $scope.save = function(data) {
            //       data = { column : 'test_date',
            //     course_id : $scope.current.id,
            //     detail: [{seat_no:int,value:string},{seat_no:int,value:string},...]
            // };
            $scope.saving = true ;
            data = $scope.ngObjFixHack(data);
            //console.log(data);
            $scope.contract.send({
                service: "SetFitness1Col",
                body: data,
                result: function(response, error, http) {
                    $scope.saving = false ;
                    //console.log(response);
                    //console.log(error);
                    if (!error) {
                        response.data.detail = [].concat(response.data.detail);
                        var tmp = [];
                        var msg = [];
                        for (var i = 0; i < response.data.detail.length; i++) {
                            tmp[response.data.detail[i].student_id] = response.data.detail[i].value;
                            if (response.data.detail[i].status != "success")
                                msg.push(response.data.detail[i].name);
                        };
                        if (msg.length > 0)
                            set_error_message("#mainMsg", "儲存發生錯誤", {
                                loginError: {},
                                message: '下列學生儲存發生錯誤，請確認是否在資料輸入區間或稍後再試一次：<br>' + msg.join(",")
                            });
                        for (var i = 0; i < $scope.list.length; i++) {
                            $scope.list[i][response.data.column] = tmp[$scope.list[i].student_id];
                        }
                        listCheck();
                    } else {
                        $scope.icon_css = "icon-warning-sign";
                        set_error_message("#mainMsg", "SetFitness1Col", error);
                    }
                    $scope.$apply();
                }
            });
        }
        var CurrentChanged = function(argument) {
            if ($scope.current == null && $scope.menu[0])
            {
                $scope.current = $scope.menu[0];
                $scope.current.inPeriod = (new Date($scope.current.start_time)).getTime() >= (new Date()).getTime() || (new Date($scope.current.end_time)).getTime() <= (new Date()).getTime();
            }
            if ($scope.menu[0]) {
                $scope.getList($scope.current.id);
            } else {
                $scope.current = {
                    course_name: '無教授體育課程'
                };
                $scope.$apply();
            }
        }
        // 體適能測驗項目
        $scope.arrayTestItem = [
            {
                Name: "測驗日期",
                Key: "test_date",
                Validate: isValidDate2,
                errorMsg: "資料格式不正確，請填入EX:2014/08/07"
            },
            {
                Name: "身高(cm)",
                Key: "height",
                Validate: /^[1-9]\d*$|^[1-9]\d*\.\d*$|^免測$|^$/,
                errorMsg: "資料格式不正確，請輸入數字或免測"
            },
            {
                Name: "體重(kg)",
                Key: "weight",
                Validate: /^[1-9]\d*$|^[1-9]\d*\.\d*$|^免測$|^$/,
                errorMsg: "資料格式不正確，請輸入數字或免測"
            },
            {
                Name: "坐姿體前彎(cm)",
                Key: "sit_and_reach",
                Validate: /^[1-9]\d*$|^免測$|^$/,
                errorMsg: "資料格式不正確，請輸入數字或免測"
            },
            {
                Name: "立定跳遠(cm)",
                Key: "standing_long_jump",
                Validate: /^[1-9]\d*$|^免測$|^$/,
                errorMsg: "資料格式不正確，請輸入數字或免測"
            },
            {
                Name: "仰臥起坐(次)",
                Key: "sit_up",
                Validate: /^[1-9]\d*$|^免測$|^$/,
                errorMsg: "資料格式不正確，請輸入數字或免測"
            },
            {
                Name: "心肺適能(秒)",
                Key: "cardiorespiratory",
                Validate: /^[1-9]\d*$|^[1-9]\d*\.[0-5]\d$|^免測$|^$/,
                errorMsg: "資料格式不正確，200秒可輸入200或3.20 <擇一輸入>或免測"
            },
        ];
        // 匯入的項目
        $scope.targetItem = {};
        // 初始匯入按鈕
        $scope.initImportItem = function () {
            $scope.arrayTestItem.forEach(function (item) {
                item.Fn = function () {
                    delete item.InputData;
                    delete item.InputValues;
                    $('#importModal').modal('show');
                    $scope.targetItem = item
                };
                item.Parse = function () {
                    item.InputData = item.InputData || '';
                    item.InputValues = item.InputData.split("\n");
                    item.HasError = false;
                    // 資料驗證
                    for (var i = 0; i < item.InputValues.length; i++) {
                        var flag = false;
                        //$scope.list[i][item.Key] = item.InputValues[i];
                        //var value = $scope.list[i][item.Key];
                        var value = item.InputValues[i].trim();
                        //var value = Number(item.InputValues[i].trim());

                        if (!isNaN(Number(value))) {
                            if (item.InputValues[i] != '') {
                                flag = true;
                            }
                        }
                        // 使用者若知道其學生沒有資料，請在其欄位內輸入 - ，程式碼會將其填上空值 
                        if (item.InputValues[i] == '-') {
                            flag = true;
                            //item.InputValues[i] = '';
                            //if (item.Key != 'test_date'){
                            //    item.InputValues[i] = '';
                            //}
                        }
                        // 執行驗證規則
                        if (angular.isFunction(item.Validate)) {
                            if (item.Validate(value)) {
                                flag = true;
                            }
                            else {
                                flag = false;
                            }
                        }
                        else {
                            if (value.match(item.Validate)) {
                                flag = true;
                            }
                        }
                        // 最後
                        if (flag) {
                            if (!isNaN(value) && item.InputValues[i] != '') {
                                item.InputValues[i] = value;
                            }
                        }
                        else {
                            item.InputValues[i] = '錯誤';//item.errorMsg;
                            item.HasError = true;
                        }
                        
                    }
                    // 狀況:匯入的資料超過學生數
                    $scope.list.forEach(function (stuRec, index) {
                        if (index >= item.InputValues.length) {
                            item.InputValues.push('錯誤');
                            item.HasError = true;
                        }
                    });
                };
                item.GoBack = function () {
                    delete item.InputValues;
                };
                item.Import = function () {
                    if (item.HasError == true)
                        return;
                    // 介面暫存資料
                    //$scope.list.forEach(function (stuRec, index) {
                    //    if (item.InputValues[index] == '-') {
                    //        stuRec[item.Key] = '';
                    //    }
                    //    else {
                    //        stuRec[item.Key] = item.InputValues[index];
                    //    }
                    //});
                    // 資料整理
                    var dataRow = [];
                    $scope.list.forEach(function (stuRec, index) {
                        if (item.InputValues[index] == '-'){
                            dataRow.push({
                                uid: stuRec.uid,
                                student_id: stuRec.student_id,
                                seat_no: stuRec.seat_no,
                                name: stuRec.name,
                                value: ''
                            });
                        }
                        else {
                            dataRow.push({
                                uid: stuRec.uid,
                                student_id: stuRec.student_id,
                                seat_no: stuRec.seat_no,
                                name: stuRec.name,
                                value: item.InputValues[index]
                            });
                        }
                    });
                    //$scope.list.forEach(function (stuRec, index) {
                    //    dataRow.push({
                    //        uid: stuRec.uid,
                    //        student_id: stuRec.student_id,
                    //        seat_no: stuRec.seat_no,
                    //        name: stuRec.name,
                    //        value: stuRec[item.Key]
                    //    });
                    //});

                    // 儲存置資料庫
                    $scope.save({
                        column: item.Key,
                        course_id: $scope.current.id,
                        detail: dataRow
                    });

                    $('#importModal').modal('hide');
                };
            });
        };

    });
var set_error_message = function(select_str, serviceName, error) {
    var tmp_msg;

    tmp_msg = "<i class=\"icon-white icon-info-sign \"></i><strong class=\"my-err-info\">呼叫服務失敗或網路異常，請稍候重試!</strong>(" + serviceName + ")";
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
        $(select_str).html("<div class=\"alert alert-danger\"><button class=\"close\" data-dismiss=\"alert\">×</button>" + tmp_msg + "</div>");
        return $(".my-err-info").click(function() {
            return alert("請拍下此圖，並與客服人員連絡，謝謝您。\n" + JSON.stringify(error, null, 2));
        });
    }
};
var ModalInstanceCtrl = function($scope, column, tmplist) {
    var columnObj = {
        test_date: {
            header: "測驗日期",
            validate: isValidDate2,
            errorMsg: "資料格式不正確，請填入EX:2014/08/07"
        },
        height: {
            header: "身高(cm)",
            validate: /^[1-9]\d*$|^[1-9]\d*\.\d*$|^免測$|^$/,
            errorMsg: "資料格式不正確，請輸入數字或免測"
        },
        weight: {
            header: "體重(kg)",
            validate: /^[1-9]\d*$|^[1-9]\d*\.\d*$|^免測$|^$/,
            errorMsg: "資料格式不正確，請輸入數字或免測"
        },
        sit_and_reach: {
            header: "坐姿體前彎(cm)",
            validate: /^[1-9]\d*$|^免測$|^$/,
            errorMsg: "資料格式不正確，請輸入整數或免測"
        },
        standing_long_jump: {
            header: "立定跳遠(cm)",
            validate: /^[1-9]\d*$|^免測$|^$/,
            errorMsg: "資料格式不正確，請輸入整數或免測"
        },
        sit_up: {
            header: "仰臥起坐(次)",
            validate: /^[1-9]\d*$|^免測$|^$/,
            errorMsg: "資料格式不正確，請輸入整數或免測"
        },
        cardiorespiratory: {
            header: "心肺適能(秒)",
            validate: /^[1-9]\d*$|^[1-9]\d*\.[0-5]\d$|^免測$|^$/,
            errorMsg: "資料格式不正確，200秒可輸入200或3.20 <擇一輸入>或免測"
        },
    };

    $scope.column_text = columnObj[column].header;
    $scope.tmplist = tmplist;
    $scope.ok = function() {
        var tag = true;
        var tmp = null;
        var match ;
        for (var i = 0; i < $scope.tmplist.length; i++) {
            tmp = $scope.tmplist[i];
            tmp.value = tmp.value.trim();
            if (angular.isFunction(columnObj[column].validate)) {
                tmp.unvalidated = !columnObj[column].validate(tmp.value);
            } else {
                match = tmp.value.match(columnObj[column].validate);
                tmp.unvalidated = !match ;
            }
            if ( tag && tmp.unvalidated ) {
                tmp.focus = true;
                tag = false;
            }
            else {
                if (tmp.value == '-') {
                    $scope.tmplist[i].value = '';
                }
            }
        };
        if (tag) {
            $scope.$close($scope.tmplist);
        } else {
            alert(columnObj[column].errorMsg);
        }
    };
    $scope.cancel = function() {
        $scope.$dismiss('cancel');
    };
};
var ModalRuleCtrl = function($scope)
{
    $scope.cancel = function() {
        $scope.$dismiss('cancel');
    };
}