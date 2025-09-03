const express = require('express');
const path = require('path');
const app = express();

// ポート設定（Herokuの環境変数を使用）
const PORT = process.env.PORT || 3000;

// 静的ファイルの配信設定
app.use(express.static(path.join(__dirname)));

// ルートパスへのアクセス
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
});