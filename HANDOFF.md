# HANDOFF.md — 進行状態(Claude Code / Codex 共通)

**終了処理のたびにこのファイルを更新する。開始処理のたびに最初に読む。** 手順・ルールは `AGENTS.md`、ここは「いまどこまで来ていて、次に何をするか」だけ。

最終更新: 2026-10-03(Claude Code・Mac mini)

## 待ち事項・保留アラート

- 🔴 **ストア配信対応の改修(ブランチ `feat/store-streaming`)は KAGEROU のストア発売に合わせてマージする(2026-10-03 オーナー決定)**。マージ前に仮置きをすべて埋める:
  - `TODO_KAGEROU_DATE`(`index.html` のヒーローとアルバム欄の2か所)→ ストアの発売日(例 `2026.10.24`)
  - `TODO_APPLE_ARTIST_URL` / `TODO_SPOTIFY_ARTIST_URL` / `TODO_YOUTUBE_ARTIST_URL`(プレイヤー欄とリンク欄に各2か所)→ 確定したアーティストページの URL。新しいページで行くか旧「アップリバー」へ統合するかは MWM 側の判断待ち(`../mwm_main/docs/distrokid/appriverのストア別アーティストページ.md`)
  - 確認方法: `grep -n TODO_ index.html` が0件になること
  - Amazon Music はコメントで待機中(掲載とURLを実測したら外す)
- (appriver の配信・審査まわりの待ち事項は MWM 側 `../mwm_main/HANDOFF.md` に集約している。サイトに反映が要る決定があればここへ書く)

## 次にやること

1. 🔴 **CIが 2026-08-18 から赤**(`verify.yml`・`ci.yml`・`ci-pr.yml` すべて失敗)。原因は `npm run format:check` が `style.css` と `vercel.json` の整形崩れを検出しているため(#88以前からの持ち越し・機能には無関係)。AGENTS.md の「CSSは手動管理」とCIの「全ファイルをPrettierで検査」が食い違っているので、①`style.css` を `.prettierignore` に足すか ②Prettierをかけて整えるかをオーナーが決めてから直す
2. ルート直下の未追跡ファイル `mainlogo.png`(2025-06-06・800KB)の扱いを決める。`index.html` が参照しているのは `main-logo.png` で、こちらは未参照。不要なら削除、要るなら用途を決めて追加
3. 旧体制の名残(`SOW_*.md`・`CORRECT_STATE.md`・`docs/PROMOTION_FLOW.md`・`promote*.yml`・ルート直下のスクリーンショット画像)を整理するか判断する(削除はオーナー確認のうえで)
4. main のブランチ保護を設定するかどうか決める(`.github/BRANCH_PROTECTION_SETUP.md`)

## 直近の決定

- 2026-10-03: **ストア配信再開に合わせた改修を準備**(BUKA と同じ形)。ヒーロー=9th ALBUM「KAGEROU」→プレイヤー欄/プレイヤー欄=Apple・Spotify・YouTube・MWM/アルバム欄に KAGEROU・捨ててしまえばいい(MWMのみ)/楽曲一覧に13曲追加(143曲)/SONGS & LYRICS に行き先の一行・ボタンを「歌詞を見る・聴く」/dヒッツの一行を削除。PR #89 は同日マージ済み
- 2026-09-10: このプロジェクトをデュアルツール体制へ移行(AGENTS.md正本・CLAUDE.mdはリンク・進行状態はこのファイル)。旧 CLAUDE.md の開発手順と旧 AGENTS.md の言語ポリシーを AGENTS.md に統合(食い違いなし)
- 2026-08-18: 歌詞のサイト内表示を廃止し、MWM送客サイトへ一本化(#88)。正本は `../mwm_main/docs/gunbai/2026-08-18-*`
- 2026-08-08: TikTokアプリ内ブラウザ対策(`mwm-bridge.js`)を導入(#86)。引っ張って更新の誤爆修正(#87)

## 作業ログ(詳細)

- サイト全体の方針・裁定は MWM 側 `../mwm_main/docs/gunbai/` が正本
