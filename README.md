# worldforum-materials

ServiceNow World Forum Tokyo 2026 のブースで配布する資料（PDF）のサイトです。
QRコードから開き、サムネイル付きの一覧から資料を探して開けます（カテゴリとキーワードで絞り込めます）。
右上の「資料を受け取る」から名前とメールアドレスを送ると、全資料のZIPを添付したメールが届きます。

公開URL：https://kakesu-mizuki.github.io/worldforum-materials/

## 構成

```
worldforum-materials/
├─ index.html       … 資料一覧ページの骨組み（「資料を受け取る」のフォームもここ）
├─ download.html    … 全資料をZIPにまとめて保存するページ（メールのリンクから開く）
├─ css/style.css    … 見た目（色・フォント・余白）
├─ js/data.js       … 資料一覧（資料名・説明・カテゴリ・ページ数・PDFとサムネイルの場所）と、フォームの送信先
├─ js/main.js       … 一覧ページの動き（画面の組み立て・カテゴリとキーワードの絞り込み・フォームの送信）
├─ js/common.js     … 両ページで共通の部品（お知らせ表示・ZIPを作って保存する処理）
├─ favicon.ico      … ブラウザのタブに出るアイコン
├─ SyslaboLogo.svg  … 上部の固定リボンのロゴ（シスラボ。押すとシスラボのサイトへ）
├─ NowTechLogo.svg  … 「NowTech も出展・登壇します」の上のロゴ（押すと NowTech のサイトへ）
├─ .nojekyll        … GitHub Pages にファイルを加工させず、そのまま公開させるための空ファイル（消さない）
├─ thumbs/          … 資料のサムネイル（PDFの1ページ目、16:9 のJPG）
└─ pdf/             … 配布するPDF
```

## PDF一覧

| ファイル名 | 資料 |
|---|---|
| Syslabo-CompanyGuide.pdf | 会社案内（シスラボ） |
| Syslabo-talk-CustomerSpotlight.pdf | 10月27日(火)の講演資料「自社内での ServiceNow×AI 活用事例」（シスラボ） |
| Syslabo-talk-SponsorSession.pdf | 10月28日(水)の講演資料「EmployeeWorksの活用事例」（シスラボ） |
| Syslabo-naisei-support.pdf | サービス紹介「内製サポート」（シスラボ） |
| Syslabo-katsuyou-shindan.pdf | サービス紹介「活用診断」（シスラボ） |
| NowTech-CompanyGuide.pdf | 会社案内（NowTech） |
| NowTech-talk-SponsorSession.pdf | 10月28日(水)の講演資料「内製支援」のご紹介（NowTech） |

## 資料を変更するとき

js/data.js にある `SITE`（展示会名・NowTech枠の文言など）と `DOCS`（資料一覧）を書き換えます。
`pickup: true` を付けた資料は「まずはこちらから」にも表示されます。

PDFを差し替えたらサムネイルも作り直します（ImageMagick + Ghostscript）：

```
magick -density 110 "pdf/ファイル名.pdf[0]" -background white -flatten -resize 800x -quality 82 thumbs/ファイル名.jpg
```

メールに添付するZIP（`Syslabo-WorldForum2026-docs.zip`）は、このサイトではなく Power Automate が読み込む場所に置いてあります。
PDFを差し替えたら、そちらのZIPも作り直して置き換えてください。
ZIPはこのリポジトリにはコミットしません（コミットすると公開されてしまうため）。

## 「資料を受け取る」フォームの仕組み

```
index.html のフォーム（名前・会社名・メールアドレス・プライバシーポリシーへの同意）
   │ 送信 → Power Automate のトリガー「HTTP 要求の受信時」に JSON で POST
   ▼
Power Automate
   │ ・入力内容を確認する
   │ ・資料のZIPを添付したメールを送る（本文には download.html のリンクも入れる）
   │ ・申込内容を Excel に記録する
   ▼
お客様にメールが届く
```

- 送信先のURLは js/data.js の `SITE.mailFlowUrl` に書きます。
- 送る項目は `name`・`company`・`email`・`email2`（確認用）です。フロー側では `triggerBody()?['name']` のように受け取ります。
- フォーム形式（x-www-form-urlencoded）で送ると、Power Automate 側で日本語が文字化けするため、JSON で送っています。
- 送信先のURLはページを見れば誰でも分かります。イベントが終わったらフローをオフにしてください。

メール本文に入れる `download.html` のリンクは、次のURLにしてください。

```
https://kakesu-mizuki.github.io/worldforum-materials/download.html
```

## 公開（GitHub Pages）

- リポジトリ：kakesu-mizuki/worldforum-materials
- 公開元：main ブランチのルート（ビルドなし）

main ブランチに反映されると、数分で公開ページも更新されます。
全ページに `noindex` を付けて、検索エンジンには出ないようにしています。
ただしリポジトリもページも公開されているので、PDFやこの README は URL が分かれば誰でも見られます。
