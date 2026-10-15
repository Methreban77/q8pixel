/* DUAL FUEL — concept product site by Q8Pixel.
   Vanilla JS: English/Arabic (RTL), the Gym/Life pack switch, the tear-open pack,
   a demo batch lookup and a demo order form. Nothing is ever sent anywhere. */
(function () {
  'use strict';

  var doc = document, html = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ------------------------------------------------------------------
     Arabic for the static markup (English lives in index.html)
     ------------------------------------------------------------------ */
  var AR = {
    'skip': 'انتقل إلى المحتوى',
    'brand.home': 'DUAL FUEL، العودة إلى الأعلى',
    'nav.label': 'التنقل الرئيسي',
    'nav.range': 'جيم أو لايف',
    'nav.day': 'يومك',
    'nav.inside': 'داخل العلبة',
    'nav.dates': 'التمر',
    'nav.order': 'الأسعار',
    'cta.order': 'اطلب علبة',
    'hero.title': 'DUAL FUEL: طاقة قبل، وتعويض بعد',
    'hero.pre1': 'طاقة',
    'hero.pre2': 'قبل.',
    'hero.post1': 'وتعويض',
    'hero.post2': 'بعد.',
    'hero.preNote': 'تمر وأرز منفوخ وقهوة، قبل التمرين بـ 30 إلى 60 دقيقة.',
    'hero.preNoteLife': 'لوح خفيف مقرمش بالتمر والقهوة قبل المشي أو الحصة أو عصرية طويلة.',
    'hero.postNote': 'بروتين و3 غ كرياتين، أول ما تخلص التمرين.',
    'hero.postNoteLife': '10 غ بروتين بدل الحلو، بحوالي 115 سعرة.',
    'var.label': 'اختر العلبة',
    'var.gymSub': 'للتمرين القوي',
    'var.lifeSub': 'ليوم أخف',
    'pack.preSub': 'طاقة · 30 غ كربوهيدرات',
    'pack.preSubLife': 'تمر بالقهوة · 95 سعرة',
    'pack.postSub': '20 غ بروتين + 3 غ كرياتين',
    'pack.postSubLife': '10 غ بروتين · 115 سعرة',
    'pack.tear': 'اقطع هنا',
    'pack.tearOpen': 'افتح العلبة',
    'pack.tearClose': 'أغلق العلبة',
    'hero.lede': 'غلاف واحد ولوحين مغلّقين. كُل البرتقالي قبل، وخلّ الأزرق لبعد.',
    'cta.orderGym': 'اطلب جيم · 1.500 د.ك',
    'cta.orderLife': 'اطلب لايف · 1.250 د.ك',
    'cta.how': 'شوف كيف يمشي مع يومك',

    'range.title': 'علبتين لنوعين من الأيام',
    'range.gymAlt': 'علبة DUAL FUEL جيم بغلاف أسود في يد لابسة قفاز داخل نادي',
    'range.gymFor': 'لمن يرفع أوزان أو يركض أو يلعب بقوة ثلاث مرات أو أكثر في الأسبوع.',
    'range.lifeAlt': 'علبة DUAL FUEL: لوح PRE بالتمر والقهوة ولوح POST بالكاكاو والبروتين في غلاف واحد',
    'range.gymAlt': 'علبة DUAL FUEL: لوح PRE بالتمر والقهوة ولوح POST بالكاكاو والبروتين في غلاف واحد',
    'range.lifeFor': 'للأيام المزحومة والمشي والحصص، لمن يحسب السعرات.',
    'range.pickGym': 'اختر جيم',
    'range.pickLife': 'اختر لايف',
    'range.fine': 'كل القيم أهداف أولية للنموذج، والقيم النهائية بعد فحص المختبر.',
    'f.pack': 'العلبة كاملة',
    'f.carbs': 'كربوهيدرات',
    'f.protein': 'بروتين',
    'f.creatine': 'كرياتين مونوهيدرات',
    'f.none': 'لا يوجد',
    'f.weight': 'وزن اللوح',
    'f.energy': 'السعرات',
    'f.sugar': 'سكر مضاف',
    'f.caffeine': 'كافيين (من القهوة)',
    'f.ingr': 'المكونات:',

    'day.title': 'علبة واحدة، وتمرين مسائي واحد',
    'day.titleLife': 'علبة واحدة، ويوم مزحوم واحد',
    'day.lead': 'تمرين عادي بعد الدوام في الكويت، من مكتب النادي إلى سلة المهملات.',
    'day.leadLife': 'يوم دوام وآخره مشي، بدون ما تمد يدك على الحلو.',
    'day.s1': 'خذ علبة',
    'day.s1t': 'من مكتب الاستقبال في النادي، أو من باقتك الأسبوعية في البيت.',
    'day.s2': 'اقطع وكُل PRE',
    'day.s2t': 'اقطع على الخط. اللوح البرتقالي يعطيك 30 غ كربوهيدرات سريعة من التمر والأرز المنفوخ، مع شوية قهوة.',
    'day.s3': 'تمرّن',
    'day.s3t': 'POST يبقى مغلّق في نصّه من الغلاف، في شنطتك.',
    'day.s4': 'كُل POST',
    'day.s4t': '20 غ بروتين و3 غ كرياتين يومي، في لوح واحد.',
    'day.s5': 'ارمِ الغلاف',
    'day.s5t': 'غلاف واحد، بدون علبة وبدون غلاف ثاني.',
    'day.l1': 'العلبة في شنطتك',
    'day.l1t': 'أخذتها مع أغراض الجمعية.',
    'day.l2': 'PRE مع قهوتك',
    'day.l2t': '95 سعرة من التمر والأرز المنفوخ والقهوة توصّلك للغدا.',
    'day.l3': 'مشي أو بادل أو حصة',
    'day.l3t': 'POST ينتظر مغلّق في نصّه من الغلاف.',
    'day.l4': 'POST بدل الحلو',
    'day.l4t': '10 غ بروتين بحوالي 115 سعرة.',

    'inside.title': 'داخل علبة جيم',
    'inside.titleLife': 'داخل علبة لايف',
    'inside.preH': 'قبل',
    'inside.preText': 'لوح التمر بالقهوة المقرمش: سريع الهضم مع لمسة قهوة. مصنوع من تمر سليم كان أصغر أو فيه علامات تمنع بيعه كفاكهة.',
    'inside.preIngr': 'تمر كويتي فائض، أرز منفوخ، زبدة لوز، قهوة سريعة التحضير، كاكاو، عسل أو شراب أرز، فانيلا، ملح.',
    'inside.postH': 'بعد',
    'inside.postText': 'لوح الكاكاو والبروتين المقرمش: غني بالكاكاو ويشبّع. بروتين في الوقت اللي يحتاجه جسمك، ومعه الكرياتين اللي كثير من الرياضيين ياخذونه بودرة.',
    'inside.postIngr': 'بروتين مصل الحليب، أرز منفوخ، زبدة لوز، كاكاو، كرياتين مونوهيدرات، شراب أرز أو عسل، فانيلا، ملح؛ ورشّة شوكولاتة داكنة اختيارية.',
    'inside.postIngrLife': 'بروتين مصل الحليب، أرز منفوخ، زبدة لوز، كاكاو، شراب أرز أو عسل، فانيلا، ملح (بدون كرياتين).',
    'inside.fine': 'يحتوي على حليب ولوز، وكافيين من القهوة: مو مناسب للأطفال أو خلال الحمل. بدون شوفان وبدون شيا؛ الأرز المنفوخ خالي من الجلوتين طبيعياً بس مو معتمد بعد. القيم أهداف أولية للنموذج، والقيم النهائية بعد فحص المختبر. ليس بديلاً عن وجبة.',

    'dates.title': 'التمر في PRE انرفض بسبب شكله',
    'dates.lead': 'الكويت تنتج أكثر من 100 ألف طن تمر في السنة. بعضه صغير أو مشقوق أو فيه علامات فما ينباع كفاكهة، مع إنه صالح للأكل تماماً. نشتريه ونطحنه، ونقول لك كم استخدمنا بالضبط.',
    'dates.p1': 'تمر منقذ',
    'dates.p1t': 'ننشر كم كيلو تمر فائض استخدمنا لكل 1,000 علبة.',
    'dates.p2': 'غلاف واحد بدون علبة',
    'dates.p2t': 'ننشر وزن التغليف لكل علبة، مقارنة بلوحين منفصلين.',
    'dates.p3': 'الإثبات على كل علبة',
    'dates.p3t': 'رمز QR يبيّن الدفعة، ومن وين جا التمر، ووزن التغليف.',
    'dates.f1': 'طن تمر انزرع في الكويت في 2024',
    'dates.f2': 'هدر طعام منزلي للشخص في السنة في الكويت',
    'dates.src': 'المصادر: FAOSTAT عن طريق Helgi Library (2026)، ومؤشر هدر الطعام من UNEP 2024.',
    'batch.title': 'افحص دفعتك',
    'batch.help': 'اكتب الرمز المطبوع جنب خط القطع، أو جرّب الرمز التجريبي.',
    'batch.label': 'رمز الدفعة',
    'batch.go': 'افحص الدفعة',
    'batch.sample': 'استخدم الرمز التجريبي DF-2611-03',

    'order.title': 'اللحظتين بأقل من سعر لوحين',
    'order.lead': 'لوح تمر ولوح بروتين، كل واحد بروحه، يكلفون حوالي 2.026 د.ك في رفوف الكويت. DUAL FUEL يغطي اللحظتين بأقل.',
    'plan.gymNote': 'علبة واحدة، اللوحين',
    'plan.lifeNote': 'علبة أخف، اللوحين',
    'plan.gymWeek': 'باقة جيم الأسبوعية، شهرياً',
    'plan.lifeWeek': 'باقة لايف الأسبوعية، شهرياً',
    'plan.weekNote': '5 علب كل شهر · توفير 10%',
    'form.title': 'الطلب',
    'form.plan': 'اختر',
    'form.qty': 'الكمية',
    'form.less': 'أقل',
    'form.more': 'أكثر',
    'form.where': 'استلام أو توصيل',
    'form.optGym': 'استلام من مكتب النادي',
    'form.optCoop': 'استلام من الجمعية',
    'form.optHome': 'توصيل داخل الكويت (+ 0.500 د.ك)',
    'form.total': 'المجموع',
    'form.submit': 'أرسل طلباً تجريبياً',
    'form.fine': 'تجريبي فقط: ما ينخصم شي وما ينرسل شي.',
    'form.again': 'ابدأ طلب جديد',

    'where.title': 'وين تصير اللحظتين',
    'where.gym': 'مكاتب استقبال النوادي',
    'where.gymT': 'على الكاونتر اللي تسجّل فيه دخولك، عشان يكون PRE في يدك قبل الإحماء.',
    'where.coop': 'الجمعيات التعاونية وصيدلياتها',
    'where.coopT': 'في قسم التغذية الرياضية بجمعية منطقتك.',
    'where.app': 'تطبيقات التوصيل',
    'where.appT': 'اطلب علبة أو باقتك الأسبوعية، وتوصلك بنفس اليوم.',
    'where.campus': 'الجامعات',
    'where.campusT': 'متاجر الحرم والأندية الرياضية، مع سفراء من فرق الطلبة.',

    'faq.title': 'أسئلة',
    'faq.q1': 'أقدر آكل اللوحين مرة وحدة؟',
    'faq.a1': 'إي. مع بعض يصيرون سناك متوازن فيه كربوهيدرات وبروتين. التقسيم للتسهيل، مو قاعدة.',
    'faq.q2': 'هل 3 غ كرياتين يومياً آمنة؟',
    'faq.a2': 'الجمعية الدولية للتغذية الرياضية تعتبر 3 إلى 5 غ يومياً فعالة، وما لقت دليل مقنع على ضرر عند البالغين الأصحاء. إذا عندك حالة صحية، اسأل طبيبك أول. علبة لايف ما فيها كرياتين.',
    'faq.q3': 'هل الكرياتين أفضل بعد التمرين؟',
    'faq.a3': 'ما ندّعي هذا. أخذه كل يوم أهم من الساعة. حطيناه في POST لأن هذا الوقت اللي أغلب الناس ياخذون فيه البروتين.',
    'faq.q4': 'ليش غلاف واحد؟',
    'faq.a4': 'غلاف واحد بقسمين مغلّقين يستهلك مواد أقل من لوحين كل واحد بغلافه، وما يحتاج علبة.',
    'faq.q5': 'التمر الفائض جودته أقل؟',
    'faq.a5': 'بالشكل بس. يمر بنفس فحوصات سلامة الغذاء مثل أي تمر نستخدمه، بس كان صغير أو فيه علامات ما تسمح ببيعه كفاكهة.',

    'next.title': 'الخطوة الجاية',
    'next.lead': 'بعد الإطلاق، أنت تختار النكهات الجاية، ونسوي كل علبة بنسخة تناسب أصحاب الحساسية.',
    'vote.title': 'صوّت للنكهة الجاية',
    'vote.f1': 'تمر وهيل (PRE)',
    'vote.f2': 'كاكاو وفستق (POST)',
    'vote.f3': 'تمر وزعفران (PRE)',
    'vote.f4': 'فانيلا وكراميل التمر (POST)',
    'vote.f5': 'ويفر بطبقات الراهش مغطى بالفستق والشوكولاتة (PRE)',
    'vote.f6': 'بونبون شوكولاتة محشي كراميل مملح وحبة بندق (POST)',
    'vote.go': 'أرسل صوتي',
    'ff.title': 'علب خالية من مسببات الحساسية، في خطة السنة الثانية والثالثة',
    'ff.g': 'خالي من الجلوتين',
    'ff.gOut': 'ولا شي: الأرز المنفوخ خالي من الجلوتين',
    'ff.gIn': 'أرز منفوخ معتمد خالي من الجلوتين، على خط إنتاج نظيف',
    'ff.l': 'خالي من اللاكتوز',
    'ff.lOut': 'بروتين مصل الحليب',
    'ff.lIn': 'بروتين البازلاء والأرز',
    'ff.n': 'خالي من المكسرات',
    'ff.nOut': 'اللوز',
    'ff.nIn': 'زبدة بذور دوار الشمس وبذور اليقطين',
    'ff.rule': 'ما نكتب «خالي من» على أي علبة إلا إذا انصنعت على خط إنتاج منفصل ونظيف، وكل دفعة نجحت في فحوصات المختبر للجلوتين والحليب والمكسرات.',
    'faq.q6': 'عندي حساسية. أقدر آكل DUAL FUEL؟',
    'faq.a6': 'مو الحين: العلبتين فيها حليب ولوز، ولوح PRE فيه كافيين، ومكتوب على الملصق. النسخ الخالية من الجلوتين واللاكتوز والمكسرات في خطة السنة الثانية والثالثة.',
    'nav.survey': 'الاستبيان',
    'survey.title': 'استبيان الألواح الصحية',
    'survey.lead': 'استبيان دقيقتين لمشروع تسويق جامعي عن الألواح الصحية في الكويت. بدون أسماء، والمشاركة اختيارية لمن عمرهم 18 سنة أو أكثر.',
    'survey.qrAlt': 'رمز QR يفتح هذا الاستبيان',
    'survey.qrCap': 'امسح الرمز وافتح الاستبيان من تلفونك، أو أرسله لربعك اللي يتمرنون.',
    'survey.wait': 'الاستبيان يفتح قريباً. امسح الرمز أو ارجع لنا بعد يوم.',
    'results.title': 'نتائج الاستبيان مباشرة',
    'results.lead': 'مجاميع بس، بدون أسماء. تتحدّث كل كم دقيقة. عيّنة متاحة من البالغين 18 سنة وأكثر في الكويت.',
    'results.jump': 'شوف النتائج مباشرة',
    'foot.sign': 'مرحلتين. هدف واحد.',
    'made.kw': 'صُنع في الكويت، من تمر كويتي',
    'dates.p4': 'صُنع في الكويت',
    'dates.p4t': 'يُخلط ويُكبس ويُغلّف عند مصنع أغذية مرخّص في الكويت. التمر كويتي، والأرز المنفوخ وبروتين مصل الحليب والقهوة والكاكاو مستوردة، فما نقول «كويتي 100%».',
    'faq.q8': 'فيه كافيين؟',
    'faq.a8': 'إي، من القهوة في لوح PRE: حوالي 60 ملغ في جيم وحوالي 35 ملغ في لايف، أقل من كوب قهوة عادي. مكتوب على الملصق، ومو مناسب للأطفال أو خلال الحمل. لوح POST ما فيه قهوة.',
    'faq.q7': 'وين ينصنع DUAL FUEL؟',
    'faq.a7': 'في الكويت، عند مصنع أغذية مرخّص يشتغل على وصفتنا. التمر من مزارع كويتية، والأرز المنفوخ وبروتين مصل الحليب والقهوة والكاكاو مستوردة.',
    'foot.demo': 'DUAL FUEL منتج تجريبي مصمم لمشروع تسويق جامعي، وغير معروض للبيع. الأسعار والدفعات والطلبات في هذي الصفحة للعرض فقط.',
    'foot.campaign': 'شوف حملة «لحظتين» التسويقية',
    'foot.credit': 'تصميم وتنفيذ',
    'badge.text': 'مشروع تجريبي من Q8Pixel',
    'badge.aria': 'مشروع تجريبي من Q8Pixel — زُر Q8Pixel'
  };

  var EN = {}; // captured from the markup on first switch
  var T = {
    en: {
      tearOpen: 'Tear it open', tearClose: 'Close the pack', tear: 'Tear here',
      kwd: function (n) { return 'KWD ' + n.toFixed(3); },
      batchEmpty: 'Type a batch code first. It looks like DF-2611-03.',
      batchBad: function (c) { return 'There is no batch ' + c + '. Check the code next to the tear line; it looks like DF-2611-03.'; },
      done: function (q, p, t) { return 'Demo order placed: ' + q + ' × ' + p + ', total ' + t + '. Nothing was charged or sent.'; },
      demo: 'Sample data: DUAL FUEL is a concept, so this batch is invented.',
      rows: ['Pack', 'Made', 'Dates from', 'Surplus dates in this batch', 'Packs in this batch', 'Packaging per pack', 'Two single bars would use']
    },
    ar: {
      tearOpen: 'افتح العلبة', tearClose: 'أغلق العلبة', tear: 'اقطع هنا',
      kwd: function (n) { return n.toFixed(3) + ' د.ك'; },
      batchEmpty: 'اكتب رمز الدفعة أول. شكله مثل DF-2611-03.',
      batchBad: function (c) { return 'ما في دفعة برمز ' + c + '. راجع الرمز جنب خط القطع؛ شكله مثل DF-2611-03.'; },
      done: function (q, p, t) { return 'انرسل طلب تجريبي: ' + q + ' × ' + p + '، المجموع ' + t + '. ما انخصم شي وما انرسل شي.'; },
      demo: 'بيانات تجريبية: DUAL FUEL منتج تجريبي، فهذي الدفعة متخيّلة.',
      rows: ['العلبة', 'تاريخ الإنتاج', 'مصدر التمر', 'التمر الفائض في الدفعة', 'عدد العلب في الدفعة', 'التغليف لكل علبة', 'لوحين منفصلين يحتاجون']
    }
  };
  var lang = html.lang === 'ar' ? 'ar' : 'en';

  /* The survey is a Google Form. Paste its embed link here (the src="..." from Send → <> in Google Forms);
     until then the section shows a "opens soon" note. */
  var FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf7wL15rMqIlyYaSFuC92vv39-qW91BKxfSuQhWiJV60y0jxw/viewform?embedded=true';

  /* Live survey results: paste the Apps Script web-app link here (Deploy → Web app → the URL ending in /exec).
     It returns anonymous totals only. While it is empty the #results section stays hidden and nothing is fetched.
     TEST HOOK: window.DF_RESULTS_URL, when set before this file runs, is used instead of RESULTS_URL.
     QA sets it with Playwright's page.addInitScript(() => { window.DF_RESULTS_URL = '...' }); the live site never sets it. */
  var RESULTS_URL = '';
  var t = function () { return T[lang]; };

  function applyLang(l) {
    lang = l;
    html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in EN)) EN[k] = el.innerHTML;
      el.innerHTML = l === 'ar' && AR[k] ? AR[k] : EN[k];
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0], k = p[1], ek = attr + '|' + k;
        if (!(ek in EN)) EN[ek] = el.getAttribute(attr);
        el.setAttribute(attr, l === 'ar' && AR[k] ? AR[k] : EN[ek]);
      });
    });
    var btn = $('[data-lang-toggle]');
    btn.textContent = l === 'ar' ? 'English' : 'عربي';
    btn.setAttribute('lang', l === 'ar' ? 'en' : 'ar');
    doc.title = l === 'ar' ? 'DUAL FUEL — طاقة قبل، وتعويض بعد · مشروع تجريبي من Q8Pixel' : 'DUAL FUEL — Fuel before. Refuel after. · Concept by Q8Pixel';
    setTearLabel();
    updateTotal();
    if (lastBatch) showBatch(lastBatch);
    if (lastDone) showDone(lastDone);
    html.classList.remove('i18n-pending');
  }
  $('[data-lang-toggle]').addEventListener('click', function () {
    var l = lang === 'ar' ? 'en' : 'ar';
    store.set('duofuel-lang', l);
    applyLang(l);
  });
  // the toggle above calls applyLang by name, so a later wrapper (vote counts) takes effect

  /* ------------------------------------------------------------------
     Gym / Life
     ------------------------------------------------------------------ */
  var variant = store.get('duofuel-variant') === 'life' ? 'life' : 'gym';
  function setVariant(v, opts) {
    variant = v;
    doc.body.dataset.variant = v;
    store.set('duofuel-variant', v);
    $$('input[name="variant"]').forEach(function (r) { r.checked = r.value === v; });
    $$('.range-item').forEach(function (a) { a.classList.toggle('is-current', a.classList.contains('range-' + v)); });
    var plan = $('input[name="plan"]:checked');
    if (!opts || opts.syncPlan !== false) {
      var want = plan && /Week$/.test(plan.value) ? v + 'Week' : v;
      var r = $('input[name="plan"][value="' + want + '"]');
      if (r) r.checked = true;
      updateTotal();
    }
  }
  $$('input[name="variant"]').forEach(function (r) { r.addEventListener('change', function () { setVariant(r.value); }); });
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      setVariant(b.getAttribute('data-pick'));
      var o = $('#order'); if (o) o.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      var c = $('input[name="plan"]:checked'); if (c) setTimeout(function () { c.focus({ preventScroll: true }); }, 450);
    });
  });

  /* ------------------------------------------------------------------
     The tear line
     ------------------------------------------------------------------ */
  var pack = $('[data-pack]'), tearBtn = $('[data-tear]');
  function setTearLabel() {
    var torn = pack.classList.contains('is-torn');
    tearBtn.setAttribute('aria-label', torn ? t().tearClose : t().tearOpen);
    $('.tear-label', tearBtn).textContent = torn ? t().tearClose : t().tear;
  }
  tearBtn.addEventListener('click', function () {
    var torn = pack.classList.toggle('is-torn');
    tearBtn.setAttribute('aria-pressed', torn ? 'true' : 'false');
    setTearLabel();
  });

  /* ------------------------------------------------------------------
     Batch lookup (demo data)
     ------------------------------------------------------------------ */
  var BATCHES = {
    'DF-2611-03': { pack: 'DUAL FUEL Gym', made: { en: '3 Nov 2026', ar: '3 نوفمبر 2026' }, from: { en: 'Surplus Khalas and Sukkari, Al-Wafra farms', ar: 'خلاص وسكري فائض، مزارع الوفرة' }, kg: '1,240 kg', packs: '31,000', pkg: '7.6 g', two: '9.8 g' },
    'DF-2611-07': { pack: 'DUAL FUEL Life', made: { en: '7 Nov 2026', ar: '7 نوفمبر 2026' }, from: { en: 'Surplus Khalas, Al-Abdali farms', ar: 'خلاص فائض، مزارع العبدلي' }, kg: '410 kg', packs: '18,500', pkg: '5.9 g', two: '8.1 g' }
  };
  var batchForm = $('[data-batch]'), batchInput = $('#batch-code'), batchErr = $('#batch-error'), batchOut = $('[data-batch-result]');
  var lastBatch = null;
  function showBatch(code) {
    var b = BATCHES[code], L = t();
    var vals = [b.pack, b.made[lang], b.from[lang], b.kg, b.packs, b.pkg, b.two];
    batchOut.innerHTML = '<dl>' + L.rows.map(function (r, i) { return '<div><dt>' + r + '</dt><dd><bdi>' + vals[i] + '</bdi></dd></div>'; }).join('') + '</dl><p class="demo-note">' + L.demo + '</p>';
    batchOut.hidden = false;
  }
  function checkBatch() {
    var code = batchInput.value.trim().toUpperCase().replace(/\s+/g, '');
    batchErr.hidden = true; batchInput.removeAttribute('aria-invalid');
    if (!code) { batchErr.textContent = t().batchEmpty; batchErr.hidden = false; batchInput.setAttribute('aria-invalid', 'true'); batchOut.hidden = true; lastBatch = null; return; }
    if (!BATCHES[code]) { batchErr.textContent = t().batchBad(code); batchErr.hidden = false; batchInput.setAttribute('aria-invalid', 'true'); batchOut.hidden = true; lastBatch = null; return; }
    batchInput.value = code; lastBatch = code; showBatch(code);
  }
  batchForm.addEventListener('submit', function (e) { e.preventDefault(); checkBatch(); });
  $('[data-batch-sample]').addEventListener('click', function () { batchInput.value = 'DF-2611-03'; checkBatch(); });

  /* ------------------------------------------------------------------
     Demo order
     ------------------------------------------------------------------ */
  var PRICES = { gym: 1.5, life: 1.25, gymWeek: 6.75, lifeWeek: 5.625 };
  var NAMES = {
    en: { gym: 'DUAL FUEL Gym', life: 'DUAL FUEL Life', gymWeek: 'Gym Week Pack', lifeWeek: 'Life Week Pack' },
    ar: { gym: 'DUAL FUEL جيم', life: 'DUAL FUEL لايف', gymWeek: 'باقة جيم الأسبوعية', lifeWeek: 'باقة لايف الأسبوعية' }
  };
  var form = $('[data-order]'), qtyOut = $('[data-qty]'), totalOut = $('[data-total]'), done = $('[data-done]');
  var qty = 1, lastDone = null;
  function total() {
    var p = $('input[name="plan"]:checked').value;
    return PRICES[p] * qty + ($('#pickup').value === 'home' ? 0.5 : 0);
  }
  function updateTotal() {
    if (!totalOut) return;
    qtyOut.textContent = qty;
    $('[data-step="-1"]').disabled = qty <= 1;
    $('[data-step="1"]').disabled = qty >= 10;
    totalOut.textContent = t().kwd(total());
  }
  $$('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () { qty = Math.min(10, Math.max(1, qty + Number(b.getAttribute('data-step')))); updateTotal(); });
  });
  $$('input[name="plan"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var v = /^life/.test(r.value) ? 'life' : 'gym';
      if (v !== variant) setVariant(v, { syncPlan: false });
      updateTotal();
    });
  });
  $('#pickup').addEventListener('change', updateTotal);
  function showDone(d) {
    $('[data-done-text]').textContent = t().done(d.qty, NAMES[lang][d.plan], t().kwd(d.total));
    done.hidden = false;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    lastDone = { qty: qty, plan: $('input[name="plan"]:checked').value, total: total() };
    showDone(lastDone);
    done.focus();
  });
  $('[data-again]').addEventListener('click', function () {
    done.hidden = true; lastDone = null; qty = 1; updateTotal();
    var c = $('input[name="plan"]:checked'); if (c) c.focus();
  });

  /* ------------------------------------------------------------------
     Flavour vote (demo: the vote lives only in this browser)
     ------------------------------------------------------------------ */
  var voted = store.get('duofuel-vote');
  var voteMsg = $('[data-vote-msg]');
  var VT = {
    en: { pick: 'Pick a flavour first.', thanks: function (f) { return 'Thanks — your vote for ' + f + ' is saved (demo: it stays in this browser).'; }, mine: 'Your vote' },
    ar: { pick: 'اختر نكهة أول.', thanks: function (f) { return 'شكراً — انحفظ صوتك لـ ' + f + ' (تجريبي: يبقى في هذا المتصفح بس).'; }, mine: 'صوتك' }
  };
  function drawVotes() {
    $$('[data-n]').forEach(function (el) {
      el.textContent = voted === el.getAttribute('data-n') ? VT[lang].mine : '';
    });
  }
  $('[data-vote]').addEventListener('submit', function (e) {
    e.preventDefault();
    var c = $('input[name="flavour"]:checked');
    if (!c) { voteMsg.textContent = VT[lang].pick; return; }
    voted = c.value; store.set('duofuel-vote', voted); drawVotes();
    voteMsg.textContent = VT[lang].thanks(c.parentNode.querySelector('[data-i18n]').textContent);
  });
  var _apply = applyLang;
  applyLang = function (l) { _apply(l); drawVotes(); voteMsg.textContent = ''; };

  /* ------------------------------------------------------------------
     Survey embed
     ------------------------------------------------------------------ */
  (function () {
    var box = $('[data-survey]');
    if (!box || !FORM_URL) return;
    var f = doc.createElement('iframe');
    f.src = FORM_URL + (FORM_URL.indexOf('embedded=true') < 0 ? (FORM_URL.indexOf('?') < 0 ? '?' : '&') + 'embedded=true' : '');
    f.title = 'DUAL FUEL survey';
    f.loading = 'lazy';
    f.className = 'survey-iframe';
    var wait = $('[data-survey-wait]', box); if (wait) wait.hidden = true;
    box.appendChild(f);
  })();

  /* ------------------------------------------------------------------
     Live survey results: anonymous totals from the Apps Script web app.
     Every value from the JSON reaches the page through textContent only.
     ------------------------------------------------------------------ */
  (function () {
    var sec = $('[data-results]');
    var src = typeof window.DF_RESULTS_URL === 'string' && window.DF_RESULTS_URL ? window.DF_RESULTS_URL : RESULTS_URL;
    src = String(src || '').trim();
    if (!/^https:\/\/[^\s"'<>]+$/i.test(src) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/[^\s"'<>]*$/i.test(src)) src = '';
    if (!sec || !src) return; // no link yet: the section stays hidden and nothing is fetched

    var RT = {
      en: {
        loading: 'Loading the latest totals…',
        error: 'Results are not available right now.',
        wait: 'Results appear after {min} responses. So far: {n}.',
        people: 'respondents aged 18+',
        updated: 'Updated {t}',
        now: 'just now',
        mins: function (m) { return m + ' min ago'; },
        hrs: function (h) { return h + ' h ago'; },
        span: 'responses {a} – {b}',
        spanOne: 'responses on {a}',
        of: '{c} of {a}',
        answered: '{a} answered',
        q: 'Q{n}',
        k1: 'find the two-bar pack appealing',
        k2: 'would likely try it',
        k3: 'would pay {p} or more',
        k3note: 'Our prices: Life {l}, Gym {g}',
        k4: 'say surplus dates make it more attractive (yes or maybe)',
        key: 'Orange bars below are the answers counted in these four figures. Percentages are of the people who answered each question.',
        more: 'Show all questions',
        less: 'Show fewer questions',
        kwd: function (s) { return 'KWD ' + s; },
        locale: 'en-GB'
      },
      ar: {
        loading: 'جاري تحميل آخر الأرقام…',
        error: 'النتائج مو متوفرة الحين.',
        wait: 'النتائج تطلع بعد ما توصل الردود {min}. لين الحين: {n}.',
        people: 'مشارك عمرهم 18 سنة أو أكثر',
        updated: 'آخر تحديث {t}',
        now: 'قبل شوي',
        mins: function (m) { return 'قبل ' + arCount(m, 'دقيقة', 'دقيقتين', 'دقايق', 'دقيقة'); },
        hrs: function (h) { return 'قبل ' + arCount(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة'); },
        span: 'الردود من {a} إلى {b}',
        spanOne: 'الردود يوم {a}',
        of: '{c} من {a}',
        answered: 'عدد اللي جاوبوا: {a}',
        q: 'س{n}',
        k1: 'تعجبهم فكرة العلبة باللوحين',
        k2: 'غالباً بيجربونها',
        k3: 'يدفعون {p} أو أكثر',
        k3note: 'أسعارنا: لايف {l}، جيم {g}',
        k4: 'التمر الفائض يخليها أجذب لهم (نعم أو يمكن)',
        key: 'الأعمدة البرتقالية تحت هي الإجابات المحسوبة في هالأرقام الأربعة. النسب من عدد اللي جاوبوا على كل سؤال.',
        more: 'اعرض كل الأسئلة',
        less: 'اعرض أسئلة أقل',
        kwd: function (s) { return s + ' د.ك'; },
        locale: 'ar-KW-u-nu-latn'
      }
    };
    function arCount(n, one, two, few, many) { return n === 1 ? one : n === 2 ? two : n + ' ' + (n <= 10 ? few : many); }

    // the four headline figures: which question and which choices (0-based, in form order) they add up
    var KPIS = [
      { q: 8, idx: [0, 1], label: 'k1' },   // very + somewhat appealing
      { q: 13, idx: [0, 1], label: 'k2' },  // very + somewhat likely to try
      { q: 10, idx: [3, 4, 5], label: 'k3', note: true }, // KWD 1.250–1.499, 1.500–1.999, 2.000+
      { q: 12, idx: [0, 1], label: 'k4' }   // yes + maybe
    ];
    var KEY = {}; KPIS.forEach(function (k) { KEY[k.q] = k.idx; });
    var MAIN = [8, 13, 10, 12, 6, 4, 9], MORE = [1, 2, 3, 5, 7, 11];

    var statusEl = $('[data-results-status]', sec), bodyEl = $('[data-results-body]', sec);
    var state = 'loading', data = null, moreOpen = false;

    /* ---- defensive reading of the JSON: known fields only, numbers clamped, strings trimmed ---- */
    function int(v, max) { v = Math.floor(Number(v)); return isFinite(v) ? Math.min(Math.max(v, 0), max) : 0; }
    function str(v, max) { return typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max) : ''; }
    function when(v) { if (typeof v !== 'string' || v.length > 40) return null; var d = new Date(v); return isNaN(d.getTime()) ? null : d; }
    function clean(raw) {
      if (!raw || typeof raw !== 'object' || raw.ok !== true) return null;
      var n = int(raw.n, 1e6), minN = int(raw.min_n, 1e6);
      var out = { n: n, minN: minN, hidden: raw.hidden === true || n < minN, updated: when(raw.updated), first: when(raw.first), last: when(raw.last), q: {}, nums: [] };
      if (out.hidden || !Array.isArray(raw.questions)) return out;
      raw.questions.slice(0, 40).forEach(function (q) {
        if (!q || typeof q !== 'object') return;
        var num = int(q.num, 99);
        if (!num || out.q[num]) return;
        var answered = int(q.answered, 1e6);
        var choices = (Array.isArray(q.choices) ? q.choices.slice(0, 24) : []).map(function (c) {
          c = c && typeof c === 'object' ? c : {};
          var en = str(c.en, 160), ar = str(c.ar, 160);
          return { en: en || ar, ar: ar || en, count: Math.min(int(c.count, 1e6), answered) };
        }).filter(function (c) { return c.en; });
        out.q[num] = { num: num, en: str(q.title_en, 400), ar: str(q.title_ar, 400), answered: answered, choices: choices };
        out.nums.push(num);
      });
      return out;
    }
    function pct(c, a) { return a > 0 ? Math.min(100, Math.max(0, Math.round(100 * c / a))) : 0; }
    function share(num, idx) {
      var q = data.q[num];
      if (!q || !q.answered) return null;
      var c = 0;
      idx.forEach(function (i) { if (q.choices[i]) c += q.choices[i].count; });
      c = Math.min(c, q.answered);
      return { c: c, a: q.answered, p: pct(c, q.answered) };
    }

    /* ---- DOM helpers (createElement + textContent only) ---- */
    function mk(tag, cls, text) { var e = doc.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = String(text); return e; }
    // "{key}" in a template becomes a <bdi>, so numbers, prices and dates stay readable inside Arabic text
    function fill(el, tpl, vals) {
      tpl.split(/(\{\w+\})/).forEach(function (part) {
        var m = /^\{(\w+)\}$/.exec(part);
        if (m && Object.prototype.hasOwnProperty.call(vals, m[1])) el.appendChild(mk('bdi', null, vals[m[1]]));
        else if (part) el.appendChild(doc.createTextNode(part));
      });
      return el;
    }
    function dirOf(s) { return /[؀-ۿ]/.test(s) ? 'rtl' : 'ltr'; }
    function fmtDate(d, withYear) {
      var o = { day: 'numeric', month: 'short', timeZone: 'Asia/Kuwait' };
      if (withYear) o.year = 'numeric';
      // non-breaking spaces so a date never splits across lines on phones
      try { return new Intl.DateTimeFormat(RT[lang].locale, o).format(d).replace(/ /g, ' '); } catch (e) { return d.toISOString().slice(0, 10); }
    }
    function kwDay(d) { return fmtDate(d, true); }
    function ago(d) {
      var L = RT[lang], s = (Date.now() - d.getTime()) / 1000;
      if (s < 60) return L.now;
      if (s < 3600) return L.mins(Math.floor(s / 60));
      if (s < 86400) return L.hrs(Math.floor(s / 3600));
      return kwDay(d);
    }

    function writeUpdated(el) {
      var L = RT[lang];
      el.textContent = '';
      if (data.updated) {
        el.appendChild(mk('span', 'res-live')).setAttribute('aria-hidden', 'true');
        fill(el, L.updated, { t: ago(data.updated) });
      }
      if (data.first && data.last) {
        if (data.updated) el.appendChild(doc.createTextNode(' · '));
        if (kwDay(data.first) === kwDay(data.last)) fill(el, L.spanOne, { a: kwDay(data.last) });
        else fill(el, L.span, { a: fmtDate(data.first, data.first.getUTCFullYear() !== data.last.getUTCFullYear()), b: kwDay(data.last) });
      }
    }

    function card(num) {
      var q = data.q[num], L = RT[lang];
      if (!q || !q.choices.length) return null;
      var art = mk('article', 'res-q'), head = mk('div', 'res-qhead');
      head.appendChild(mk('span', 'res-qnum', L.q.replace('{n}', num)));
      head.appendChild(mk('h3', null, (lang === 'ar' ? q.ar || q.en : q.en || q.ar) || L.q.replace('{n}', num)));
      art.appendChild(head);
      var list = mk('ul', 'res-bars'), key = KEY[num] || [];
      q.choices.forEach(function (c, i) {
        var p = pct(c.count, q.answered), text = lang === 'ar' ? c.ar : c.en;
        var li = mk('li', 'rb-row' + (key.indexOf(i) >= 0 ? ' is-key' : ''));
        var top = mk('div', 'rb-head'), label = mk('bdi', 'rb-label', text), val = mk('span', 'rb-val');
        label.dir = dirOf(text);
        val.appendChild(mk('bdi', 'rb-pct', p + '%'));
        val.appendChild(mk('bdi', 'rb-n', '(' + c.count + ')'));
        top.appendChild(label); top.appendChild(val);
        var track = mk('div', 'rb-track'), bar = mk('div', 'rb-fill');
        track.setAttribute('aria-hidden', 'true');
        bar.style.setProperty('--w', p + '%');
        track.appendChild(bar);
        li.appendChild(top); li.appendChild(track);
        list.appendChild(li);
      });
      art.appendChild(list);
      art.appendChild(fill(mk('p', 'res-ans'), L.answered, { a: q.answered }));
      return art;
    }

    function grid(nums, id) {
      var g = mk('div', 'res-grid');
      if (id) g.id = id;
      nums.forEach(function (n) { var c = card(n); if (c) g.appendChild(c); });
      return g.childNodes.length ? g : null;
    }

    function render() {
      var L = RT[lang];
      statusEl.textContent = ''; bodyEl.textContent = '';
      statusEl.className = 'results-status';
      statusEl.hidden = false;
      sec.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
      if (state === 'loading') { statusEl.textContent = L.loading; return; }
      if (state === 'error') { statusEl.textContent = L.error; statusEl.classList.add('is-error'); return; }
      if (data.hidden) { fill(statusEl, L.wait, { min: data.minN, n: data.n }); statusEl.classList.add('is-wait'); return; }
      statusEl.hidden = true;

      var meta = mk('div', 'res-meta'), count = mk('p', 'res-count');
      count.appendChild(mk('bdi', 'res-n', data.n));
      count.appendChild(mk('span', null, L.people));
      meta.appendChild(count);
      var upd = mk('p', 'res-updated');
      upd.setAttribute('data-results-updated', '');
      writeUpdated(upd);
      meta.appendChild(upd);
      bodyEl.appendChild(meta);

      var kpis = mk('ul', 'res-kpis');
      KPIS.forEach(function (k) {
        var s = share(k.q, k.idx), li = mk('li', 'res-kpi');
        li.appendChild(mk('bdi', 'kpi-val', s ? s.p + '%' : '–'));
        li.appendChild(fill(mk('p', 'kpi-label'), L[k.label], { p: L.kwd('1.250') }));
        if (k.note) li.appendChild(fill(mk('p', 'kpi-note'), L.k3note, { l: L.kwd('1.250'), g: L.kwd('1.500') }));
        var sub = mk('p', 'kpi-sub');
        if (s) { fill(sub, L.of, { c: s.c, a: s.a }); sub.appendChild(doc.createTextNode(' · ')); }
        sub.appendChild(mk('bdi', null, L.q.replace('{n}', k.q)));
        li.appendChild(sub);
        kpis.appendChild(li);
      });
      bodyEl.appendChild(kpis);
      bodyEl.appendChild(mk('p', 'fine res-key', L.key));

      var main = grid(MAIN);
      if (main) bodyEl.appendChild(main);
      var rest = MORE.concat(data.nums.filter(function (n) { return MAIN.indexOf(n) < 0 && MORE.indexOf(n) < 0; }));
      var extra = grid(rest, 'res-more');
      if (extra) {
        var btn = mk('button', 'btn btn-line res-toggle', moreOpen ? L.less : L.more);
        btn.type = 'button';
        btn.setAttribute('aria-controls', 'res-more');
        btn.setAttribute('aria-expanded', moreOpen ? 'true' : 'false');
        extra.hidden = !moreOpen;
        btn.addEventListener('click', function () {
          moreOpen = !moreOpen;
          extra.hidden = !moreOpen;
          btn.textContent = moreOpen ? RT[lang].less : RT[lang].more;
          btn.setAttribute('aria-expanded', moreOpen ? 'true' : 'false');
        });
        bodyEl.appendChild(btn);
        bodyEl.appendChild(extra);
      }
    }

    /* ---- loading: fetch first (Apps Script allows CORS after its redirect), JSONP if that fails ---- */
    function getJSON(url) {
      return new Promise(function (resolve, reject) {
        if (!window.fetch) { reject(new Error('no fetch')); return; }
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); reject(new Error('timeout')); }, 10000);
        fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        }).then(function (j) { clearTimeout(timer); resolve(j); }, function (e) { clearTimeout(timer); reject(e); });
      });
    }
    var jsonpSeq = 0;
    function getJSONP(url) {
      return new Promise(function (resolve, reject) {
        var name = 'dfResults_' + Date.now().toString(36) + '_' + (jsonpSeq++), s = doc.createElement('script'), settled = false, timer;
        function finish(err, val) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          window[name] = function () {}; // a late reply must not throw
          setTimeout(function () { try { delete window[name]; } catch (e) { window[name] = undefined; } }, 30000);
          if (s.parentNode) s.parentNode.removeChild(s);
          if (err) reject(err); else resolve(val);
        }
        window[name] = function (j) { finish(null, j); };
        s.onerror = function () { finish(new Error('jsonp failed')); };
        s.onload = function () { finish(new Error('no callback')); }; // runs after the script, so only when it never called back
        timer = setTimeout(function () { finish(new Error('timeout')); }, 10000);
        s.async = true;
        s.src = url + (url.indexOf('?') < 0 ? '?' : '&') + 'callback=' + name;
        doc.head.appendChild(s);
      });
    }
    function load(isRefresh) {
      getJSON(src).then(null, function () { return getJSONP(src); }).then(function (raw) {
        var d = clean(raw);
        if (!d) throw new Error('bad data');
        data = d; state = 'ready'; render();
      }).catch(function () {
        if (!isRefresh || !data) { state = 'error'; render(); } // a failed refresh keeps the last good totals
      });
    }

    sec.hidden = false;
    var jump = $('[data-results-link]'); if (jump) jump.hidden = false;
    // bars grow in when the section first scrolls into view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { sec.classList.add('is-shown'); io.disconnect(); }
      }, { rootMargin: '0px 0px -10% 0px' });
      io.observe(sec);
    } else sec.classList.add('is-shown');

    var prevApply = applyLang;
    applyLang = function (l) { prevApply(l); render(); }; // labels switch language without a refetch
    render();
    load(false);
    setInterval(function () { if (!doc.hidden) load(true); }, 5 * 60 * 1000);
    setInterval(function () { var u = $('[data-results-updated]', sec); if (u && data && state === 'ready') writeUpdated(u); }, 60 * 1000);
  })();

  setVariant(variant);
  applyLang(lang);
})();
