var ElectiveStatisticsDetail = function() {
    var getSelectedCourseScoreStatistics = function (pCourseStudents) {
        //  修課人數
        var statAttendAmount = 0;
        //  登分人數
        var statScoredAmount = 0;

        //  A+ 登分比例
        var statAPlusScoredRate = '0%';
        //  A+ 評分比例人數
        var statAPlusScoredRateAmount = 0;
        //  A  登分比例
        var statAScoredRate = '0%';
        //  A  評分比例人數
        var statAScoredRateAmount = 0;
        //  A-及以下 登分比例
        var statAMinusScoredRate = '0%';
        //  A-及以下 評分比例人數
        var statAMinusScoredRateAmount = 0;

        //  A+及A 加總登分比例
        var statAPlusAndASumScoredRate = '0%';
        //  A+及A 加總評分比例人數
        var statAPlusAndASumScoredRateAmount = 0;
        //  A-及以下 加總登分比例
        var statAMinusSumScoredRate = '0%';
        //  A-及以下 加總評分比例人數
        var statAMinusSumScoredRateAmount = 0;

        //  A+ 需減少人數
        var statAPlusReduceAmount = 0;
        //  A  需減少人數
        var statAReduceAmount = 0;
        //  A-及以下 需增加人數
        var statAMinusAddAmount = 0;
        //  A+及A 需減少總人數
        var statAPlusAndASumReduceAmount = 0;
        //  A-及以下 需增加總人數
        var statAMinusSumAddAmount = 0;

        //  A+ 登分人數
        var statAPlusScoredAmount = 0;
        //  A  登分人數
        var statAScoredAmount = 0;
        //  A-及以下 登分人數
        var statAMinusScoredAmount = 0;

        //  A+及A 登分總人數
        var statAPlusAndASumScoredAmount = 0;
        //  A-及以下 登分總人數
        var statAMinusSumScoredAmount = 0;

        //  所有成績
        // var pass_score = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"];

        //  所有修課學生
        if (pCourseStudents) {
            for(var student_number in pCourseStudents) {
                var student = pCourseStudents[student_number];

                if (student.IsCancel !== "t")
                {
                    statAttendAmount += 1;
                    if (student.Score) {
                        statScoredAmount += 1;

                        switch (student.Score) {
                            case "A+":
                                statAPlusScoredAmount += 1;
                                break;
                            case "A":
                                statAScoredAmount += 1;
                                break;
                            case "A-":
                            case "B+":
                            case "B":
                            case "B-":
                            case "C+":
                            case "C":
                            case "C-":
                            case "F":
                            case "X":
                                statAMinusScoredAmount += 1;
                                break;

                        }
                    }
                }
            }
        }

        // JavaScript的四捨五入、無條件捨去、無條件進位
        // Math.round() 四捨五入
        // Math.floor() 取小於這個數的最大整數
        // Math.ceil() 取大於這個數的最小整數

        // A+ 登分比例值
        var statAPlusScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statAPlusScoredAmount * 1000/statAttendAmount)/10);
        // A  登分比例值
        var statAScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statAScoredAmount * 1000/statAttendAmount)/10);
        // A-及以下 登分比例值
        var statAMinusScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statAMinusScoredAmount * 1000/statAttendAmount)/10);

        // A+及A 加總登分比例值
        var statAPlusAndASumScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round((statAPlusScoredAmount + statAScoredAmount) * 1000/statAttendAmount)/10);
        // A-及以下 加總登分比例值
        var statAMinusSumScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statAMinusScoredAmount * 1000/statAttendAmount)/10);

        statAPlusScoredRate = statAPlusScoredRateNumber + "%";
        statAScoredRate = statAScoredRateNumber + "%";
        statAMinusScoredRate = statAMinusScoredRateNumber + "%";
        statAPlusAndASumScoredRate = statAPlusAndASumScoredRateNumber + "%";
        statAMinusSumScoredRate = statAMinusSumScoredRateNumber + "%";

        // 登分總人數
        statAPlusAndASumScoredAmount = statAPlusScoredAmount + statAScoredAmount;
        statAMinusSumScoredAmount = statAMinusScoredAmount;

        // 評分比例人數 = 修課人數 * 比例
        statAPlusScoredRateAmount = Math.floor(statAttendAmount * 0.3);
        statAScoredRateAmount = Math.floor(statAttendAmount * 0.6);
        statAMinusScoredRateAmount = Math.ceil(statAttendAmount * 0.4);
        statAPlusAndASumScoredRateAmount = Math.floor(statAttendAmount * 0.6);
        statAMinusSumScoredRateAmount = Math.ceil(statAttendAmount * 0.4);

        // A+ 需減少人數
        statAPlusReduceAmount = ((statAPlusScoredAmount - statAPlusScoredRateAmount) > 0) ? (statAPlusScoredAmount - statAPlusScoredRateAmount) : 0;
        // A 需減少人數
        statAReduceAmount = ((statAScoredAmount - statAScoredRateAmount) > 0) ? (statAScoredAmount - statAScoredRateAmount) : 0;
        // A- 需增加人數
        statAMinusAddAmount = ((statAMinusScoredRateAmount - statAMinusScoredAmount) > 0) ? (statAMinusScoredRateAmount - statAMinusScoredAmount) : 0;
        // 需增加減少總人數
        statAPlusAndASumReduceAmount = ((statAPlusAndASumScoredAmount - statAPlusAndASumScoredRateAmount) > 0) ? (statAPlusAndASumScoredAmount - statAPlusAndASumScoredRateAmount) : 0;
        statAMinusSumAddAmount = ((statAMinusSumScoredRateAmount - statAMinusSumScoredAmount) > 0) ? (statAMinusSumScoredRateAmount - statAMinusSumScoredAmount) : 0;

        return {
            'AttendAmount': statAttendAmount,
            'ScoredAmount': statScoredAmount,
            'APlusScoredRate': statAPlusScoredRate,
            'AScoredRate': statAScoredRate,
            'AMinusScoredRate': statAMinusScoredRate,
            'APlusAndASumScoredRate': statAPlusAndASumScoredRate,
            'AMinusSumScoredRate': statAMinusSumScoredRate,
            'APlusReduceAmount': statAPlusReduceAmount,
            'AReduceAmount': statAReduceAmount,
            'AMinusAddAmount': statAMinusAddAmount,
            'APlusAndASumReduceAmount': statAPlusAndASumReduceAmount,
            'AMinusSumAddAmount': statAMinusSumAddAmount,
            'APlusScoredAmount': statAPlusScoredAmount,
            'AScoredAmount': statAScoredAmount,
            'AMinusScoredAmount': statAMinusScoredAmount,
            'APlusAndASumScoredAmount': statAPlusAndASumScoredAmount,
            'AMinusSumScoredAmount': statAMinusSumScoredAmount,
            'APlusScoredRateNumber': statAPlusScoredRateNumber,
            'AScoredRateNumber': statAScoredRateNumber,
            'AMinusScoredRateNumber': statAMinusScoredRateNumber,
            'APlusAndASumScoredRateNumber': statAPlusAndASumScoredRateNumber,
            'AMinusSumScoredRateNumber': statAMinusSumScoredRateNumber,
        }
    };

    var getSelectedCourse = function(pSelectedCourse, statistics) {
        if (!pSelectedCourse) {
            pSelectedCourse = {};
        }
        pSelectedCourse.Compliant = true;

        var container = $('#statistics-container-elective');

        // 課程名稱：statistics-course-name
        if (pSelectedCourse) {
            container.find(".statistics-course-name").html(pSelectedCourse.CourseTitle);
        } else {
            container.find(".statistics-course-name").html('');
        }

        // 修課人數：statistics-attend-amount
        container.find(".statistics-attend-amount").html(statistics.AttendAmount);

        // 登分人數：
        if (statistics.ScoredAmount < statistics.AttendAmount) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-scored-amount").html("<font color='red'>" + statistics.ScoredAmount + "</font>");
        } else {
            container.find(".statistics-scored-amount").html(statistics.ScoredAmount);
        }

        // A+ 登分比例：
        if (statistics.APlusScoredRateNumber > 30) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-plus-scored-rate").html("<font color='red'>" + statistics.APlusScoredRate + "</font>");
        } else {
            container.find(".statistics-a-plus-scored-rate").html(statistics.APlusScoredRate);
        }

        // A 登分比例：
        if (statistics.AScoredRateNumber > 60) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-scored-rate").html("<font color='red'>" + statistics.AScoredRate + "</font>");
        } else {
            container.find(".statistics-a-scored-rate").html(statistics.AScoredRate);
        }
        // A-及以下 登分比例：
        if (statistics.AMinusScoredRateNumber < 40) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-minus-scored-rate").html("<font color='red'>" + statistics.AMinusScoredRate + "</font>");
        } else {
            container.find(".statistics-a-minus-scored-rate").html(statistics.AMinusScoredRate);
        }
        // A+與A 的加總登分比例：
        if (statistics.APlusAndASumScoredRateNumber > 60) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-plus-and-a-sum-scored-rate").html("<font color='red'>" + statistics.APlusAndASumScoredRate + "</font>");
        } else {
            container.find(".statistics-a-plus-and-a-sum-scored-rate").html(statistics.APlusAndASumScoredRate);
        }
        // A-及以下 的加總登分比例：
        if (statistics.AMinusSumScoredRateNumber < 40) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-minus-sum-scored-rate").html("<font color='red'>" + statistics.AMinusSumScoredRate + "</font>");
        } else {
            container.find(".statistics-a-minus-sum-scored-rate").html(statistics.AMinusSumScoredRate);
        }
        // A+ 登分人數
        container.find(".statistics-a-plus-scored-amount").html(statistics.APlusScoredAmount);
        // A 登分人數
        container.find(".statistics-a-scored-amount").html(statistics.AScoredAmount);
        // A-及以下 登分人數
        container.find(".statistics-a-minus-scored-amount").html(statistics.AMinusScoredAmount);
        // A+及A 登分總人數
        container.find(".statistics-a-plus-and-a-sum-scored-amount").html(statistics.APlusAndASumScoredAmount);
        // A-及以下 登分總人數
        container.find(".statistics-a-minus-sum-scored-amount").html(statistics.AMinusSumScoredAmount);
        // A+需減少人數：
        if (statistics.APlusReduceAmount > 0) {
            container.find(".statistics-a-plus-reduce-amount").html("<font color='red'>" + "-" + statistics.APlusReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-plus-reduce-amount").html(statistics.APlusReduceAmount);
        }
        // A需減少人數：
        if (statistics.AReduceAmount > 0) {
            container.find(".statistics-a-reduce-amount").html("<font color='red'>" + "-" + statistics.AReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-reduce-amount").html(statistics.AReduceAmount);
        }
        // A-及以下需增加人數：
        if (statistics.AMinusAddAmount > 0) {
            container.find(".statistics-a-minus-add-amount").html("<font color='red'>" + "-" + statistics.AMinusAddAmount + "</font>");
        } else {
            container.find(".statistics-a-minus-add-amount").html(statistics.AMinusAddAmount);
        }
        // A+及A 需減少總人數：
        if (statistics.APlusAndASumReduceAmount > 0) {
            container.find(".statistics-a-plus-and-a-sum-reduce-amount").html("<font color='red'>" + "-" + statistics.APlusAndASumReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-plus-and-a-sum-reduce-amount").html(statistics.APlusAndASumReduceAmount);
        }
        // A-及以下 需增加總人數：
        if (statistics.AMinusSumAddAmount > 0) {
            container.find(".statistics-a-minus-add-amount").html("<font color='red'>" + "+" + statistics.AMinusSumAddAmount + "</font>");
        } else {
            container.find(".statistics-a-minus-add-amount").html(statistics.AMinusSumAddAmount);
        }
    };

    return {
        run: function(pSelectedCourse, pCourseStudents) {
            var statistics = getSelectedCourseScoreStatistics(pCourseStudents);
            getSelectedCourse(pSelectedCourse, statistics);
        }
    }
}();
