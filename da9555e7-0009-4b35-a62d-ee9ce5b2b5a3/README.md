IEP成績標準設定
====

### GUID: da9555e7-0009-4b35-a62d-ee9ce5b2b5a3

### Contract: ischool.course.iep
`Service List:`
```
    取得我的授課課程     GetMyCourse
    取得成績輸入截止時間  GetDeadline
    取得課程學生         GetCourseStudent
    設定課程學生IEP      SetStudentIEP
```
### Table
`Target column`
```
    passing_standard  及格標準
    makeup_standard  補考標準
    remark  備註
```

---

## 開始開發
* `cd mygadget`
* `yarn` #安裝套件
* `yarn start` ＃啟動 angular server。
* 連到 `http://localhost:4200` 開始 Debug。

## 部署
* `yarn build`
* 把 dist 目錄所有檔案部署出去。

## Questions
### 如何放置 Gadget 專有資源，例如圖片、Word 檔…  
將檔案放到 `src/assets` 裡面即可，例如檔案「`src/assets/img/icon.png`」實際路徑是「`assets/img/icon.png`」。

### 如何加入 JQuery
通常在 angualr 不使用 jquery，但仍然可以使用，先「`yarn add jquery`」安裝 jquery，然後在「`.angular.json`」加入設定。
```json
...
    "scripts": [
        "../node_modules/jquery/dist/jquery.min.js"
    ],
...
```
這作法會將 jquery 打包進 bundle 裡面，如果不要打包，可以直接放在 `assets` 目錄裡，然後在 `index.html` 直接引用。

