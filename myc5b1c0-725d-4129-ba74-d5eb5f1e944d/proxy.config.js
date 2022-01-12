
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
const cookie = '_ga=GA1.1.15310176.1641865796; _ga_0XS98J4028=GS1.1.1641867854.2.0.1641867854.0; @ecoboost-web3=9a730e5b-d979-4694-bd44-a67a5e56e4eb; @ecoboost-web3.sig=vbz8Ag68lcYqNKW9etGGod3aAxU; _ga_0W66BZCJ6C=GS1.1.1641957760.3.1.1641962250.0';

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
