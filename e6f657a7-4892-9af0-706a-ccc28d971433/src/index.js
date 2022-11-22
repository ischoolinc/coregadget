import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter} from 'react-router-dom';

// 因為 gadget 在 deploy 後路徑是動態的，所以即時取得。
// 如果未設定 basename 則 gadget 只要不是 host 在「根」都會出錯誤。
const basename = document.location.pathname;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter basename={basename}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
