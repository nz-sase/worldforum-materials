/* ======================================================
   資料データ：ここを書き換えるだけで中身が変わります
   file … PDFの場所 / thumb … サムネイル画像（16:9）の場所
   pickup: true にすると「まずはこちらから」にも表示されます
   ====================================================== */
const SITE = {
  eventName: "ServiceNow World Forum Tokyo 2026",
  partner: "NowTech",   /* この会社の資料は下の「出展・登壇」枠にまとめて表示 */
  partnerTitle: "NowTech も出展・登壇します",
  partnerLead: "株式会社NowTechは、シスラボのグループ会社です。今回のWorld Forumにも出展・登壇しておりますので、あわせてご覧ください。",
  footNote: "© 2026 SYSLABO ／ NowTech",
  zipName: "Syslabo-WorldForum2026-docs.zip",  /* まとめて保存するときのZIPのファイル名（ZIPは保存のたびにブラウザの中で作る） */
  /* 「メールで自分に送る」フォームの送信先（Power Automate のトリガー「HTTP 要求の受信時」の URL）。
     ここに届いた内容をもとに、Power Automate が資料のZIPを添付したメールを送る */
  mailFlowUrl: "https://default718c1f80a45c45bdbeeae609894a1a.4a.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/23/workflows/046cdd97b61849b09847ad031fb42d1d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6o0UK7SNhSLGTuGHYDeAmL1ZHbP6e2ivLiKPj8Zb5sI"
};

const DOCS = [
  { title: "会社案内", desc: "弊社のServiceNow事業の内容と、会社の基本情報、その他の事業をまとめています。", company: "シスラボ", cat: "会社紹介", pages: 28, file: "pdf/Syslabo-CompanyGuide.pdf", thumb: "thumbs/Syslabo-CompanyGuide.jpg", pickup: true },
  { title: "自社内での ServiceNow×AI 活用事例", desc: "10月27日(火)の講演資料です。", company: "シスラボ", cat: "講演資料", pages: 31, file: "pdf/Syslabo-talk-CustomerSpotlight.pdf", thumb: "thumbs/Syslabo-talk-CustomerSpotlight.jpg" },
  { title: "EmployeeWorksの活用事例", desc: "10月28日(水)の講演資料です。", company: "シスラボ", cat: "講演資料", pages: 28, file: "pdf/Syslabo-talk-SponsorSession.pdf", thumb: "thumbs/Syslabo-talk-SponsorSession.jpg" },
  { title: "内製サポートサービスのご紹介", desc: "社内でのServiceNow開発・運用を支援する、伴走サービスのご紹介です。", company: "シスラボ", cat: "サービス紹介", pages: 63, file: "pdf/Syslabo-naisei-support.pdf", thumb: "thumbs/Syslabo-naisei-support.jpg", pickup: true },
  { title: "活用診断サービスのご紹介", desc: "現状の活用度を診断し、次の一手を提案するサービスのご紹介です。", company: "シスラボ", cat: "サービス紹介", pages: 20, file: "pdf/Syslabo-katsuyou-shindan.pdf", thumb: "thumbs/Syslabo-katsuyou-shindan.jpg", pickup: true },
  { title: "会社案内", desc: "NowTechの会社概要と事業内容のご紹介です。", company: "NowTech", cat: "会社紹介", pages: 14, file: "pdf/NowTech-CompanyGuide.pdf", thumb: "thumbs/NowTech-CompanyGuide.jpg" },
  { title: "「内製支援」のご紹介", desc: "10月28日(水)の講演資料です。", company: "NowTech", cat: "講演資料", pages: 16, file: "pdf/NowTech-talk-SponsorSession.pdf", thumb: "thumbs/NowTech-talk-SponsorSession.jpg" }
];
