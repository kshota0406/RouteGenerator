# Route Generator

Google Maps API を使用した高度なルートURL生成・共有ツールです。出発地、目的地、複数の経由地を設定し、その経路をURLとして保存・共有できます。

## ✨ 主な機能

- 🗺️ **Google Maps URL生成**: 選択した地点からGoogle Mapsで開けるURLを自動生成
- 🔗 **経路の保存と共有**: 生成した経路をユニークなURLとして保存し、他者と共有可能
- 💾 **URLからの経路復元**: 共有されたURLを開くだけで、経路が自動的に復元
- 🔍 **オートコンプリート**: Google Places APIによる地点入力の強力な自動補完
- 📍 **ドラッグ＆ドロップ**: ドラッグ＆ドロップで経由地の順番を直感的に並べ替え
- 📱 **レスポンシブ対応**: モバイル・デスクトップ両対応の滑らかなUI
- 🎨 **クールなUI**: ホログラム調のエフェクトを取り入れたモダンなデザイン

## 🛠️ 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Jotai
- **地図・場所API**: Google Maps JavaScript SDK, Google Places API
- **パッケージマネージャー**: pnpm

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、Google Maps APIキーを設定します。

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
```

### 3. Google Maps API の有効化

Google Cloud Consoleで、以下のAPIを有効にしてください：

1. **Maps JavaScript API** - 地図表示用
2. **Places API** - オートコンプリート用

### 4. 開発サーバーの起動

```bash
pnpm dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 使い方

### 基本的なルート設定

1. **出発地を入力**: オートコンプリート機能で地点を選択します。
2. **経由地を追加** (オプション): 「+ 経由地を追加」ボタンで経由地を追加（最大10ヶ所）。
3. **目的地を入力**: 同様にオートコンプリートで選択します。
4. **順番を並べ替え**: ドラッグ＆ドロップで経由地の順番を変更できます。

### 経路の共有と利用

- **経路をシェア**: 「経路をシェア」ボタンをクリックすると、現在の経路情報を含んだURLがクリップボードにコピーされます。
- **Google Mapで見る**: 「Google Mapで経路を見る」ボタンで、設定したルートをGoogle Mapsで開きます。
- **リセット**: 「リセット」ボタンで、すべての入力情報をクリアできます。

## 🔄 シェア機能の仕組み

経路情報は、以下のプロセスでURLにエンコード・デコードされます。

1. **データ圧縮**: 出発地、目的地、経由地の情報を、キー名を短縮するなどして軽量化。
2. **JSON化**: 圧縮したデータをJSON文字列に変換。
3. **Base64エンコード**: UTF-8対応のBase64でエンコードし、URLセーフな文字列に。
4. **URL生成**: `?route=[エンコードされたデータ]` の形式でURLを生成。

このURLにアクセスすると、逆のプロセスでデータが復元され、経路が画面に表示されます。

## 📁 プロジェクト構造

```
src/
├── app/
│   ├── layout.tsx         # 全体のレイアウト（Header, Footer）
│   └── page.tsx           # メインページ
├── components/
│   ├── Header.tsx         # ヘッダーコンポーネント
│   ├── Footer.tsx         # フッターコンポーネント
│   ├── GoogleCredit.tsx   # Googleクレジット表記
│   ├── PlaceInput.tsx     # 地点入力コンポーネント
│   └── ShareButtons.tsx   # シェアボタン
└── lib/
    ├── mapsUrl.ts         # Google Maps URL生成ロジック
    ├── routeSharing.ts    # 経路のエンコード/デコードロジック
    └── store.ts           # Jotaiによる状態管理
```

## 📜 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🙏 貢献

プルリクエストやイシューの報告を歓迎します。

## 💡 注意事項

- Google Maps Platformの利用には料金が発生する場合があります。詳細は[公式の料金ページ](https://developers.google.com/maps/pricing)を確認してください。
- APIキーの管理には十分注意してください。
