/* DUOFUEL — concept product site by Q8Pixel.
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
    'brand.home': 'DUOFUEL، العودة إلى الأعلى',
    'nav.label': 'التنقل الرئيسي',
    'nav.range': 'جيم أو لايف',
    'nav.day': 'يومك',
    'nav.inside': 'داخل العلبة',
    'nav.dates': 'التمر',
    'nav.order': 'الأسعار',
    'cta.order': 'اطلب علبة',
    'hero.title': 'DUOFUEL: طاقة قبل، وتعويض بعد',
    'hero.pre1': 'طاقة',
    'hero.pre2': 'قبل.',
    'hero.post1': 'وتعويض',
    'hero.post2': 'بعد.',
    'hero.preNote': 'تمر وشوفان، قبل التمرين بـ 30 إلى 60 دقيقة.',
    'hero.preNoteLife': 'لقمة خفيفة من التمر والشوفان قبل المشي أو الحصة أو عصرية طويلة.',
    'hero.postNote': 'بروتين و3 غ كرياتين، أول ما تخلص التمرين.',
    'hero.postNoteLife': '10 غ بروتين بدل الحلو، بحوالي 115 سعرة.',
    'var.label': 'اختر العلبة',
    'var.gymSub': 'للتمرين القوي',
    'var.lifeSub': 'ليوم أخف',
    'pack.preSub': 'طاقة · 30 غ كربوهيدرات',
    'pack.preSubLife': 'تمر + شوفان · 95 سعرة',
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
    'range.gymAlt': 'علبة DUOFUEL جيم بغلاف أسود في يد لابسة قفاز داخل نادي',
    'range.gymFor': 'لمن يرفع أوزان أو يركض أو يلعب بقوة ثلاث مرات أو أكثر في الأسبوع.',
    'range.lifeAlt': 'علبة DUOFUEL لايف بغلاف ورق كرافت جنب تمر وشوفان ولوز وشوكولاتة داكنة',
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
    'f.ingr': 'المكونات:',

    'day.title': 'علبة واحدة، وتمرين مسائي واحد',
    'day.titleLife': 'علبة واحدة، ويوم مزحوم واحد',
    'day.lead': 'تمرين عادي بعد الدوام في الكويت، من مكتب النادي إلى سلة المهملات.',
    'day.leadLife': 'يوم دوام وآخره مشي، بدون ما تمد يدك على الحلو.',
    'day.s1': 'خذ علبة',
    'day.s1t': 'من مكتب الاستقبال في النادي، أو من باقتك الأسبوعية في البيت.',
    'day.s2': 'اقطع وكُل PRE',
    'day.s2t': 'اقطع على الخط. اللوح البرتقالي يعطيك 30 غ كربوهيدرات سريعة من التمر والشوفان.',
    'day.s3': 'تمرّن',
    'day.s3t': 'POST يبقى مغلّق في نصّه من الغلاف، في شنطتك.',
    'day.s4': 'كُل POST',
    'day.s4t': '20 غ بروتين و3 غ كرياتين يومي، في لوح واحد.',
    'day.s5': 'ارمِ الغلاف',
    'day.s5t': 'غلاف واحد، بدون علبة وبدون غلاف ثاني.',
    'day.l1': 'العلبة في شنطتك',
    'day.l1t': 'أخذتها مع أغراض الجمعية.',
    'day.l2': 'PRE مع قهوتك',
    'day.l2t': '95 سعرة من التمر والشوفان توصّلك للغدا.',
    'day.l3': 'مشي أو بادل أو حصة',
    'day.l3t': 'POST ينتظر مغلّق في نصّه من الغلاف.',
    'day.l4': 'POST بدل الحلو',
    'day.l4t': '10 غ بروتين بحوالي 115 سعرة.',

    'inside.title': 'داخل علبة جيم',
    'inside.titleLife': 'داخل علبة لايف',
    'inside.preH': 'قبل',
    'inside.preText': 'طري وسهل الهضم. مصنوع من تمر سليم كان أصغر أو فيه علامات تمنع بيعه كفاكهة.',
    'inside.preIngr': 'تمر فائض، شوفان، زبدة لوز، ملح بحري.',
    'inside.postH': 'بعد',
    'inside.postText': 'كثيف وداكن وغني بالكاكاو. بروتين في الوقت اللي يحتاجه جسمك، ومعه الكرياتين اللي كثير من الرياضيين ياخذونه بودرة.',
    'inside.postIngr': 'بروتين مصل الحليب، شوكولاتة داكنة، لوز، كرياتين مونوهيدرات.',
    'inside.postIngrLife': 'بروتين مصل الحليب، شوكولاتة داكنة، لوز.',
    'inside.fine': 'يحتوي على حليب وشوفان (جلوتين) ولوز. القيم أهداف أولية للنموذج، والقيم النهائية بعد فحص المختبر. ليس بديلاً عن وجبة.',

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
    'order.lead': 'لوح تمر ولوح بروتين، كل واحد بروحه، يكلفون حوالي 2.026 د.ك في رفوف الكويت. DUOFUEL يغطي اللحظتين بأقل.',
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
    'vote.f2': 'شوكولاتة وقهوة عربية (POST)',
    'vote.f3': 'تمر وزعفران (PRE)',
    'vote.f4': 'فانيلا وكراميل التمر (POST)',
    'vote.go': 'أرسل صوتي',
    'ff.title': 'علب خالية من مسببات الحساسية، في خطة السنة الثانية والثالثة',
    'ff.g': 'خالي من الجلوتين',
    'ff.gOut': 'الشوفان العادي',
    'ff.gIn': 'شوفان معتمد خالي من الجلوتين أو أرز منفوخ',
    'ff.l': 'خالي من اللاكتوز',
    'ff.lOut': 'بروتين مصل الحليب',
    'ff.lIn': 'بروتين البازلاء والأرز',
    'ff.n': 'خالي من المكسرات',
    'ff.nOut': 'اللوز',
    'ff.nIn': 'زبدة بذور دوار الشمس وبذور اليقطين',
    'ff.rule': 'ما نكتب «خالي من» على أي علبة إلا إذا انصنعت على خط إنتاج منفصل ونظيف، وكل دفعة نجحت في فحوصات المختبر للجلوتين والحليب والمكسرات.',
    'faq.q6': 'عندي حساسية. أقدر آكل DUOFUEL؟',
    'faq.a6': 'مو الحين: العلبتين فيها حليب وشوفان (جلوتين) ولوز، ومكتوب على الملصق. النسخ الخالية من الجلوتين واللاكتوز والمكسرات في خطة السنة الثانية والثالثة.',
    'foot.sign': 'مرحلتين. هدف واحد.',
    'made.kw': 'صُنع في الكويت، من تمر كويتي',
    'dates.p4': 'صُنع في الكويت',
    'dates.p4t': 'يُخلط ويُخبز ويُغلّف عند مصنع أغذية مرخّص في الكويت. التمر كويتي، وبروتين مصل الحليب والكاكاو مستوردين، فما نقول «كويتي 100%».',
    'faq.q7': 'وين ينصنع DUOFUEL؟',
    'faq.a7': 'في الكويت، عند مصنع أغذية مرخّص يشتغل على وصفتنا. التمر من مزارع كويتية، وبروتين مصل الحليب والكاكاو مستوردين.',
    'foot.demo': 'DUOFUEL منتج تجريبي مصمم لمشروع تسويق جامعي، وغير معروض للبيع. الأسعار والدفعات والطلبات في هذي الصفحة للعرض فقط.',
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
      demo: 'Sample data: DUOFUEL is a concept, so this batch is invented.',
      rows: ['Pack', 'Made', 'Dates from', 'Surplus dates in this batch', 'Packs in this batch', 'Packaging per pack', 'Two single bars would use']
    },
    ar: {
      tearOpen: 'افتح العلبة', tearClose: 'أغلق العلبة', tear: 'اقطع هنا',
      kwd: function (n) { return n.toFixed(3) + ' د.ك'; },
      batchEmpty: 'اكتب رمز الدفعة أول. شكله مثل DF-2611-03.',
      batchBad: function (c) { return 'ما في دفعة برمز ' + c + '. راجع الرمز جنب خط القطع؛ شكله مثل DF-2611-03.'; },
      done: function (q, p, t) { return 'انرسل طلب تجريبي: ' + q + ' × ' + p + '، المجموع ' + t + '. ما انخصم شي وما انرسل شي.'; },
      demo: 'بيانات تجريبية: DUOFUEL منتج تجريبي، فهذي الدفعة متخيّلة.',
      rows: ['العلبة', 'تاريخ الإنتاج', 'مصدر التمر', 'التمر الفائض في الدفعة', 'عدد العلب في الدفعة', 'التغليف لكل علبة', 'لوحين منفصلين يحتاجون']
    }
  };
  var lang = html.lang === 'ar' ? 'ar' : 'en';
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
    doc.title = l === 'ar' ? 'DUOFUEL — طاقة قبل، وتعويض بعد · مشروع تجريبي من Q8Pixel' : 'DUOFUEL — Fuel before. Refuel after. · Concept by Q8Pixel';
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
    'DF-2611-03': { pack: 'DUOFUEL Gym', made: { en: '3 Nov 2026', ar: '3 نوفمبر 2026' }, from: { en: 'Surplus Khalas and Sukkari, Al-Wafra farms', ar: 'خلاص وسكري فائض، مزارع الوفرة' }, kg: '1,240 kg', packs: '31,000', pkg: '7.6 g', two: '9.8 g' },
    'DF-2611-07': { pack: 'DUOFUEL Life', made: { en: '7 Nov 2026', ar: '7 نوفمبر 2026' }, from: { en: 'Surplus Khalas, Al-Abdali farms', ar: 'خلاص فائض، مزارع العبدلي' }, kg: '410 kg', packs: '18,500', pkg: '5.9 g', two: '8.1 g' }
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
    en: { gym: 'DUOFUEL Gym', life: 'DUOFUEL Life', gymWeek: 'Gym Week Pack', lifeWeek: 'Life Week Pack' },
    ar: { gym: 'DUOFUEL جيم', life: 'DUOFUEL لايف', gymWeek: 'باقة جيم الأسبوعية', lifeWeek: 'باقة لايف الأسبوعية' }
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

  setVariant(variant);
  applyLang(lang);
})();
