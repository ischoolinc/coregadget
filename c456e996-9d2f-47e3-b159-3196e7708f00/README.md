# 新竹康橋國小 家長學生學期成績查詢

康橋新竹小學的家長學生成績查詢模組，是拿「國中通用學期成績查詢(2023新版)」 gadget 來調整的"

## Node 版本

### `Node 16+`

此為 react.js 18 建置的專案，請使用 Node 16+ 以上開發。

## 啟動與建置相關指令

以下為啟動開發環境，與建置部署檔案的相關指令：

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

產生正式部署的程式碼，並放到 `build` 目錄中。\
此指令會以產品模式打包 react 程式，並以最佳效能進行最佳化。\
此指令同時會把 `public` 目錄裡的檔案複製到 `build` 目錄中，所以記得把 gadget 的 description.xml 與 icon.png 放到 `public` 目錄中，如此在建置時便會同時複製到 `build` 目錄。\
最後記得手動調整 `build` 目錄裡 index.html，把最下方的 `<script defer="defer" src="/static/js/main.xxxxxxx.js"></script>`, 與
    `<link href="/static/css/main.073c9b0a.css" rel="stylesheet" />` ，把絕對目錄改成相對目錄，這樣才能符合部署環境。

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
