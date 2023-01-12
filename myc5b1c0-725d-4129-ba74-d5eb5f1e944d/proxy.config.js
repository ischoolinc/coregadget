
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
// const cookie = '_ga=GA1.1.1135696798.1652339057; _ga_1GRM5CK2EV=GS1.1.1652339378.1.1.1652339459.0; _ga_0XS98J4028=GS1.1.1670390472.13.0.1670390492.0.0.0; @ecoboost-web3=43b63de1-1936-4fb3-8419-910bbc992cc5; @ecoboost-web3.sig=9yilk9z-Ukgf0nGV0Yerj0NjbqE; _ga_0W66BZCJ6C=GS1.1.1670423097.13.1.1670423707.0.0.0';
const cookie = '_ga=GA1.1.1478985843.1672735683; _ga_0XS98J4028=GS1.1.1672736468.1.1.1672736618.0.0.0; _ga_0W66BZCJ6C=GS1.1.1673485228.2.0.1673485228.0.0.0; @ecoboost-web3=0ad32358-1ad3-4dec-bf32-a740fcc5b4b6; @ecoboost-web3.sig=SsCz3vmo3wGHP19M7KmDVf8qsEc';

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
