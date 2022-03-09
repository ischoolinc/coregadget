
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
const cookie = '_ga=GA1.1.1293087968.1641952280; _ga_0XS98J4028=GS1.1.1642053598.5.1.1642055429.0; @ecoboost-web3=940ec1a6-4ab2-4536-b2c3-95166bdc1d85; @ecoboost-web3.sig=0amxDhKKqwe3zxuwXfpI_5rJGd0; _ga_0W66BZCJ6C=GS1.1.1642351138.16.1.1642351362.0';

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
