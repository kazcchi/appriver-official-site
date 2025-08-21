# SOW: トップページYASURAGIアルバム情報のボタン化

## 概要
appriver公式サイトのトップページ（ホームセクション）にあるYASURAGIアルバム情報をボタン化し、押下時にアルバム配信リンクに遷移する機能を追加する。本番環境に影響を与えずに段階的に実装する。

## 現状分析

### 現在の実装状況
**対象要素**: `index.html` の hero-release-info
```html
<!-- YASURAGI Release Info -->
<div class="hero-release-info new-release">
    2025.8.22<br>
    2ndアルバム「YASURAGI」<br>
    全ストアにて配信開始
</div>
```

**現在の表示**:
- スタイル: 静的テキスト表示
- 機能: 表示のみ（クリック不可）
- 位置: トップページのアーティスト名下部

## 要件

### 機能要件
1. **ボタン化**
   - 現在のテキスト表示をクリック可能なボタンに変更
   - テキスト内容は現状維持: 「2025.8.22\n2ndアルバム「YASURAGI」\n全ストアにて配信開始」

2. **リンク機能**
   - 押下時にYASURAGIアルバム配信ページに遷移
   - リンク先: `https://linkco.re/1gXERgmA`
   - 新しいタブで開く（`target="_blank"`）

3. **ユーザビリティ**
   - ボタンであることが視覚的に分かるデザイン
   - ホバー・タップ時の視覚フィードバック
   - モバイル・デスクトップ両対応

### 技術要件
1. **本番環境影響なし**
   - 新ブランチでの開発
   - ステージング環境での動作確認
   - 段階的マージによるリスク最小化

2. **レスポンシブデザイン対応**
   - スマホでの操作性を重視
   - デスクトップでの表示も最適化

3. **アクセシビリティ**
   - 適切なaria-label設定
   - キーボードナビゲーション対応

## 実装仕様

### HTML変更
```html
<!-- 現在の実装 -->
<div class="hero-release-info new-release">
    2025.8.22<br>
    2ndアルバム「YASURAGI」<br>
    全ストアにて配信開始
</div>

<!-- 変更後の実装 -->
<a href="https://linkco.re/1gXERgmA" 
   target="_blank" 
   class="hero-release-button new-release"
   aria-label="YASURAGIアルバムを聴く">
    2025.8.22<br>
    2ndアルバム「YASURAGI」<br>
    全ストアにて配信開始
</a>
```

### CSS追加/修正
```css
/* 既存の hero-release-info スタイルをベースに */
.hero-release-button {
    /* 既存のhero-release-infoスタイルを継承 */
    display: inline-block;
    background: linear-gradient(135deg, rgba(232, 164, 139, 0.9), rgba(255, 183, 149, 0.8));
    color: #2c1810;
    padding: 15px 25px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    line-height: 1.4;
    box-shadow: 0 4px 15px rgba(232, 164, 139, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
    
    /* ボタン特有のスタイル */
    border: 2px solid rgba(232, 164, 139, 0.5);
    backdrop-filter: blur(10px);
}

.hero-release-button:hover,
.hero-release-button:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 164, 139, 0.4);
    background: linear-gradient(135deg, rgba(232, 164, 139, 1), rgba(255, 183, 149, 0.9));
    border-color: rgba(232, 164, 139, 0.8);
}

.hero-release-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(232, 164, 139, 0.3);
}

/* モバイル対応 */
@media (max-width: 768px) {
    .hero-release-button {
        padding: 12px 20px;
        font-size: 14px;
        touch-action: manipulation; /* モバイルでのタップ最適化 */
    }
}
```

## 実装手順

### Phase 1: 開発準備
1. **開発ブランチ作成**
   ```bash
   git checkout -b feature/add-yasuragi-button-link
   ```

2. **現状バックアップ**
   - index.html の該当セクションバックアップ
   - style.css のhero-release-info関連スタイルバックアップ

### Phase 2: 実装
1. **HTML修正**
   - `div.hero-release-info` を `a.hero-release-button` に変更
   - リンク属性追加（href, target, aria-label）

2. **CSS実装**
   - `.hero-release-button` スタイル追加
   - ホバー・フォーカス・アクティブ状態のスタイル
   - レスポンシブ対応

### Phase 3: テスト・デプロイ
1. **ローカル環境テスト**
   - ボタン表示確認
   - リンク動作確認
   - レスポンシブデザイン確認

2. **ステージング環境デプロイ**
   - Vercelプレビューでの確認
   - クロスブラウザテスト

3. **本番環境マージ**
   - 段階的マージ
   - 本番動作確認

## リスク要因と対策

### 1. デザイン整合性リスク
**リスク**: 既存デザインとの調和が取れない
**対策**:
- 既存のnew-releaseクラスのスタイルを基調とする
- カラーパレットを統一

### 2. ユーザビリティリスク
**リスク**: ボタンであることが分からない
**対策**:
- 明確な視覚的フィードバック
- ホバー・タップエフェクトの実装

### 3. モバイル対応リスク
**リスク**: スマホでの操作性が悪い
**対策**:
- 十分なタップ領域の確保
- touch-action最適化

## 成功基準

### 必須要件
- [ ] YASURAGIアルバム情報がボタン化される
- [ ] ボタン押下でhttps://linkco.re/1gXERgmAに遷移する
- [ ] 新しいタブで配信ページが開く
- [ ] スマホ・デスクトップで適切に動作する
- [ ] 既存デザインとの整合性が保たれる

### 追加要件
- [ ] ホバー・タップ時の視覚フィードバックが適切
- [ ] アクセシビリティ対応完了
- [ ] クロスブラウザ対応確認

## 開発スケジュール

| フェーズ | 作業内容 | 想定時間 | 完了条件 |
|---------|---------|---------|---------|
| Phase 1 | 開発準備 | 30分 | ブランチ作成・バックアップ完了 |
| Phase 2 | 実装 | 1時間 | HTML・CSS実装完了 |
| Phase 3 | テスト・デプロイ | 1時間 | 本番環境デプロイ完了 |

**総想定時間**: 2.5時間

## 完了後の確認事項

1. **機能動作確認**
   - ボタンクリックでリンク遷移確認
   - 新しいタブで開くことを確認

2. **デザイン確認**
   - 既存デザインとの整合性確認
   - ホバー・アクティブ状態の確認

3. **レスポンシブ確認**
   - スマホでのタップ操作確認
   - デスクトップでのマウスオーバー確認

4. **クロスブラウザ確認**
   - Chrome, Safari, Firefox での動作確認
   - モバイルブラウザでの動作確認

---

**重要**: 
- 実装中は必ず新ブランチで作業し、mainブランチへの直接変更は行わない
- 本番環境への影響を最小限に抑えるため、段階的なテスト・デプロイを徹底する
- ボタン化によりユーザビリティが向上し、YASURAGIアルバムへの導線が強化される