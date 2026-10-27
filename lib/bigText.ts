/** A+ büyük yazı tercihi (FontSizeToggle) — sunucu düzeninden de okunabilsin diye ayrı dosyada */
export const BIG_TEXT_KEY = "obrn-big-text";
/** İlk boyamadan önce uygulanır (layout), sayfa açılırken zıplamasın */
export const BIG_TEXT_PREPAINT = `try{if(localStorage.getItem("${BIG_TEXT_KEY}")==="1")document.documentElement.classList.add("text-buyuk")}catch(e){}`;
