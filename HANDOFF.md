# HANDOFF.md — 進行状態(Claude Code / Codex 共通)

**終了処理のたびにこのファイルを更新する。開始処理のたびに最初に読む。** 手順・ルールは `AGENTS.md`、ここは「いまどこまで来ていて、次に何をするか」だけ。

最終更新: 2026-10-23(Claude Code・Mac mini)

## 待ち事項・保留アラート

- ✅ **2026-10-23 10th アルバム「tasogare」(12曲)を本番公開(PR #96)**。Apple Music JP に 10/23 付けで載ったのを確認してから `npm run deploy`。ヒーロー=「NEW ALBUM『tasogare』2026.10.23 ストリーミング配信開始」、アルバム欄の先頭に `TASOGARE.jpg`(MWM のジャケット 1400px を 1000px の JPEG に)、曲一覧 155 曲(8 曲目は差し替え後の「何年先も　あなたへ」)。曲名・読み・URL は `mwm_main/new-releases/tasogare/`(8 曲目は `tasogare-08/`)から取り、12 曲とも MWM の曲ページが開くことを確認。songs-data.js の releaseDate は KAGEROU と同じく MWM 公開日(2026-10-16)。本番 https://appriver.jp で表示を確認済み
- ✅ **`.node-version` を 22.23.4 へ(2026-10-23)**。22.18.0 は同日 Mac mini の nodenv から削除したため、検査もデプロイも動かなくなっていた
- ✅ **ホスティングを Vercel から Cloudflare Workers `appriver-official` へ移行(2026-10-15 完了)**。10/14 にいったん戻し、10/15 に再挑戦して切り替えた。経過は `docs/dns/2026-10-14-移行前のDNS控え-お名前.md`。**本番反映は `npm run deploy`、push では本番は変わらない**。Vercel の appriver-official-site は数日様子を見てから削除(オーナーの手)。短縮 URL の行き先は 10/15 に新しいアーティストページ・MWM へ直した(AGENTS.md)
- ✅ **ストア版を本番反映済み(2026-10-07・PR #90)**=KAGEROUアルバムのApple Music掲載(10/7確認)を受けてマージ。同日、スマホ幅で「聴いてみる」が2行に折れるのを修正(#91・768px以下のcompactカードだけ・幅220px・折り返し禁止)。残り=12月末に旧ページと統合したらURLを見直す/Amazon Musicは掲載を実測したらコメントを外す。以下は準備時の記録→ ストア配信対応の改修(ブランチ `feat/store-streaming`)は KAGEROU のストア発売に合わせてマージする(2026-10-03 オーナー決定)。✅10/4に仮置きをすべて埋めた(`grep -n TODO index.html` は0件):
  - 発売日=`2026.10.04`(DistroKidでKAGEROU 12曲を10/4に申請・発売日10/4)
  - アーティストページ=すべて**DistroKid経由の新しいページ**(旧「アップリバー」には紐づけない=MWM側9/8・9/21の方針)。Apple `https://music.apple.com/jp/artist/appriver/6818672122`/Spotify `https://open.spotify.com/artist/4E3Og0VU8ez1FcsPCLNz3S`/YouTube Music `https://music.youtube.com/channel/UCa0X77bBagSdZk3beSTheeQ`(新トピック。`UC3P8aPW6tQUuqJO_xYaiYCQ`「アップリバー」は旧チャンネルなので使わない)。10/4時点では3つとも陽炎シングルだけ
  - 残り=KAGEROUアルバムがストアに載ったのを確かめてからmainへマージ(Vercel自動デプロイ)→ https://appriver.jp を実機確認。12月末に旧ページと統合したらURLを見直す
  - Amazon Music はコメントで待機中(掲載とURLを実測したら外す)
- (appriver の配信・審査まわりの待ち事項は MWM 側 `../mwm_main/HANDOFF.md` に集約している。サイトに反映が要る決定があればここへ書く)

## 次にやること

1. ✅ **CI を直した(2026-10-15)**: 本当の原因は整形崩れではなく、ワークフロー 4 本の書き方が壊れていて GitHub が読めなかったこと(push のたびに「No jobs were run」の失敗メール)。`ci.yml` の 1 本にまとめ、`vercel.json` を整形した
2. ルート直下の未追跡ファイル `mainlogo.png`(2025-06-06・800KB)の扱いを決める。`index.html` が参照しているのは `main-logo.png` で、こちらは未参照。不要なら削除、要るなら用途を決めて追加
3. 旧体制の名残(`SOW_*.md`・`CORRECT_STATE.md`・`docs/PROMOTION_FLOW.md`・`promote*.yml`・ルート直下のスクリーンショット画像)を整理するか判断する(削除はオーナー確認のうえで)
4. main のブランチ保護を設定するかどうか決める(`.github/BRANCH_PROTECTION_SETUP.md`)

## 直近の決定

- 2026-10-23: tasogare をサイトに追加・公開(オーナー「この内容で進めて」「両サイトとも公開して」)
- 2026-10-03: **ストア配信再開に合わせた改修を準備**(BUKA と同じ形)。ヒーロー=9th ALBUM「KAGEROU」→プレイヤー欄/プレイヤー欄=Apple・Spotify・YouTube・MWM/アルバム欄に KAGEROU・捨ててしまえばいい(MWMのみ)/楽曲一覧に13曲追加(143曲)/SONGS & LYRICS に行き先の一行・ボタンを「歌詞を見る・聴く」/dヒッツの一行を削除。PR #89 は同日マージ済み
- 2026-09-10: このプロジェクトをデュアルツール体制へ移行(AGENTS.md正本・CLAUDE.mdはリンク・進行状態はこのファイル)。旧 CLAUDE.md の開発手順と旧 AGENTS.md の言語ポリシーを AGENTS.md に統合(食い違いなし)
- 2026-08-18: 歌詞のサイト内表示を廃止し、MWM送客サイトへ一本化(#88)。正本は `../mwm_main/docs/gunbai/2026-08-18-*`
- 2026-08-08: TikTokアプリ内ブラウザ対策(`mwm-bridge.js`)を導入(#86)。引っ張って更新の誤爆修正(#87)

## 作業ログ(詳細)

- サイト全体の方針・裁定は MWM 側 `../mwm_main/docs/gunbai/` が正本
