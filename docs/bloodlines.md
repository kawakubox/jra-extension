# 血統カラーリング機能

## 概要

出馬表ページ（`li.sire` / `span.bloodmare`）の父・母父に血統系統に応じた背景色を付与する。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `src/data/sires.json` | 種牡馬名 → 血統系統キーのマッピング |
| `src/content/bloodline.css` | 血統系統キー → 背景色の定義 |
| `src/content/EntryPageParser.ts` | DOMから種牡馬名を抽出するパーサー |
| `src/content/PedigreeColorizer.ts` | 馬名をルックアップしてクラスを付与するロジック |

## 種牡馬を追加する

`src/data/sires.json` に1行追加する。キーは辞書順（ラテン文字 → カタカナのUnicode順）で管理する。

```json
{
  "新種牡馬名": "bloodline_key"
}
```

対応する `bloodline_key` がまだ CSS に存在しない場合は、後述の手順で系統を追加する。

## 血統系統を追加する

1. `src/content/bloodline.css` に `.bloodline-{key}` クラスを追加する（辞書順を維持）。

```css
.bloodline-new_key { background-color: #xxxxxx; }
```

2. `src/data/sires.json` の該当種牡馬エントリに `"new_key"` を設定する。

## 既存系統の色を変更する

`src/content/bloodline.css` の該当クラスの `background-color` を変更するだけでよい。`sires.json` の変更は不要。

## 注意事項

- `sires.json` のキーはJRAサイトに表示される馬名と完全一致している必要がある。
- 将来的に `sires.json` はTSVからの自動生成に切り替え予定（別PR）。
