# 專案指引

以 NodeJS + Express 開發 App 為題，闡述「系統開發作業」，
若是導入「Docker Compose + Docker Machine」之 VM 虛擬化技術，
在作業流程應安排之程序，及該注意之事項。


# 「個人開發環境」建置作業程序

「系統開發」專案，開發人員需要建置個人所操作使用之「開發環境」，以便進行下列之系統開發工作：

 - 撰寫程式碼
 - 執行單元測試
 - 觀察已完成部份之系統功能

---

## 「個人開發環境」建置作業程序 V0.1

引進「Docker 技術」（僅使用 Dockerfile 檔案），用於建置開發人員所使用之「個人開發環境」。

以下之「『個人開發環境』作業程序」，主要之工作目的可分為：

 - 建置 Docker Image 檔案，以便後續能自 Docker Image 產生 Docker Container；

 - 在 Docker Container 執行已撰寫程式碼之執行結果、除錯。
 

### 1. 建立 Dockerfile 檔案。

建立 Dockerfile ，並放入如下所示之內容，以為建置（Build） Docker Image 檔案所用之「腳本描述」（Build Script）。

```docker
FROM    node:4.7.0
EXPOSE  3000
EXPOSE  5858
COPY    . /app
WORKDIR /app

RUN     cd /app; npm install npm@5.6.0 -g; npm install
CMD     ["npm", "start"]
```    

### 2. 建立專案套件管理檔案

#### (1) 指定 NodeJS 引擎版本。以下案例之 n ，可改用 nvm 或其它。

```bash
n 4.7.0
```

#### (2) 建立「專案套件管理」 檔案： package.json。

```bash
npm init -y
```

#### (3) 安裝套件： express。

```bash
npm install --save express
```

#### (4) 加入啟動功能： `npm start` 。

在 "scripts" 中，加入 "start" 描述。

```npm
{
  "name": "docker-dev-workflow-express",
  "version": "1.0.0",
  "description": "以 NodeJS + Express 開發 App 為題，闡述「系統開發作業」， 若是導入「Docker Compose + Docker Machine」之 VM 虛擬化技術， 在作業流程應安排之程序，及該注意之事項。",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
  "keywords": [],
  "author": "Alan Jui",
  "license": "ISC",
  "dependencies": {
    "express": "^4.16.2"
  }
}
```

### 3. 執行「系統開發」之「程式碼撰寫」工作。

完成初步之「系統架構」，撰寫以下之原始程式碼：

#### (1) 建立系統之主程式檔： /app/app.js。
        
```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(3000);
```    

#### (2) 建立畫面之「首頁檔」： /app/public/index.html。
  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Docker DEV Workflow</title>
</head>
<body>
  <h1>Hello NodeJS</h1>
</body>
</html>
```  

### 4. 建置 Docker Image 檔案。

自本前所在之目錄，透過 Dockerfile 腳本檔案內的建置指示，建置 Docker Image 檔案，並將輸出的檔案命名為：node-app 。

```bash
docker build -t node-app .
```    

### 5. 啟動 Docker Container ，執行開發中之「應用系統」。

自已建置的 Docker Image 檔案：node-app ，產生 Docker Container ，並將之命名為： web 。

```bash
docker run -it --name=web -p 3000:3000 node-app
```

### 6. 在瀏覽器輸入以下網址，觀察開發中「應用系統」的輸出結果。

```
http://localhost:3000
```

---

## 「個人開發環境」建置作業程序 V0.2

__【前版待改善議題】__

前版作業程序 V0.1，已成功完成「個人開發環境」的初步建置。但在進行後續的開發工作，每當 .html 檔案的內容有所變更（例如：在 index.html 增添內容），
非經如下所述 4 道操作程序，則無法看到變更後的輸出結果，故而使得開發作業「不夠順暢」。

#### (1) 變更 index.html 檔案，加入內容： `<p>Developement process</p>` 。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Docker DEV Workflow</title>
</head>
<body>
  <h1>Hello NodeJS</h1>
  <p>Developement process</p>
</body>
</html>
```

