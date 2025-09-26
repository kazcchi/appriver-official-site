# songs 分割設計（雛形）

目的: `songs-data.js` の衝突リスクを下げ、1曲単位の編集が可能な構造に段階移行する。

## 方針

- `songs/` 配下に `ID.json`（1曲1ファイル）で管理
- `tools/song-builder/build-songs-data.js` で `songs-data.js` を生成
- 既存運用は維持（この仕組みは当面オプトイン）

## JSONスキーマ（例）

```
{
  "id": "futarinonagai",
  "title": "二人の長いストーリー",
  "reading": "ふたりのながいすとーりー",
  "album": "",
  "albumReading": "",
  "releaseDate": "2025-09-17",
  "linkUrl": "https://linkco.re/PTr9FHvT",
  "lyrics": "...複数行..."
}
```

## 生成コマンド（案）

- Node: `node tools/song-builder/build-songs-data.js`
- 出力: `stdout` に `songs-data.js` 相当を出力（ファイルにリダイレクト）

## 段階導入の観点

- 初期は read-only（生成のみ用意）。既存 `songs-data.js` をそのまま使用。
- CI には未組み込み（安定後に `build --if-present` に統合検討）。
