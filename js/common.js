/* ===== 一覧ページ（index.html）とダウンロード用ページ（download.html）で共通の部品 ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

const ICON_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>';

/* お知らせ（画面下に少しだけ出るメッセージ） */
let toastTimer;
function showToast(msg, ms = 2200) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => $("toast").classList.remove("show"), ms);
}

async function load(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(res.status);
  return res.arrayBuffer();
}

/* ファイルとして渡す。
   「ダウンロード用のファイル」（octet-stream）にしておくと、iPhone・iPad でもそのまま保存できる */
function saveFile(data, name) {
  const blobUrl = URL.createObjectURL(new Blob([data], { type: "application/octet-stream" }));
  const tmp = document.createElement("a");
  tmp.href = blobUrl;
  tmp.download = name;
  document.body.appendChild(tmp);
  tmp.click();
  tmp.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

/* 資料を保存する。1件だけならPDFをそのまま、2件以上ならその場で1つのZIPにまとめて渡す。
   （大きなZIPはサイトに置けないので、毎回ブラウザの中で作る）
   準備している間は buttons を押せないようにする */
let saving = false;
async function saveDocs(docs, buttons) {
  if (saving) return;
  saving = true;
  buttons.forEach(b => b.classList.add("is-busy"));
  try {
    let done = 0;
    showToast(`資料を準備しています… 0/${docs.length}`, 0);
    const files = await Promise.all(docs.map(async d => {
      const buf = await load(d.file);
      showToast(`資料を準備しています… ${++done}/${docs.length}`, 0);
      return buf;
    }));
    const fileName = d => d.file.split("/").pop();
    if (docs.length === 1) {
      saveFile(files[0], fileName(docs[0]));
    } else {
      const zip = new JSZip();
      docs.forEach((d, i) => zip.file(fileName(d), files[i]));  /* 一覧と同じ順に入れる */
      saveFile(await zip.generateAsync({ type: "arraybuffer" }), SITE.zipName);
    }
    showToast("ダウンロードを開始しました。");
  } catch {
    showToast("ダウンロードできませんでした。通信環境をご確認のうえ、もう一度お試しください。", 4000);
  } finally {
    saving = false;
    buttons.forEach(b => b.classList.remove("is-busy"));
  }
}
