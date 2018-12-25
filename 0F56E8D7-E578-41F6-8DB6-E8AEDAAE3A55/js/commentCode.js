var app = angular.module('commentCode',[]);

app.controller('commentCodeCtrl', ['$scope', function ($scope) {

    $scope.connection = gadget.getContract("ta");
    // 取得平時評量代碼表
    $scope.connection.send({
        service: "TeacherAccess.GetExamTextScoreMappingTable",
        body: {
            Content: {}
        },
        result: function (response, error, http) {
            if (error !== null) {
                alert("TeacherAccess.GetExamTextScoreMappingTable Error");
            } else {
                $scope.$apply(function () {
                    if (response !== null && response.Response !== null && response.Response !== '') {

                        $scope.examTextList = [].concat(response.Response.TextMappingTable.Item);
                    }
                });
            }
        }
    });
}]);