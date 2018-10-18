(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".setBtn {\n    cursor: pointer;\n}\n.thBorder {\n    background: #eee;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <h1>導師-線上點名</h1>\n  <div>\n    <div *ngIf=\"canCrossDate\" style=\"margin-top:15px;\">\n      <span>日期：</span>\n      <div style=\"position: relative;display: inline-block;vertical-align: middle;\">\n        <div class=\"input-group input-group-sm\"\n             style=\"width:380px;\">\n          <input type=\"text\"\n                 class=\"form-control\"\n                 [ngModel]=\"inputDate\"\n                 (ngModelChange)=\"checkDate($event)\" />\n          <span class=\"input-group-btn\">\n            <button type=\"button\"\n                    class=\"btn btn-default\"\n                    (click)=\"setCurrentDate(todayDate)\"\n                    [ngClass]=\"{'btn-primary': getDateString(currentDate)==getDateString(todayDate)}\">今天\n            </button>\n            <button type=\"button\"\n                    (click)=\"setCurrentDate(currentDate, -1)\"\n                    class=\"btn btn-default\">前一天\n            </button>\n            <button type=\"button\"\n                    (click)=\"setCurrentDate(currentDate, 1)\"\n                    class=\"btn btn-default\">後一天\n            </button>\n            <button type=\"button\"\n                    (click)=\"setCurrentDate(currentDate, -7)\"\n                    class=\"btn btn-default\">上一週\n            </button>\n            <button type=\"button\"\n                    (click)=\"setCurrentDate(currentDate, 7)\"\n                    class=\"btn btn-default\">下一週\n            </button>\n          </span>\n        </div>\n      </div>\n      <span *ngIf=\"inputDate!=getDateString(currentDate)\"\n            class=\"text-danger\">日期格式錯誤</span>\n    </div>\n    <div *ngIf=\"!canCrossDate\" style=\"margin-top:15px;\">\n      <span>日期：{{getDateString(todayDate)}}</span>\n    </div>\n    <div style=\"margin-top:15px;\">\n      <span>請選擇班級：</span>\n      <div class=\"btn-group\"\n           role=\"group\"\n           aria-label=\"假別\">\n        <button *ngFor=\"let item of classes\"\n                (click)=\"toggleClassDate(item)\"\n                type=\"button\"\n                class=\"btn btn-sm\"\n                [ngClass]=\"{'btn-primary': selClass==item, 'btn-default': selClass!=item}\">{{item.className}}</button>\n      </div>\n    </div>\n  </div>\n  <div *ngIf=\"selClass\">\n    <div style=\"margin-top:15px;\">\n      <span>請選擇假別：</span>\n      <div class=\"btn-group\"\n           role=\"group\"\n           aria-label=\"假別\">\n        <button (click)=\"currAbs=clearAbs\"\n                type=\"button\"\n                class=\"btn btn-sm\"\n                [ngClass]=\"{'btn-primary': currAbs==clearAbs, 'btn-default': currAbs!=clearAbs}\">清除</button>\n        <button *ngFor=\"let abs of absences\"\n                (click)=\"currAbs=abs\"\n                type=\"button\"\n                class=\"btn btn-sm\"\n                [ngClass]=\"{'btn-primary': currAbs==abs, 'btn-default': currAbs!=abs}\">{{abs.name}}</button>\n      </div>\n    </div>\n    <table class=\"table table-bordered table-hover table-striped\"\n           style=\"margin-top: 15px;\">\n      <thead>\n        <tr>\n          <th class=\"thBorder\"\n              style=\"min-width:110px;\">\n            <div *ngIf=\"getDateString(currentDate)==getDateString(todayDate)\">\n              <div class=\"btn-group\">\n                <button (click)=\"saveData()\"\n                        type=\"button\"\n                        class=\"btn btn-sm\"\n                        [ngClass]=\"{'btn-success': completed=='t', 'btn-warning': completed!='t'}\">\n                  {{(completed=='t') ? '儲存變更' : '完成點名'}}\n                </button>\n              </div>\n              <span *ngIf=\"completed=='t'\"\n                    class=\"text-muted\">\n                已點名\n              </span>\n            </div>\n            <div *ngIf=\"getDateString(currentDate)!=getDateString(todayDate)\">\n              <div class=\"btn-group\">\n                <button (click)=\"saveData()\"\n                        type=\"button\"\n                        class=\"btn btn-sm btn-danger\">\n                  儲存變更\n                </button>\n              </div>\n              <span *ngIf=\"completed=='t'\"\n                    class=\"text-danger\">\n                {{getDateString(currentDate)}}\n              </span>\n            </div>\n          </th>\n          <th *ngFor=\"let period of periods\"\n              (click)=\"setAllStudentsAbs(period)\"\n              class=\"setBtn thBorder text-center\">\n            {{period.name}}\n          </th>\n        </tr>\n      </thead>\n      <tbody>\n        <ng-container *ngFor=\"let stu of students;let i = index\">\n          <tr *ngIf=\"i > 0 && i % 5 ==0\">\n            <th class=\"thBorder\">\n            </th>\n            <th *ngFor=\"let period of periods\"\n                (click)=\"setAllStudentsAbs(period)\"\n                class=\"setBtn thBorder text-center\">\n              {{period.name}}\n            </th>\n          </tr>\n          <tr>\n            <td (click)=\"setStudentAllPeriodAbs(stu)\"\n                class=\"setBtn\">\n              {{stu.seatNo}}. {{stu.name}}\n            </td>\n            <td *ngFor=\"let period of periods\"\n                (click)=\"setStudentPeroidAbs(stu, period)\"\n                title=\"{{period.name}}\"\n                [class.setBtn]=\"!(stu.leaveList.get(period.name)?.isLock)\"\n                style=\"position:relative\">\n              <div *ngIf=\"stu.leaveList.get(period.name)?.absName != stu.orileaveList.get(period.name)?.absName\"\n                   style=\"display:inline-block;background-color:red;position:absolute;left:3px;top:3px;width:5px;height:6px;border-radius:5px;\"></div>\n              <span [class.text-muted]=\"(stu.leaveList.get(period.name)?.isLock)\">\n                {{toShort(stu.leaveList.get(period.name)?.absName)}}\n              </span>\n            </td>\n          </tr>\n        </ng-container>\n      </tbody>\n    </table>\n    <p *ngIf=\"students.length==0\">目前無資料</p>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _help_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./help-class */ "./src/app/help-class.ts");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.service */ "./src/app/app.service.ts");
/* harmony import */ var rxjs_Rx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/Rx */ "./node_modules/rxjs-compat/_esm5/Rx.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(appService, change) {
        this.appService = appService;
        this.change = change;
        this.classes = new Array();
        /**可設定的假別 */
        this.absences = new Array();
        /**全部的假別 */
        this.allAbsences = new Array();
        this.clearAbs = new _help_class__WEBPACK_IMPORTED_MODULE_1__["Absence"](null, null);
        /**節次 */
        this.periods = new Array();
        this.periodMap = new Map();
        this.students = new Array();
        this.classSubject$ = new rxjs_Rx__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        /**允許跨日設定 */
        this.canCrossDate = false;
        this.currentDate = new Date(new Date().toDateString());
        this.todayDate = new Date(new Date().toDateString());
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // 預設值
        this.currAbs = this.clearAbs;
        this.completed = false;
        this.inputDate = this.getDateString(this.currentDate);
        // 取得假別、節次、老師帶班
        rxjs_Rx__WEBPACK_IMPORTED_MODULE_3__["Observable"].combineLatest(this.appService.getConfig(), this.appService.getAbsences(), this.appService.getPeriods(), this.appService.getMyClass(), function (config, x, y, z) {
            _this.canCrossDate = config.crossDate;
            // 比對設定檔，為 true 的假別才顯示
            if (config.absenceNames.length) {
                var absencesList = [];
                for (var _i = 0, x_1 = x; _i < x_1.length; _i++) {
                    var item = x_1[_i];
                    if (config.absenceNames.indexOf(item.name) !== -1) {
                        absencesList.push(item);
                    }
                }
                _this.absences = absencesList;
            }
            else {
                _this.absences = x;
            }
            _this.allAbsences = x;
            _this.periods = y;
            y.forEach(function (p) {
                _this.periodMap.set(p.name, p);
            });
            _this.classes = z;
        })
            .subscribe(function () {
            // 全部取回後，進行處理
            if (_this.classes && _this.classes.length) {
                // 指定目前班級為第一個班級
                _this.selClass = _this.classes[0];
                // 訂閱班級異動
                _this.classSubject$.subscribe(function (c) {
                    rxjs_Rx__WEBPACK_IMPORTED_MODULE_3__["Observable"].combineLatest(_this.appService.getClassStudentsLeave(c, _this.getDateString(_this.currentDate), _this.absences), _this.appService.getRollcallState(c), function (studs, complete) {
                        _this.students = studs;
                        _this.completed = complete;
                    })
                        .subscribe();
                });
                // 切換班級
                _this.toggleClassDate();
            }
        });
    };
    AppComponent.prototype.getDateString = function (dateTime) {
        return dateTime.getFullYear() + "/" + (dateTime.getMonth() + 1) + "/" + dateTime.getDate();
    };
    AppComponent.prototype.checkDate = function (input) {
        var d = Date.parse(input);
        if (d) {
            this.setCurrentDate(new Date(d));
        }
        else {
            this.inputDate = input;
        }
    };
    AppComponent.prototype.setCurrentDate = function (target, shift) {
        target = new Date(target);
        if (shift) {
            target.setDate(target.getDate() + shift);
        }
        if (this.getDateString(this.currentDate) != this.getDateString(target)) {
            this.currentDate = target;
            this.toggleClassDate();
        }
        this.inputDate = this.getDateString(this.currentDate);
    };
    /**切換班級或缺曠日期，取得「該日學生缺曠」、「點名完成」狀態 */
    AppComponent.prototype.toggleClassDate = function (targetClass) {
        if (targetClass)
            this.selClass = targetClass;
        if (this.selClass) {
            this.classSubject$.next(this.selClass);
        }
    };
    /**假別簡稱 */
    AppComponent.prototype.toShort = function (name) {
        for (var _i = 0, _a = this.allAbsences; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.name == name) {
                return n.abbreviation;
            }
        }
        return '';
    };
    /**設定全部學生該節次統一假別 */
    AppComponent.prototype.setAllStudentsAbs = function (period) {
        var _this = this;
        if (period && this.currAbs) {
            this.students.forEach(function (stu) {
                stu.setAbsence(period.name, _this.currAbs.name);
            });
        }
    };
    /**設定單一學生所有節次統一假別 */
    AppComponent.prototype.setStudentAllPeriodAbs = function (stu) {
        var _this = this;
        if (stu && this.currAbs) {
            this.periods.forEach(function (period) {
                stu.setAbsence(period.name, _this.currAbs.name);
            });
        }
    };
    /**設定單一學生單一節次假別 */
    AppComponent.prototype.setStudentPeroidAbs = function (stu, period) {
        if (stu && period && this.currAbs) {
            if (stu.leaveList.has(period.name)) {
                // 與上次相同即清除
                if (stu.leaveList.get(period.name).absName == this.currAbs.name) {
                    stu.setAbsence(period.name, this.clearAbs.name);
                }
                else {
                    stu.setAbsence(period.name, this.currAbs.name);
                }
            }
            else {
                stu.setAbsence(period.name, this.currAbs.name);
            }
        }
    };
    /**儲存點名結果 */
    AppComponent.prototype.saveData = function () {
        var _this = this;
        var data = [];
        this.students.forEach(function (s) {
            var tmpDetail = '';
            s.leaveList.forEach(function (value, key) {
                var periodName = s.leaveList.get(key).periodName;
                var periodType = _this.periodMap.get(periodName).type;
                var absName = s.leaveList.get(key).absName;
                tmpDetail += "<Period AbsenceType=\"" + absName + "\" AttendanceType=\"" + periodType + "\">" + periodName + "</Period>";
            });
            data.push({
                sid: s.sid,
                detail: (tmpDetail) ? "<Attendance>" + tmpDetail + "</Attendance>" : ''
            });
        });
        this.appService.saveStudentLeave(this.selClass, this.getDateString(this.currentDate), data).subscribe(function () {
            // 重取缺曠狀態
            _this.toggleClassDate();
        });
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_app_service__WEBPACK_IMPORTED_MODULE_2__["AppService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.service */ "./src/app/app.service.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_3__["HttpModule"]
            ],
            providers: [_app_service__WEBPACK_IMPORTED_MODULE_4__["AppService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.service.ts":
/*!********************************!*\
  !*** ./src/app/app.service.ts ***!
  \********************************/
/*! exports provided: AppService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppService", function() { return AppService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _help_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./help-class */ "./src/app/help-class.ts");
/* harmony import */ var rxjs_Rx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Rx */ "./node_modules/rxjs-compat/_esm5/Rx.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppService = /** @class */ (function () {
    // p.kcbs.hc.edu.tw
    function AppService(zone) {
        this.zone = zone;
    }
    /**呼叫 gadget service */
    AppService.prototype.send = function (opts) {
        var _this = this;
        return rxjs_Rx__WEBPACK_IMPORTED_MODULE_2__["Observable"].create(function (subj$) {
            var connection = gadget.getContract(opts.contact);
            connection.send({
                service: opts.service,
                body: opts.body,
                result: function (response, error) {
                    if (error !== null) {
                        subj$.error(error);
                    }
                    else {
                        _this.zone.run(function () {
                            subj$.next(opts.map(response));
                            subj$.complete();
                        });
                    }
                }
            });
        });
    };
    /**取得老師帶班 */
    AppService.prototype.getMyClass = function () {
        return this.send({
            contact: "cloud.teacher",
            service: "beta.GetMyClass",
            body: "",
            map: function (rsp) {
                var classes = new Array();
                if (rsp.Class) {
                    rsp.Class = [].concat(rsp.Class || []);
                    rsp.Class.forEach(function (item) {
                        classes.push(new _help_class__WEBPACK_IMPORTED_MODULE_1__["Class"](item.ClassId, item.ClassName, item.GradeYear));
                    });
                }
                return classes;
            }
        });
    };
    /**取得節次 */
    AppService.prototype.getPeriods = function () {
        return this.send({
            contact: "cloud.public",
            service: "beta.GetSystemConfig",
            body: { Name: '節次對照表' },
            map: function (rsp) {
                var periods = new Array();
                if (rsp.List && rsp.List.Content && rsp.List.Content.Periods && rsp.List.Content.Periods.Period) {
                    rsp.List.Content.Periods.Period = [].concat(rsp.List.Content.Periods.Period || []);
                    rsp.List.Content.Periods.Period.forEach(function (item) {
                        periods.push(new _help_class__WEBPACK_IMPORTED_MODULE_1__["Period"](item.Name, Number(item.Sort), item.Type));
                    });
                    // 排序
                    periods.sort(function (a, b) {
                        if (a.sort > b.sort) {
                            return 1;
                        }
                        if (a.sort < b.sort) {
                            return -1;
                        }
                        return 0;
                    });
                }
                return periods;
            }
        });
    };
    /**取得假別 */
    AppService.prototype.getAbsences = function () {
        return this.send({
            contact: "cloud.public",
            service: "beta.GetSystemConfig",
            body: { Name: '假別對照表' },
            map: function (rsp) {
                var absences = new Array();
                if (rsp.List && rsp.List.Content && rsp.List.Content.AbsenceList && rsp.List.Content.AbsenceList.Absence) {
                    rsp.List.Content.AbsenceList.Absence = [].concat(rsp.List.Content.AbsenceList.Absence || []);
                    rsp.List.Content.AbsenceList.Absence.forEach(function (item) {
                        absences.push(new _help_class__WEBPACK_IMPORTED_MODULE_1__["Absence"](item.Name, item.Abbreviation));
                    });
                }
                return absences;
            }
        });
    };
    /**取得今天某班級點名狀態 */
    AppService.prototype.getRollcallState = function (selClass) {
        return this.send({
            contact: "p_kcbs.rollCallBook.teacher",
            service: "_.checkTodayRollCall",
            body: { classId: selClass.classId },
            map: function (rsp) {
                return rsp.completed;
            }
        });
    };
    /**取得班級學生及今天請假狀態 */
    AppService.prototype.getClassStudentsLeave = function (selClass, occurDate, absences) {
        var aryAbsence = [];
        for (var _i = 0, absences_1 = absences; _i < absences_1.length; _i++) {
            var item = absences_1[_i];
            aryAbsence.push(item.name);
        }
        return this.send({
            contact: "p_kcbs.rollCallBook.teacher",
            service: "_.getStudentAttendance",
            body: { classId: selClass.classId, OccurDate: occurDate },
            map: function (rsp) {
                var students = new Array();
                if (rsp.Student) {
                    var stus = [].concat(rsp.Student || []);
                    stus.forEach(function (item) {
                        var leaves = new Map();
                        var orileaves = new Map();
                        if (item.Detail && item.Detail.Attendance && item.Detail.Attendance.Period) {
                            var periods = [].concat(item.Detail.Attendance.Period || []);
                            periods.forEach(function (p) {
                                var isLock = (aryAbsence.indexOf(p.AbsenceType) !== -1) ? false : true;
                                leaves.set(p['@text'], new _help_class__WEBPACK_IMPORTED_MODULE_1__["Leave"](p['@text'], p.AbsenceType, isLock));
                                orileaves.set(p['@text'], new _help_class__WEBPACK_IMPORTED_MODULE_1__["Leave"](p['@text'], p.AbsenceType, isLock));
                            });
                        }
                        students.push(new _help_class__WEBPACK_IMPORTED_MODULE_1__["Student"](item.StudentId, item.StudentName, item.SeatNo, leaves, orileaves));
                    });
                }
                return students;
            }
        });
    };
    /**儲存學生請假狀況 */
    AppService.prototype.saveStudentLeave = function (selClass, occurDate, data) {
        return this.send({
            contact: "p_kcbs.rollCallBook.teacher",
            service: "_.setStudentAttendance",
            body: {
                classId: selClass.classId,
                OccurDate: occurDate,
                students: { student: data }
            },
            map: function (rsp) {
                return rsp.complete;
            }
        });
    };
    /**取得班導師點名設定 */
    AppService.prototype.getConfig = function () {
        return this.send({
            contact: "cloud.public",
            service: "beta.GetSystemConfig",
            body: { Name: '班導師點名設定' },
            map: function (rsp) {
                var absenceNames = new Array();
                var crossDate = false;
                // 可設定的假別
                if (rsp.List && rsp.List.Content && rsp.List.Content.AbsenceList && rsp.List.Content.AbsenceList.Absence) {
                    rsp.List.Content.AbsenceList.Absence = [].concat(rsp.List.Content.AbsenceList.Absence || []);
                    rsp.List.Content.AbsenceList.Absence.forEach(function (item) {
                        if (item['@text'] === 'True') {
                            absenceNames.push(item.Name);
                        }
                    });
                }
                if (rsp.List && rsp.List.Content && rsp.List.Content.AbsenceList && rsp.List.Content.AbsenceList.CrossDate) {
                    crossDate = (rsp.List.Content.AbsenceList.CrossDate === 'True');
                }
                return {
                    absenceNames: absenceNames,
                    crossDate: crossDate,
                };
            }
        });
    };
    AppService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], AppService);
    return AppService;
}());



