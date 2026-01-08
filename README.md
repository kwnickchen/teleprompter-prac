# 提詞器 (Teleprompter)

一個簡潔易用的網頁提詞器工具，協助使用者流暢地進行演講。

## 功能列表

- ✅ 文字編輯區：支援多行文字輸入與編輯
- ✅ 提詞顯示區：大字體、高對比顯示，方便閱讀
- ✅ 速度調節：可調整滾動速度（10% - 100%）
- ✅ 字體大小調節：可調整顯示區字體大小（16px - 48px）
- ✅ 播放控制：開始/暫停、重置功能
- ✅ 全屏模式：支援全屏顯示提詞內容
- ✅ 鍵盤快捷鍵：
  - 空白鍵：開始/暫停
  - R 鍵：重置到開頭
- ✅ 響應式設計：支援桌面與行動裝置

## 需求

- Node.js 18+ (請參考 `.nvmrc`)

## 安裝與啟動

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 部署步驟

### GitHub Pages 部署

本專案已配置 GitHub Actions，當推送到 `master` 分支時會自動部署到 GitHub Pages。

部署流程：
1. 將程式碼推送到 GitHub 儲存庫
2. 確保在 `master` 分支
3. GitHub Actions 會自動觸發建置與部署流程
4. 部署完成後，可在 `https://[username].github.io/teleprompter-app/` 訪問

### 手動部署

1. 執行建置指令：
   ```bash
   npm run build
   ```

2. 將 `dist` 目錄內容上傳到您的網頁伺服器

## 技術棧

- **框架**：React 18
- **建置工具**：Vite 5
- **UI 元件庫**：Material UI 5
- **樣式**：Emotion

## 授權

MIT License

