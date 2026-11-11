// Kafile teklif PDF'i (yeni model: kafile -> umreci -> umrecinin hediye dağıttığı kişiler).
// Kullanım: node scripts/kafile-teklif.js
// Çıktı: Masaüstü/OBRNHOMEN Kafile ve Influencer/OBRNHOMEN-Kafile-Teklifi.pdf + Teklif Gorselleri/*.jpg + Masaüstü/TEKLIF.pdf
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const desk = path.join(os.homedir(), "OneDrive", "Desktop");
const outDir = path.join(desk, "OBRNHOMEN Kafile ve Influencer");
const imgDir = path.join(outDir, "Teklif Gorselleri");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "teklif-"));
fs.mkdirSync(imgDir, { recursive: true });

const IMG = [
  "https://cdn.dsmcdn.com/mnresize/600/600/ty1817/prod/QC_PREP/20260128/00/383cf962-30d3-3973-a3d3-aa33ab4cdb24/1_org_zoom.jpg",
  "https://cdn.dsmcdn.com/mnresize/600/600/ty1660/prod/QC/20250406/00/6571c4d5-43b0-3928-92c4-898b06fca76a/1_org_zoom.jpg",
  "https://cdn.dsmcdn.com/mnresize/600/600/ty1809/prod/QC_PREP/20260115/15/d4184b10-e4c4-3642-b685-da25dcdc8cc7/1_org_zoom.jpg",
];

const arch = (c, s) => `
<svg viewBox="0 0 64 64" width="${s}" height="${s}" style="color:${c}">
  <path d="M12 59V31C12 18 21 9 32 4c11 5 20 14 20 27v28" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M8 59h48" stroke="currentColor" stroke-width="1.5"/>
  <path d="M19 31l13 5.5V56l-13-5.5z" fill="#1d1a14"/><path d="M32 36.5L45 31v19.5L32 56z" fill="#2c2820"/>
  <path d="M19 31l13-5.5L45 31l-13 5.5z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M19 35l13 5.5L45 35" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <path d="M36.5 45.6l4-1.7v6l-4 1.7z" fill="currentColor"/>
</svg>`;

const css = `
@page { size:A4; margin:0 }
* { margin:0; padding:0; box-sizing:border-box }
body { font-family:Inter,sans-serif; color:#3d4a42; -webkit-print-color-adjust:exact; print-color-adjust:exact }
.page { width:210mm; height:297mm; padding:18mm 18mm 16mm; position:relative; overflow:hidden; page-break-after:always; background:#faf6ec }
.page:last-child { page-break-after:auto }
.dark { background:#14392b; color:#f5efe0 }
.k { font-size:8.5pt; letter-spacing:2.4px; font-weight:600; color:#c9a24a; text-transform:uppercase }
h1 { font-family:Lora,serif; font-weight:700; color:#14392b; font-size:25pt; line-height:1.15; margin:2mm 0 4mm }
h2 { font-family:Lora,serif; font-weight:700; color:#14392b; font-size:14pt; margin-bottom:1.5mm }
h3 { font-size:11pt; font-weight:600; color:#14392b; margin-bottom:1.2mm }
p, li { font-size:10pt; line-height:1.55 }
.lead { font-size:11pt; color:#5d6a62; max-width:165mm }
.box { background:#fff; border:1px solid #eadfc8; border-radius:4mm; padding:5mm 5.5mm }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:4mm }
.grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:4mm }
.foot { position:absolute; left:18mm; right:18mm; bottom:10mm; display:flex; justify-content:space-between; font-size:8.5pt; color:#9a9380 }
b { color:#14392b }
.dark b { color:#fff }
`;

const foot = (n) => `<div class="foot"><span>OBRNHOMEN · Kafile Teklifi</span><span>${n}</span></div>`;

