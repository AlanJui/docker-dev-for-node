# 專案指引

以 NodeJS + Express 開發 App 為題，闡述「系統開發作業」，
若是導入「Docker Compose + Docker Machine」之 VM 虛擬化技術，
在作業流程應安排之程序，及該注意之事項。


# 「個人開發環境」建置作業程序

「系統開發」專案，開發人員需要建置個人所操作使用之「開發環境」，以便進行下列之系統開發工作：

 - 撰寫程式碼
 - 執行單元測試
 - 觀察已完成部份之系統功能

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
CMD     ["node", "app.js"]
```    

### 2. 建立專案套件管理檔案

#### (1) 指定 NodeJS 引擎版本。以下案例之 n ，可改用 nvm 或其它。__

```bash
n 4.7.0
```

#### (2) 建立「專案套件管理」 檔案： package.json。__

```bash
npm init -y
npm install --save express
```

### 3. 執行「系統開發」之「程式碼撰寫」工作。

完成初步之「系統架構」，撰寫以下之原始程式碼：

__(1) 建立系統之主程式檔： /app/app.js。__
        
```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(3000);
```    

__(2) 建立畫面之「首頁檔」： /app/public/index.html。__
  
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
docker build -t my-node-app .
```    

### 5. 啟動 Docker Container ，執行開發中之「應用系統」。

自已建置的 Docker Image 檔案：my-node-app ，建置 Docker Container ，並將之命名為： my-node-app 。

```bash
docker run -it --name=my-node-app-container -p 3000:3000 my-node-app
```

### 6. 使用瀏覽器觀察執行輸出之結果。

```bash
http://localhost:3000
```

## 「個人開發環境」建置作業程序 V0.2

### 前版待改善議題

上述之「個人開發環境」雖已可用，但在進行後續的開發工作（例如：在 index.html 檔案中增添內容）。
每當要觀察新的結果，得經過 4 道人工操作的作業程序，開發工作因而形成「有些不便」。

(0) 變更 index.html 內容。

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

(1) 終止 Docker Container 的執行。

```bash
docker stop my-node-app-container
```

(2) 移除 Docker Container 。

```bash
docker rm my-node-app-container
```

(3) 重新建置 Docker Image 檔案： my-node-app 。

```bash
docker build -t my-node-app .
```

(4) 重新啟動 Docker Container ： my-node-app-container。

```bash
docker run -it --name=my-node-app-container -p 3000:3000 my-node-app
```

### 本版改善結果


改善上述問題，設定「改善目標」為：當 .html 檔案的內容有所變更時，不必重新建置 Docker Container 便能觀察變更後的結果。

變更「作業程序」中「步驟(5)」的 Bash 指令，使用 Docker 中的 -v 參數（Volume），要求 Docker Container 得與「專案目錄」產生連結關係，只要「原始程式碼」檔案內容有任何變更時，都能自 Docker Container 觀察到變更後的最新結果。 

(5) 啟動 Docker Container 與執行「開發中系統」。

原 Bash 指令中，加入新參數： `-v $(pwd):/app` 。

```bash
docker run -it --name=my-node-app-container -v $(pwd):/app -p 3000:3000 my-node-app
```

## 「個人開發環境」建置作業程序 V0.3

### 前版待改善議題

`「個人開發環境」建置作業程序 V0.2 ` ，改善了 .html 檔案內容有所變更，卻無法立即觀察結果的問題。
但變更 .js 檔案，卻無法產生同樣的結果。

例如：加入 API 功能

(1) 編輯 app.js 檔案，加入 API 功能： GET /api/hello。

```javascript
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/hello', function (req, res) {
  res.send('world');
});

app.listen(3000);
```

(2) 自瀏覽器輸入 URL: http://localhost:3000/api/hello 。

結果自瀏覽器，看到系統發出的問題：「Cannot GET /api/hello」。

(3) 終止 Docker Container 。

```bash
docker kill my-node-app-container
```

(4) 刪除 Docker Container 。

```bash
docker rm my-node-app-container
```

(5) 重新啟動 Docker Container 。

```bash
docker run -it --name=my-node-app-container -v $(pwd):/app -p 3000:3000 my-node-app
```

(6) 再次自瀏覽器觀察 URL: http://localhost:3000/api/hello 的輸出結果。

### 本版改善結果

改善 `個人開發環境」建置作業程序 V0.2` 的問題，設定「改善目標」為：省去：「刪除 Docker Container」的步驟。

變更「作業程序」中「步驟(5)」的 Bash 指令，使用 Docker 指令中的 --rm 參數，要求 Docker Container 在終止時（指令：stop 、 kill），能自動刪除 Docker Container 。 

(5) 啟動 Docker Container 與執行「開發中系統」。

原 Bash 指令中，加入新參數： `--rm` 。

```bash
docker run -it --name=my-node-app-container --rm -v $(pwd):/app -p 3000:3000 my-node-app
```

---

## 「個人開發環境」建置作業程序 V0.4

### 前版待改善議題

變更 .js 檔案，可立即觀察到結果。 ==> nodemon

### 本版改善結果 

---

## 「個人開發環境」建置作業程序 V0.5

### 前版待改善議題

待開發系統需要用到 DB 時。 ==> docker-compose

### 本版改善結果

---

# 參考文章

 - [Workflows: using Docker Machine and Docker Compose together in development](https://alexanderzeitler.com/articles/docker-machine-and-docker-compose-developer-workflows/)
