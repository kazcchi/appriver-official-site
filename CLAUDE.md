# Claude Code 開発環境設定

## 🎯 プロジェクト概要

**appriver.jp** - SUNO AIで制作した楽曲配信サイト

- **技術スタック**: JavaScript, HTML, CSS (フロントエンド)
- **パッケージマネージャー**: npm
- **Node.js**: 20.18.0
- **開発方式**: デュアルツール（Claude Code + Codex CLI）

## 🚀 クイックスタート

### 1. 環境確認

```bash
node --version  # v20.18.0
npm --version   # 10.8.2
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. 開発前チェック

```bash
npm run verify  # format:check + lint
```

### 4. コード修正

```bash
npm run format    # Prettier自動修正
npm run lint:fix  # ESLint自動修正
```

## 🔒 デュアルツール開発ルール

### 必須事項

1. **コミットメッセージにツールタグ必須**
   - Claude使用時: `[Claude] 変更内容`
   - Codex使用時: `[Codex] 変更内容`

2. **1PR = 1ツール原則**
   - PR作成後のツール切替は禁止
   - PRテンプレートでツール選択必須

3. **CI通過必須**
   - format check
   - ESLint check
   - secrets scan
   - tool lock compliance

### ワークフロー

```bash
# 1. ブランチ作成
git checkout -b feature/your-feature

# 2. 開発作業
# (Claude Code または Codex で開発)

# 3. 検証
npm run verify

# 4. コミット (ツールタグ必須)
git commit -m "[Claude] feat: 新機能追加"

# 5. プッシュ & PR作成
git push origin feature/your-feature
```

## 📁 プロジェクト構造

```
appriver-claude-dev/
├── index.html                 # メインページ
├── style.css                  # スタイルシート
├── songs-data.js             # 楽曲データ (手動フォーマット)
├── music-players.js          # 音楽プレイヤー機能
├── search-sort.js            # 検索・ソート機能
├── slider.js                 # スライダー機能
├── pull-to-refresh.js        # プルリフレッシュ
├── package.json              # NPM設定
├── eslint.config.js          # ESLint設定
├── .prettierrc               # Prettier設定
├── .prettierignore           # Prettier除外ファイル
└── .github/
    ├── workflows/
    │   ├── verify.yml        # CI/CD (format + lint)
    │   └── secrets-scan.yml  # シークレットスキャン
    └── pull_request_template.md # PRテンプレート
```

## 🛠️ NPM Scripts

```bash
# 開発用コマンド
npm run format       # Prettier自動修正
npm run format:check # Prettier チェックのみ
npm run lint         # ESLint チェック
npm run lint:fix     # ESLint 自動修正
npm run verify       # 全チェック (CI相当)

# Git hooks (自動実行)
npm run prepare      # husky初期化
```

## 🎯 ファイル別ルール

### JavaScript ファイル

- **対象**: `*.js`
- **ツール**: ESLint + Prettier
- **ルール**: eslint.config.js参照
- **自動修正**: `npm run lint:fix`

### songs-data.js (特別扱い)

- **手動フォーマット推奨**
- **理由**: 大容量・可読性重視
- **PrettierIgnore**: .prettierignore で除外済み

### HTML/CSS ファイル

- **手動管理**
- **理由**: 複雑な構造・Prettierパーサー問題回避

## 🔍 CI/CD パイプライン

### GitHub Actions

1. **verify.yml**
   - Prettier format check
   - ESLint check
   - Tool lock compliance
   - Node.js 20.18.0

2. **secrets-scan.yml**
   - TruffleHog secrets detection
   - 5分タイムアウト

### ブランチ保護 (手動設定必要)

- main ブランチ保護
- PR必須 + レビュー1名以上
- ステータスチェック必須
- 詳細: `.github/BRANCH_PROTECTION_SETUP.md`

## 🚨 トラブルシューティング

### よくある問題

**1. Prettier エラー**

```bash
npm run format  # 自動修正
```

**2. ESLint エラー**

```bash
npm run lint:fix  # 自動修正
```

**3. Pre-commit hook失敗**

```bash
npm run verify  # 手動確認
git add .       # 修正ファイル再ステージ
git commit      # 再コミット
```

**4. ツールタグ不備**

```bash
# コミットメッセージ修正
git commit --amend -m "[Claude] 正しいメッセージ"
```

**5. Node.js バージョン不一致**

```bash
# .node-version ファイル確認
cat .node-version  # 20.18.0

# nvm使用例
nvm use 20.18.0
```

## 📋 チェックリスト

### 開発開始前

- [ ] Node.js 20.18.0
- [ ] npm 依存関係インストール済み
- [ ] ブランチ作成済み
- [ ] ツール選択決定済み

### 開発中

- [ ] 定期的な `npm run verify`
- [ ] コミットメッセージにツールタグ
- [ ] 1PR = 1ツール原則遵守

### PR作成前

- [ ] `npm run verify` 成功
- [ ] 全変更ファイル確認
- [ ] PRテンプレート記入
- [ ] 影響範囲・ロールバック手順記載

### マージ前

- [ ] CI全通過
- [ ] レビュー承認済み
- [ ] ツールロック確認済み

## 🔗 参考リンク

- [ESLint Config](eslint.config.js)
- [Prettier Config](.prettierrc)
- [GitHub Actions](.github/workflows/)
- [Branch Protection Setup](.github/BRANCH_PROTECTION_SETUP.md)

---

💡 **ヒント**: 不明な点があれば、このドキュメントを先に確認してください。Claude Codeは常にこのファイルを参照して適切な開発手順を実行します。
