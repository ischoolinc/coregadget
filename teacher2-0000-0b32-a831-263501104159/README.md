Angular Gadget
====

## 前置要求
* 安裝 Node.js
* 安裝 Yarn (建議安裝)
* 安裝 VSCode
* 安裝 Angular CLI (`yarn global add @angular/cli`)。

## 開始開發
* `git clone https://github.com/ischoolinc/angulargadget mygadget`
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

### 更多資訊
Angular 研究院
https://3.basecamp.com/4399967/projects/15850221

## 驗證條件
### new (只新增)
==============================
教師姓名：不可以空、長度 50
教師姓名 + 暱稱：不可重複、不可與現有相同

依匯入欄位：
  性別：限男、女、空值
  登入帳號：長度 200、不可重複、不可與現有相同
  教師代碼：不可重複、不可與現有相同
  教師編號：不可重複、不可與現有相同

### edit (找不到，不處理)
==============================
教師姓名：不可以空、長度 50
教師姓名 + 暱稱：不可重複、不可與現有相同(排除識別欄位符合的資料外)

依匯入欄位：
  性別：限男、女、空值
  登入帳號：長度 200、不可重複、不可與現有相同(排除識別欄位符合的資料外)
  教師代碼：不可重複、不可與現有相同(排除識別欄位符合的資料外)
  教師編號：不可重複、不可與現有相同(排除識別欄位符合的資料外)

識別欄位：
  不可為空、不可重複、需與現有相同

### auto (每一筆都要判斷是 new or edit) 未實作
==============================
教師姓名：不可以空、長度 50
教師姓名 + 暱稱：不可重複

依匯入欄位：
  性別：限男、女、空值
  登入帳號：長度 200、不可重複

識別欄位：
  不可為空、不可重複

與現有相同 => edit =>
  教師姓名 + 暱稱，不可與現有相同(排除識別欄位符合的資料外)
  登入帳號，不可與現有相同(排除識別欄位符合的資料外)
與現有不同 => new =>
  教師姓名 + 暱稱：不可與現有相同
  登入帳號：不可與現有相同