# ルートプランナー

Google Maps API を使用したルートURL生成ツールです。出発地、目的地、中継地点を入力して、Google Mapsで開けるURLを生成できます。

## 機能

- 🗺️ **Google Maps URL生成**: 選択した地点からGoogle Maps URLを自動生成
- 🔍 **オートコンプリート**: Google Places API による地点入力の自動補完
- 📍 **中継地点管理**: 動的に中継地点を追加・削除可能
- 📱 **レスポンシブ対応**: モバイル・デスクトップ両対応
- 📋 **クリップボードコピー**: 生成されたURLをワンクリックでコピー
- 🔗 **直接開く**: 生成されたURLを新しいタブで開く

## 技術スタック

- **フレームワーク**: Next.js 15.3.4 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **地図API**: Google Maps JavaScript SDK
- **オートコンプリート**: Google Places API
- **状態管理**: useState + Jotai
- **パッケージマネージャー**: pnpm

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Google Maps API の設定

以下のAPIを有効にしてください：

1. **Maps JavaScript API** - 地図表示用
2. **Places API** - オートコンプリート用

### 4. 開発サーバーの起動

```bash
pnpm dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 使用方法

### 基本的なルート設定

1. **出発地を入力**: オートコンプリート機能で地点を選択
2. **中継地点を追加** (オプション): 「+ 中継地点を追加」ボタンで追加
3. **目的地を入力**: 同様にオートコンプリートで選択
4. **URLを生成**: 「Google Maps URLを生成」ボタンをクリック

### 中継地点の管理

- **追加**: 「+ 中継地点を追加」ボタンで中継地点を追加
- **削除**: 各中継地点の削除ボタンで削除
- **編集**: 入力フィールドを直接編集可能

### 生成されたURLの利用

- **コピー**: 「コピー」ボタンでURLをクリップボードにコピー
- **開く**: 「開く」ボタンでGoogle Mapsでルートを表示

## プロジェクト構造

```
src/
├── app/
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # レイアウト
│   └── page.tsx                  # メインページ
├── components/
│   └── PlaceInput.tsx            # 地点入力コンポーネント
└── lib/
    └── mapsUrl.ts                # URL生成ロジック
```

## 生成されるURL形式

```
https://www.google.com/maps/dir/?api=1
&origin=lat,lng
&destination=lat,lng
&waypoints=lat1,lng1|lat2,lng2|...
&travelmode=driving
```

## API 制限と注意事項

### Google Maps API 制限

- **Maps JavaScript API**: 月間25,000回の読み込み
- **Places API**: 月間28,500回のリクエスト

### 料金

- Google Maps Platform の料金体系に従います
- 詳細は [Google Maps Platform 料金](https://developers.google.com/maps/pricing) を確認してください

### ベストプラクティス

1. **APIキーの保護**: 環境変数で管理し、クライアントサイドに露出しない
2. **エラーハンドリング**: API制限やネットワークエラーへの対応
3. **ユーザビリティ**: ローディング状態とエラー表示の適切な実装

## 開発

### ビルド

```bash
pnpm build
```

### 本番起動

```bash
pnpm start
```

### リント

```bash
pnpm lint
```

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

問題が発生した場合は、以下を確認してください：

1. APIキーが正しく設定されているか
2. 必要なAPIが有効になっているか
3. 環境変数が正しく読み込まれているか
4. ネットワーク接続が安定しているか