// ---------- Sayfa 1: Kapak ----------
const p1 = `<section class="page dark">
  <div style="display:flex;align-items:center;gap:5mm;font-family:Lora,serif;font-size:19pt;letter-spacing:4px;color:#c9a24a">${arch("#c9a24a", 50)} OBRNHOMEN</div>
  <div style="margin-top:50mm">
    <span style="display:inline-block;border:1px solid #c9a24a;border-radius:20mm;padding:2mm 5mm;font-size:8.5pt;letter-spacing:2px;color:#c9a24a">HAC &amp; UMRE KAFİLELERİNE ÖZEL</span>
    <div style="font-family:Lora,serif;font-weight:700;font-size:34pt;line-height:1.12;margin:7mm 0 6mm;color:#f5efe0">Umreciniz dönüşte dağıtacağı<br>hediyelikleri <span style="color:#c9a24a">sizden</span> alsın.</div>
    <p style="font-size:12pt;line-height:1.6;color:#d9d2bf;max-width:160mm">Her umreci dönüşte 20-50 kişiye hediye dağıtır. Bu hediyelikleri Mekke'de, son gün, kalabalıkta değil; telefonundan birkaç dakikada seçsin. Biz hazırlayalım, her hediyenin içine <b>kafilenizin adı</b> ve <b>hediyeyi verenin adı</b> yazılı kartı koyalım.</p>
  </div>
  <div class="grid3" style="margin-top:12mm">${IMG.map((u) => `<img src="${u}" style="width:100%;height:58mm;object-fit:cover;object-position:top;border-radius:3mm">`).join("")}</div>
  <div style="position:absolute;left:18mm;right:18mm;bottom:14mm;border-top:1px solid #4d6a55;padding-top:4mm;display:flex;justify-content:space-between;font-size:9.5pt;color:#cfc6ad">
    <span>obrnhomen.com</span><span>WhatsApp: 0531 689 38 49</span><span>merhaba@obrnhomen.com</span></div>
</section>`;

// ---------- Sayfa 2: Nasıl işler + kart ----------
const step = (n, t, d) => `<div class="box" style="display:flex;gap:4.5mm;align-items:flex-start;padding:4.2mm 5mm">
  <div style="flex:none;width:10mm;height:10mm;border-radius:50%;background:#14392b;color:#c9a24a;font-family:Lora,serif;font-weight:700;font-size:13pt;display:flex;align-items:center;justify-content:center">${n}</div>
  <div><h3>${t}</h3><p style="color:#5d6a62">${d}</p></div></div>`;

const p2 = `<section class="page">
  <div class="k">Nasıl işler</div>
  <h1>Kafile → umreci → sevdikleri</h1>
  <p class="lead">Kafileye ya da umreciye hediye vermiyoruz; umrecinin eş dosta dağıtacağı hediyelikleri hazırlıyoruz. Siz sadece linki paylaşıyorsunuz, gerisini biz yapıyoruz.</p>
  <div style="display:grid;gap:3.2mm;margin-top:6mm">
    ${step(1, "Linki umrecilerinize iletirsiniz", "Kafilenize özel bir link ve kod veriyoruz. WhatsApp grubunuza hazır görsel ve mesajıyla birlikte paylaşırsınız.")}
    ${step(2, "Umreci telefondan adım adım seçer", "obrnhomen.com/hediyelik-hazirla sayfasında sırayla seccade, eşarp-yazma, tesbih, yüzük-takke, esans, misvak ve diğer hediyelikler (Yasin, zikirmatik, cep Kur'an, hazır setler, çocuklar için). Her üründen kaç tane istediğini seçer, kartta yazacak adını girer.")}
    ${step(3, "Biz hazırlarız, her hediyeye kart koyarız", "50 hediye varsa 50 kart. Ürünler İstanbul Eminönü'deki dükkânımızda, hediye poşetinde hazırlanır.")}
    ${step(4, "Teslimat sizin istediğiniz şekilde", "Umrecinin evine tek tek, ya da kafilenize toplu. Yola çıkmadan önce de olur, dönüşte kapısında da.")}
  </div>
  <div class="k" style="margin-top:8mm">Her hediyenin içindeki kart</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:3mm">
    <div style="background:#14392b;border-radius:3mm;height:52mm;position:relative;color:#f5efe0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 7mm">
      <div style="position:absolute;inset:2.5mm;border:1px solid #9a7a35;border-radius:2mm"></div>
      ${arch("#c9a24a", 30)}
      <div style="font-family:Lora,serif;font-weight:600;font-size:15pt;color:#c9a24a;margin:1.5mm 0">Umreniz kabul olsun</div>
      <div style="font-family:Lora,serif;font-style:italic;font-size:8.5pt;line-height:1.45;color:#ddd5c0">Mübarek topraklardan getirdiğim bu hediye, dualarınızda beni de hatırlamanız içindir.</div>
      <div style="font-family:Lora,serif;font-style:italic;font-size:10pt;color:#f5efe0;margin-top:2mm">— Ayşe Yılmaz</div>
    </div>
    <div style="background:#fffdf7;border-radius:3mm;height:52mm;position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 0 1px #eadfc8">
      <div style="position:absolute;inset:2.5mm;border:1px solid #c9a24a;border-radius:2mm"></div>
      <div style="font-size:7.5pt;letter-spacing:2px;color:#9a8450">BU HEDİYE</div>
      <div style="font-family:Lora,serif;font-weight:700;font-size:17pt;color:#14392b;margin:1.5mm 0 1mm">Kafilenizin Adı</div>
      <div style="font-size:9pt">2027 Umre Kafilesi hatırasıdır</div>
      <div style="width:22mm;height:1px;background:#c9a24a;margin:3mm 0"></div>
      <div style="font-size:7.5pt;letter-spacing:1px;color:#8a8572">OBRNHOMEN · obrnhomen.com</div>
    </div>
  </div>
  <p style="margin-top:3mm;font-size:9pt;color:#7a7768">Bir umreci 50 hediye dağıtırsa kafilenizin adı 50 eve girer. Kartlar ücretsizdir. Umreci adını yazmazsa kart adsız basılır.</p>
  ${foot(2)}
</section>`;

