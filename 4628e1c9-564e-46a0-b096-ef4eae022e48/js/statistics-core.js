var CoreStatisticsDetail = function() {
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
        //  A- 登分比例
        var statAMinusScoredRate = '0%';
        //  A- 評分比例人數
        var statAMinusScoredRateAmount = 0;
        //  B+ 登分比例
        var statBPlusScoredRate = '0%';
        //  B+ 評分比例人數
        var statBPlusScoredRateAmount = 0;
        //  B及以下 登分比例
        var statBScoredRate = '0%';
        //  B及以下 評分比例人數
        var statBScoredRateAmount = 0;

        //  A+及A 加總登分比例(2018/09 by elvira)
        var statAPlusAndASumScoredRate = '0%';
        //  A+及A 加總評分比例人數(2018/09 by elvira)
        var statAPlusAndASumScoredRateAmount = 0;
        //  A+及A及A- 加總登分比例
        var statASumScoredRate = '0%';
        //  A+及A及A- 加總評分比例人數
        var statASumScoredRateAmount = 0;
        //  B+及B及以下 加總登分比例
        var statBSumScoredRate = '0%';
        //  B+及B及以下 加總評分比例人數
        var statBSumScoredRateAmount = 0;

        //  A+ 需減少人數
        var statAPlusReduceAmount = 0;
        //  A  需減少人數
        var statAReduceAmount = 0;
        //  A- 需減少人數
        var statAMinusReduceAmount = 0;
        //  B+ 需增加人數
        var statBPlusAddAmount = 0;
        //  B  需增加人數
        var statBAddAmount = 0;
        //  A  需減少總人數
        var statASumReduceAmount = 0;
        //  B  需增加總人數
        var statBSumAddAmount = 0;

        //  A+ 登分人數
        var statAPlusScoredAmount = 0;
        //  A  登分人數
        var statAScoredAmount = 0;
        //  A- 登分人數
        var statAMinusScoredAmount = 0;
        //  B+ 登分人數
        var statBPlusScoredAmount = 0;
        //  B及以下 登分人數
        var statBScoredAmount = 0;

        //  A+及A 登分總人數(2018/09 by elvira)
        var statAPlusAndASumScoredAmount = 0;
        //  A+及A及A- 登分總人數
        var statASumScoredAmount = 0;
        //  B+及B及以下 登分總人數
        var statBSumScoredAmount = 0;

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
                                statAMinusScoredAmount += 1;
                                break;
                            case "B+":
                                statBPlusScoredAmount += 1;
                                break;
                            case "B":
                                statBScoredAmount += 1;
                                break;
                            case "B-":
                                statBScoredAmount += 1;
                                break;
                            case "C+":
                                statBScoredAmount += 1;
                                break;
                            case "C":
                                statBScoredAmount += 1;
                                break;
                            case "C-":
                                statBScoredAmount += 1;
                                break;
                            case "F":
                                statBScoredAmount += 1;
                                break;
                            case "X":
                                statBScoredAmount += 1;
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
        // A- 登分比例值
        var statAMinusScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statAMinusScoredAmount * 1000/statAttendAmount)/10);
        // B+ 登分比例值
        var statBPlusScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statBPlusScoredAmount * 1000/statAttendAmount)/10);
        // B  登分比例值
        var statBScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round(statBScoredAmount * 1000/statAttendAmount)/10);

        // A+及A 加總登分比例值(2018/09 by elvira)
        var statAPlusAndASumScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round((statAPlusScoredAmount + statAScoredAmount) * 1000/statAttendAmount)/10);
        // A+及A及A- 加總登分比例值
        var statASumScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round((statAPlusScoredAmount + statAScoredAmount + statAMinusScoredAmount) * 1000/statAttendAmount)/10);
        // B+及B及以下 加總登分比例值
        var statBSumScoredRateNumber = ((statAttendAmount === 0) ? 0 : Math.round((statBPlusScoredAmount + statBScoredAmount) * 1000/statAttendAmount)/10);

        statAPlusScoredRate = statAPlusScoredRateNumber + "%";
        statAScoredRate = statAScoredRateNumber + "%";
        statAMinusScoredRate = statAMinusScoredRateNumber + "%";
        statBPlusScoredRate = statBPlusScoredRateNumber + "%";
        statBScoredRate = statBScoredRateNumber + "%";
        statAPlusAndASumScoredRate = statAPlusAndASumScoredRateNumber + "%"; // 2018/09 by elvira
        statASumScoredRate = statASumScoredRateNumber + "%";
        statBSumScoredRate = statBSumScoredRateNumber + "%";

        // 登分總人數
        statAPlusAndASumScoredAmount = statAPlusScoredAmount + statAScoredAmount; // 2018/09 by elvira
        statASumScoredAmount = statAPlusScoredAmount + statAScoredAmount + statAMinusScoredAmount;
        statBSumScoredAmount = statBPlusScoredAmount + statBScoredAmount;

        // 評分比例人數 = 修課人數 * 比例
        statAPlusScoredRateAmount = Math.floor(statAttendAmount * 0.15);
        // statAScoredRateAmount = Math.floor(statAttendAmount * 0.4);
        // statAMinusScoredRateAmount = Math.floor(statAttendAmount * 0.25);
        statBPlusScoredRateAmount = Math.ceil(statAttendAmount * 0.1);
        statBScoredRateAmount = Math.ceil(statAttendAmount * 0.05);
        statAPlusAndASumScoredRateAmount = Math.floor(statAttendAmount * 0.5);
        statASumScoredRateAmount = Math.floor(statAttendAmount * 0.65);
        statBSumScoredRateAmount = Math.ceil(statAttendAmount * 0.35);

        // A+ 需減少人數
        statAPlusReduceAmount = ((statAPlusScoredAmount - statAPlusScoredRateAmount) > 0) ? (statAPlusScoredAmount - statAPlusScoredRateAmount) : 0;
        // A 需減少人數 2018/09 by elvira
        if ((statAPlusAndASumScoredAmount - statAPlusAndASumScoredRateAmount) > 0) {
            // A 登分上限人數 = A+及A 評分比例人數 - (A+評分比例人數 或 A+已登分人數，取最小的值)
            var statAScoredMaxAmount = statAPlusAndASumScoredRateAmount - Math.min(statAPlusScoredRateAmount, statAPlusScoredAmount);
            statAReduceAmount = ((statAScoredAmount - statAScoredMaxAmount) > 0) ? (statAScoredAmount - statAScoredMaxAmount) : 0;
        } else {
            statAReduceAmount = 0;
        }
        // A- 需減少人數 2018/09 by elvira
        if ((statASumScoredAmount - statASumScoredRateAmount) > 0) {
            // A- 登分上限人數 = A+至A- 評分比例人數 - (A+評分比例人數 或 A+已登分人數，取最小的值) - A已登分人數
            var statAMinusScoredMaxAmount = statASumScoredRateAmount - Math.min(statAPlusScoredRateAmount, statAPlusScoredAmount) - statAScoredAmount;
            if (statAMinusScoredMaxAmount > 0) {
                statAMinusReduceAmount = ((statAMinusScoredAmount - statAMinusScoredMaxAmount) > 0) ? (statAMinusScoredAmount - statAMinusScoredMaxAmount) : 0;
            } else {
                statAMinusReduceAmount = 0;
            }
        } else {
            statAMinusReduceAmount = 0;
        }
        // statAReduceAmount = ((statAScoredAmount - statAScoredRateAmount) > 0) ? (statAScoredAmount - statAScoredRateAmount) : 0;
        // statAMinusReduceAmount = ((statAMinusScoredAmount - statAMinusScoredRateAmount) > 0) ? (statAMinusScoredAmount - statAMinusScoredRateAmount) : 0;
        // 需增加人數
        statBPlusAddAmount = ((statBPlusScoredRateAmount - statBPlusScoredAmount) > 0) ? (statBPlusScoredRateAmount - statBPlusScoredAmount) : 0;
        statBAddAmount = ((statBScoredRateAmount - statBScoredAmount) > 0) ? (statBScoredRateAmount - statBScoredAmount) : 0;
        // 需增加減少總人數
        statASumReduceAmount = ((statASumScoredAmount - statASumScoredRateAmount) > 0) ? (statASumScoredAmount - statASumScoredRateAmount) : 0;
        statBSumAddAmount = ((statBSumScoredRateAmount - statBSumScoredAmount) > 0) ? (statBSumScoredRateAmount - statBSumScoredAmount) : 0;

        return {
            'AttendAmount': statAttendAmount,
            'ScoredAmount': statScoredAmount,
            'APlusScoredRate': statAPlusScoredRate,
            'AScoredRate': statAScoredRate,
            'AMinusScoredRate': statAMinusScoredRate,
            'BPlusScoredRate': statBPlusScoredRate,
            'BScoredRate': statBScoredRate,
            'APlusAndASumScoredRate': statAPlusAndASumScoredRate, // 2018/09 by elvira
            'ASumScoredRate': statASumScoredRate,
            'BSumScoredRate': statBSumScoredRate,
            'APlusReduceAmount': statAPlusReduceAmount,
            'AReduceAmount': statAReduceAmount,
            'AMinusReduceAmount': statAMinusReduceAmount,
            'BPlusAddAmount': statBPlusAddAmount,
            'BAddAmount': statBAddAmount,
            'ASumReduceAmount': statASumReduceAmount,
            'BSumAddAmount': statBSumAddAmount,
            'APlusScoredAmount': statAPlusScoredAmount,
            'AScoredAmount': statAScoredAmount,
            'AMinusScoredAmount': statAMinusScoredAmount,
            'BPlusScoredAmount': statBPlusScoredAmount,
            'BScoredAmount': statBScoredAmount,
            'APlusAndASumScoredAmount': statAPlusAndASumScoredAmount, // 2018/09 by elvira
            'ASumScoredAmount': statASumScoredAmount,
            'BSumScoredAmount': statBSumScoredAmount,
            'APlusScoredRateNumber': statAPlusScoredRateNumber,
            'AScoredRateNumber': statAScoredRateNumber,
            'AMinusScoredRateNumber': statAMinusScoredRateNumber,
            'BPlusScoredRateNumber': statBPlusScoredRateNumber,
            'BScoredRateNumber': statBScoredRateNumber,
            'APlusAndASumScoredRateNumber': statAPlusAndASumScoredRateNumber, // 2018/09 by elvira
            'ASumScoredRateNumber': statASumScoredRateNumber,
            'BSumScoredRateNumber': statBSumScoredRateNumber
        }
    };

    var getSelectedCourse = function(pSelectedCourse, statistics) {
        if (!pSelectedCourse) {
            pSelectedCourse = {};
        }
        pSelectedCourse.Compliant = true;

        var container = $('#statistics-container-core');

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
            container.find(".statistics-scored-amount").html("<font color='red'>" + statistics.ScoredAmount + "</font>");
            pSelectedCourse.Compliant = false;
        } else {
            container.find(".statistics-scored-amount").html(statistics.ScoredAmount);
        }

        // A+ 登分比例：
        if (statistics.APlusScoredRateNumber > 15) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-plus-scored-rate").html("<font color='red'>" + statistics.APlusScoredRate + "</font>");
        } else {
            container.find(".statistics-a-plus-scored-rate").html(statistics.APlusScoredRate);
        }

        // B+ 登分比例：
        if (statistics.BPlusScoredRateNumber < 10) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-b-plus-scored-rate").html("<font color='red'>" + statistics.BPlusScoredRate + "</font>");
        } else {
            container.find(".statistics-b-plus-scored-rate").html(statistics.BPlusScoredRate);
        }
        // B 登分比例：
        if (statistics.BScoredRateNumber < 5) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-b-scored-rate").html("<font color='red'>" + statistics.BScoredRate + "</font>");
        } else {
            container.find(".statistics-b-scored-rate").html(statistics.BScoredRate);
        }
        // A+與A 的加總登分比例： // 2018/09 by elvira
        if (statistics.APlusAndASumScoredRateNumber > 50) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-plus-and-a-sum-scored-rate").html("<font color='red'>" + statistics.APlusAndASumScoredRate + "</font>");
        } else {
            container.find(".statistics-a-plus-and-a-sum-scored-rate").html(statistics.APlusAndASumScoredRate);
        }
        // A 的加總登分比例：
        if (statistics.ASumScoredRateNumber > 65) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-a-sum-scored-rate").html("<font color='red'>" + statistics.ASumScoredRate + "</font>");
        } else {
            container.find(".statistics-a-sum-scored-rate").html(statistics.ASumScoredRate);
        }
        // B 的加總登分比例：
        if (statistics.BSumScoredRateNumber < 35) {
            pSelectedCourse.Compliant = false;
            container.find(".statistics-b-sum-scored-rate").html("<font color='red'>" + statistics.BSumScoredRate + "</font>");
        } else {
            container.find(".statistics-b-sum-scored-rate").html(statistics.BSumScoredRate);
        }
        // A+ 登分人數
        container.find(".statistics-a-plus-scored-amount").html(statistics.APlusScoredAmount);
        // A 登分人數
        container.find(".statistics-a-scored-amount").html(statistics.AScoredAmount);
        // A- 登分人數
        container.find(".statistics-a-minus-scored-amount").html(statistics.AMinusScoredAmount);
        // B+ 登分人數
        container.find(".statistics-b-plus-scored-amount").html(statistics.BPlusScoredAmount);
        // B及以下登分人數
        container.find(".statistics-b-scored-amount").html(statistics.BScoredAmount);
        // A 登分總人數
        container.find(".statistics-a-sum-scored-amount").html(statistics.ASumScoredAmount);
        // B 登分總人數
        container.find(".statistics-b-sum-scored-amount").html(statistics.BSumScoredAmount);
        // A+ 需減少人數：
        if (statistics.APlusReduceAmount > 0) {
            container.find(".statistics-a-plus-reduce-amount").html("<font color='red'>" + "-" + statistics.APlusReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-plus-reduce-amount").html(statistics.APlusReduceAmount);
        }
        // A 需減少人數：
        if (statistics.AReduceAmount > 0) {
            container.find(".statistics-a-reduce-amount").html("<font color='red'>" + "-" + statistics.AReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-reduce-amount").html(statistics.AReduceAmount);
        }
        // A- 需減少人數：
        if (statistics.AMinusReduceAmount > 0) {
            container.find(".statistics-a-minus-reduce-amount").html("<font color='red'>" + "-" + statistics.AMinusReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-minus-reduce-amount").html(statistics.AMinusReduceAmount);
        }
        // B+ 需增加人數：
        if (statistics.BPlusAddAmount > 0) {
            container.find(".statistics-b-plus-add-amount").html("<font color='red'>" + "+" + statistics.BPlusAddAmount + "</font>");
        } else {
            container.find(".statistics-b-plus-add-amount").html(statistics.BPlusAddAmount);
        }
        // B及以下 需增加人數：
        if (statistics.BAddAmount > 0) {
            container.find(".statistics-b-add-amount").html("<font color='red'>" + "+" + statistics.BAddAmount + "</font>");
        } else {
            container.find(".statistics-b-add-amount").html(statistics.BAddAmount);
        }
        // A 需減少總人數：
        if (statistics.ASumReduceAmount > 0) {
            container.find(".statistics-a-sum-reduce-amount").html("<font color='red'>" + "-" + statistics.ASumReduceAmount + "</font>");
        } else {
            container.find(".statistics-a-sum-reduce-amount").html(statistics.ASumReduceAmount);
        }
        // B 需增加總人數：
        if (statistics.BSumAddAmount > 0) {
            container.find(".statistics-b-sum-add-amount").html("<font color='red'>" + "+" + statistics.BSumAddAmount + "</font>");
        } else {
            container.find(".statistics-b-sum-add-amount").html(statistics.BSumAddAmount);
        }
    };

    return {
        run: function(pSelectedCourse, pCourseStudents) {
            var statistics = getSelectedCourseScoreStatistics(pCourseStudents);
            getSelectedCourse(pSelectedCourse, statistics);
        }
    }
}();
