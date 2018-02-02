# 專案指引

以 NodeJS + Express 開發 App 為題，闡述「系統開發作業」，
若是導入「Docker Compose + Docker Machine」之 VM 虛擬化技術，
在作業流程應安排之程序，及該注意之事項。

(1) 建 Dockerfile 

(2) 完成初階 App:
    - /app/app.js
    - /app/public/index.html

(3) 啟動 Docker Container 中的 App
```bash
docker run -it --name=my-node-app-container -p 3000:3000 my-node-app

```

(4) 變更 index.html 內容。

```bash
docker stop my-node-app-container
docker rm my-node-app-container
docker build -t my-node-app .
docker run -it --name=my-node-app-container -p 3000:3000 my-node-app
```

(5) 改善
```bash
docker stop my-node-app-container
docker rm my-node-app-container
docker build -t my-node-app .
docker run -it --name=my-node-app-container -v $(pwd):/app -p 3000:3000 my-node-app
```
