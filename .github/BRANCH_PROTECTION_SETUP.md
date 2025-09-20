# GitHub ブランチ保護設定手順

## ⚠️ 重要：手動設定が必要

以下の設定はGitHub Web UIで手動設定が必要です。

## 設定手順

### 1. リポジトリ設定へアクセス

1. GitHubリポジトリページを開く
2. `Settings` タブをクリック
3. 左メニューから `Branches` を選択

### 2. main ブランチ保護ルール設定

`Add branch protection rule` をクリックし、以下を設定：

**Branch name pattern:**

```
main
```

**必須設定項目:**

✅ **Require a pull request before merging**

- ✅ Require approvals: `1`
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from code owners（後日CODEOWNERS設定時）

✅ **Require status checks to pass before merging**

- ✅ Require branches to be up to date before merging
- **必須ステータスチェック:**
  - `verify` (GitHub Actions)
  - `secrets-scan` (GitHub Actions)

✅ **Require conversation resolution before merging**

✅ **Require signed commits**（推奨）

✅ **Require linear history**

✅ **Restrict pushes that create files**（オプション）

**管理者設定:**

- ✅ Do not allow bypassing the above settings
- ✅ Restrict push access to specific people or teams（必要に応じて）

### 3. 設定確認

設定完了後、以下を確認：

1. PRなしでmainブランチへの直接pushが拒否される
2. 必須ステータスチェックが動作する
3. レビュー承認が必要になる

## 🔒 ツールロック統合

ブランチ保護と組み合わせて：

1. **コミットメッセージ必須タグ**: `[Claude]` または `[Codex]`
2. **PR必須ラベル**: `tool:claude` または `tool:codex`
3. **CI自動検証**: ツールタグの存在チェック

## トラブルシューティング

**GitHub Actions が見つからない場合:**

1. Actions タブで初回実行を確認
2. ワークフローが正常に動作することを確認
3. ステータスチェック名を再確認

**設定が反映されない場合:**

- ブラウザキャッシュをクリア
- 管理者権限を確認
- Organization設定との競合を確認
