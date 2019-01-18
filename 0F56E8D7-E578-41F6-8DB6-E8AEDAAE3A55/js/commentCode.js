var app = angular.module('commentCode',[]);

app.controller('commentCodeCtrl', ['$scope', function ($scope) {
    
    window.setMappingTable = function (table) {
        $scope.$apply(function () {
            $scope.examTextList = [].concat(table.Item);
        });
    }
}]);