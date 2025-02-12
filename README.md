# ゆめみフロントエンドコーディングテスト提出

こちらは **ゆめみフロントエンドコーディングテスト**の提出物  
**Next.js SPA** を使用し、**コード品質、テスト、パフォーマンス、ベストプラクティス**に重点を置いて開発

## 🚀 技術スタック

- **Next.js 15** (App Router)  
- **React 19**  
- **TypeScript**  
- **Tailwind CSS**  
- **pnpm**

## 📌 主な特徴

- 📱 **レスポンシブ対応 UI**（Tailwind CSSを使用）  
- ⚡️ **React Server Components (RSC)** と **キャッシュ機能** によるパフォーマンス最適化  
- ♿️ **アクセシビリティ**と**国際化対応**  
- 🧪 **ユニットテスト** (Vitest) と **統合テスト** (Cypress) を導入  
- 🐳 **Docker** を使用したデプロイメント  

---

## 🛠️ セットアップ手順

1. このリポジトリをクローン
   ```
   git clone https://github.com/firasaguel/yumemi-frontend.git  
   cd yumemi-frontend  
   ```
2. 依存関係をインストール
```
   pnpm install  
```
3. 開発サーバーを起動  
```
   pnpm dev  
```
---

## 🌱 環境変数の設定

.env.example ファイルに環境変数の例を記載している。  
APIキーは **Yumemi APIポータル** から取得してください。（例: https://api.yumemi-coding...）
APIキーを取得したらファイル名を.envに変更する

---

## 🗂️ イッシュー管理について

このリポジトリでは **GitHub Issues** と **sub-issues** を使用して進捗を管理している。  
メインのイシューのみを確認するには、以下の no:parent-issue フィルターをご利用ください。
🔗 https://github.com/FirasAguel/yumemi-frontend/issues?q=is%3Aissue%20state%3Aopen%20no%3Aparent-issue

---

## 📦 Docker デプロイ手順

1. Docker イメージをビルド
```
   docker build -t yumemi-frontend .  
```
2. コンテナを起動
```
   docker run -p 3000:3000 yumemi-frontend  
```
---

## 🧪 テスト

本プロジェクトは **Vitest** を使ったユニットテスト。テストを実行するには以下のコマンドを使用する  
```
pnpm test  
```
---

何か不明点やフィードバックがあれば、気軽に Issue を作成してください！ 🎉  
