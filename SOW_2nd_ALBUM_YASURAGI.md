# SOW: 2ndアルバム「YASURAGI」追加機能

## 概要

appriver公式サイトに2ndアルバム「YASURAGI」を追加する。既存の1stアルバム「NUKUMORI」の前に配置し、最新アルバムとして表示する。

## 要件

### 機能要件

1. **アルバムセクションの拡張**
   - 現在の単一アルバム表示を複数アルバム表示に変更
   - 2つのアルバムカードを横並びまたは縦並びで表示

2. **2ndアルバム「YASURAGI」の情報**
   - タイトル: YASURAGI
   - 収録曲数: 15曲
   - リリース日: 2025.8.22
   - 配信状況: 全ストアにて配信スタート
   - 表示順序: NUKUMORIの前（最新アルバムとして）

3. **既存アルバム「NUKUMORI」の情報維持**
   - 既存の情報とリンクを保持
   - 表示順序: YASURAGIの後（2番目のアルバムとして）

### 技術要件

1. **レスポンシブデザイン対応**
   - デスクトップ: 横並び表示
   - モバイル: 縦並び表示

2. **既存デザインとの統一性**
   - 現在のアルバムカードデザインを踏襲
   - カラースキームとフォントの統一
   - アニメーション効果の継承

3. **アクセシビリティ**
   - 適切なalt属性とaria-labelの設定
   - キーボードナビゲーション対応

## 実装仕様

### HTML構造

```html
<section id="album" class="album-section">
  <div class="container">
    <h2>ALBUM</h2>
    <div class="albums-container">
      <!-- 2nd Album: YASURAGI -->
      <div class="album-info">
        <div class="album-artwork">
          <div class="album-artwork-container">
            <img
              src="yasuragi-album.jpg"
              alt="YASURAGI アルバムアート"
              class="album-artwork-image"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
            />
            <div class="placeholder-artwork">YASURAGI</div>
          </div>
        </div>
        <div class="album-details">
          <h3>YASURAGI</h3>
          <p class="track-count">15曲</p>
          <p class="release-date">2025.8.22　　全ストアにて配信スタート</p>
          <a href="#" class="stream-link" target="_blank">聴いてみる</a>
        </div>
      </div>

      <!-- 1st Album: NUKUMORI -->
      <div class="album-info">
        <!-- 既存のNUKUMORIアルバム情報 -->
      </div>
    </div>
  </div>
</section>
```

### CSS追加/修正

```css
.albums-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

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

### アセット要件

1. **YASURAGIアルバムアート**
   - ファイル名: yasuragi-album.jpg
   - 推奨サイズ: 600x600px以上
   - フォーマット: JPEG
   - プレースホルダー対応: 画像読み込み失敗時の代替表示

2. **配信リンク**
   - 各ストリーミングプラットフォームへのリンク
   - linkco.reまたは直接リンクでの実装

## 開発フロー

1. ✅ SOW作成と仕様確定
2. ⏳ 新規ブランチ作成（feature/add-2nd-album-yasuragi）
3. ⏳ HTML構造の修正
4. ⏳ CSS スタイリングの実装
5. ⏳ アルバムアート画像の準備（プレースホルダーで仮実装）
6. ⏳ レスポンシブ対応の確認
7. ⏳ テスト環境での確認
8. ⏳ 本番環境へのマージ

## テスト項目

- [ ] デスクトップでの2アルバム横並び表示
- [ ] モバイルでの2アルバム縦並び表示
- [ ] 各アルバムの情報表示
- [ ] リンクの動作確認
- [ ] アルバムアート画像のエラーハンドリング
- [ ] レスポンシブデザインの動作
- [ ] 既存機能への影響確認

## リスク要因

1. **デザイン調整**
   - 2つのアルバムカードが画面に収まらない場合の対応
   - 既存デザインとの調和

2. **アルバムアート**
   - YASURAGIアルバムアート画像の準備
   - 画像サイズとファイルサイズの最適化

3. **配信リンク**
   - YASURAGI配信開始前のリンク設定（リリース日: 2025.8.22）

## 成功基準

- YASURAGIアルバムが最新アルバムとして適切に表示される
- 既存のNUKUMORIアルバム情報が保持される
- レスポンシブデザインが正常に動作する
- 本番環境に影響を与えずに実装完了する
