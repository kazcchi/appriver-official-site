# SOW: Music Playersセクション - Amazon Music → Others変更

## 概要
appriver公式サイトのMUSIC PLAYERSセクションにおいて、Amazon Musicボタンを「Others」に変更し、プラットフォーム選択肢を「Apple Music」「Spotify」「YouTube」「Others」の4つに再構成する。本番環境に影響を与えずに実装する。

## 現状分析

### 現在のプラットフォーム構成
```html
<button class="platform-btn active" data-platform="apple-music">Apple Music</button>
<button class="platform-btn" data-platform="spotify">Spotify</button>
<button class="platform-btn" data-platform="amazon-music">Amazon Music</button>
<button class="platform-btn" data-platform="youtube">YouTube</button>
```

### 現在のプレーヤー表示
- apple-music-player: Apple Musicプレイリストへのリンク
- spotify-player: Spotifyプレイリストへのリンク  
- amazon-music-player: Amazon Musicプレイリストへのリンク
- youtube-player: YouTubeチャンネルへのリンク

## 要件

### 機能要件
1. **プラットフォームボタン変更**
   - Amazon Music → Others
   - data-platform="amazon-music" → data-platform="others"
   - アイコン変更: fab fa-amazon → fas fa-external-link-alt
   - 表示テキスト: "Amazon Music" → "Others"

2. **プレーヤー表示内容変更**
   - amazon-music-player → others-player
   - Others選択時の表示内容を複数プラットフォームリンク集に変更
   - Amazon Music、Line Music、YouTube Music等のリンクを含める

3. **既存機能保持**
   - Apple Music、Spotify、YouTubeの機能は完全保持
   - プラットフォーム切り替え機能の正常動作
   - デフォルト選択状態（Apple Music active）の維持

### 技術要件
1. **本番環境影響なし**
   - 新ブランチでの開発: `feature/music-players-amazon-to-others`
   - 段階的テスト・デプロイ
   - ロールバック可能な実装

2. **既存コード影響最小化**
   - music-players.js の最小限修正
   - CSS クラス名の一貫性維持
   - 既存のスタイリング踏襲

## 実装内容

### HTML修正

#### プラットフォームボタン変更
```html
<!-- 変更前 -->
<button class="platform-btn" data-platform="amazon-music">
    <i class="fab fa-amazon"></i>
    Amazon Music
</button>

<!-- 変更後 -->
<button class="platform-btn" data-platform="others">
    <i class="fas fa-external-link-alt"></i>
    Others
</button>
```

#### プレーヤー表示内容変更
```html
<!-- 変更前: amazon-music-player -->
<div class="player-embed" id="amazon-music-player" style="display: none;">
    <div class="amazon-music-direct-container">
        <div class="amazon-music-header">
            <div class="amazon-music-logo">
                <i class="fab fa-amazon"></i>
                <span>Amazon Music</span>
            </div>
        </div>
        <div class="amazon-music-playlist-link">
            <a href="[Amazon Music URL]" target="_blank" class="amazon-music-full-playlist-btn">
                <i class="fas fa-external-link-alt"></i>
                <span>プレイリストを開く</span>
            </a>
        </div>
    </div>
</div>

<!-- 変更後: others-player -->
<div class="player-embed" id="others-player" style="display: none;">
    <div class="others-direct-container">
        <div class="others-header">
            <div class="others-logo">
                <i class="fas fa-external-link-alt"></i>
                <span>Other Platforms</span>
            </div>
        </div>
        <div class="others-platforms">
            <a href="[Amazon Music URL]" target="_blank" class="others-platform-btn">
                <i class="fab fa-amazon"></i>
                <span>Amazon Music</span>
            </a>
            <a href="[Line Music URL]" target="_blank" class="others-platform-btn">
                <i class="fas fa-music"></i>
                <span>Line Music</span>
            </a>
            <a href="[YouTube Music URL]" target="_blank" class="others-platform-btn">
                <i class="fab fa-youtube"></i>
                <span>YouTube Music</span>
            </a>
        </div>
    </div>
</div>
```

### CSS追加
```css
/* Others Platform Styling */
.others-direct-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.others-header {
    margin-bottom: 1.5rem;
}

.others-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
}

.others-platforms {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.others-platform-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.others-platform-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

@media (min-width: 768px) {
    .others-platforms {
        flex-direction: row;
        gap: 1.5rem;
    }
    
    .others-platform-btn {
        flex: 1;
    }
}
```

### JavaScript修正 (music-players.js)
```javascript
// data-platform="amazon-music" → data-platform="others"
// getElementById("amazon-music-player") → getElementById("others-player")
```

## 実装手順

### Step 1: 開発準備
1. **新ブランチ作成**
   ```bash
   git checkout -b feature/music-players-amazon-to-others
   ```

2. **現状バックアップ**
   - index.html.backup-amazon-to-others-YYYYMMDD
   - style.css.backup-amazon-to-others-YYYYMMDD  
   - music-players.js.backup-amazon-to-others-YYYYMMDD

### Step 2: ファイル修正
1. **index.html修正**
   - プラットフォームボタンの変更
   - プレーヤー表示部分の変更

2. **style.css修正**
   - others-related CSSクラス追加
   - amazon-music関連スタイルの置換

3. **music-players.js修正**
   - プラットフォーム切り替えロジック更新
   - イベントリスナー更新

### Step 3: テスト
1. **ローカル環境確認**
   - 4つのプラットフォームボタン表示確認
   - Others選択時の複数リンク表示確認
   - 既存3プラットフォーム（Apple/Spotify/YouTube）の動作確認

2. **機能動作確認**
   - プラットフォーム切り替え動作
   - 各リンクの正常動作
   - レスポンシブデザイン確認

### Step 4: デプロイ
1. **Vercelプレビュー環境確認**
2. **承認後mainブランチマージ**

## 必要なリンクURL

### Others プラットフォーム用リンク
1. **Amazon Music**: 既存のAmazon MusicプレイリストURL
2. **Line Music**: appriverのLine Musicアーティストページ/プレイリスト
3. **YouTube Music**: appriverのYouTube Musicアーティストページ

## リスク分析

### リスク要因
1. **機能破綻リスク**: プラットフォーム切り替えJavaScript修正時のバグ
2. **リンク不備リスク**: Others内の各プラットフォームリンクの不正確性
3. **デザイン崩れリスク**: 新しいOthersプレーヤーのスタイリング不備

### 対策
1. **段階的テスト**: 各修正ファイルごとの動作確認
2. **リンク事前確認**: 実装前の全リンクURL検証
3. **既存コードベース踏襲**: 現在のスタイリングパターンの継承

## 成功基準

### 必須要件
- [ ] プラットフォームボタンが「Apple Music」「Spotify」「YouTube」「Others」の4つ表示される
- [ ] Others選択時に複数プラットフォームリンクが表示される
- [ ] 既存3プラットフォームの機能が完全保持される
- [ ] プラットフォーム切り替えが正常動作する
- [ ] 各プラットフォームリンクが正常動作する

### 品質要件
- [ ] レスポンシブデザインが正常動作する
- [ ] 既存デザインとの統一性が保たれる
- [ ] アクセシビリティが維持される
- [ ] ページ読み込み速度に影響がない

## 見積もり時間
- **分析・設計**: 30分
- **実装**: 120分
- **テスト**: 60分  
- **デプロイ**: 30分
- **総作業時間**: 3.5時間