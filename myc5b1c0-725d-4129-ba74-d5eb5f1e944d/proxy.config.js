
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
const cookie = '_ga=GA1.1.1135696798.1652339057; _ga_1GRM5CK2EV=GS1.1.1652339378.1.1.1652339459.0; @ecoboost-web3=bff5529c-a6f1-4dde-84c3-fd6eb0b4c9ce; @ecoboost-web3.sig=MQbd6QzoTPCx8DFdUyUfGYm-NJc; _ga_0W66BZCJ6C=GS1.1.1652339057.1.1.1652340054.0';

const onProxyReq = function (proxyReq, req, res) {
  proxyReq.setHeader('SameSite', 'None; Secure');

  if (cookie) { proxyReq.setHeader('Cookie', cookie); }

}

const PROXY_CONFIG = {
  "/service": {
    "target": "http://localhost:3042",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "onProxyReq": onProxyReq,
  },
  "/auth": {
    "target": "http://localhost:3042",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "onProxyReq": onProxyReq,
  },
  "/web2": {
    "target": "http://localhost:3042",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "onProxyReq": onProxyReq,
  }
}

module.exports = PROXY_CONFIG;
