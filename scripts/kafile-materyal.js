// Kafileye özel hediye kartı (baskı PDF + önizleme PNG) ve WhatsApp grup görseli (PNG) üretir.
// Kullanım: node scripts/kafile-materyal.js "Kafile Adı" KOD "2027 Ramazan Umresi"
// Çıktı: Masaüstü/OBRNHOMEN Kafile ve Influencer/Kafile Materyalleri/<Kafile Adı>/
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const [name = "Örnek Turizm", code = "ORNEK", tour = "2027 Umre Kafilesi"] = process.argv.slice(2);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = path.join(os.homedir(), "OneDrive", "Desktop", "OBRNHOMEN Kafile ve Influencer", "Kafile Materyalleri");
const outDir = path.join(base, name.replace(/[\\/:*?"<>|]/g, ""));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kafile-"));
fs.mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const NAME = esc(name);
const CODE = esc(code.toUpperCase());
const TOUR = esc(tour);
const link = `obrnhomen.com/?ref=${CODE}`;

const arch = (c, s) => `
<svg viewBox="0 0 64 64" width="${s}" height="${s}" style="color:${c}">
  <path d="M12 59V31C12 18 21 9 32 4c11 5 20 14 20 27v28" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M8 59h48" stroke="currentColor" stroke-width="1.5"/>
  <path d="M19 31l13 5.5V56l-13-5.5z" fill="#1d1a14"/><path d="M32 36.5L45 31v19.5L32 56z" fill="#2c2820"/>
  <path d="M19 31l13-5.5L45 31l-13 5.5z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M19 35l13 5.5L45 35" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <path d="M36.5 45.6l4-1.7v6l-4 1.7z" fill="currentColor"/>
</svg>`;

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

// ---------- 1) HEDİYE KARTI (kartvizit 85x55 mm, ön + arka) ----------
const cardCss = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .card { width:85mm; height:55mm; position:relative; overflow:hidden; page-break-after:always; font-family:Inter,sans-serif; }
  .card:last-child { page-break-after:auto; }
  .front { background:#14392b; color:#f5efe0; text-align:center; padding:5mm 6mm; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .frame { position:absolute; inset:2.5mm; border:0.3mm solid rgba(201,162,74,.7); border-radius:1.5mm; pointer-events:none; }
  .front h1 { font-family:Lora,serif; font-weight:600; font-size:13.5pt; color:#c9a24a; margin:1mm 0 1.2mm; letter-spacing:.3px; }
  .front p { font-family:Lora,serif; font-style:italic; font-size:7.2pt; line-height:1.4; color:#ddd5c0; max-width:66mm; }
  .back { background:#faf6ec; color:#14392b; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:5mm; }
  .back .frame { border-color:#c9a24a; }
  .back .k { font-size:6.5pt; letter-spacing:1.6px; color:#9a8450; text-transform:uppercase; }
  .back h2 { font-family:Lora,serif; font-size:15pt; font-weight:700; margin:1.5mm 0 1mm; line-height:1.15; }
  .back .t { font-size:7.5pt; color:#3d4a42; }
  .back .line { width:14mm; height:0.3mm; background:#c9a24a; margin:2.2mm auto; }
  .back .s { font-size:5.8pt; color:#8a8572; letter-spacing:.6px; }`;
const cardHtml = (forPrint) => `<!doctype html><html lang="tr"><head><meta charset="utf-8">${fonts}
<style>@page{size:85mm 55mm;margin:0} ${cardCss}
${forPrint ? "" : "body{background:#e9e4d8;padding:24px;display:flex;flex-direction:column;gap:24px;width:max-content} .card{zoom:2.2;box-shadow:0 2px 8px rgba(0,0,0,.18);border-radius:1mm}"}
</style></head><body>
<div class="card front"><div class="frame"></div>
  ${arch("#c9a24a", 34)}
  <h1>Umreniz kabul olsun</h1>
  <p>Mübarek topraklardan getirdiğim bu hediye, dualarınızda beni de hatırlamanız içindir.</p>
</div>
<div class="card back"><div class="frame"></div>
  <div class="k">Bu hediye</div>
  <h2>${NAME}</h2>
  <div class="t">${TOUR} hatırasıdır</div>
  <div class="line"></div>
  <div class="s">OBRNHOMEN · obrnhomen.com</div>
</div>
</body></html>`;

// ---------- 2) WHATSAPP GRUP GÖRSELİ (1080x1350) ----------
const imgs = [
  "https://cdn.dsmcdn.com/mnresize/500/500/ty1817/prod/QC_PREP/20260128/00/383cf962-30d3-3973-a3d3-aa33ab4cdb24/1_org_zoom.jpg",
  "https://cdn.dsmcdn.com/mnresize/500/500/ty1660/prod/QC/20250406/00/6571c4d5-43b0-3928-92c4-898b06fca76a/1_org_zoom.jpg",
  "https://cdn.dsmcdn.com/mnresize/500/500/ty1809/prod/QC_PREP/20260115/15/d4184b10-e4c4-3642-b685-da25dcdc8cc7/1_org_zoom.jpg",
];
const waHtml = `<!doctype html><html lang="tr"><head><meta charset="utf-8">${fonts}<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1080px; height:1350px; background:#14392b; color:#f5efe0; font-family:Inter,sans-serif; padding:70px 72px; position:relative; overflow:hidden; }
  .brand { display:flex; align-items:center; gap:16px; font-family:Lora,serif; font-size:34px; letter-spacing:5px; color:#c9a24a; }
  .for { margin-top:56px; font-size:30px; color:#d9d2bf; }
  .for b { color:#fff; }
  h1 { font-family:Lora,serif; font-size:92px; line-height:1.02; font-weight:700; margin:14px 0 18px; }
  h1 span { color:#c9a24a; }
  .sub { font-size:31px; line-height:1.45; color:#d9d2bf; max-width:900px; }
  .photos { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin:46px 0; }
  .photos img { width:100%; height:270px; object-fit:cover; object-position:top; border-radius:14px; }
  .code { background:#faf6ec; color:#14392b; border-radius:22px; padding:30px 36px; display:flex; justify-content:space-between; align-items:center; }
  .code .l { font-size:24px; color:#5d6a62; letter-spacing:1px; }
  .code .c { font-family:Lora,serif; font-size:70px; font-weight:700; letter-spacing:4px; color:#14392b; }
  .code .r { text-align:right; font-size:26px; line-height:1.5; color:#14392b; }
  .code .r b { color:#b0873a; }
  .foot { position:absolute; left:72px; right:72px; bottom:62px; display:flex; justify-content:space-between; font-size:26px; color:#cfc6ad; }
</style></head><body>
  <div class="brand">${arch("#c9a24a", 62)} OBRNHOMEN</div>
  <div class="for"><b>${NAME}</b> umrecilerine özel</div>
  <h1>Hediyelikleriniz<br><span>%10 indirimle</span> kapınızda</h1>
  <div class="sub">Seccade, tesbih, Yasin, takke, esans, misvak… Dönüşte dağıtacağınız hediyelikleri yola çıkmadan hazırlayın, valiz derdi olmasın.</div>
  <div class="photos">${imgs.map((u) => `<img src="${u}">`).join("")}</div>
  <div class="code">
    <div><div class="l">İNDİRİM KODUNUZ</div><div class="c">${CODE}</div></div>
    <div class="r">Siparişte kodu yazın<br>ya da linke tıklayın:<br><b>${link}</b></div>
  </div>
  <div class="foot"><span>WhatsApp: 0531 689 38 49</span><span>2.000 ₺ üzeri ücretsiz kargo</span></div>
</body></html>`;


// ---------- 3) A4 BASKI (10'lu dizili, sayfa 1 = ön yüzler, sayfa 2 = arka yüzler) ----------
const a4Html = () => {
  const m = cardHtml(true);
  const front = m.split('<div class="card front">')[1].split('<div class="card back">')[0].replace(/<\/body>[\s\S]*/, "");
  const back = m.split('<div class="card back">')[1].replace(/<\/body>[\s\S]*/, "");
  const grid = (inner, cls) => `<div class="sheet">${Array.from({ length: 10 }, () => `<div class="card ${cls}">${inner}`).join("")}</div>`;
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">${fonts}<style>@page{size:A4;margin:0} ${cardCss}
  .sheet{width:210mm;height:297mm;display:grid;grid-template-columns:repeat(2,85mm);grid-auto-rows:55mm;justify-content:center;align-content:center;gap:0;page-break-after:always}
  .sheet:last-child{page-break-after:auto} .sheet .card{page-break-after:auto;outline:0.1mm dashed #bbb}</style></head><body>
  ${grid(front.trim().replace(/<\/div>\s*$/, "") + "</div>", "front")}${grid(back.trim(), "back")}</body></html>`;
};

// ---------- Çizim ----------
const w = (f, s) => (fs.writeFileSync(path.join(tmp, f), s), "file:///" + path.join(tmp, f).replace(/\\/g, "/"));
const run = (args) => execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=15000", ...args], { stdio: "pipe" });

run(["--no-pdf-header-footer", `--print-to-pdf=${path.join(outDir, "Hediye-Karti-BASKI.pdf")}`, w("kart.html", cardHtml(true))]);
run(["--window-size=760,1010", `--screenshot=${path.join(outDir, "Hediye-Karti-onizleme.png")}`, w("kart-on.html", cardHtml(false))]);
run(["--no-pdf-header-footer", `--print-to-pdf=${path.join(outDir, "Hediye-Karti-A4-10lu-BASKI.pdf")}`, w("a4.html", a4Html())]);
run(["--window-size=1080,1350", `--screenshot=${path.join(outDir, "WhatsApp-Grup-Gorseli.png")}`, w("wa.html", waHtml)]);

const msg = `Değerli umrecilerimiz 🌿
Dönüşte eş dosta dağıtacağınız hediyelikleri (seccade, tesbih, Yasin, esans…) yola çıkmadan hazırlamak isteyenler için ${name} olarak OBRNHOMEN ile anlaştık.
Size özel %10 indirim kodu: ${code.toUpperCase()}
Link: https://www.${link}
Hayırlı yolculuklar, Rabbim umrelerinizi kabul etsin.`;
fs.writeFileSync(path.join(outDir, "WhatsApp-Grup-Mesaji.txt"), msg, "utf8");
console.log("Hazır:", outDir);
