# SOW: カラオケクーポンボタンの追加

## 概要
モバイル版ヒーローページのスクロールガイド下部に、カラオケクーポン取得用のリンクボタンを追加する。

## 実装仕様

### 1. ボタン配置位置
- **配置場所**: ヒーローセクション内、スクロールガイドの直下
- **HTML構造**: `<div id="scrollGuide" class="scroll-guide">` の直後に追加

### 2. HTML構造
```html
<!-- カラオケクーポンボタン -->
<a href="https://social.kicks.video/v1/re/kr/82108/joysound_coupon?utm_source=vk&utm_medium=sw&utm_campaign=share&utm_term=82108" 
   target="_blank" 
   class="hero-karaoke-coupon-button"
   aria-label="カラオケクーポンを取得">
    カラオケクーポン↩️<br>
    今すぐ取得
</a>
```

### 3. CSS設計

#### 基本スタイル（デスクトップ共通）
```css
.hero-karaoke-coupon-button {
    /* hero-release-buttonと同様の基本スタイルを継承 */
    font-size: 1.2rem;
    margin-top: 2rem;
    text-align: center;
    line-height: 1.4;
    text-decoration: none;
    color: inherit;
    display: inline-block;
    
    /* カラオケクーポン専用のスタイル */
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.9), rgba(255, 235, 59, 0.8));
    border: 2px solid rgba(255, 193, 7, 0.6);
    border-radius: 15px;
    padding: 15px 25px;
    font-weight: 600;
    color: #2c1810;
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
    transition: all 0.3s ease;
    position: absolute;
    top: 85%; /* スクロールガイド（75%）の下に配置 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
}

.hero-karaoke-coupon-button:hover,
.hero-karaoke-coupon-button:focus {
    transform: translate(-50%, -2px);
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
    background: linear-gradient(135deg, rgba(255, 193, 7, 1), rgba(255, 235, 59, 0.9));
    border-color: rgba(255, 193, 7, 0.8);
    text-decoration: none;
    color: #2c1810;
}

.hero-karaoke-coupon-button:active {
    transform: translate(-50%, 0);
    box-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);
}
```

#### モバイル対応（480px以下）
```css
@media (max-width: 480px) {
    .hero-karaoke-coupon-button {
        font-size: 1rem;
        margin-top: 1.5rem;
        padding: 12px 20px;
        border-radius: 12px;
        touch-action: manipulation; /* モバイルでのタップ最適化 */
        top: 87%; /* モバイルでは少し下に調整 */
    }
}
```

### 4. 表示制御

#### デスクトップでの非表示設定
```css
@media (min-width: 769px) {
    .hero-karaoke-coupon-button {
        display: none !important;
    }
}
```

### 5. アクセシビリティ対応
- `aria-label`属性でボタンの目的を明確化
- `target="_blank"`でリンクが新しいタブで開くことを明示
- フォーカス可能な要素として適切なスタイルを適用

### 6. 本番環境への影響最小化対策

#### ファイルバックアップ
```bash
# 実装前にバックアップを作成
cp index.html index.html.backup-karaoke-coupon-$(date +%Y%m%d-%H%M%S)
cp style.css style.css.backup-karaoke-coupon-$(date +%Y%m%d-%H%M%S)
```

#### 段階的実装
1. **Phase 1**: CSS追加（ボタン非表示状態）
2. **Phase 2**: HTML追加（ボタン表示開始）
3. **Phase 3**: 動作確認・微調整

#### ロールバック手順
```bash
# 問題発生時の即座ロールバック
git checkout HEAD~1 -- index.html style.css
```

### 7. テスト項目
- [ ] モバイル実機でのボタン表示確認
- [ ] タップ操作の動作確認
- [ ] リンク先URLの正常動作確認
- [ ] デスクトップでの非表示確認
- [ ] 既存のアルバムボタンとの干渉確認
- [ ] スクロールガイドとの位置関係確認

### 8. 実装予想時間
- HTMLコード追加: 5分
- CSS実装: 15分  
- テスト・調整: 10分
- **総所要時間: 30分**

## 備考
- カラオケクーポンボタンはモバイル版のみ表示
- 黄色系のグラデーションでアルバムボタン（オレンジ系）と差別化
- 既存のスクロールガイドやアルバムボタンのスタイルを参考に統一感を保持
- UTMパラメータ付きの完全なトラッキングURL使用