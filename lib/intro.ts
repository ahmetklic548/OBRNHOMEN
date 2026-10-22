/** Açılış animasyonunun bu oturumda görüldüğünü tutan sessionStorage anahtarı */
export const INTRO_SEEN_KEY = "obrn-intro-seen";

/** İlk boyamadan önce çalışır: görüldüyse <html>'e "intro-seen" ekler, CSS animasyonu hiç göstermez */
export const INTRO_PREPAINT_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")==="1")document.documentElement.classList.add("intro-seen")}catch(e){}`;
