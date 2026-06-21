# JRA Extension

JRA（www.jra.go.jp）向け Chrome 拡張機能。

## 開発環境セットアップ

```bash
npm install
```

## 開発

ファイル変更を監視して自動ビルド：

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` ディレクトリにビルド成果物が生成されます。

## Chrome への読み込み方

1. `npm run build` を実行
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」を ON にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist/` フォルダを選択

コードを変更した場合は再ビルド後、拡張機能ページの更新ボタン（🔄）をクリックしてリロードしてください。
