# 1Campus MyCourse

1campus.net 上的「我的課程」模組。

## Development server

開發時，要先設定後端，請打開`proxy.config.js`檔案，把相關設定指定好再開始。後端會是 1campus.net 的 server，記得
url、cookie 要設定正確。

## Access Google Classroom API with Service account Credentials

使用 GCP「服務帳戶」呼叫 Google Classroom API 的問題。

- `https://stackoverflow.com/questions/33880877/access-google-classroom-api-with-service-account-credentials`

## 新北我的課程上線前置作業

### 1. 在 web3 資料庫的 connected_service 建立相應的服務帳號授權資料。

### 2. 在對應的學校資料庫的「老師、學生」身份掛載我的課程模組。

- guid: `myc5b1c0-725d-4129-ba74-d5eb5f1e944d`
- gadget params:

```json
{
  "hide_oha": true,
  "oha": { 
    "url": "https://classroom.ntpc.edu.tw", 
    "tip": "積點教室" 
  }
}
```
