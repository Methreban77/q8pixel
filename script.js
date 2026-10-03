// Arabic translations. English text lives in index.html and is captured on load.
const AR = {
  "nav.services": "خدماتنا",
  "nav.work": "أعمالنا",
  "nav.process": "طريقة عملنا",
  "nav.contact": "تواصل معنا",
  "hero.eyebrow": "استوديو مواقع وتطبيقات في الكويت",
  "hero.title": "نصمم مواقع وتطبيقات تنمّي أعمالك",
  "hero.text": "من أول موقع إلكتروني إلى تطبيق جوال متكامل واستضافة موثوقة — Q8Pixel يتولى كل شيء من البداية إلى النهاية.",
  "hero.cta": "تواصل عبر واتساب",
  "hero.call": "اتصل",
  "services.title": "ماذا نقدّم",
  "services.web.title": "المواقع الإلكترونية",
  "services.web.text": "مواقع سريعة وعصرية بلغتين، تظهر بشكل رائع على جميع الشاشات ويسهل العثور عليها في جوجل.",
  "services.apps.title": "تطبيقات الجوال",
  "services.apps.text": "تطبيقات آيفون وأندرويد لعملائك — نصممها ونبرمجها وننشرها على App Store و Google Play.",
  "services.hosting.title": "الاستضافة",
  "services.hosting.text": "استضافة آمنة وموثوقة مع شهادة SSL ونسخ احتياطي ودعم مستمر، ليبقى موقعك متاحاً دائماً.",
  "work.title": "أعمالنا",
  "work.note": "مشاريع تجريبية لأنشطة تجارية افتراضية — اضغط على أي مشروع لتجربته مباشرة.",
  "work.web.tag": "موقع إلكتروني",
  "work.web.title": "جمر المرسى — مطعم",
  "work.web.text": "قائمة طعام كاملة بلغتين مع بحث، وساعات عمل مباشرة، ومعرض صور، وحجز طاولات.",
  "work.app.tag": "تطبيق جوال",
  "work.app.title": "ليلك — تطبيق حجز صالون",
  "work.app.text": "احجز الخدمة والأخصائية والموعد بلمسات قليلة، ثم أدر حجوزاتك. يمكن تثبيته على أي هاتف.",
  "work.store.tag": "متجر إلكتروني",
  "work.store.title": "سديم — دار العود والعطور",
  "work.store.text": "كتالوج منتجات مع مكونات العطور، وسلة مشتريات، وإتمام الطلب مع التوصيل لجميع مناطق الكويت.",
  "work.cta": "جرّب النسخة التجريبية",
  "process.title": "طريقة عملنا",
  "process.1.title": "نتحدث",
  "process.1.text": "نتعرّف على نشاطك التجاري وأهدافك.",
  "process.2.title": "نصمم",
  "process.2.text": "تشاهد التصميم وتوافق عليه قبل أن نبدأ البرمجة.",
  "process.3.title": "نبني",
  "process.3.text": "نبرمج موقعك أو تطبيقك ونختبره ونطلقه.",
  "process.4.title": "ندعمك",
  "process.4.text": "استضافة وتحديثات ومساعدة متى احتجت إليها.",
  "contact.title": "لنبنِ مشروعك معاً",
  "contact.text": "أخبرنا عن مشروعك — نرد بسرعة عبر واتساب.",
  "contact.whatsapp": "راسلنا على واتساب",
  "contact.call": "اتصل بنا",
  "footer.rights": "جميع الحقوق محفوظة."
};

const META = {
  en: {
    title: document.title,
    description: document.querySelector('meta[name="description"]').content
  },
  ar: {
    title: "Q8Pixel — تصميم مواقع وتطبيقات واستضافة في الكويت",
    description: "Q8Pixel يصمم مواقع إلكترونية عصرية بلغتين وتطبيقات آيفون وأندرويد ويقدم استضافة موثوقة للشركات في الكويت."
  }
};

const nodes = document.querySelectorAll("[data-i18n]");
const EN = {};
nodes.forEach((el) => { EN[el.dataset.i18n] = el.textContent; });

const toggle = document.getElementById("lang-toggle");

function setLanguage(lang) {
  const dict = lang === "ar" ? AR : EN;
  nodes.forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text) el.textContent = text;
  });

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = META[lang].title;
  document.querySelector('meta[name="description"]').content = META[lang].description;

  toggle.textContent = lang === "ar" ? "English" : "العربية";
  toggle.lang = lang === "ar" ? "en" : "ar";

  try { localStorage.setItem("lang", lang); } catch (e) {}
}

toggle.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "ar" ? "en" : "ar");
});

let saved = null;
try { saved = localStorage.getItem("lang"); } catch (e) {}
const browserLang = (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
const initial = saved || browserLang;
if (initial === "ar") setLanguage("ar");

document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveals: sections fade up as they enter the screen, siblings staggered.
const revealTargets = document.querySelectorAll(
  ".section h2, .section-note, .card, .work-card, .steps li, .contact-inner > *"
);

if ("IntersectionObserver" in window) {
  revealTargets.forEach((el) => {
    el.dataset.reveal = "";
    const siblings = [...el.parentElement.children].filter((c) => c.matches(el.tagName));
    el.style.setProperty("--d", Math.max(0, siblings.indexOf(el)));
  });

  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-in");
      revealer.unobserve(el);
      // Hand control back to each element's own hover transitions once revealed.
      setTimeout(() => {
        el.removeAttribute("data-reveal");
        el.style.removeProperty("--d");
      }, 1400);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach((el) => revealer.observe(el));

  // Pause the hero show reel while it is off screen.
  const stage = document.getElementById("stage");
  if (stage) {
    new IntersectionObserver(([entry]) => {
      stage.classList.toggle("paused", !entry.isIntersecting);
    }).observe(stage);
  }

  // "How we work" illustrations play only while the section is visible.
  const steps = document.getElementById("steps");
  if (steps) {
    new IntersectionObserver(([entry]) => {
      steps.classList.toggle("playing", entry.isIntersecting);
    }, { threshold: 0.2 }).observe(steps);
  }
} else {
  document.documentElement.classList.remove("js");
}
