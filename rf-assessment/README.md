# RF 幼兒學習評量助手

基於《幼兒園教保活動課程：幼兒學習評量手冊》開發的 AI 評量工具。

## 快速部署到 Vercel（免費）

### 方法一：拖曳上傳（最快，2 分鐘完成）
1. 先在本機跑 `npm install && npm run build`
2. 到 https://vercel.com → 登入 → 拖曳 `build/` 資料夾上傳
3. 完成！獲得一個 https 網址

### 方法二：GitHub + Vercel（推薦，之後更新方便）
1. 把這個資料夾上傳到 GitHub（新建一個 repo）
2. 到 https://vercel.com → "Add New Project" → 選擇你的 repo
3. Framework Preset 選 "Create React App"
4. 點 Deploy，約 2 分鐘完成

## 本機開發預覽
```bash
npm install
npm start
```
瀏覽器開啟 http://localhost:3000

## 注意事項
- 影片開場已直接內嵌在 App.jsx 中（base64 格式），不需要額外上傳影片檔
- 工具使用 Claude API，費用極低（每次對話約 0.001 美元）
