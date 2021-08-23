
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
const cookie = '_ga=GA1.1.390537039.1627549336; _ga_0XS98J4028=GS1.1.1627571635.2.1.1627572233.0; _ga_8H3JZJ3YHW=GS1.1.1627601401.1.1.1627601417.0; _ga_0W66BZCJ6C=GS1.1.1627606353.6.1.1627606626.0; _ga_1GRM5CK2EV=GS1.1.1627624331.5.0.1627624331.0; @ecoboost-web3=0307800f-d8d8-4732-a87a-0ad303bb4673; @ecoboost-web3.sig=ogw-R0ELB2VKQ8-t9VByIoOuezM';

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