#### (2) 在瀏覽器輸入以下網址，觀察輸出結果，但還是看到原先之內容。

```
http://localhost:3000
```

#### (3) 終止 Docker Container 的執行。

```bash
docker stop web
```

#### (4) 移除 Docker Container 。

```bash
docker rm web
```

#### (5) 重新建置 Docker Image 檔案： node-app 。

```bash
docker build -t node-app .
```

#### (6) 重新啟動 Docker Container ：web。

```bash
docker run -it --name=web -p 3000:3000 node-app
```

#### (7) 在瀏覽器輸入以下網址，觀察輸出結果，終於能看到變更後的新結果。

```
http://localhost:3000
```

__【本版改善事項】__

為改善前版之問題，設定本版「改善目標」：當 .html 檔案的內容有所變更時，可以不必重新建置 Docker Container ，便能觀察變更後最新輸出的結果。

變更作業程序「步驟 5」執行的指令，增添 -v 參數，透過 Volume 功能的特性，使得 Docker Container 與「專案目錄」產生連結關係，
因而每當 .html 檔案的內容有所變更，瀏覽器就能觀察到最新的輸出結果。 

__`5. 啟動 Docker Container ，執行開發中之「應用系統」。`__ 

原 Bash 指令中，加入新參數： `-v $(pwd):/app` 。

```bash
docker run -it --name=web -v $(pwd):/app -p 3000:3000 node-app
```

__【驗證改善結果】__

#### (1) 終止 Docker Container 。

```bash
docker kill web
```

#### (2) 刪除 Docker Container 。

```bash
docker rm web
```

#### (3) 重新啟動 Docker Container：web，執行開發中之「應用系統」。

```bash
docker run -it --name=web -v $(pwd):/app -p 3000:3000 node-app
```

#### (5) 編輯檔案： index.html ，將內容： `Development process` ，改成 `Workflow for development process` 。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Docker DEV Workflow</title>
</head>
<body>
  <h1>Hello NodeJS</h1>
  <p>Workflow for developement process</p>
</body>
</html>
```

#### (6) 在瀏覽器輸入以下網址，觀察開發中「應用系統」的輸出結果。

```
http://localhost:3000
```

---

## 「個人開發環境」建置作業程序 V0.3

__【前版待改善議題】__

前版作業程序 V0.2，雖已改善了 .html 檔案內容已變更，卻無法立即看到結果的問題。
但 .js 檔案的變更，卻無法產生同樣的結果。

例如：加入 API 功能。

#### (1) 編輯 app.js 檔案，加入 API 功能： GET /api/hello。

加入如下內容：
```javascript
app.get('/api/hello', function (req, res) {
  res.send('world');
});
```
    
最後結果：
```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/hello', function (req, res) {
  res.send('world');
});

app.listen(3000);
```

#### (2) 自瀏覽器輸入 URL: http://localhost:3000/api/hello 。

結果自瀏覽器，看到系統發出的問題：「Cannot GET /api/hello」。

#### (3) 終止 Docker Container 。

```bash
docker kill web
```

#### (4) 刪除 Docker Container 。

```bash
docker rm web
```

#### (5) 重新啟動 Docker Container：web，執行開發中之「應用系統」。

```bash
docker run -it --name=web -v $(pwd):/app -p 3000:3000 node-app
```

#### (6) 在瀏覽器輸入以下網址，觀察輸出結果，終於能看到變更後的新結果。

**輸入網址：**
 
```
http://localhost:3000/api/hello
```

**輸出結果：**
 
```
world
```


__【本版改善事項】__

安裝 NodeJS 套件： `nodemon` ，令開發中之「應用系統」能處理：「遇有 .js 檔案內容已變更」事件，能自動重新啟動應用系統，
使得開發人員可立即觀察最新的輸出結果。

__【驗證改善結果】__

#### (1) 終止 Docker Container 。

```bash
docker kill web
```

#### (2) 刪除 Docker Container 。

```bash
docker rm web
```

#### (3) 安裝 nodemon 套件。

```bash
npm install --save-dev nodemon
```

#### (4) 修訂 package.json ，改 npm start。

變更：node app.js ，改為：nodemon app.js 。

```javascript
    "scripts": {
        ...
        "start": "nodemon app.js"
    },