// ---------- Sayfa 3: Neden ----------
const stat = (n, d) => `<div class="box"><div style="font-family:Lora,serif;font-weight:700;font-size:24pt;color:#c9a24a;line-height:1.1;margin-bottom:2mm">${n}</div><p style="color:#5d6a62">${d}</p></div>`;
const why = (t, d) => `<div class="box"><h3>${t}</h3><p style="color:#5d6a62">${d}</p></div>`;
const p3 = `<section class="page">
  <div class="k">Kafilelerin ortak derdi</div>
  <h1>Dönüş hediyeliği, umrenin en yorucu alışverişi</h1>
  <p class="lead">Umrecilerin büyük kısmı eş dosta dağıtacağı hediyelikleri son günlerde, kalabalıkta, yüksek fiyata alıyor. Valiz sınırı aşılıyor, fazla bagaj ücreti çıkıyor, kafile görevlisinin vakti de buna gidiyor.</p>
  <div class="grid2" style="margin-top:6mm">
    <div class="box" style="border-left:4px solid #b4553f"><h3>Bugün</h3><p style="color:#5d6a62">Son gün aceleyle alışveriş, pahalı ürün, ağır valiz, fazla bagaj ücreti. Hediyeliği kimin hazırladığı da hatırlanmaz.</p></div>
    <div class="box" style="border-left:4px solid #2e6b4f"><h3>OBRNHOMEN ile</h3><p style="color:#5d6a62">Umreci ibadetine odaklanır, hediyelikleri telefondan seçer. Dağıttığı her hediyede kafilenizin adı anılır, siz de kazanırsınız.</p></div>
  </div>
  <div class="k" style="margin-top:9mm">Neden OBRNHOMEN</div>
  <div class="grid3" style="margin-top:3mm">
    ${stat("600+", "çeşit hac-umre ve dini hediyelik: seccade, tesbih, Yasin, Kur'an-ı Kerim, yazma, esans, misvak.")}
    ${stat("9,0", "Trendyol mağaza puanımız. Müşterilerimizin değerlendirmesiyle.")}
    ${stat("Eminönü", "İstanbul'un hediyelik merkezindeyiz. Dilerseniz dükkânımıza uğrayıp ürünleri görebilirsiniz.")}
  </div>
  <div class="grid2" style="margin-top:4mm">
    ${why("Kafileye iş yükü yok", "Seçimi umreci yapar, siparişi biz hazırlarız. Siz sadece linki paylaşırsınız.")}
    ${why("Zamanında teslim", "Sipariş onayından sonra 5-7 iş günü içinde, istenen adrese.")}
    ${why("Sorunsuz değişim", "Hasarlı ya da eksik ürün olursa hemen değiştiririz. 14 gün ücretsiz iade.")}
    ${why("Tek muhatap", "Sipariş, teslim ve sonrası için doğrudan WhatsApp hattımızdan bize ulaşırsınız.")}
  </div>
  ${foot(3)}
</section>`;

// ---------- Sayfa 4: 3 yol + iletişim ----------
const yol = (tag, t, items, hl) => `<div class="box" style="position:relative;padding-top:7mm;${hl ? "border:1.5px solid #c9a24a" : ""}">
  <span style="position:absolute;top:-3mm;left:5mm;background:#c9a24a;color:#fff;font-size:8pt;font-weight:600;letter-spacing:1px;border-radius:10mm;padding:1mm 3.5mm">${tag}</span>
  <h2>${t}</h2><ul style="padding-left:4.5mm;color:#3d4a42">${items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`;
