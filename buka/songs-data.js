// BUKA 楽曲データ管理
// R&B Female Vocalist
// SOW仕様: 検索・ソート機能対応のデータ構造

const songsData = {
  // VELVET NIGHT album
  midnight_confession: {
    title: 'Midnight Confession',
    reading: 'みっどないとこんふぇっしょん',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 10,
    lyrics: `深夜のビートが鳴り響く
街のネオンに照らされて
隠していた想いが 溢れ出す
もう止められない この感情

Midnight confession
月明かりの下で
素直になれたなら

あなたの腕の中で
すべてを忘れたい
嘘のない言葉だけ
この夜に溶かして

Midnight confession
二度と戻れなくても
この想いは本物

朝が来る前に 伝えたい
ずっと隠してた この気持ち
あなただけに 聴いてほしい
私のMidnight confession`,
  },
  velvet_touch: {
    title: 'Velvet Touch',
    reading: 'ゔぇるゔぇっとたっち',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 9,
    lyrics: `シルクのような夜の風が
肌をそっと撫でていく
あなたの指先が描く
見えない地図をたどる

Velvet touch 柔らかな温もり
言葉じゃ伝えきれない
Velvet touch 心の奥まで
届いてしまうの

街灯の光がゆらめいて
二人の影が重なる
時間を止めてしまいたい
この瞬間だけは

Velvet touch 離さないで
朝が来るまでのあいだ
Velvet touch あなたがいれば
それだけでいい`,
  },
  amaoto_no_melody: {
    title: '雨音のメロディ',
    reading: 'あまおとのめろでぃ',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 8,
    lyrics: `窓を打つ雨の音が
あなたを思い出させる
一緒に聴いたあの曲が
今も胸の中で流れてる

雨音のメロディ
やさしく包み込む
寂しさも孤独も
全部受け止めてくれた

傘もささずに歩いた
あの日の帰り道
濡れた髪をかきあげて
笑った あなたの顔

雨音のメロディ
忘れられない音色
いつかまた二人で
この雨を聴きたい

窓ガラスに指で描いた
ハートマークが消えても
あの日の温もりだけは
ちゃんと覚えてるよ

雨音のメロディ
今夜も鳴り止まない`,
  },
  golden_hour: {
    title: 'Golden Hour',
    reading: 'ごーるでんあわー',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 7,
    lyrics: `夕暮れの光が差し込んで
すべてが金色に染まる時間
あなたの横顔がきれいで
息を飲んだ あの瞬間

Golden hour 二人だけの
かけがえのない時間
Golden hour 永遠に
続けばいいのに

オレンジ色の空の下で
小さな約束をした
「どんな未来が来ても
 一緒にいよう」って

Golden hour 陽が沈んでも
心は明るいままで
Golden hour あなたとなら
どんな暗闇も怖くない

この美しい瞬間を
ずっと忘れないように
目を閉じて 焼き付けた
あなたとのGolden hour`,
  },
  kuchibiru: {
    title: 'くちびる',
    reading: 'くちびる',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 6,
    lyrics: `甘い匂いのリップ 塗りなおして
鏡の中の自分に問いかける
「今日こそは」って 何度思ったの
結局また 言えないまま

くちびるに残る 言えなかった言葉
あなたのことが 好きだって
震える声で 伝えたかった
でも 笑顔で「またね」って言った

カフェの窓際 向かい合って
コーヒーの湯気越しに見つめてた
何気ない会話の隙間に
本当の気持ち 隠したまま

くちびるを噛んで 我慢してた
溢れそうな この想い
いつか届くかな あなたに
私の くちびるの秘密`,
  },
  neon_light: {
    title: 'Neon Light',
    reading: 'ねおんらいと',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 5,
    lyrics: `渋谷の街が 色づいていく
ネオンに照らされた 金曜の夜
ハイヒールの音 リズムを刻む
今夜は自分らしく踊りたい

Neon light 輝く夜に
本当の自分が目を覚ます
Neon light 眩しいくらいに
この瞬間を生きていく

誰かの期待に応えるのも
いい子でいるのも もう疲れた
鏡に映る この笑顔は
ちゃんと 本物かな

Neon light 涙も汗も
全部キラキラに変えて
Neon light 夜が終わっても
私は私のままでいい

ビートに身を任せて
心を解き放って
今夜のNeon lightの中で
自由に踊りたい`,
  },
  anata_no_koe: {
    title: 'あなたの声',
    reading: 'あなたのこえ',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 4,
    lyrics: `電話越しのあなたの声が
今日も私を救ってくれる
「大丈夫？」のたった一言が
どんな薬より 効くから

あなたの声 聴くだけで
張り詰めた心がほどける
あなたの声 それだけで
明日も頑張れる気がする

仕事終わりの疲れた夜
メッセージ開くのすら億劫で
でもあなたの 電話だけは
いつも出たいと思えた

あなたの声 その温度が
冷えた私を温めてくれる
あなたの声 離れていても
そばにいるような気がする

いつか面と向かって
伝えたい言葉がある
あなたの声が
私の一番好きな音だって`,
  },
  tsuki_to_diamonds: {
    title: '月とダイヤモンド',
    reading: 'つきとだいやもんど',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 3,
    lyrics: `月明かりに照らされた
夜の海辺を二人で歩く
水面に散らばる光が
まるでダイヤモンドみたい

月とダイヤモンド
どちらが美しいかなんて
もう関係ない
あなたの瞳が一番綺麗

指に光るリング
約束したあの日のように
永遠を信じたい
この夜の魔法の中で

月とダイヤモンド
二人を照らす光
どんな宝石より
あなたの笑顔が輝いてる

波の音に包まれて
時間がゆっくり流れる
このまま朝が来なければいいのに
月とダイヤモンドの夜`,
  },
  sayonara_wa_iwanai: {
    title: 'サヨナラは言わない',
    reading: 'さよならはいわない',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 2,
    lyrics: `空港のロビーで 見送るあなた
搭乗ゲートの前で 立ち止まった
振り向きたくて でも怖くて
涙を見せたくなくて

サヨナラは言わない
だって またすぐ会えるから
サヨナラは言わない
距離に負けたくないから

画面越しに見る あなたの笑顔
遠い街の朝日 届く写真
寂しさは嘘つかないけど
信じる気持ちも本当

サヨナラは言わない
「おやすみ」と「おはよう」だけ
サヨナラは言わない
再会の約束がある限り

次に会える日まで
この想いを温めて
サヨナラじゃなくて
「また会おうね」でいい`,
  },
  yoake_no_breath: {
    title: '夜明けのBreath',
    reading: 'よあけのぶれす',
    album: 'VELVET NIGHT',
    albumReading: 'ゔぇるゔぇっとないと',
    releaseDate: '2026-04-21',
    linkUrl: '#',
    displayPriority: 1,
    lyrics: `長い夜を越えて
やっと見えた光
深く息を吸って
新しい朝を迎える

夜明けのBreath
夜の終わりと始まりの間で
夜明けのBreath
すべてが静かに生まれ変わる

泣いた夜も 迷った日も
全部意味があったでしょう
傷ついた心が教えてくれた
本当に大切なもの

夜明けのBreath
深呼吸をして
もう一度 歩き出そう
自分を信じて

空が藍から紫に
紫からオレンジに変わるように
私も少しずつ 変わっていける
夜明けのBreathを感じながら

新しい一日が始まる
希望の光を浴びて
夜明けのBreath
今日も生きてく`,
  },
};

// ユーティリティ関数: songsDataをフラットな配列に変換
function getSongsArray() {
  return Object.entries(songsData).map(([id, song]) => ({
    id,
    ...song,
  }));
}

// 検索ソート設定
const searchSortConfig = {
  defaultSort: 'releaseDate',
  defaultOrder: 'desc',
  searchFields: ['title', 'album'],
};

// Node.js互換性
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { songsData, searchSortConfig, getSongsArray };
}
