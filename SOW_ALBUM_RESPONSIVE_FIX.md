# SOW: アルバムパートのレスポンシブ表示修正

## 概要

AppRiver公式サイトのアルバムセクション（#album）において、PC画面でブラウザサイズに応じたレスポンシブ表示が適切に機能していない問題を修正する。

## 問題分析

### 現在のCSS構造の問題点

#### 1. メディアクエリ不備

**現在の設定:**

```css
@media (min-width: 768px) {
  .albums-container {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }

  .album-info {
    flex: 1;
    max-width: 400px;
  }
}
```

**問題:**

- 768px以上で一律横並び表示
- 中間サイズ（768px-1200px）でのレイアウト考慮不足
- 大画面（1400px以上）での最適化なし

#### 2. レイアウト制約

**現在の.album-info:**

```css
.album-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 800px;
}
```

**問題:**

- 固定的なgrid-template-columns（1fr 2fr）
- ブラウザ幅に応じたフレキシブル対応不足
- アルバムアートワークの表示サイズが画面サイズと連動しない

#### 3. コンテナ制約

```css
.albums-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
```

**問題:**

- PC画面でのアルバム間の配置最適化不足
- 画面幅に応じたgap調整なし

## 修正方針

### 1. 段階的メディアクエリの導入

- **タブレット（768px-1024px）**: 縦積み維持、要素サイズ調整
- **小型PC（1024px-1400px）**: 横並び、コンパクト表示
- **大型PC（1400px以上）**: 横並び、ゆとりある表示

### 2. フレキシブルグリッドシステム

- CSS Gridのfr単位とminmax()活用
- アルバムアートワークの動的サイズ調整
- テキスト領域の適応的レイアウト

### 3. コンテナ最適化

- 画面サイズ別のgap調整
- justify-content動的変更

## 実装内容

### Phase 1: CSS構造の再構築

#### 1-1: 基本レスポンシブ設定更新

```css
/* モバイル（デフォルト） */
.albums-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.album-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}
```

#### 1-2: タブレット対応（768px-1024px）

```css
@media (min-width: 768px) and (max-width: 1023px) {
  .albums-container {
    gap: 2.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .album-info {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    max-width: 550px;
    text-align: left;
  }

  .album-artwork-image {
    width: 180px;
    height: 180px;
  }
}
```

#### 1-3: 小型PC対応（1024px-1399px）

```css
@media (min-width: 1024px) and (max-width: 1399px) {
  .albums-container {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .album-info {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2.5rem;
    max-width: 480px;
    flex: 0 1 480px;
  }

  .album-artwork-image {
    width: 200px;
    height: 200px;
  }
}
```

#### 1-4: 大型PC対応（1400px以上）

```css
@media (min-width: 1400px) {
  .albums-container {
    flex-direction: row;
    justify-content: center;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .album-info {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 3rem;
    max-width: 550px;
    flex: 0 1 550px;
  }

  .album-artwork-image {
    width: 240px;
    height: 240px;
  }
}
```

### Phase 2: アルバムアートワーク最適化

#### 2-1: 動的サイズ調整

```css
.album-artwork-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(212, 145, 117, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    width 0.3s ease,
    height 0.3s ease;
  display: block;
}

.placeholder-artwork {
  width: 300px;
  height: 300px;
  border-radius: 20px;
  transition:
    width 0.3s ease,
    height 0.3s ease;
}
```

#### 2-2: テキスト要素調整

```css
.album-details h3 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
}

.track-count {
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.release-date {
  font-size: clamp(1.1rem, 2.2vw, 1.3rem);
}
```

## 作業手順

### Step 1: 現在のCSS分析とバックアップ

1. style.cssの該当部分を詳細分析
2. 変更前のバックアップ作成（style.css.album-responsive-backup-YYYYMMDD）

### Step 2: 段階的実装

1. **作業用ブランチ作成**: `feature/album-responsive-fix`
2. **メディアクエリ段階的追加**: モバイル → タブレット → PC
3. **各段階でのテスト**: 768px, 1024px, 1400px境界値確認

### Step 3: 検証とテスト

1. **ローカル環境**: 各画面サイズでの動作確認
2. **デベロッパーツール**: レスポンシブモードでの連続確認
3. **実機テスト**: PC/タブレット/スマホでの最終確認

### Step 4: デプロイ

1. **テスト環境**: feature/album-responsive-fix ブランチでプレビュー確認
2. **本番反映**: 承認後にmainブランチへマージ

## リスク分析と対策

### リスク

1. **既存レイアウト崩れ**: 他セクションへの意図しない影響
2. **パフォーマンス低下**: 過度なCSS transitionによる動作重化
3. **互換性問題**: 古いブラウザでのCSS Grid対応

### 対策

1. **スコープ限定**: .album-section内のセレクタのみ変更
2. **軽量実装**: 必要最小限のtransition設定
3. **フォールバック**: CSS Gridが非対応の場合のflexbox代替

## 完了条件

### 動作確認項目

1. **768px未満**: 縦積み、中央揃え表示
2. **768-1023px**: 横並び、2カラム表示、適切なサイズ
3. **1024-1399px**: 横並び、2アルバム表示、バランス良いレイアウト
4. **1400px以上**: 横並び、余裕あるレイアウト、大きなアートワーク

### 品質基準

1. **レスポンシブ**: 全画面サイズで適切な表示
2. **パフォーマンス**: リサイズ時のスムーズな動作
3. **視認性**: アルバム情報の読みやすさ維持
4. **一貫性**: サイト全体のデザインとの調和

## 見積もり

- **分析・設計**: 30分
- **実装**: 90分
- **テスト**: 45分
- **デプロイ**: 15分
- **総作業時間**: 3時間