/***/ }),

/***/ "./src/app/help-class.ts":
/*!*******************************!*\
  !*** ./src/app/help-class.ts ***!
  \*******************************/
/*! exports provided: Class, Student, Absence, Period, Leave */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Class", function() { return Class; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Student", function() { return Student; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Absence", function() { return Absence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Period", function() { return Period; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Leave", function() { return Leave; });
/**班級 */
var Class = /** @class */ (function () {
    function Class(classId, className, gradeYear) {
        this.classId = classId;
        this.className = className;
        this.gradeYear = gradeYear;
        this.classId = classId;
        this.className = className;
        this.gradeYear = gradeYear;
    }
    return Class;
}());

/**學生 */
var Student = /** @class */ (function () {
    function Student(sid, name, seatNo, leaveList, orileaveList) {
        this.sid = sid;
        this.name = name;
        this.seatNo = seatNo;
        this.leaveList = leaveList;
        this.orileaveList = orileaveList;
        this.sid = sid;
        this.name = name;
        this.seatNo = seatNo;
        this.leaveList = leaveList || new Map();
        this.orileaveList = orileaveList || new Map();
    }
    Student.prototype.setAbsence = function (periodName, absName) {
        if (periodName) {
            if (this.leaveList.has(periodName)) {
                if (this.leaveList.get(periodName).isLock) {
                    return;
                }
            }
            if (absName) {
                this.leaveList.set(periodName, new Leave(periodName, absName, false));
            }
            else {
                this.leaveList.delete(periodName);
            }
        }
    };
    return Student;
}());

/**假別及簡稱 */
var Absence = /** @class */ (function () {
    function Absence(name, abbreviation) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.name = name;
        this.abbreviation = abbreviation;
    }
    return Absence;
}());

/**節次 */
var Period = /** @class */ (function () {
    function Period(name, sort, type) {
        this.name = name;
        this.sort = sort;
        this.type = type;
        this.name = name;
        this.sort = sort;
        this.type = type;
    }
    return Period;
}());

/**學生請假的類別 */
var Leave = /** @class */ (function () {
    function Leave(periodName, absName, isLock) {
        this.periodName = periodName;
        this.absName = absName;
        this.isLock = isLock;
        this.periodName = periodName;
        this.absName = absName;
        this.isLock = isLock;
    }
    return Leave;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]);


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/elvira/git/coregadget/903e67d4-b391-4f97-81ec-fc84c05f5079/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map