const p4 = `<section class="page">
  <div class="k">Üç çalışma şekli</div>
  <h1>Size hangisi uyarsa</h1>
  <p class="lead">Hepsinde seçim ekranı, hediye kartı ve teslimat aynı. Fark sadece kazancın nasıl paylaşıldığında.</p>
  <div style="display:grid;gap:5.5mm;margin-top:7mm">
    ${yol("YOL 1 · KAFİLE SATAR", "Siz satın, fark sizin", [
      "Ürünleri site fiyatının <b>%20 altında</b> alırsınız",
      "Umrecinize site fiyatından satarsınız; aradaki fark kafilenizin kazancıdır",
      "Siparişi umrecinin seçim listesiyle bize iletirsiniz, gerisini biz hazırlarız",
    ], true)}
    ${yol("YOL 2 · SIFIR MALİYET", "Ortaklık kodu", [
      "Kafilenize özel indirim kodu ve link",
      "Umreciniz siteden alırken <b>%10 indirim</b> kazanır",
      "Siz her satıştan <b>%10 komisyon</b> alırsınız; satışlar sistemde kayıtlı, her ay şeffaf hesap",
      "Stok, para, risk yok",
    ])}
    ${yol("YOL 3 · ÖZEL ANLAŞMA", "Size özel çalışalım", [
      "Büyük gruplar, hac kafileleri ya da farklı bir ihtiyacınız varsa",
      "Bir görüşmede konuşup size uygun şekilde anlaşırız",
    ])}
  </div>
  <div style="background:#14392b;color:#f5efe0;border-radius:4mm;padding:5.5mm 6mm;margin-top:7mm;font-size:10.5pt;line-height:1.55">
    <b style="color:#c9a24a">Sömestr ve Ramazan umreleri (Ocak–Mart 2027)</b> için kafileler hazırlıklarına şimdiden başladı. Sizin umrecileriniz de yola çıkmadan seçimlerini yapabilsin diye tarihlerinizi erkenden konuşalım.
  </div>
  <div class="box" style="margin-top:6mm;border:1.5px solid #c9a24a;display:flex;justify-content:space-between;align-items:center;gap:6mm">
    <div><h2>10 dakikalık bir görüşme yeterli</h2><p style="color:#5d6a62">Size hangi yolun uyduğunu konuşalım; kodunuzu, kartınızı ve grup görselinizi aynı gün hazırlayalım. İsterseniz ofisinize gelelim, isterseniz Eminönü'deki dükkânımızda ağırlayalım.</p></div>
    <div style="flex:none;text-align:right;font-size:10pt;line-height:1.7"><b>WhatsApp / Telefon</b><br>0531 689 38 49<br><b>E-posta</b><br>merhaba@obrnhomen.com<br><b>Seçim ekranı</b><br>obrnhomen.com/hediyelik-hazirla</div>
  </div>
  ${foot(4)}
</section>`;

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">${fonts}<style>${css}</style></head><body>${p1}${p2}${p3}${p4}</body></html>`;

const file = path.join(tmp, "teklif.html");
fs.writeFileSync(file, html, "utf8");
const url = "file:///" + file.replace(/\\/g, "/");
const run = (args) => execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=15000", ...args], { stdio: "pipe" });

const pdf = path.join(outDir, "OBRNHOMEN-Kafile-Teklifi.pdf");
run(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, url]);
fs.copyFileSync(pdf, path.join(desk, "TEKLIF.pdf"));

// Sayfa görselleri (WhatsApp'tan tek tek atmak için): her sayfayı ayrı HTML olarak çiz
[p1, p2, p3, p4].forEach((p, i) => {
  const f = path.join(tmp, `s${i + 1}.html`);
  fs.writeFileSync(f, `<!doctype html><html lang="tr"><head><meta charset="utf-8">${fonts}<style>${css} body{zoom:2}</style></head><body>${p}</body></html>`, "utf8");
  const png = path.join(tmp, `s${i + 1}.png`);
  run(["--window-size=1588,2246", `--screenshot=${png}`, "file:///" + f.replace(/\\/g, "/")]);
  fs.copyFileSync(png, path.join(imgDir, `OBRNHOMEN-Teklif-${i + 1}.png`));
});
console.log("Hazır:", pdf);
