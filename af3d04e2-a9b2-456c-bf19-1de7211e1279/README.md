# 此模板基礎框架介紹

此模板主要是使用 `vite` 來生成的 React 基礎框架，並安裝了一些基本模組：

## 主要模組

1. 狀態管理:
   - [zustand](https://github.com/pmndrs/zustand)

2. CSS相關:
   - [tailwindcss](https://tailwindcss.com/)
   - [daisyui](https://daisyui.com/)

3. 單元測試:
   - [vitest](https://vitest.dev/)
   - [Testing Library](https://testing-library.com/)

以上為基本的模組配置，可根據開發需求進行相應的調整和擴展。

以下為 README.md 範例供參考

## 功能

測試帳號密碼

```bash
帳號： example@example.com
密碼： example
```

## 安裝

> 請務必依據你的專案來調整內容。

以下將會引導你如何安裝此專案到你的電腦上。

Node.js 版本建議為：`18` 以上...

### 取得專案

- [GitHub Repository]()

```bash
git clone git@github.com:kaoenzo/ischool-msg-client.git
```
或用版控軟體 clone

### 移動到專案內

```bash
cd ${localPath}/ischool-msg-client
```

### 安裝套件

```bash
yarn
```

### 環境變數設定

請在終端機輸入 `cp .env.example .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案

參考 package.json

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
預設
http://127.0.0.1:5173/
```

## 環境變數說明（目前還是範例架構）

```env
APIPATH= # API 位置
COUSTOMPATH= # 自訂變數
...
```

## 資料夾說明
- function firebase cloud function 程式碼放置處
- hosting 前端程式碼放置處
  - __test__ 單元測試程式碼放置處
  - public - 靜態資源放置處(編譯網站時不會編譯)
  - src - 主要程式碼放置處
    - assets - 動態資源放置處(編譯網站時會一起編譯，輸出的檔案會有流水號檔名)
    - pages - 放置各頁面程式碼放置處
    - components - 子元件程式碼放置處
    - context - 狀態管理相關程式碼放置處
    - utilities - 公用程式碼放置處
    - services - 呼叫 API 相關程式碼放置處
    - libraries - 第三方套件相關程式碼放置處
...

## 專案技術(以 package.json 為主)
hosting
- Node.js v16.19.0
- React v18.2.15
- Vite v4.4.5
- typescript v5.0.2

...

## 輔助套件(以 package.json 為主)
- tailwindcss v3.3.3
- daisyui v3.5.1
- zustand v4.4.1
- react-query v4.32.6
- sweetalert2 v11.7.22
- dayjs v1.11.9
- react-error-boundary v4.0.11
- i18next v23.4.4
- react-icons v4.10.1

## 單元測試
- Vitest
- React Testing Library
...

## 字型
使用了 Google Fonts 服務，導入了 "Noto Sans TC" 和 "Roboto" 這兩種字型。

## 部署說明

firebase deploy

如果 server (cloud fun)端有更新，則須至：
https://console.cloud.google.com/functions/list?env=gen1&project=campus-msg&tab=permissions
調整權限
選擇新增的cloud fun -> 到「PERMISSIONS」 -> GRANT ACCESS ->


## CI/CD 說明

待補

## 疑難雜症解決補充
- [img tag 裡的 fetchpriority 在 ts 中會報 error 的處理方案](https://stackoverflow.com/questions/73455263/fetch-priority-attribute-in-img-tag-react-js/)
- [firebase 升級到模塊化注意事項](https://firebase.google.com/docs/web/modular-upgrade?hl=zh-tw)
- [measurementid in firebase](https://stackoverflow.com/questions/60804074/how-to-get-the-measurementid-from-the-firebase-config)
- [use the env file in firebase cloud function](https://firebase.google.com/docs/functions/config-env?gen=2nd)

## 測試站

## 其他

