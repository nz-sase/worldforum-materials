/* ===== 画面を組み立てる ===== */
const MAIN = DOCS.filter(d => d.company !== SITE.partner);
const PARTNER = DOCS.filter(d => d.company === SITE.partner);
const CATS = ["すべて", ...new Set(MAIN.map(d => d.cat))];
let cat = "すべて";

$("eventName").textContent = SITE.eventName;
$("partnerTitle").textContent = SITE.partnerTitle;
$("partnerLead").textContent = SITE.partnerLead;
$("footNote").textContent = SITE.footNote;

/* サムネイルとタイトルを押すとPDFが開く
   （サムネイルのリンクはタイトルのリンクと同じなので、キーボード操作・読み上げでは飛ばす） */
function card(d) {
  const href = encodeURI(d.file);
  return `<div class="card">
    <a class="card-thumb" href="${href}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
      <div class="thumb"><span class="badge">PDF ・ ${d.pages}p</span><img src="${esc(d.thumb)}" alt="" loading="lazy"></div>
    </a>
    <div class="card-body">
      <a class="card-link" href="${href}" target="_blank" rel="noopener">
        <h3>${esc(d.title)}</h3>
        <p class="desc">${esc(d.desc)}</p>
        <p class="meta">${esc(d.company)} ・ ${esc(d.cat)}</p>
      </a>
    </div>
  </div>`;
}

/* カテゴリとキーワードに合わせて一覧を描き直す
   （キーワードは資料名・説明・カテゴリ・会社名から探す。検索中は「まずはこちらから」を隠す） */
function render() {
  const kw = $("q").value.trim().toLowerCase();
  const hit = d => !kw || (d.title + d.desc + d.cat + d.company).toLowerCase().includes(kw);
  const items = (cat === "すべて" ? MAIN : DOCS.filter(d => d.cat === cat)).filter(hit);
  const partner = PARTNER.filter(hit);
  $("list").innerHTML = items.map(card).join("");
  $("list-title").textContent = cat === "すべて" ? "すべての資料" : cat;
  $("count").textContent = items.length + "件";
  $("empty").hidden = items.length > 0;
  $("pickup").innerHTML = MAIN.filter(d => d.pickup).map(card).join("");
  $("partner").innerHTML = partner.map(card).join("");
  $("partner-sec").hidden = cat !== "すべて" || !partner.length;
  $("pickup-sec").hidden = cat !== "すべて" || !!kw;
}

$("chips").innerHTML = CATS.map(c => `<button class="chip" aria-pressed="${c === cat}">${esc(c)}</button>`).join("");
$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  cat = b.textContent;
  [...$("chips").children].forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});
$("q").addEventListener("input", render);
render();

/* ===== 資料を受け取る（右上のボタン） =====
   メールアドレスはこのページのフォームで受け取り、メールは Power Automate から送る */
const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const form = $("mailForm");
document.querySelectorAll(".mail-btn").forEach(b => {
  b.innerHTML = ICON_MAIL + "資料を受け取る";
  b.addEventListener("click", () => {
    /* 送信が終わったあとに開き直したら、空のフォームから始める */
    if (form.hidden) { form.reset(); form.hidden = false; $("mailDone").hidden = true; }
    $("mailModal").showModal();
  });
});
$("mailClose").addEventListener("click", () => $("mailModal").close());
/* 枠の外（暗いところ）を押しても閉じる */
$("mailModal").addEventListener("click", e => { if (e.target === e.currentTarget) e.currentTarget.close(); });

/* 入力内容を確かめる。問題があれば [欄の name, メッセージ] を返す */
function checkForm() {
  const v = k => form.elements[k].value.trim();
  if (!v("name")) return ["name", "お名前を入力してください。"];
  if (!v("email")) return ["email", "メールアドレスを入力してください。"];
  if (!form.elements.email.checkValidity()) return ["email", "メールアドレスの形式が正しくありません。"];
  if (v("email2") !== v("email")) return ["email2", "確認用のメールアドレスが一致しません。"];
  if (!form.elements.agree.checked) return ["agree", "プライバシーポリシーへの同意が必要です。"];
  return null;
}
function showError(msg) {
  $("mailError").textContent = msg;
  $("mailError").hidden = !msg;
}

/* Power Automate へは JSON で送る
   （フォーム形式だと、Power Automate の triggerFormDataValue() で日本語が文字化けするため） */
let sending = false;
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (sending) return;
  [...form.elements].forEach(el => el.removeAttribute("aria-invalid"));
  const err = checkForm();
  if (err) {
    const el = form.elements[err[0]];
    el.setAttribute("aria-invalid", "true");
    el.focus();
    return showError(err[1]);
  }
  showError("");
  sending = true;
  $("mailSubmit").classList.add("is-busy");
  $("mailSubmit").textContent = "送信しています…";
  try {
    /* 隠し欄に何か入っていたらボットとみなし、送ったふりだけする */
    if (!form.elements.website.value) {
      if (!SITE.mailFlowUrl) throw new Error("mailFlowUrl が未設定");
      const v = k => form.elements[k].value.trim();
      const res = await fetch(SITE.mailFlowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v("name"), company: v("company"), email: v("email"), email2: v("email2") })
      });
      if (!res.ok) throw new Error(res.status);
    }
    form.hidden = true;
    $("mailDone").hidden = false;
  } catch {
    showError("送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。");
  } finally {
    sending = false;
    $("mailSubmit").classList.remove("is-busy");
    $("mailSubmit").textContent = "送信する";
  }
});
