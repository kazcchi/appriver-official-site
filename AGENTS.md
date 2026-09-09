# appriver 公式サイト(appriver.jp)

SUNO AIで制作した楽曲で活動するアーティスト「appriver」の公式サイト。静的サイト(HTML/CSS/JavaScript)。2026-08-18以降の役割は **MWM(https://mwm.ne.jp)への送客サイト**。歌詞・試聴はサイト内で完結させず、MWMのアーティストページへ誘導する。同じリポジトリの `buka/` に BUKA の公式サイトも同居する。

## 言語ポリシー

- 以後のやり取りは必ず日本語で行う。
- コード識別子や外部仕様上で英語必須な場合を除き、日本語を優先する。
- 例外が必要な場合はPRで合意を取る。

## 運用ルール(Claude Code / Codex 共通・最初に読む)

- **正本はこの `AGENTS.md`**。`CLAUDE.md` はここへのシンボリックリンク。編集はこのファイルに対して行う
- **進行状態は `HANDOFF.md` だけに書く**(待ち事項・次にやること・直近の決定)。このファイルには手順とルールだけを書く
- 日付ごとの引き継ぎファイルを増やさない。詳細ログが要るときは `docs/` 配下に置き、`HANDOFF.md` からリンクする
- リモートは GitHub **public** `kazcchi/appriver-official-site`(公開サイトのため意図的に公開リポジトリ)。Mac mini と MacBook Air の2台運用。開始時 pull・終了時 push、同時作業はしない
- 公開リポジトリなので **鍵・個人情報・未公開の経営情報をコミットしない**(CIのシークレットスキャンあり)。鍵は `.env`(git管理外)。値を表示・出力しない
- 「最新にして」「終了処理して」の手順は全体設定(Claude: `~/.claude/CLAUDE.md` / Codex: `~/.codex/AGENTS.md`)のとおり
- **コミットメッセージにツールタグ必須**: Claude使用時 `[Claude] 変更内容`、Codex使用時 `[Codex] 変更内容`。husky の commit-msg フックと CI の両方で検査される(大文字小文字を区別)
- 作業はブランチを切って PR → main へマージ(直近の履歴はすべてPR経由)。main のブランチ保護は未設定(`.github/BRANCH_PROTECTION_SETUP.md` が手順書)
- MWM本体(`../mwm_main`)と役割分担がある。サイト全体の方針(送客先・表記の掟)は MWM 側の正本(`mwm_main/docs/gunbai/`)に従う

## 触らない範囲(凍結)

- `mwm-bridge.js`: TikTokアプリ内ブラウザから mwm.ne.jp へ遷移できない問題の橋渡し(2026-08-08 実機検証済み)。UAがTikTokと名乗る場合だけ横取りする設計を崩さない
- `vercel.json` の `/out/*` リライト: 外部導線(TikTok・YouTube・MWMアルバム等)の短縮URL。既存の行き先を勝手に変えない(追加はよい)
- `CNAME`(`appriver.jp`)・`browserconfig.xml`・`manifest.json`・`icons/`: ドメインとPWA設定
- 歌詞のサイト内表示は 2026-08-18 に廃止済み(#88)。復活させない(MWMへ一本化の裁定)
- `songs-data.js` は Prettier 除外(手動フォーマット・大容量)。整形ツールにかけない

## 技術・構成

- 素のHTML/CSS/JavaScript(フレームワークなし)。Node.js 20.18.0(`.node-version`)・npm。ホスティングは Vercel(`vercel.json`)、ドメインは appriver.jp(www は appriver.jp へ301)
- 主要ファイル: `index.html`(メインページ)/`style.css`/`songs-data.js`(楽曲データ)/`search-sort.js`(検索・並び替え)/`slider.js`/`pull-to-refresh.js`/`mwm-bridge.js`(TikTok対策)/`analytics.js`/`scroll-guide.js`・`swipe-guide.js`・`reload-guide.js`(操作ガイド)/`song-template.snippet.js`(曲追加のひな形)
- フォルダ: `buka/`(BUKA公式サイト・同じ構成の静的サイト)/`out/`(外部リンクの中継ページ)/`icons/`(PWAアイコン)/`docs/`(文書)/`tools/`/`.github/`(CI・PRテンプレート)
- 曲追加の手順: `ADD_SONG_CHECKLIST.md`(ひな形は `song-template.snippet.js`)。ただし歌詞は MWM に一本化済みなので、いまは配信リンクとメタ情報だけを扱う
- ルート直下の `SOW_*.md`・`CORRECT_STATE.md`・`docs/PROMOTION_FLOW.md`・`.github/workflows/promote*.yml` は、開発リポジトリ(appriver-claude-dev)から本番へ昇格していた旧体制の名残。現在は本リポジトリ単独で開発する

## NPM スクリプト

```bash
npm install          # 依存関係
npm run verify       # format:check + lint(CI相当・コミット前に通す)
npm run format       # Prettier 自動修正
npm run lint:fix     # ESLint 自動修正
```

- `*.js` は ESLint + Prettier(`eslint.config.js`・`.prettierrc`)。`songs-data.js` は `.prettierignore` で除外
- HTML/CSS は手動管理(Prettierにかけない)

## CI

- `verify.yml`(Prettier + ESLint + ツールタグ検査)・`secrets-scan.yml`(TruffleHog)・`ci.yml`/`ci-pr.yml`。PR とマージ前に全通過が必須
- Pre-commit フックが失敗したら `npm run verify` で原因を直し、再ステージしてコミットし直す。ツールタグ不備は `git commit --amend` で直す

## 検証方法

- `npm run verify` を通す
- 画面の変更は `index.html` をブラウザで開くか、ローカルサーバーで確認する(MWM側のブラウザペイン設定では `appriver-static`=ポート3200、`buka-static`=3201)。スマホ幅での確認を必ず入れる(利用者の大半がスマホ・TikTok経由)
- mwm.ne.jp への導線を変えたときは、TikTokアプリ内ブラウザ(プロフィール欄リンクからの正式ブラウザ)で実機確認する。ブラウザペインでは再現できない
- 本番反映は main へのマージで Vercel が自動デプロイ。反映後に https://appriver.jp を実機で開いて確認する
