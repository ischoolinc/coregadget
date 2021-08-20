
// 如果不指定請設定成 null。
// cookie 內容請到相應的站台的 service  response 中取得。
const cookie = '_ga=GA1.1.1057067022.1622521494; _ga_8H3JZJ3YHW=GS1.1.1626622420.10.1.1626622796.0; _ga_0XS98J4028=GS1.1.1627619766.52.0.1627619766.0; _ga_1GRM5CK2EV=GS1.1.1627910559.13.1.1627910828.0; @ecoboost-web3=f23ae8d3-f86d-4760-af6c-72dfb70dbb2e; @ecoboost-web3.sig=oga07Jgl_wx-XBPG7ckUWhs8yaU; _ga_0W66BZCJ6C=GS1.1.1629344912.80.1.1629345643.0';

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
