# 開発→本番 昇格フロー（自動PR）

目的: appriver-claude-dev での変更を、安全に appriver-official-site へPRとして昇格します。

## 全体像

- dev（このリポジトリ）
  - `.github/workflows/promote.yml` から official へ `repository_dispatch` を送信
  - トリガー:
    - `workflow_dispatch`（手動実行、ブランチ指定可能）
    - `main` へのpushでコミットメッセージに `[promote]` を含む場合

- official（本番リポジトリ）
  - `promotion-receiver.yml` が `repository_dispatch` を受信
  - dev の対象ブランチ差分を取り込み、PRを自動作成

## シークレット

- dev リポジトリに以下を登録:
  - `OFFICIAL_REPO_TOKEN`（repo:write 権限のPAT。対象: `kazcchi/appriver-official-site`）

## 使い方（標準）

1. dev 側で通常の開発 → PR → Vercelプレビュー確認 → dev/main へマージ
2. 昇格トリガを実行（どちらか）
   - 手動: GitHub Actions → `promote-to-official` → Run workflow（source_branch=main）
   - 自動: dev/main へのマージコミットに `[promote]` を含めてpush
3. official に自動でPRが作成されるので、レビュー後 Squash and merge

## 注意事項

- official 側の受信ワークフロー（`promotion-receiver.yml`）の導入が必要です。
- 実装は「差分ファイルの取り込み」方式です。削除も反映されます。
- songs-data などの大容量/手編集ファイルは、CIの構文チェック（ESM import）で安全性を担保します。
