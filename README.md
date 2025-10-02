# appriver 公式サイト

SUNO AIで制作した楽曲で音楽配信する新人アーティスト「appriver」の公式webサイトです。

## ファイル構成

- `index.html` - メインのHTMLファイル
- `style.css` - スタイルシート
- `README.md` - このファイル

## 使用方法

1. `index.html` をWebブラウザで開いてください
2. または、ローカルサーバーを起動してアクセスしてください

## サイト構成

- **ホーム**: アーティスト紹介
- **アルバム**: 最新アルバム「NUKUMORI」の情報
- **歌詞**: メイン楽曲「いのちの理由」の歌詞
- **リンク**: TikTokとストリーミングプラットフォームへのリンク

## 特徴

- レスポンシブデザイン対応
- 「心にしみる曲・癒される曲」をテーマにした美しいデザイン
- グラデーションとアニメーション効果
- モバイルフレンドリー

## アルバム情報

- **タイトル**: NUKUMORI
- **収録曲数**: 15曲
- **配信開始日**: 2025年6月28日

## リンク

- [アルバム「NUKUMORI」](https://linkco.re/E7hxe2Ay)
- [「いのちの理由」](https://linkco.re/Hb9nfMcM)
- [TikTok @appriver12](https://www.tiktok.com/@appriver12?is_from_webapp=1&sender_device=pc)

## 運用クイックガイド（開発）

- フロー: ブランチ作成 → 変更 → PR作成 → Vercelプレビュー確認 → Squash and merge → 開発Productionデプロイ確認
- プレビューURL: PRの「Checks → Vercel」から確認
- Production（開発用）: Vercelのプロジェクト「appriver-claude-dev」→ 最新のProductionデプロイの Domains

### 楽曲追加の要点

- 追加先: `songs-data.js` の `songsData` に1オブジェクト追加（ID重複禁止）
- 日付: `YYYY-MM-DD`（例: 2025-09-17）
- 歌詞: バッククォート`を含めない（テンプレート文字列使用のため）
- 配信リンク: LinkCore等のURL

### CI / ルールの要点

- 必須チェック（推奨）: `CI / smoke (pull_request)`
- verify: PR差分のコミットメッセージに `[Codex]` または `[Claude]` を含める
- ローカル: `commit-msg` フックで同タグを強制（Husky）。コミット時に未記載だと拒否されます。
- secrets-scan: TruffleHog v3 + 差分スキャン + `.trufflehogignore` で `songs-data.js` とバックアップを除外
- Prettier: `.github/workflows/*.yml` は整形対象外（.prettierignore 済み）

### トラブルシューティング

- RequiredがExpectedのまま: ルールで必須チェック名を「CI / smoke (pull_request)」に統一
- verifyで`origin/main..HEAD`のエラー: checkoutに`fetch-depth: 0`、比較は`base.sha..HEAD`（現状対応済み）
- secrets-scan誤検知: `@v3`固定・`--only-verified`・`.trufflehogignore`の見直し