```

修訂後結果：
```npm
{
  "name": "docker-dev-workflow-express",
  "version": "1.0.0",
  "description": "以 NodeJS + Express 開發 App 為題，闡述「系統開發作業」， 若是導入「Docker Compose + Docker Machine」之 VM 虛擬化技術， 在作業流程應安排之程序，及該注意之事項。",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
  "keywords": [],
  "author": "Alan Jui",
  "license": "ISC",
  "dependencies": {
    "express": "^4.16.2"
  },
  "devDependencies": {
    "nodemon": "^1.14.12"
  }
}
```

#### (4) 重新建置 Docker Image 檔案： node-app 。

```bash
docker build -t node-app .
```

#### (5) 重新啟動 Docker Container：web，執行開發中之「應用系統」。

```bash
docker run -it --name=web -v $(pwd):/app -p 3000:3000 node-app
```

#### (6) 變更 API ，令 GET /api/hello 的輸出結果為： docker。

在 app.js 檔案，修訂如下之程式碼：

```javascript
...
res.send('docker');
...
```

最後結果：
```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/hello', function (req, res) {
  res.send('docker');
});

app.listen(3000);
```

#### (5) 在瀏覽器觀察立即看到最新結果 。

在瀏覽器輸入以下網址，觀察輸出結果，終於能看到變更後的新結果。

**輸入網址：**
 
```
http://localhost:3000/api/hello
```

**輸出結果：**
 
```
docker
```






---

## 「個人開發環境」建置作業程序 V0.4

__【前版待改善議題】__

應用系統得要使用 DB，如： mongode ，此時，啟動 docker container 得分別執行，一個給 web 用，一個給 db 用。

__【本版改善事項】__ 

可利用 Docker Hub 已有現成的 Docker Image: mongo 。

Docker Container 命名為：db 。

``` bash
docker run -d -it --name=my-db -p 27017:27017 mongo:3.4
```

啟動 Docker Container: web 的指令變更如下：

加入： 
 * --link db：與 Docker Container: db 連結；也就是啟動 web 之前，得先啟動 db
 * -d：要求 Docker Container: web 改以「背景」模式執行

```bash
docker run -d -it --name=web -v $(pwd):/app -p 3000:3000 --link db node-app
```

__【驗證改善結果】__


``` bash
docker run -d -it --name=db -p 27017:27017 mongo
```


```bash
docker run -d -it --name=web -v $(pwd):/app -p 3000:3000 --link db node-app
```

#### (1) 安裝套件。

```bash
npm install --save mongodb body-parser
```

#### (2) 修訂 app.js 。

```javascript
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/dockerdemo';
var db;

MongoClient.connect(url, function (err, database) {
    console.log("Connected correctly to server");
    db = database;
});

app.use(bodyparser.json());
app.use(express.static('public'));

var insertDocument = function (db, document, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertOne(document, function (err, result) {
        callback(err, JSON.stringify(result.ops[0]));
    });
};

app.post('/api/hello', function (req, res) {
    var data = req.body;
    insertDocument(db, data, function(err, result) {
        res.status(201).send(result)
    })
});

app.get('/api/hello', function (req, res) {
    res.send('world');
});

app.listen(3000);
```

#### ()

```bash
docker run -d -it --name=web -v $(pwd):/app -p 3000:3000 --link db node-app
```
---

```bash
curl -i -d '{"name": "Alan"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/hello
```

```bash
curl -i -d "name=Alan" -H "Content-Type: application/x-www-form-urlencoded" -X POST http://localhost:3000/api/hello
```




## 「個人開發環境」建置作業程序 V0.5

__【前版待改善議題】__

XXX

__【本版改善事項】__

XXXX

__【驗證改善結果】__

XXX

---

# 參考文章

 - [Workflows: using Docker Machine and Docker Compose together in development](https://alexanderzeitler.com/articles/docker-machine-and-docker-compose-developer-workflows/)
