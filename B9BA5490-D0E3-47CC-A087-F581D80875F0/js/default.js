var app = angular.module("starter", [])

app.controller('MenuCtrl', function ($scope, $timeout) {

  $scope.pageView = "main";
  $scope.data = {};
  $scope.contract = gadget.getContract("ischool.myAddressBook");

  $scope.getData = function () {
    $scope.contract.send({
      service: "_.GetMyAddressBook",
      body: {},
      result: function (response, error, http) {
        if (!error) {
          if (response.Response && response.Response.Student) {

            $scope.$apply(function () {

              angular.forEach(response.Response.Student, function (value, key) {

                if (!$scope.data[value.ClassName])
                  $scope.data[value.ClassName] = { className: value.ClassName, students: [] };

                //value.OtherAddresses.AddressList.Address強轉array
                value.OtherAddresses = value.OtherAddresses || {};
                value.OtherAddresses.AddressList = value.OtherAddresses.AddressList || {};
                value.OtherAddresses.AddressList.Address = [].concat(value.OtherAddresses.AddressList.Address || []);

                $scope.data[value.ClassName].students.push(value);

              });

              $scope.selected($scope.getFirstItem());

            });

            //console.log($scope.data);

          }
          else {
            alert("查無班級資料");
          }
        }
        else {
          alert("系統無此帳號身分");
          return;
        }
      }
    });
  };

  $scope.getData();

  $scope.selected = function (text) {
    $scope.activeClass = text;
    $scope.pageView = "main";

    $timeout(function () {

      var file = ["<html><head><meta charset='utf-8' /></head><body><table><tr><td>姓名</td><td>座號</td><td>學號</td><td>性別</td><td>生日</td><td>身分證號</td><td>戶籍電話</td><td>聯絡電話</td><td>行動電話</td><td>其他電話1</td><td>其他電話2</td><td>其他電話3</td><td>Email</td><td>監護人電話</td><td>父親電話</td><td>母親電話</td><td>戶籍地址</td><td>通訊地址</td><td>其他地址</td></tr>"];
      angular.forEach($scope.data[$scope.activeClass].students, function (item) {

        // file.push("\r\n");
        file.push(
          "<tr><td>" + item.Name + "</td>"
          + "<td>" + item.SeatNo + "</td>"
          + "<td>" + item.StudentNubmer + "</td>"
          + "<td>" + item.Gender + "</td>"
          + "<td>" + item.Birthdate + "</td>"
          + "<td>" + item.IdNumber + "</td>"
          + "<td>" + item.PermanentPhone + "</td>"
          + "<td>" + item.ContactPhone + "</td>"
          + "<td>" + item.SmsPhone + "</td>"
          + "<td>" + ((item.OtherPhones && item.OtherPhones.PhoneList && item.OtherPhones.PhoneList.PhoneNumber[0]) ? item.OtherPhones.PhoneList.PhoneNumber[0] : '') + "</td>"
          + "<td>" + ((item.OtherPhones && item.OtherPhones.PhoneList && item.OtherPhones.PhoneList.PhoneNumber[1]) ? item.OtherPhones.PhoneList.PhoneNumber[1] : '') + "</td>"
          + "<td>" + ((item.OtherPhones && item.OtherPhones.PhoneList && item.OtherPhones.PhoneList.PhoneNumber[2]) ? item.OtherPhones.PhoneList.PhoneNumber[2] : '') + "</td>"
          + "<td>" + item.Email + "</td>"
          + "<td>" + ((item.CustdoianOtherInfo && item.CustdoianOtherInfo.CustodianOtherInfo.Phone) ? item.CustdoianOtherInfo.CustodianOtherInfo.Phone : '') + "</td>"
          + "<td>" + ((item.FatherOtherInfo && item.FatherOtherInfo.FatherOtherInfo.Phone) ? item.FatherOtherInfo.FatherOtherInfo.Phone : '') + "</td>"
          + "<td>" + ((item.MotherOtherInfo && item.MotherOtherInfo.MotherOtherInfo.Phone) ? item.MotherOtherInfo.MotherOtherInfo.Phone : '') + "</td>"
          + "<td>" + (($scope.getAddress(item.PermanentAddress) && $scope.getAddress(item.PermanentAddress.AddressList.Address)) ? $scope.getAddress(item.PermanentAddress.AddressList.Address) : '') + "</td>"
          + "<td>" + (($scope.getAddress(item.MailingAddress) && $scope.getAddress(item.MailingAddress.AddressList.Address)) ? $scope.getAddress(item.MailingAddress.AddressList.Address) : '') + "</td>"
          + "<td>" + (($scope.getAddress(item.OtherAddresses) && $scope.getAddress(item.OtherAddresses.AddressList.Address[0])) ? $scope.getAddress(item.OtherAddresses.AddressList.Address[0]) : '') + "</td></tr>"
        );
      });

      file.push("</table></body></html>");

      var blob = new Blob(file);
      // var blob = new Blob([file], {type: "application/vnd.ms-excel"});
      fileURL = URL.createObjectURL(blob);;
      fileName = $scope.activeClass + ".xls";

      var btnDownload = document.getElementById("download");
      btnDownload.href = fileURL;
      btnDownload.download = fileName;
    }, 100);

  };

  $scope.getBack = function () {
    $scope.selected($scope.activeClass);
    console.log($scope.activeClass)
  };

  $scope.studentClick = function (object) {
    $scope.activeStudent = object;
    $scope.pageView = "info";
  };

  $scope.getFirstItem = function () {
    var run = true;
    var retVal;
    angular.forEach($scope.data, function (value, key) {
      if (run) {
        run = false;
        retVal = value.className;
      }
    });

    if (retVal)
      return retVal;
    else
      return 0;
  };

  $scope.getAddress = function (object) {
    var retVal = "";

    if (object) {
      retVal += object.ZipCode;
      retVal += object.County;
      retVal += object.Town;
      retVal += (object.District || '');
      retVal += (object.Area || '');
      retVal += object.DetailAddress;
    }

    return retVal;
  };

  $scope.detect = function () {
    if (navigator.userAgent.match(/Chrome/i) || navigator.userAgent.match(/Firefox/i) || navigator.userAgent.match(/Safari/i) || navigator.userAgent.match(/Opera/i)) {
      return true;
    }
    else {
      return false;
    }
  };

  $scope.openPhoto = function (photo, gender) {
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01");
    modal.style.display = "block";
    photo ? modalImg.src = "data:image/png;base64," + photo : (gender == '女') ? modalImg.src = "img/photo_female.png" : modalImg.src = "img/photo_male.png";

    modal.onclick = function () {
      img01.className += " out";
      setTimeout(function () {
        modal.style.display = "none";
        img01.className = "modal-content";
      }, 400);
    }
  };

});

