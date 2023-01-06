
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
// const cookie = '_ga=GA1.1.1135696798.1652339057; _ga_1GRM5CK2EV=GS1.1.1652339378.1.1.1652339459.0; _ga_0XS98J4028=GS1.1.1670390472.13.0.1670390492.0.0.0; @ecoboost-web3=43b63de1-1936-4fb3-8419-910bbc992cc5; @ecoboost-web3.sig=9yilk9z-Ukgf0nGV0Yerj0NjbqE; _ga_0W66BZCJ6C=GS1.1.1670423097.13.1.1670423707.0.0.0';
const cookie = '_ga_8H3JZJ3YHW=GS1.1.1641772673.1.0.1641772673.0; _ga=GA1.1.241368413.1641772673; _ga_1GRM5CK2EV=GS1.1.1669913426.14.1.1669913439.0.0.0; _ga_0XS98J4028=GS1.1.1671007705.149.1.1671007724.0.0.0; @ecoboost-web3=168f5175-ff13-4ec6-9da2-055be4dd9ac6; @ecoboost-web3.sig=5Y7TDiKAIN5zVl-eEEAUOZ2Fmag; _ga_0W66BZCJ6C=GS1.1.1672711782.178.1.1672712017.0.0.0';

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
