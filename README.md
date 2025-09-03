# ワークショップタイムライン管理ツール 要件定義書

## 1. プロジェクト概要

### 目的
ワークショップの各セッションを時間管理しながら進行するためのシンプルなWebアプリケーション

### 対象ユーザー
モバイブコーディング初心者のワークショップファシリテーター

### デプロイ環境
- GitHub（ソースコード管理）
- Heroku（ホスティング環境）

## 2. 機能要件

### 2.1 必須機能

#### タイムライン機能
- セッション（項目）の追加
- セッション名と所要時間（分）の入力
- セッションの削除

#### タイマー機能
- 現在のセッションのカウントダウン表示
- スタート/ストップボタン
- 次のセッションへ進むボタン

#### 表示機能
- セッション一覧の表示
- 現在進行中のセッションのハイライト
- 残り時間の大きな表示

## 3. システム構成

### 3.1 ファイル構成
```
workshop-timer/
├── index.html        # メインHTML
├── style.css         # スタイルシート
├── script.js         # クライアントサイドJavaScript
├── package.json      # Node.js依存関係
├── server.js         # 静的ファイル配信用サーバー
├── Procfile          # Heroku起動コマンド
└── README.md         # 本ドキュメント
```

### 3.2 技術スタック
- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **バックエンド**: Node.js + Express（静的ファイル配信のみ）
- **データ保存**: ブラウザのローカルストレージ
- **ホスティング**: Heroku

## 4. 画面仕様

### 4.1 画面構成（1画面完結）
1. **ヘッダー部**
   - 現在のセッション名
   - 残り時間（大きく表示）

2. **コントロール部**
   - スタート/ストップボタン
   - 次へボタン

3. **セッション管理部**
   - セッション追加フォーム（名前・時間入力）
   - セッション一覧表示
   - 削除ボタン

### 4.2 UI要件
- ボタンは大きく押しやすいサイズ
- 残り時間は画面中央に大きく表示
- 色は3色のみ（背景・文字・アクセント）
- モバイル対応（レスポンシブ）

## 5. データ仕様

### 5.1 セッションデータ構造
```javascript
{
  sessions: [
    {
      id: 1,
      name: "セッション名",
      duration: 10,        // 分単位
      status: "pending"    // pending | active | completed
    }
  ],
  currentSessionIndex: 0
}
```

### 5.2 ローカルストレージ
- キー名: `workshop-timer-data`
- 自動保存（セッション追加/削除時）

## 6. 動作仕様

### 6.1 基本動作フロー
1. セッション追加 → リスト最後に追加
2. スタートボタン → カウントダウン開始（1秒ごと）
3. 時間終了 or ストップボタン → タイマー停止
4. 次へボタン → 次のセッションに移動・タイマーリセット

### 6.2 制約事項
- タイマーは分単位のみ（秒の設定不可）
- 一時停止機能なし（スタート/ストップのみ）
- セッションの順序変更不可
- データのエクスポート/インポート機能なし

## 7. Heroku環境設定

### 7.1 必要な設定ファイル

#### package.json
```json
{
  "name": "workshop-timer",
  "version": "1.0.0",
  "description": "Simple workshop timer application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### Procfile
```
web: node server.js
```

#### server.js
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## 8. デプロイ手順

1. GitHubリポジトリ作成
2. 上記ファイルをコミット・プッシュ
3. HerokuアプリケーションをGitHubリポジトリと連携
4. 自動デプロイ設定
5. デプロイ実行

## 9. 今後の拡張可能性

- 複数ファシリテーター対応
- セッションデータの共有機能
- 実績時間の記録
- レポート機能

## 10. 開発フェーズ

### Phase 1（MVP）
- 基本的なタイマー機能
- セッション管理
- ローカルストレージ保存

### Phase 2（将来）
- UI/UXの改善
- 追加機能の実装

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
