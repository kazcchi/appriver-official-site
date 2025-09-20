# appriver Spotify Player Integration

## 概要

appriver.jpサイト用のSpotify埋め込みプレイヤー実装テスト環境

## 実装手順

### Phase 1: プレイリスト作成

1. **Spotifyにログイン**
   - appriverのSpotifyアカウントでログイン
   - https://open.spotify.com/ にアクセス

2. **プレイリスト作成**
   - 「プレイリストを作成」をクリック
   - 名前: `appriver - NUKUMORI`
   - 説明: `appriver公式プレイリスト - SUNO AIで作成した楽曲集`

3. **楽曲を追加**
   - 以下の楽曲を検索してプレイリストに追加
   - appriver で検索して楽曲を見つける
   - 全17曲を追加

4. **プレイリストを公開**
   - プレイリスト設定 → 「プレイリストを公開する」をオン
   - 共有可能な状態にする

### Phase 2: 埋め込みコード取得

1. **プレイリストページで**
   - プレイリストの「...」メニューをクリック
   - 「Share」→「Embed playlist」を選択

2. **埋め込みコードをコピー**
   ```html
   <iframe
     style="border-radius:12px;width:100%;height:380px"
     src="https://open.spotify.com/embed/playlist/[PLAYLIST_ID]"
     frameborder="0"
     allow="encrypted-media; clipboard-write"
   >
   </iframe>
   ```

### Phase 3: 実装

1. **index.htmlの更新**
   - 埋め込みコードを `<!-- 実際の埋め込みコード（後で追加） -->` 部分に追加
   - プレースホルダーを削除

2. **個別楽曲埋め込み**
   - 各楽曲のSpotify URLから埋め込みコードを取得
   - 個別楽曲テストエリアに追加

## ファイル構成

```
spotify-integration/
├── index.html              # メインページ
├── css/
│   └── spotify-player.css  # プレイヤー専用スタイル
├── js/
│   └── spotify-handler.js  # プレイヤー制御JS
└── README.md              # 実装手順（このファイル）
```

## 重要な設定

- `allow="encrypted-media"` - フル再生に必須
- `allow="clipboard-write"` - 共有機能に必須
- `frameborder="0"` - デザイン統一

## 再生の制限

- **Premium会員**: フル楽曲再生可能
- **無料会員**: 30秒プレビューのみ
- **未ログイン**: 30秒プレビューのみ

## テスト方法

1. **ローカルサーバー起動**

   ```bash
   cd /Users/integrity/appriver-claude-dev/spotify-integration
   python -m http.server 8000
   ```

2. **ブラウザでアクセス**
   - http://localhost:8000

3. **テストケース**
   - Spotifyログイン状態でアクセス
   - 未ログイン状態でアクセス
   - モバイルブラウザでアクセス

## 次のステップ

1. プレイリスト作成完了後、埋め込みコードを追加
2. 個別楽曲埋め込み実装
3. 本番サイトへの統合検討
4. Apple Music埋め込み追加検討

## 注意事項

- 本番環境（既存のindex.html）は変更しない
- このテスト環境で動作確認後、統合を検討
- Spotifyの利用規約に準拠した実装

## 問題発生時の対処

1. **プレイヤーが表示されない**
   - プレイリストが公開設定になっているか確認
   - 埋め込みコードが正しいか確認

2. **フル再生できない**
   - Spotifyにログインしているか確認
   - Premium会員かどうか確認

3. **モバイルで表示が崩れる**
   - CSSのレスポンシブ対応を確認
   - ブラウザの開発者ツールでデバッグ
