# HANDOFF.md — 進行状態(Claude Code / Codex 共通)

**終了処理のたびにこのファイルを更新する。開始処理のたびに最初に読む。** 手順・ルールは `AGENTS.md`、ここは「いまどこまで来ていて、次に何をするか」だけ。

最終更新: 2026-09-10(Claude Code)

## 待ち事項・保留アラート

- ⏳ **PR #89(デュアルツール移行)のマージ待ち**。マージ後に main を pull して `CLAUDE.md` がリンクになっていることを確認。CIは持ち越しの赤(下記1番)なので緑にはならない
- (appriver の配信・審査まわりの待ち事項は MWM 側 `../mwm_main/HANDOFF.md` に集約している。サイトに反映が要る決定があればここへ書く)

## 次にやること

1. 🔴 **CIが 2026-08-18 から赤**(`verify.yml`・`ci.yml`・`ci-pr.yml` すべて失敗)。原因は `npm run format:check` が `style.css` と `vercel.json` の整形崩れを検出しているため(#88以前からの持ち越し・機能には無関係)。AGENTS.md の「CSSは手動管理」とCIの「全ファイルをPrettierで検査」が食い違っているので、①`style.css` を `.prettierignore` に足すか ②Prettierをかけて整えるかをオーナーが決めてから直す
2. ルート直下の未追跡ファイル `mainlogo.png`(2025-06-06・800KB)の扱いを決める。`index.html` が参照しているのは `main-logo.png` で、こちらは未参照。不要なら削除、要るなら用途を決めて追加
3. 旧体制の名残(`SOW_*.md`・`CORRECT_STATE.md`・`docs/PROMOTION_FLOW.md`・`promote*.yml`・ルート直下のスクリーンショット画像)を整理するか判断する(削除はオーナー確認のうえで)
4. main のブランチ保護を設定するかどうか決める(`.github/BRANCH_PROTECTION_SETUP.md`)

## 直近の決定

- 2026-09-10: このプロジェクトをデュアルツール体制へ移行(AGENTS.md正本・CLAUDE.mdはリンク・進行状態はこのファイル)。旧 CLAUDE.md の開発手順と旧 AGENTS.md の言語ポリシーを AGENTS.md に統合(食い違いなし)
- 2026-08-18: 歌詞のサイト内表示を廃止し、MWM送客サイトへ一本化(#88)。正本は `../mwm_main/docs/gunbai/2026-08-18-*`
- 2026-08-08: TikTokアプリ内ブラウザ対策(`mwm-bridge.js`)を導入(#86)。引っ張って更新の誤爆修正(#87)

## 作業ログ(詳細)

- サイト全体の方針・裁定は MWM 側 `../mwm_main/docs/gunbai/` が正本
