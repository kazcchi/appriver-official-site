# SOW: ヒーローページ「appriver」ロゴフォント変更

## 概要
AppRiver公式サイトのヒーローページにある「appriver」ロゴのフォントを現在の手書き風フォント（Chalkboard）から「クレー（Klee）」フォントに変更する。

## 目的
- より洗練された日本語的な美しさを持つフォントでブランドイメージを向上させる
- 日本のアーティストらしい温かみのある印象を与える

## 対象要素

### 1. ヘッダーロゴ（.logo h1）
**場所**: index.html:76行目 `<h1>appriver</h1>`
**現在のCSS**: style.css:173-184行目
```css
.logo h1 {
    font-size: 2rem;
    font-weight: normal;
    font-family: 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
    background: linear-gradient(45deg, #e8a48b 0%, #d49175 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: transform 0.3s ease;
    letter-spacing: -1px;
    text-transform: lowercase;
}
```

### 2. ヒーローセクションのメインロゴ（.artist-name）
**場所**: index.html:96行目 `<h1 class="artist-name">appriver</h1>`
**現在のCSS**: style.css:302-311行目
```css
.artist-name {
    font-size: 6rem;
    font-weight: normal;
    font-family: 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
    margin-bottom: 1rem;
    color: white;
    animation: fadeInUp 3s ease-out 0.5s both;
    letter-spacing: -1px;
    text-transform: lowercase;
}
```

## 変更内容

### 1. Google Fontsの追加
**ファイル**: index.html
**変更箇所**: 57行目のフォント読み込み部分に「Klee」を追加
```html
<!-- 変更前 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=M+PLUS+2:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- 変更後 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=M+PLUS+2:wght@100;200;300;400;500;600;700;800;900&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">
```

### 2. CSSフォントファミリーの変更
**ファイル**: style.css

#### 2-1. ヘッダーロゴ（173行目周辺）
```css
/* 変更前 */
.logo h1 {
    font-family: 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
}

/* 変更後 */
.logo h1 {
    font-family: 'Klee One', 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
}
```

#### 2-2. ヒーローセクションメインロゴ（302行目周辺）
```css
/* 変更前 */
.artist-name {
    font-family: 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
}

/* 変更後 */
.artist-name {
    font-family: 'Klee One', 'Chalkboard', 'Chalkboard SE', 'Bradley Hand', 'Marker Felt', cursive;
}
```

### 3. レスポンシブ対応箇所の確認
以下の箇所も同様にフォントファミリーを更新する必要があるか確認：
- style.css:1838行目周辺（タブレット用）
- style.css:2002行目周辺（モバイル用）
- style.css:2112行目周辺（小画面用ヘッダー）

## 作業手順

### Phase 1: ローカル環境での検証
1. 作業用ブランチの作成
2. Google Fonts読み込みの変更
3. CSSフォントファミリーの変更
4. ローカルでの表示確認
5. レスポンシブデザインの確認

### Phase 2: デプロイ前確認
1. 全デバイスでの表示確認
2. フォント読み込み速度の確認
3. フォールバックフォントの動作確認

### Phase 3: 本番反映
1. GitHubへのプッシュ
2. Vercelの自動デプロイ確認
3. 本番環境での最終確認

## リスクと対策

### リスク
- フォント読み込み失敗時のフォールバック確認必要
- 既存のレイアウトへの影響確認必要
- 読み込み速度への影響確認必要

### 対策
- フォールバックフォントチェーンの維持
- レスポンシブデザインの全画面サイズでの確認
- Google Fontsの適切な読み込み設定

## 影響範囲
- **直接影響**: ヘッダーロゴ、ヒーローセクションのメインロゴのみ
- **間接影響**: なし（他の要素には影響しない）
- **SEO影響**: なし
- **パフォーマンス影響**: 最小限（Google Fontsの追加読み込みのみ）

## 完了条件
1. ヘッダーロゴが「Klee One」フォントで表示される
2. ヒーローセクションのメインロゴが「Klee One」フォントで表示される
3. 全デバイスで正常に表示される
4. フォント読み込み失敗時にフォールバックフォントで表示される
5. 本番環境で正常に動作する

## 見積もり
- **作業時間**: 30分
- **テスト時間**: 15分
- **総所要時間**: 45分