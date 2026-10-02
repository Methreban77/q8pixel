/* Marsa Ember — concept restaurant site by Q8Pixel.
   Vanilla JS: bilingual UI (EN/AR, RTL), hash routes, menu search/filter, live opening status (Kuwait, UTC+3),
   gallery lightbox and a demo-only booking form (nothing is ever sent anywhere). */
(function () {
  'use strict';

  var doc = document;
  var html = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  var session = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ------------------------------------------------------------------
     Arabic for the static markup (English lives in index.html)
     ------------------------------------------------------------------ */
  var AR = {
    'skip': 'انتقل إلى المحتوى',
    'brand.home': 'جمر المرسى، العودة إلى الأعلى',
    'menu.results': 'نتائج البحث',
    'fab.book': 'احجز',
    'brand.name': 'جمر المرسى',
    'brand.sub': 'مشويات وأسماك · الكويت',
    'nav.label': 'التنقل الرئيسي',
    'nav.mobile': 'التنقل',
    'nav.open': 'فتح قائمة التنقل',
    'nav.signature': 'الأطباق المميزة',
    'nav.menu': 'قائمة الطعام',
    'nav.story': 'قصتنا',
    'nav.gallery': 'الأجواء',
    'nav.visit': 'زورونا',
    'cta.book': 'احجز طاولة',
    'cta.menu': 'تصفّح القائمة',
    'cta.whatsapp': 'اطلب عبر واتساب',
    'hero.eyebrow': 'مأكولات بحرية خليجية ومشويات على الفحم · شرق، مدينة الكويت',
    'hero.title': 'حيث يلتقي الخليج<br><em>بالجمر</em>.',
    'hero.lead': 'صيدُ الصباح يُشوى على مهلٍ فوق الفحم الطبيعي، ويُنكَّه باللومي والزعفران وبهارات البيت — على بُعد خطوات من مرسى شرق.',
    'hero.artAlt': 'رسم توضيحي لطبقنا المميز: زبيدي مشوي على الفحم في طبق فخاري داكن مع الطحينة والليمون المشوي والأعشاب والرمان.',
    'hero.noteK': 'طبقنا المميز',
    'hero.scroll': 'انتقل إلى الأطباق المميزة',
    'addr.short': 'شارع الخليج العربي، شرق',
    'addr.full': 'شارع الخليج العربي، شرق، مدينة الكويت',
    'mq.1': 'صيد الصباح كل يوم',
    'mq.2': 'فحم طبيعي',
    'mq.3': 'بهارات خليجية',
    'mq.4': 'جلسات مطلة على البحر',
    'mq.5': 'مجلس عائلي',
    'sig.eyebrow': 'من قلب الجمر',
    'sig.title': 'أطباقنا المميزة',
    'sig.lead': 'أربعة أطباق تختصر هويتنا: صيد الخليج، وحرارة الجمر، والبهارات التي نشأنا عليها.',
    'sig.alt1': 'رسم توضيحي: زبيدي كامل مشوي على الفحم في طبق بيضاوي',
    'sig.alt2': 'رسم توضيحي: مجبوس بالزعفران يعلوه فيليه هامور مقرمش',
    'sig.alt3': 'رسم توضيحي: سيخان من روبيان الخليج المشوي مع الفلفل والليمون الأخضر',
    'sig.alt4': 'رسم توضيحي: كنافة بالزعفران والفستق على صينية نحاسية',
    'sig.find': 'اعرضه في القائمة',
    'cat.grills': 'المشويات',
    'cat.seafood': 'المأكولات البحرية',
    'cat.mezze': 'المقبلات',
    'cat.desserts': 'الحلويات',
    'cat.drinks': 'المشروبات',
    'menu.eyebrow': 'قائمة الطعام',
    'menu.title': 'القائمة كاملة',
    'menu.lead': 'الأسعار بالدينار الكويتي وتشمل الخدمة. اسألوا فريقنا عن صيد اليوم.',
    'menu.searchLabel': 'ابحث في القائمة',
    'menu.searchPh': 'ابحث: روبيان، غنم، كنافة…',
    'menu.clear': 'مسح البحث',
    'menu.filters': 'تصفية حسب النوع',
    'menu.cats': 'أقسام القائمة',
    'menu.note': 'يُرجى إبلاغ فريقنا بأي حساسية غذائية. يعتمد توفّر الأسماك على صيد اليوم.',
    'tag.s': 'حار',
    'tag.v': 'نباتي',
    'tag.n': 'جديد',
    'story.alt': 'رسم توضيحي: سفينة خشبية تقليدية تدخل المرسى عند شروق الشمس',
    'story.eyebrow': 'قصتنا',
    'story.title': 'وُلدنا بين المرسى والجمر',
    'story.p1': 'بدأت حكاية «جمر المرسى» من عادة بسيطة: أن نكون في المرسى ساعة عودة القوارب، فنختار أجود الصيد، ونطهوه كما اعتادت البيوت الكويتية منذ القدم — على جمر الفحم الطبيعي وعلى مهل.',
    'story.p2': 'يحافظ مطبخنا على النكهات الأصيلة — اللومي والزعفران والبزار والهيل — ويقدّمها في مكان دافئ وعصري بجوار البحر، صُمّم لعشاءات العائلة التي تطول ولسهرات الأصدقاء.',
    'story.k1': 'صيد الصباح',
    'story.v1': 'هامور وزبيدي وسبيطي نختارها طازجة كل يوم.',
    'story.k2': 'فحم طبيعي',
    'story.v2': 'نار هادئة ودخان حقيقي، بلا غاز ولا استعجال.',
    'story.k3': 'بهارات خليجية',
    'story.v3': 'خلطة البزار الخاصة بنا، نطحنها في مطبخنا كل أسبوع.',
    'gal.eyebrow': 'الأجواء',
    'gal.title': 'تعالوا للعشاء، وابقوا للسهرة',
    'gal.lead': 'لمحات مرسومة من أجواء المكان. اضغطوا على أي مشهد لرؤيته عن قرب.',
    'gal.1.t': 'صالة الطعام عند الغروب',
    'gal.2.t': 'شوّاية الفحم المفتوحة',
    'gal.3.t': 'الجلسة الخارجية المطلة على البحر',
    'gal.4.t': 'صيد اليوم',
    'gal.5.t': 'مجلس العائلة',
    'gal.6.t': 'قهوة وتمر',
    'visit.eyebrow': 'زورونا',
    'visit.title': 'مقعدكم بجوار البحر بانتظاركم',
    'visit.hours': 'مواعيد العمل',
    'visit.hoursCap': 'مواعيد العمل حسب اليوم بتوقيت الكويت',
    'visit.kitchen': 'يستقبل المطبخ آخر الطلبات قبل الإغلاق بثلاثين دقيقة. جميع المواعيد بتوقيت الكويت.',
    'visit.mapAlt': 'خريطة توضيحية: جمر المرسى على شارع الخليج العربي في منطقة شرق، بجوار المرسى وغرب أبراج الكويت.',
    'visit.location': 'الموقع',
    'visit.a1': 'خدمة صفّ السيارات عند المدخل',
    'visit.a2': 'جلسات عائلية ومجلس خاص',
    'visit.a3': 'مدخل دون درجات ومهيّأ للكراسي المتحركة',
    'visit.maps': 'افتح في الخرائط',
    'visit.newTab': '(يفتح في علامة تبويب جديدة)',
    'map.gulf': 'الخليج العربي',
    'map.marina': 'المرسى',
    'map.towers': 'أبراج الكويت',
    'map.road': 'شارع الخليج العربي',
    'map.sharq': 'شرق',
    'res.eyebrow': 'الحجوزات',
    'res.title': 'احجزوا طاولتكم',
    'res.lead': 'اختاروا التاريخ والوقت، وسنحتفظ بطاولتكم 15 دقيقة بعد موعد الحجز.',
    'res.p1': 'حتى 12 ضيفًا عبر الموقع — اسألونا عن المجلس للمجموعات الأكبر.',
    'res.p2': 'الغداء من الساعة 1:00 م (ومن 2:00 م يوم الجمعة)، والعشاء حتى وقت متأخر.',
    'res.p3': 'تفضّلون التوصيل إلى المنزل؟ راسلونا عبر واتساب.',
    'res.demo': 'نموذج تجريبي — لا يُرسَل أي شيء إلى أي جهة. جرّبوه لتتعرّفوا على خطوات الحجز.',
    'res.date': 'التاريخ',
    'res.guests': 'عدد الضيوف',
    'res.less': 'تقليل عدد الضيوف',
    'res.more': 'زيادة عدد الضيوف',
    'res.guestsHint': 'من 1 إلى 12 ضيفًا',
    'res.time': 'الوقت',
    'res.pickDate': 'اختاروا التاريخ لعرض الأوقات المتاحة.',
    'res.seating': 'مكان الجلوس المفضّل',
    'res.name': 'الاسم الكامل',
    'res.phone': 'رقم النقّال',
    'res.phoneHint': 'رقم كويتي من 8 أرقام',
    'res.occasion': 'المناسبة (اختياري)',
    'res.notes': 'ملاحظات (اختياري)',
    'res.notesPh': 'حساسية غذائية، كرسي أطفال، طاولة بجوار النافذة…',
    'res.submit': 'احجز الطاولة',
    'seat.indoor': 'الصالة الداخلية',
    'seat.terrace': 'الجلسة الخارجية',
    'seat.majlis': 'مجلس العائلة',
    'occ.none': 'بدون مناسبة',
    'occ.birthday': 'عيد ميلاد',
    'occ.anniversary': 'ذكرى الزواج',
    'occ.business': 'عشاء عمل',
    'occ.family': 'تجمّع عائلي',
    'conf.title': 'تم حجز الطاولة — تجريبي',
    'conf.text': 'إليكم ملخص الحجز. بما أن هذا موقع تجريبي، لم يُنشأ أي حجز فعلي ولم تغادر أي بيانات متصفحكم.',
    'conf.sample': 'حجز افتراضي معروض للمعاينة.',
    'conf.edit': 'تعديل الحجز',
    'conf.new': 'حجز جديد',
    'foot.tag': 'مأكولات بحرية خليجية ومشويات على الفحم بجوار المرسى.',
    'foot.explore': 'تصفّح',
    'foot.hours': 'المواعيد',
    'foot.h1': 'السبت – الأربعاء · 12:30 م – 11:30 م',
    'foot.h2': 'الخميس · 12:30 م – 12:30 ص',
    'foot.h3': 'الجمعة · 1:30 م – 12:30 ص',
    'foot.find': 'العنوان',
    'foot.demo': '«جمر المرسى» مطعم خيالي صمّمته Q8Pixel ضمن مشاريعها التجريبية، وليس نشاطًا تجاريًا حقيقيًا؛ فالقائمة والأسعار والقصة والحجوزات لأغراض العرض فقط.',
    'foot.credit': 'تصميم وتطوير',
    'foot.year': '\u200F© 2026 · عمل تجريبي',
    'badge.aria': 'مشروع تجريبي من Q8Pixel — زيارة موقع Q8Pixel',
    'badge.text': 'مشروع تجريبي من Q8Pixel',
    'fab.aria': 'اطلب عبر واتساب (تجريبي)',
    'fab.label': 'اطلب',
    'toast.close': 'إغلاق',
    'lb.close': 'إغلاق',
    'lb.prev': 'المشهد السابق',
    'lb.next': 'المشهد التالي'
  };

  /* ------------------------------------------------------------------
     Strings used by scripts (both languages)
     ------------------------------------------------------------------ */
  function arCount(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n >= 3 && n <= 10) return n + ' ' + few;
    return n + ' ' + many;
  }
  var STR = {
    en: {
      'meta.title': 'Marsa Ember — Gulf Seafood & Charcoal Grill, Kuwait · Concept by Q8Pixel',
      'meta.desc': 'Concept restaurant website by Q8Pixel: fresh Gulf seafood and charcoal grills by the harbour in Sharq, Kuwait City. Bilingual menu, table booking and live opening hours.',
      'lang.label': 'العربية', 'lang.code': 'ar', 'lang.aria': 'Switch to Arabic',
      'nav.open': 'Open navigation', 'nav.close': 'Close navigation',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      am: 'AM', pm: 'PM', today: 'Today', tonight: 'Tonight',
      'lb.count': '{n} / {total}', example: 'example',
      'st.open': 'Open now', 'st.closed': 'Closed now',
      'st.closes': 'Closes at {t}', 'st.opensToday': 'Opens today at {t}', 'st.opensTomorrow': 'Opens tomorrow at {t}',
      'st.kwt': 'Kuwait time {t}',
      'st.short.open': 'Open now · until {t}', 'st.short.closedToday': 'Closed now · opens at {t}', 'st.short.closedTomorrow': 'Closed now · opens tomorrow at {t}',
      price: '{p} KD',
      dishes: function (n) { return n === 1 ? '1 dish' : n + ' dishes'; },
      'menu.showing': '{n} in {cat}',
      'menu.searching': '{n} matching “{q}” across all categories',
      'menu.searchNone': 'No dishes match “{q}”',
      'menu.filtered': '{n} in {cat} with your filters',
      'menu.empty': 'No dishes match',
      'menu.emptyHint': 'Try another word, or clear the filters.',
      'menu.elsewhere': 'Nothing in this section with these filters — but you’ll find matches here:',
      'q.open': '“', 'q.close': '”',
      'menu.reset': 'Clear search & filters',
      'tag.s': 'Spicy', 'tag.v': 'Vegetarian', 'tag.n': 'New', 'tag.sig': 'Chef’s pick', 'tags.aria': 'Dish labels',
      cat: { grills: 'Grills', seafood: 'Seafood', mezze: 'Mezze', desserts: 'Desserts', drinks: 'Drinks' },
      'slots.lunch': 'Lunch', 'slots.dinner': 'Dinner',
      'slots.pick': 'Choose a date to see available times.',
      'slots.none': 'No more tables today. Please choose another date.',
      guests: function (n) { return n === 1 ? '1 guest' : n + ' guests'; },
      'err.date': 'Please choose a date.',
      'err.datePast': 'Please choose today or a later date.',
      'err.dateFar': 'Online bookings open up to 60 days ahead.',
      'err.time': 'Please choose a time.',
      'err.guests': 'Guests must be between 1 and 12.',
      'err.name': 'Please enter your name (at least 2 letters).',
      'err.phone': 'Please enter your mobile number.',
      'err.phoneBad': 'Enter an 8-digit Kuwaiti number starting with 2, 4, 5, 6 or 9.',
      'err.summary': 'Please check the highlighted fields.',
      'conf.ref': 'Reference', 'conf.date': 'Date', 'conf.time': 'Time', 'conf.guests': 'Guests', 'conf.seating': 'Seating',
      'conf.name': 'Name', 'conf.phone': 'Mobile', 'conf.occasion': 'Occasion', 'conf.notes': 'Notes',
      seat: { indoor: 'Dining room', terrace: 'Sea-view terrace', majlis: 'Family majlis' },
      occ: { birthday: 'Birthday', anniversary: 'Anniversary', business: 'Business dinner', family: 'Family gathering' },
      'sample.name': 'Noura A.', 'sample.notes': 'A table by the water, please.',
      'toast.wa': 'Demo only — on a live site, this button would open a WhatsApp chat with the restaurant.',
      'gal.1.d': 'Arched windows, brass lanterns and the last light over the water.',
      'gal.2.d': 'Kebab, tawook, tikka and Gulf prawns over glowing natural charcoal.',
      'gal.3.d': 'Cool evenings, warm lights and the dhows heading home.',
      'gal.4.d': 'Hamour, zubaidi and Gulf prawns — from the market at dawn, on ice by noon.',
      'gal.5.d': 'A private corner dressed in Sadu weaving, for gatherings of up to 12.',
      'gal.6.d': 'Every meal ends the Kuwaiti way: cardamom gahwa and dates.'
    },
    ar: {
      'meta.title': 'جمر المرسى — مأكولات بحرية خليجية ومشويات على الفحم، الكويت · مشروع تجريبي من Q8Pixel',
      'meta.desc': 'موقع مطعم تجريبي من تصميم Q8Pixel: مأكولات بحرية خليجية طازجة ومشويات على الفحم بجوار مرسى شرق في مدينة الكويت. قائمة طعام بلغتين، وحجز طاولات، ومواعيد عمل مباشرة.',
      'lang.label': 'English', 'lang.code': 'en', 'lang.aria': 'التبديل إلى الإنجليزية',
      'nav.open': 'فتح قائمة التنقل', 'nav.close': 'إغلاق قائمة التنقل',
      days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      am: 'ص', pm: 'م', today: 'اليوم', tonight: 'الليلة',
      'lb.count': 'المشهد {n} من {total}', example: 'مثال',
      'st.open': 'مفتوح الآن', 'st.closed': 'مغلق الآن',
      'st.closes': 'يُغلق الساعة {t}', 'st.opensToday': 'يفتح اليوم الساعة {t}', 'st.opensTomorrow': 'يفتح غدًا الساعة {t}',
      'st.kwt': 'بتوقيت الكويت الآن {t}',
      'st.short.open': 'مفتوح الآن · حتى {t}', 'st.short.closedToday': 'مغلق الآن · يفتح الساعة {t}', 'st.short.closedTomorrow': 'مغلق الآن · يفتح غدًا {t}',
      price: '{p} د.ك',
      dishes: function (n) { return n === 0 ? 'لا أطباق' : arCount(n, 'طبق واحد', 'طبقان', 'أطباق', 'طبقًا'); },
      'menu.showing': '{n} في قسم {cat}',
      'menu.searching': 'نتائج البحث عن «{q}» في جميع الأقسام: {n}',
      'menu.searchNone': 'لا توجد أطباق تطابق «{q}»',
      'menu.filtered': '{n} في قسم {cat} حسب التصفية',
      'menu.empty': 'لا توجد أطباق مطابقة',
      'menu.emptyHint': 'جرّبوا كلمة أخرى، أو امسحوا عوامل التصفية.',
      'menu.elsewhere': 'لا نتائج في هذا القسم بهذه التصفية، لكن توجد نتائج في:',
      'q.open': '«', 'q.close': '»',
      'menu.reset': 'مسح البحث والتصفية',
      'tag.s': 'حار', 'tag.v': 'نباتي', 'tag.n': 'جديد', 'tag.sig': 'اختيار الشيف', 'tags.aria': 'تصنيفات الطبق',
      cat: { grills: 'المشويات', seafood: 'المأكولات البحرية', mezze: 'المقبلات', desserts: 'الحلويات', drinks: 'المشروبات' },
      'slots.lunch': 'الغداء', 'slots.dinner': 'العشاء',
      'slots.pick': 'اختاروا التاريخ لعرض الأوقات المتاحة.',
      'slots.none': 'لا توجد طاولات متاحة لبقية اليوم. يُرجى اختيار تاريخ آخر.',
      guests: function (n) { return arCount(n, 'ضيف واحد', 'ضيفان', 'ضيوف', 'ضيفًا'); },
      'err.date': 'يُرجى اختيار التاريخ.',
      'err.datePast': 'يُرجى اختيار تاريخ اليوم أو تاريخ لاحق.',
      'err.dateFar': 'يُتاح الحجز عبر الموقع حتى 60 يومًا مقدّمًا.',
      'err.time': 'يُرجى اختيار الوقت.',
      'err.guests': 'يجب أن يكون عدد الضيوف بين 1 و12.',
      'err.name': 'يُرجى إدخال الاسم (حرفان على الأقل).',
      'err.phone': 'يُرجى إدخال رقم النقّال.',
      'err.phoneBad': 'يُرجى إدخال رقم كويتي من 8 أرقام يبدأ بـ 2 أو 4 أو 5 أو 6 أو 9.',
      'err.summary': 'يُرجى مراجعة الحقول المحددة.',
      'conf.ref': 'رقم الحجز', 'conf.date': 'التاريخ', 'conf.time': 'الوقت', 'conf.guests': 'عدد الضيوف', 'conf.seating': 'مكان الجلوس',
      'conf.name': 'الاسم', 'conf.phone': 'النقّال', 'conf.occasion': 'المناسبة', 'conf.notes': 'الملاحظات',
      seat: { indoor: 'الصالة الداخلية', terrace: 'الجلسة الخارجية', majlis: 'مجلس العائلة' },
      occ: { birthday: 'عيد ميلاد', anniversary: 'ذكرى الزواج', business: 'عشاء عمل', family: 'تجمّع عائلي' },
      'sample.name': 'نورة أ.', 'sample.notes': 'نفضّل طاولة مطلة على البحر من فضلكم.',
      'toast.wa': 'للعرض فقط — في الموقع الفعلي يفتح هذا الزر محادثة واتساب مع المطعم.',
      'gal.1.d': 'نوافذ مقوّسة وفوانيس نحاسية وآخر خيوط الضوء فوق الماء.',
      'gal.2.d': 'كباب وطاووق وتكة وروبيان خليجي فوق جمر الفحم الطبيعي.',
      'gal.3.d': 'أمسيات عليلة النسيم وأضواء دافئة وسفن خشبية في طريق عودتها.',
      'gal.4.d': 'هامور وزبيدي وروبيان خليجي — من سوق السمك فجرًا، وعلى الثلج قبل الظهر.',
      'gal.5.d': 'ركن خاص مزيّن بنسيج السدو، يتسع لتجمعات تصل إلى 12 شخصًا.',
      'gal.6.d': 'كل وجبة تُختَم على الطريقة الكويتية: قهوة عربية بالهيل وتمر.'
    }
  };

  /* ------------------------------------------------------------------
     Menu data — tags: s = spicy, v = vegetarian, n = new, * = chef's pick
     ------------------------------------------------------------------ */
  var CATS = ['grills', 'seafood', 'mezze', 'desserts', 'drinks'];
  var CAT_ICON = { grills: 'i-flame', seafood: 'i-fish', mezze: 'i-bowl', desserts: 'i-cake', drinks: 'i-cup' };
  function D(id, cat, price, tags, en, enD, ar, arD) { return { id: id, cat: cat, price: price, tags: tags, en: [en, enD], ar: [ar, arD] }; }
  var MENU = [
    D('g1', 'grills', '8.750', '*', 'Ember Lamb Chops', 'Four lamb chops in a loomi and black-pepper rub, with charred lemon.', 'ريش غنم على الجمر', 'أربع ريش غنم بتتبيلة اللومي والفلفل الأسود، مع ليمون مشوي.'),
    D('g2', 'grills', '4.250', '', 'Shish Tawook', 'Marinated chicken thigh, garlic toum and sumac onions.', 'شيش طاووق', 'أفخاذ دجاج متبّلة مع الثومية والبصل بالسماق.'),
    D('g3', 'grills', '4.750', '', 'Kuwaiti Kebab', 'Hand-minced lamb and beef with grilled tomato and warm bread.', 'كباب كويتي', 'لحم غنم وبقر مفروم يدويًا، مع طماطم مشوية وخبز ساخن.'),
    D('g4', 'grills', '4.500', 's', 'Harissa Half Chicken', 'Slow-charred half chicken, red harissa and garlic yoghurt.', 'نصف دجاجة بالهريسة', 'نصف دجاجة مشوية على مهل بصلصة الهريسة الحمراء ولبن بالثوم.'),
    D('g5', 'grills', '6.250', 'n', 'Beef Tenderloin Tikka', 'Tenderloin cubes, bezar butter and grilled peppers.', 'تكة فيليه لحم', 'مكعبات فيليه لحم بقري مع زبدة البزار والفلفل المشوي.'),
    D('g6', 'grills', '3.250', 'v', 'Halloumi & Vegetable Skewers', 'Halloumi, courgette, peppers and cherry tomato with za’atar oil.', 'أسياخ حلوم وخضار', 'حلوم وكوسا وفلفل وطماطم كرزية مع زيت الزعتر.'),
    D('g7', 'grills', '13.500', '', 'Mixed Grill for Two', 'Lamb chops, tawook, kebab and tikka with saffron rice and salads.', 'مشاوي مشكّلة لشخصين', 'ريش وطاووق وكباب وتكة، مع أرز بالزعفران وسلطات.'),
    D('s1', 'seafood', '7.500', '*', 'Charcoal Zubaidi', 'Whole silver pomfret in our Gulf spice rub, with tahini and charred lemon.', 'زبيدي على الفحم', 'زبيدي كامل بتتبيلة البهارات الخليجية، يُقدَّم مع الطحينة والليمون المشوي.'),
    D('s2', 'seafood', '6.750', '*', 'Hamour Machboos', 'Saffron and loomi rice, crisp hamour fillet, fried onions and daqoos.', 'مجبوس هامور', 'أرز بالزعفران واللومي مع فيليه هامور مقرمش وبصل محمّر ودقوس.'),
    D('s3', 'seafood', '6.250', 's*', 'Gulf Prawn Skewers', 'Jumbo prawns over the coals, with garlic and red-chilli butter.', 'أسياخ روبيان الخليج', 'روبيان جامبو على الفحم مع زبدة الثوم والفلفل الأحمر.'),
    D('s4', 'seafood', '8.250', '', 'Grilled Sobaity', 'Whole sobaity bream with olive oil, lemon and sea salt.', 'سبيطي مشوي', 'سبيطي كامل بزيت الزيتون والليمون وملح البحر.'),
    D('s5', 'seafood', '5.750', '', 'Sayadiya Sheri', 'Sheri fillets over caramelised-onion rice, with tahini.', 'صيادية شعري', 'فيليه شعري على أرز بالبصل المكرمل، مع الطحينة.'),
    D('s6', 'seafood', '14.500', 'n', 'Saffron Lobster Tail', 'Butter-basted lobster tail with saffron and lime.', 'ذيل لوبستر بالزعفران', 'ذيل لوبستر مدهون بالزبدة مع الزعفران والليمون الأخضر.'),
    D('s7', 'seafood', '3.950', 's', 'Chilli Calamari', 'Crispy squid with green chilli, coriander and garlic.', 'كاليماري بالفلفل الحار', 'حبّار مقرمش بالفلفل الأخضر والكزبرة والثوم.'),
    D('m1', 'mezze', '1.950', 'v', 'Smoked Moutabal', 'Coal-roasted aubergine, tahini and pomegranate.', 'متبّل مدخّن', 'باذنجان مشوي على الفحم مع الطحينة والرمان.'),
    D('m2', 'mezze', '2.750', '', 'Hummus with Ember Lamb', 'Silky hummus topped with spiced lamb and toasted pine nuts.', 'حمص باللحم', 'حمص ناعم يعلوه لحم متبّل وصنوبر محمّص.'),
    D('m3', 'mezze', '2.250', 'v', 'Charred Fattoush', 'Crisp greens, radish, sumac and toasted bread.', 'فتوش', 'خضار طازجة وفجل وسماق مع خبز محمّص.'),
    D('m4', 'mezze', '1.950', 'vs', 'Muhammara', 'Roasted red pepper, walnut and pomegranate molasses.', 'محمّرة', 'فلفل أحمر مشوي وجوز ودبس رمان.'),
    D('m5', 'mezze', '1.750', 'vn', 'Labneh & Za’atar', 'Thick labneh with wild za’atar and olive oil.', 'لبنة بالزعتر', 'لبنة كثيفة مع زعتر بري وزيت زيتون.'),
    D('m6', 'mezze', '3.250', 's', 'Shrimp & Daqoos Bites', 'Crispy Gulf shrimp with a tangy daqoos dip.', 'روبيان مقرمش بالدقوس', 'روبيان خليجي مقرمش مع صلصة الدقوس.'),
    D('m7', 'mezze', '1.850', 'v', 'Cheese Sambousek', 'Golden pastries filled with akkawi cheese and nigella seeds.', 'سمبوسة جبن', 'معجنات ذهبية محشوة بالجبن العكاوي وحبة البركة.'),
    D('d1', 'desserts', '2.950', 'v*', 'Saffron Kunafa', 'Crisp kunafa with soft cheese, saffron syrup and pistachio.', 'كنافة بالزعفران', 'كنافة مقرمشة بالجبن الطري وقطر الزعفران والفستق الحلبي.'),
    D('d2', 'desserts', '2.750', 'v', 'Date & Cardamom Cake', 'Warm sticky date cake with date-syrup caramel and cream.', 'كيكة التمر والهيل', 'كيكة تمر دافئة مع كراميل الدبس والقشطة.'),
    D('d3', 'desserts', '1.950', 'v', 'Lugaimat', 'Crisp golden dumplings with date syrup and sesame.', 'لقيمات', 'لقيمات ذهبية مقرمشة بدبس التمر والسمسم.'),
    D('d4', 'desserts', '1.750', 'v', 'Pistachio Muhallabia', 'Rose-water milk pudding with crushed pistachio.', 'مهلبية بالفستق', 'مهلبية بماء الورد مع فستق حلبي مجروش.'),
    D('d5', 'desserts', '2.500', 'vn', 'Ember-roasted Figs', 'Roasted figs, honey and labneh ice cream.', 'تين مشوي على الجمر', 'تين مشوي مع العسل وآيس كريم اللبنة.'),
    D('d6', 'desserts', '2.250', 'n', 'Gahwa Affogato', 'Vanilla ice cream with a shot of cardamom Arabic coffee.', 'أفوغاتو بالقهوة العربية', 'آيس كريم الفانيلا مع قهوة عربية بالهيل تُسكب عليه.'),
    D('b1', 'drinks', '1.500', 'v', 'Loomi Lemonade', 'Fresh lemon, dried black lime and mint.', 'ليمونادة باللومي', 'ليمون طازج ولومي ونعناع.'),
    D('b2', 'drinks', '1.750', 'vn', 'Pomegranate & Rose Cooler', 'Pomegranate, rose water and sparkling water.', 'مشروب الرمان والورد', 'رمان وماء ورد ومياه فوّارة.'),
    D('b3', 'drinks', '0.950', 'v', 'Saffron Karak', 'Spiced milk tea brewed with saffron and cardamom.', 'كرك بالزعفران', 'شاي بالحليب مطبوخ مع الزعفران والهيل.'),
    D('b4', 'drinks', '2.500', 'v', 'Arabic Coffee Dallah', 'A pot of cardamom gahwa with dates, for the whole table.', 'دلّة قهوة عربية', 'دلّة قهوة بالهيل مع التمر، تكفي الطاولة كلها.'),
    D('b5', 'drinks', '1.500', 'v', 'Fresh Orange Juice', 'Squeezed to order.', 'عصير برتقال طازج', 'يُعصر عند الطلب.'),
    D('b6', 'drinks', '1.250', 'v', 'Mint Lemonade', 'Lemon and fresh mint blended over ice.', 'ليمون بالنعناع', 'ليمون ونعناع طازج مخفوقان مع الثلج.')
  ];
  var BY_ID = {};
  MENU.forEach(function (d) { BY_ID[d.id] = d; });

  /* Opening hours, minutes after midnight, Sunday..Saturday. Closing > 1440 = after midnight. */
  var HOURS = [[750, 1410], [750, 1410], [750, 1410], [750, 1410], [750, 1470], [810, 1470], [750, 1410]];
  var MAX_DAYS = 60;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  var lang = html.lang === 'ar' ? 'ar' : 'en';
  function t(key, vars) {
    var s = STR[lang][key];
    if (s == null) s = STR.en[key];
    if (s == null) return key;
    if (typeof s === 'function') return s(vars);
    if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtPrice(p) { return t('price', { p: p }); }
  function fmtTime(min) {
    min = ((min % 1440) + 1440) % 1440;
    var h = Math.floor(min / 60), m = min % 60;
    return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? t('am') : t('pm'));
  }
  function kwNow() {
    var d = new Date(Date.now() + 3 * 3600 * 1000); // Kuwait is UTC+3 all year
    return { day: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes(), iso: d.toISOString().slice(0, 10) };
  }
  function isoAdd(iso, days) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00Z');
    try {
      return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-KW-u-nu-latn' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
    } catch (e) { return iso; }
  }
  function toWestern(s) {
    return String(s).replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 0x660; })
      .replace(/[۰-۹]/g, function (c) { return c.charCodeAt(0) - 0x6F0; });
  }
  function headerH() { var h = $('#site-header'); return h ? h.offsetHeight : 72; }

  /* Search normalisation: case, Arabic diacritics/letter variants, apostrophes; keeps an index map for highlighting */
  function normalize(str) {
    var s = String(str).toLowerCase(), out = '', map = [];
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (/[ً-ْـٰ'’]/.test(c)) continue;
      if (/[أإآٱ]/.test(c)) c = 'ا';
      else if (c === 'ة') c = 'ه';
      else if (c === 'ى') c = 'ي';
      else if (c === 'ؤ') c = 'و';
      else if (c === 'ئ') c = 'ي';
      out += c; map.push(i);
    }
    return { text: out, map: map };
  }
  /* extra search words so guests find dishes by everyday terms in either language */
  var KW = {
    fish: 'fish سمك', prawn: 'prawn prawns shrimp shrimps روبيان ربيان', lamb: 'lamb meat لحم غنم', chicken: 'chicken دجاج',
    beef: 'beef meat لحم بقر', sweet: 'sweet dessert حلو حلويات', coffee: 'coffee قهوة', juice: 'juice عصير'
  };
  var KW_BY_ID = {
    g1: 'lamb', g2: 'chicken', g3: 'lamb beef', g4: 'chicken', g5: 'beef', g7: 'lamb chicken beef',
    s1: 'fish', s2: 'fish', s3: 'prawn', s4: 'fish', s5: 'fish', m2: 'lamb', m6: 'prawn',
    d1: 'sweet', d2: 'sweet', d3: 'sweet', d4: 'sweet', d5: 'sweet', d6: 'sweet coffee', b4: 'coffee', b5: 'juice'
  };
  MENU.forEach(function (d) {
    var extra = (KW_BY_ID[d.id] || '').split(' ').filter(Boolean).map(function (k) { return KW[k]; }).join(' ');
    d.hay = normalize([d.en[0], d.en[1], d.ar[0], d.ar[1], STR.en.cat[d.cat], STR.ar.cat[d.cat], extra].join(' | ')).text;
  });

  /* ------------------------------------------------------------------
     i18n for static markup
     ------------------------------------------------------------------ */
  var enHTML = new Map();
  var enAttr = new Map();
  $$('[data-i18n]').forEach(function (el) { enHTML.set(el, el.innerHTML); });
  $$('[data-i18n-attr]').forEach(function (el) {
    var o = {};
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':');
      if (p.length === 2) o[p[0].trim()] = { key: p[1].trim(), en: el.getAttribute(p[0].trim()) };
    });
    enAttr.set(el, o);
  });
  function applyStatic() {
    enHTML.forEach(function (en, el) {
      var k = el.getAttribute('data-i18n');
      var v = lang === 'ar' && AR[k] != null ? AR[k] : en;
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    enAttr.forEach(function (o, el) {
      Object.keys(o).forEach(function (a) {
        var v = lang === 'ar' && AR[o[a].key] != null ? AR[o[a].key] : o[a].en;
        if (v != null) el.setAttribute(a, v);
      });
    });
  }
  function fillDishes() {
    $$('[data-dish-name]').forEach(function (el) { var d = BY_ID[el.getAttribute('data-dish-name')]; if (d) el.textContent = d[lang][0]; });
    $$('[data-dish-desc]').forEach(function (el) { var d = BY_ID[el.getAttribute('data-dish-desc')]; if (d) el.textContent = d[lang][1]; });
    $$('[data-dish-price]').forEach(function (el) { var d = BY_ID[el.getAttribute('data-dish-price')]; if (d) el.textContent = fmtPrice(d.price); });
  }

  /* ------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------ */
  var toastEl = $('#toast'), toastMsg = $('#toast-msg'), toastTimer = null;
  function toast(msg) {
    toastMsg.textContent = '';
    toastEl.classList.add('show');
    window.setTimeout(function () { toastMsg.textContent = msg; }, 40);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(hideToast, 5600);
  }
  function hideToast() { toastEl.classList.remove('show'); }
  $('#toast-close').addEventListener('click', hideToast);

  /* ------------------------------------------------------------------
     Opening hours + live status
     ------------------------------------------------------------------ */
  function openState(now) {
    var prev = HOURS[(now.day + 6) % 7];
    if (prev[1] > 1440 && now.min < prev[1] - 1440) return { open: true, closes: prev[1] - 1440 };
    var h = HOURS[now.day];
    if (now.min >= h[0] && now.min < h[1]) return { open: true, closes: h[1] };
    if (now.min < h[0]) return { open: false, when: 'today', opens: h[0] };
    return { open: false, when: 'tomorrow', opens: HOURS[(now.day + 1) % 7][0] };
  }
  /* translated sentence with its time kept on one line (so "11:55 PM" never wraps on its own) */
  function tTime(key, min) {
    return esc(t(key, { t: '\u0000' })).replace('\u0000', '<span class="nw">' + esc(fmtTime(min)) + '</span>');
  }
  function renderStatus() {
    var now = kwNow(), st = openState(now);
    $$('[data-status-dot]').forEach(function (d) { d.classList.toggle('is-open', st.open); d.classList.toggle('is-closed', !st.open); });
    var box = $('#status-box');
    box.classList.toggle('is-open', st.open); box.classList.toggle('is-closed', !st.open);
    $('#status-main').textContent = st.open ? t('st.open') : t('st.closed');
    var sub = st.open ? tTime('st.closes', st.closes)
      : tTime(st.when === 'today' ? 'st.opensToday' : 'st.opensTomorrow', st.opens);
    $('#status-sub').innerHTML = sub + ' · ' + tTime('st.kwt', now.min);
    var short = st.open ? tTime('st.short.open', st.closes)
      : tTime(st.when === 'today' ? 'st.short.closedToday' : 'st.short.closedTomorrow', st.opens);
    $$('[data-status="short"]').forEach(function (el) { el.innerHTML = short; });
  }
  function renderHours() {
    var now = kwNow(), days = t('days');
    /* just after midnight the previous day's late hours are still running: mark that row ("Tonight") */
    var prev = (now.day + 6) % 7, late = HOURS[prev][1] > 1440 && now.min < HOURS[prev][1] - 1440;
    var hlDay = late ? prev : now.day;
    $('#hours-body').innerHTML = [0, 1, 2, 3, 4, 5, 6].map(function (d) {
      var on = d === hlDay;
      return '<tr' + (on ? ' class="today"' : '') + '><th scope="row">' + days[d] +
        (on ? ' <span class="today-pill">' + t(late ? 'tonight' : 'today') + '</span>' : '') +
        '</th><td>' + fmtTime(HOURS[d][0]) + ' – ' + fmtTime(HOURS[d][1]) + '</td></tr>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Menu: tabs, search, dietary filters
     ------------------------------------------------------------------ */
  var menuState = { cat: 'grills', q: '', tags: [] };
  var panel = $('#menu-panel'), tabsEl = $('#menu-tabs'), searchIn = $('#menu-search'), searchClear = $('#search-clear');
  var menuStatus = $('#menu-status'), statusTimer = null;

  /* Search matches at the start of a word only (an Arabic word may carry ال / و / ب / ل … in front), so "لحم" finds
     "باللحم" but never "الحمراء". Whole-word matches win ("حلو" → desserts, not "حلوم"); prefix matches
     ("روبي" → روبيان) are used only when no dish has the whole word. */
  var WORD_CH = 'a-z0-9à-ɏء-ي٠-٩ٱ-ۓ';
  var AR_PREFIX = '(?:بال|وال|فال|كال|لل|ال|و|ب|ل|ف|ك)?';
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function searchRe(qn, whole) {
    return new RegExp('(^|[^' + WORD_CH + '])(' + AR_PREFIX + escRe(qn) + ')' + (whole ? '(?![' + WORD_CH + '])' : ''), 'g');
  }
  function searchQuery(raw) {
    var qn = normalize(String(raw).trim()).text.replace(/\s+/g, ' ');
    if (/^ال/.test(qn) && qn.length > 3) qn = qn.slice(2); /* "الروبيان" also finds "روبيان" */
    return qn;
  }
  function hl(str, re) {
    if (!re) return esc(str);
    var n = normalize(str), out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(n.text))) {
      var s = m.index + m[1].length, e = s + m[2].length;
      if (e <= s) { re.lastIndex++; continue; }
      var start = n.map[s], end = n.map[e - 1] + 1;
      out += esc(str.slice(last, start)) + '<mark>' + esc(str.slice(start, end)) + '</mark>';
      last = end;
    }
    return out + esc(str.slice(last));
  }
  function tagHTML(cls, icon, label) {
    return '<li class="tag ' + cls + '"><svg class="icon" aria-hidden="true"><use href="#' + icon + '"/></svg>' + esc(label) + '</li>';
  }
  function dishHTML(d, i, re, level) {
    var L = d[lang], tags = [];
    if (d.tags.indexOf('*') > -1) tags.push(tagHTML('tag-sig', 'i-star', t('tag.sig')));
    if (d.tags.indexOf('s') > -1) tags.push(tagHTML('tag-s', 'i-chili', t('tag.s')));
    if (d.tags.indexOf('v') > -1) tags.push(tagHTML('tag-v', 'i-leaf', t('tag.v')));
    if (d.tags.indexOf('n') > -1) tags.push(tagHTML('tag-n', 'i-spark', t('tag.n')));
    var h = 'h' + level;
    return '<article class="dish" id="dish-' + d.id + '" tabindex="-1" style="--n:' + i + '">' +
      '<div class="dish-head"><' + h + ' class="dish-name">' + hl(L[0], re) + '</' + h + '>' +
      '<span class="dish-leader" aria-hidden="true"></span><span class="dish-price">' + esc(fmtPrice(d.price)) + '</span></div>' +
      '<p class="dish-desc">' + hl(L[1], re) + '</p>' +
      (tags.length ? '<ul class="dish-tags" aria-label="' + esc(t('tags.aria')) + '">' + tags.join('') + '</ul>' : '') +
      '</article>';
  }
  function renderMenu(noAnim) {
    var qRaw = menuState.q.trim(), qn = searchQuery(qRaw), searching = qn.length > 0, re = null;
    var tagged = MENU.filter(function (d) {
      for (var i = 0; i < menuState.tags.length; i++) if (d.tags.indexOf(menuState.tags[i]) < 0) return false;
      return true;
    });
    var pool = tagged;
    if (searching) {
      var byRe = function (r) { return tagged.filter(function (d) { r.lastIndex = 0; return r.test(d.hay); }); };
      re = searchRe(qn, true);
      pool = byRe(re);
      if (!pool.length) { re = searchRe(qn, false); pool = byRe(re); }
    }
    CATS.forEach(function (c) {
      var n = pool.filter(function (d) { return d.cat === c; }).length;
      var badge = $('[data-count="' + c + '"]');
      badge.textContent = n;
      badge.parentNode.classList.toggle('is-empty', n === 0);
    });
    tabsEl.classList.toggle('is-searching', searching);
    var list = searching ? pool : pool.filter(function (d) { return d.cat === menuState.cat; });
    var out = '';
    if (!list.length) {
      /* filters match nothing in this category but do elsewhere: offer those categories instead of a dead end */
      var elsewhere = CATS.filter(function (c) { return pool.some(function (d) { return d.cat === c; }); });
      var jumps = elsewhere.map(function (c) {
        return '<button class="chip chip-jump" type="button" data-jump="' + c + '"><svg class="icon" aria-hidden="true"><use href="#' + CAT_ICON[c] + '"/></svg>' +
          esc(t('cat')[c]) + ' <span class="tab-count">' + pool.filter(function (d) { return d.cat === c; }).length + '</span></button>';
      }).join('');
      out = '<div class="menu-empty"><strong>' + esc(qRaw ? t('menu.searchNone', { q: qRaw }) : t('menu.empty')) + '</strong>' +
        esc(t(jumps ? 'menu.elsewhere' : 'menu.emptyHint')) +
        (jumps ? '<div class="menu-jumps">' + jumps + '</div>' : '') +
        '<br><button class="btn btn-ink" type="button" data-action="menu-reset">' + esc(t('menu.reset')) + '</button></div>';
    } else if (searching) {
      var i = 0;
      CATS.forEach(function (c) {
        var items = list.filter(function (d) { return d.cat === c; });
        if (!items.length) return;
        out += '<h3 class="menu-group-title"><svg class="icon" aria-hidden="true"><use href="#' + CAT_ICON[c] + '"/></svg>' + esc(t('cat')[c]) + '</h3>';
        items.forEach(function (d) { out += dishHTML(d, i++, re, 4); });
      });
    } else {
      list.forEach(function (d, i) { out += dishHTML(d, i, null, 3); });
    }
    panel.innerHTML = out;
    if (noAnim) $$('.dish', panel).forEach(function (el) { el.style.animation = 'none'; });
    /* while searching, results span every category, so the panel is named by "Search results", not the old tab */
    panel.setAttribute('aria-labelledby', searching ? 'menu-results-label' : 'tab-' + menuState.cat);
    searchClear.hidden = !menuState.q;
    var count = t('dishes', list.length);
    var msg = searching ? t(list.length ? 'menu.searching' : 'menu.searchNone', { n: count, q: qRaw })
      : t(menuState.tags.length ? 'menu.filtered' : 'menu.showing', { n: count, cat: t('cat')[menuState.cat] });
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () { menuStatus.textContent = msg; }, searching ? 350 : 0);
  }
  function selectCat(cat, fromUser) {
    if (CATS.indexOf(cat) < 0) return;
    menuState.cat = cat;
    if (fromUser && menuState.q) { menuState.q = ''; searchIn.value = ''; }
    $$('.tab', tabsEl).forEach(function (tab) {
      var on = tab.getAttribute('data-cat') === cat;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    });
    renderMenu();
    if (fromUser) {
      var tab = $('[data-cat="' + cat + '"]', tabsEl);
      if (tab && tabsEl.scrollWidth > tabsEl.clientWidth) {
        var tr = tab.getBoundingClientRect(), wr = tabsEl.getBoundingClientRect();
        if (tr.left < wr.left || tr.right > wr.right) tabsEl.scrollBy({ left: tr.left - wr.left - 24, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      replaceHash('#/menu/' + cat);
    }
  }
  tabsEl.addEventListener('click', function (e) {
    var tab = e.target.closest('.tab');
    if (tab) selectCat(tab.getAttribute('data-cat'), true);
  });
  tabsEl.addEventListener('keydown', function (e) {
    var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (keys.indexOf(e.key) < 0) return;
    var tabs = $$('.tab', tabsEl), i = tabs.indexOf(doc.activeElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = tabs.length - 1;
    else {
      var forward = (e.key === 'ArrowRight') !== (html.dir === 'rtl');
      i = (i + (forward ? 1 : -1) + tabs.length) % tabs.length;
    }
    tabs[i].focus();
    selectCat(tabs[i].getAttribute('data-cat'), true);
  });
  /* edge fades on the scrollable tab row (scrollLeft runs 0 → -max in RTL, so use its absolute value) */
  var tabsWrap = $('#tabs-wrap');
  function updateTabFade() {
    var max = tabsEl.scrollWidth - tabsEl.clientWidth, pos = Math.abs(tabsEl.scrollLeft);
    tabsWrap.classList.toggle('fade-start', max > 2 && pos > 4);
    tabsWrap.classList.toggle('fade-end', max > 2 && pos < max - 4);
  }
  tabsEl.addEventListener('scroll', updateTabFade, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(updateTabFade).observe(tabsEl);
  else window.addEventListener('resize', updateTabFade);
  searchIn.addEventListener('input', function () { menuState.q = searchIn.value; renderMenu(); });
  searchIn.addEventListener('keydown', function (e) { if (e.key === 'Escape' && searchIn.value) { e.preventDefault(); clearSearch(); } });
  function clearSearch() { searchIn.value = ''; menuState.q = ''; renderMenu(); searchIn.focus(); }
  searchClear.addEventListener('click', clearSearch);
  $$('.chip[data-tag]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var tag = chip.getAttribute('data-tag'), i = menuState.tags.indexOf(tag);
      if (i > -1) menuState.tags.splice(i, 1); else menuState.tags.push(tag);
      chip.setAttribute('aria-pressed', i > -1 ? 'false' : 'true');
      renderMenu();
    });
  });
  function resetMenuFilters() {
    menuState.q = ''; searchIn.value = ''; menuState.tags = [];
    $$('.chip[data-tag]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
  }
  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="menu-reset"]')) { resetMenuFilters(); renderMenu(); searchIn.focus(); return; }
    var jump = e.target.closest('[data-jump]');
    if (jump) {
      selectCat(jump.getAttribute('data-jump'), true);
      var tab = $('[data-cat="' + menuState.cat + '"]', tabsEl);
      if (tab) tab.focus({ preventScroll: true });
    }
  });
  function focusDish(id) {
    var d = BY_ID[id];
    if (!d) return null;
    if (menuState.q || menuState.tags.length || menuState.cat !== d.cat || !$('#dish-' + d.id)) {
      resetMenuFilters();
      selectCat(d.cat, false);
    }
    return $('#dish-' + d.id);
  }

  /* ------------------------------------------------------------------
     Gallery lightbox (native <dialog>)
     ------------------------------------------------------------------ */
  var lb = $('#lightbox'), lbArt = $('#lb-art'), lbIndex = 0, lbTrigger = null;
  var galBtns = $$('[data-gallery]');
  var canModal = lb && typeof lb.showModal === 'function';
  function lbIsOpen() { return lb.hasAttribute('open'); }
  function renderLightbox(animate) {
    var btn = galBtns[lbIndex];
    var title = $('.g-title', btn).textContent;
    var svg = $('svg', btn).cloneNode(true);
    svg.removeAttribute('class');
    svg.removeAttribute('aria-hidden');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', title);
    lbArt.innerHTML = '';
    lbArt.appendChild(svg);
    if (animate) { lbArt.classList.remove('swap'); void lbArt.offsetWidth; lbArt.classList.add('swap'); }
    $('#lb-title').textContent = title;
    $('#lb-desc').textContent = t('gal.' + (lbIndex + 1) + '.d');
    $('#lb-count').textContent = t('lb.count', { n: lbIndex + 1, total: galBtns.length });
  }
  function openLightbox(i, push) {
    lbIndex = (i + galBtns.length) % galBtns.length;
    renderLightbox(false);
    if (!lbIsOpen()) {
      if (canModal) lb.showModal(); else lb.setAttribute('open', '');
      html.classList.add('modal-open');
    }
    var h = '#/gallery/' + (lbIndex + 1);
    /* the pushed entry is marked so closing can step back over it instead of leaving a duplicate "#/gallery" entry */
    if (push) history.pushState({ lb: 1 }, '', h); else replaceHash(h);
  }
  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + galBtns.length) % galBtns.length;
    renderLightbox(true);
    replaceHash('#/gallery/' + (lbIndex + 1));
  }
  function closeLightbox() {
    if (!lbIsOpen()) return;
    if (canModal) lb.close(); else lb.removeAttribute('open');
    onLbClose();
  }
  function onLbClose() {
    if (!html.classList.contains('modal-open')) return;
    html.classList.remove('modal-open');
    var r = parseRoute();
    if (r && r.parts[0] === 'gallery' && r.parts[1]) {
      if (history.state && history.state.lb) { ignorePop = true; history.back(); }
      else replaceHash('#/gallery');
    }
    var back = lbTrigger || galBtns[lbIndex];
    if (back) back.focus({ preventScroll: true });
    lbTrigger = null;
  }
  galBtns.forEach(function (b, i) { b.addEventListener('click', function () { lbTrigger = b; openLightbox(i, true); }); });
  lb.addEventListener('close', onLbClose);
  $('#lb-close').addEventListener('click', closeLightbox);
  $('#lb-prev').addEventListener('click', function () { stepLightbox(-1); });
  $('#lb-next').addEventListener('click', function () { stepLightbox(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-inner')) closeLightbox(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      var next = (e.key === 'ArrowRight') !== (html.dir === 'rtl');
      stepLightbox(next ? 1 : -1);
    }
  });
  (function swipe() {
    var x0 = null;
    lbArt.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    lbArt.addEventListener('pointerup', function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) < 50) return;
      var next = (dx < 0) !== (html.dir === 'rtl');
      stepLightbox(next ? 1 : -1);
    });
  })();

  /* ------------------------------------------------------------------
     Reservation form (demo only — never sent anywhere)
     ------------------------------------------------------------------ */
  var form = $('#res-form'), confirmEl = $('#confirm'), alertEl = $('#form-alert');
  var dateIn = $('#res-date'), guestsIn = $('#res-guests'), nameIn = $('#res-name'), phoneIn = $('#res-phone');
  var notesIn = $('#res-notes'), occIn = $('#res-occasion'), slotsBox = $('#slots');
  var errors = {}, touched = {}, lastBooking = null, shownBooking = null;
  try { lastBooking = JSON.parse(session.get('marsa-booking') || 'null'); } catch (e) { lastBooking = null; }

  function todayIso() { return kwNow().iso; }
  function maxIso() { return isoAdd(todayIso(), MAX_DAYS); }
  /* Bookable times for a date: every 30 min from 30 min after opening to 1 h before closing; today needs 1 h notice. */
  function slotInfo(v) {
    var h = HOURS[new Date(v + 'T00:00:00Z').getUTCDay()], slots = [];
    for (var m = h[0] + 30; m <= h[1] - 60; m += 30) slots.push(m);
    var isToday = v === todayIso(), nowMin = kwNow().min;
    var ok = function (x) { return !isToday || x >= nowMin + 60; };
    return { slots: slots, ok: ok, any: slots.some(ok) };
  }
  function initDate() {
    var today = todayIso();
    dateIn.min = today;
    dateIn.max = maxIso();
    /* late in the evening there is nothing left to book today, so start from tomorrow */
    if (!dateIn.value) dateIn.value = slotInfo(today).any ? today : isoAdd(today, 1);
  }
  function selectedTime() { var r = $('input[name="time"]:checked', form); return r ? r.value : null; }
  function renderSlots() {
    var v = dateIn.value, keep = selectedTime() || slotsBox.getAttribute('data-keep');
    if (!v || v < todayIso() || v > maxIso()) {
      slotsBox.innerHTML = '<p class="slots-empty">' + esc(t('slots.pick')) + '</p>';
      return;
    }
    var info = slotInfo(v), slots = info.slots, ok = info.ok;
    if (!info.any) {
      slotsBox.innerHTML = '<p class="slots-empty">' + esc(t('slots.none')) + '</p>';
      return;
    }
    var groups = [['slots.lunch', slots.filter(function (m) { return m < 1020; })], ['slots.dinner', slots.filter(function (m) { return m >= 1020; })]];
    slotsBox.innerHTML = groups.filter(function (g) { return g[1].length; }).map(function (g) {
      return '<div class="slot-group"><p class="slot-group-title">' + esc(t(g[0])) + '</p><div class="slot-list">' +
        g[1].map(function (m) {
          return '<label class="slot"><input type="radio" name="time" value="' + m + '"' + (!ok(m) ? ' disabled' : '') + '><span>' + esc(fmtTime(m)) + '</span></label>';
        }).join('') + '</div></div>';
    }).join('');
    /* restore the kept time as a property, not a `checked` attribute, so form.reset() really clears it */
    if (keep) {
      var kept = $('input[name="time"][value="' + String(keep).replace(/\D/g, '') + '"]:not(:disabled)', slotsBox);
      if (kept) kept.checked = true;
    }
    slotsBox.removeAttribute('data-keep');
  }
  function renderDateReadout() {
    var v = dateIn.value;
    $('#date-readout').textContent = /^\d{4}-\d{2}-\d{2}$/.test(v) ? fmtDate(v) : '';
  }
  function phoneDigits(s) {
    var d = toWestern(s).replace(/[\s\-().]/g, '').replace(/^(\+|00)965/, '');
    return /^965\d{8}$/.test(d) ? d.slice(3) : d; /* "965 5000 0000" typed without the plus */
  }
  var FIELDS = ['date', 'time', 'guests', 'name', 'phone'];
  function validateField(name) {
    var key = null, v;
    if (name === 'date') {
      v = dateIn.value;
      if (!v) key = 'err.date'; else if (v < todayIso()) key = 'err.datePast'; else if (v > maxIso()) key = 'err.dateFar';
    } else if (name === 'time') {
      if (!selectedTime()) key = 'err.time';
    } else if (name === 'guests') {
      v = Number(toWestern(guestsIn.value));
      if (!(v >= 1 && v <= 12 && Math.floor(v) === v)) key = 'err.guests';
    } else if (name === 'name') {
      v = nameIn.value.trim();
      var letters = (v.match(/[A-Za-zÀ-ɏء-يٱ-ۓ]/g) || []).length; /* letters only: Arabic-Indic digits don't count */
      if (letters < 2) key = 'err.name';
    } else if (name === 'phone') {
      v = phoneDigits(phoneIn.value);
      if (!v) key = 'err.phone'; else if (!/^[24569]\d{7}$/.test(v)) key = 'err.phoneBad';
    }
    setError(name, key);
    return !key;
  }
  function setError(name, key) {
    errors[name] = key;
    var err = $('#err-' + name);
    if (key) { err.textContent = t(key); err.hidden = false; } else { err.textContent = ''; err.hidden = true; }
    var input = { date: dateIn, guests: guestsIn, name: nameIn, phone: phoneIn }[name];
    if (input) { if (key) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    if (name === 'phone') phoneIn.parentNode.classList.toggle('invalid', !!key);
    if (name === 'time') $('.slots-field').classList.toggle('invalid', !!key);
  }
  function refreshErrors() {
    Object.keys(errors).forEach(function (n) { if (errors[n]) setError(n, errors[n]); });
    if (!alertEl.hidden) alertEl.textContent = t('err.summary');
  }
  /* focus the first invalid field and make sure its message is visible too (clear of the header and floating badge) */
  function focusField(name) {
    var el = name === 'time' ? ($('input[name="time"]:not(:disabled)', form) || dateIn) : { date: dateIn, guests: guestsIn, name: nameIn, phone: phoneIn }[name];
    if (!el) return;
    el.focus({ preventScroll: true });
    var field = el.closest('.field') || el, msg = $('#err-' + name);
    var top = field.getBoundingClientRect().top, bottom = (msg && !msg.hidden ? msg : field).getBoundingClientRect().bottom;
    var minTop = headerH() + 16, maxBottom = window.innerHeight - 96;
    if (top < minTop || bottom > maxBottom) {
      var dy = top < minTop || bottom - top > maxBottom - minTop ? top - minTop : bottom - maxBottom;
      scrollToY(window.scrollY + dy, true);
    }
  }
  function updateStepper() {
    var g = Number(guestsIn.value) || 0;
    $('[data-step="-1"]').disabled = g <= 1;
    $('[data-step="1"]').disabled = g >= 12;
  }
  $$('.step-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = Number(guestsIn.value) || 0;
      g = Math.min(12, Math.max(1, g + Number(b.getAttribute('data-step'))));
      guestsIn.value = g;
      updateStepper();
      if (touched.guests || errors.guests) validateField('guests');
    });
  });
  guestsIn.addEventListener('input', function () { guestsIn.value = toWestern(guestsIn.value); updateStepper(); if (errors.guests) validateField('guests'); });
  dateIn.addEventListener('change', function () { renderSlots(); renderDateReadout(); touched.date = true; validateField('date'); if (errors.time) validateField('time'); });
  dateIn.addEventListener('input', renderDateReadout);
  slotsBox.addEventListener('change', function () { touched.time = true; validateField('time'); });
  phoneIn.addEventListener('input', function () {
    var v = toWestern(phoneIn.value).replace(/[^\d+\s]/g, '');
    if (v !== phoneIn.value) phoneIn.value = v;
    if (errors.phone) validateField('phone');
  });
  phoneIn.addEventListener('blur', function () {
    var d = phoneDigits(phoneIn.value);
    if (/^\d{8}$/.test(d)) phoneIn.value = d.slice(0, 4) + ' ' + d.slice(4);
  });
  [['name', nameIn], ['phone', phoneIn], ['guests', guestsIn]].forEach(function (p) {
    p[1].addEventListener('blur', function () { if (p[1].value.trim() || touched[p[0]]) { touched[p[0]] = true; validateField(p[0]); } });
  });
  nameIn.addEventListener('input', function () { if (errors.name) validateField('name'); });
  notesIn.addEventListener('input', function () { $('#notes-count').textContent = notesIn.value.length + '/240'; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    FIELDS.forEach(function (n) { touched[n] = true; if (!validateField(n) && !first) first = n; });
    if (first) {
      /* set the summary right away (so the layout is final before we scroll to the first error); toggling a
         trailing no-break space changes the text without changing its height, so a repeat submit is re-announced */
      var again = !alertEl.hidden && alertEl.textContent.slice(-1) !== ' ';
      alertEl.hidden = false;
      alertEl.textContent = t('err.summary') + (again ? ' ' : '');
      focusField(first);
      return;
    }
    alertEl.hidden = true;
    var seat = $('input[name="seating"]:checked', form);
    var b = {
      ref: 'ME-' + Math.floor(1000 + Math.random() * 9000),
      date: dateIn.value, time: Number(selectedTime()), guests: Number(guestsIn.value),
      seating: seat ? seat.value : 'indoor', name: nameIn.value.trim(), phone: phoneDigits(phoneIn.value),
      occasion: occIn.value, notes: notesIn.value.trim(), sample: false
    };
    lastBooking = b;
    session.set('marsa-booking', JSON.stringify(b));
    showConfirmation(b, true);
    history.pushState(null, '', '#/reserve/confirmed');
  });

  function sampleBooking() {
    return { ref: 'ME-2481', date: isoAdd(todayIso(), 1), time: 1200, guests: 4, seating: 'terrace', name: '', phone: '50000000', occasion: 'birthday', notes: '', sample: true };
  }
  function renderConfirmation(b) {
    var p = String(b.phone || '');
    var masked = p.length === 8 ? p.charAt(0) + '••• ••' + p.slice(-2) : '••••';
    var ex = b.sample ? '<span class="ex-label">' + esc(t('example')) + '</span>' : '';
    var rows = [
      ['ref', esc(b.ref), 'ref wide'],
      ['date', esc(fmtDate(b.date)), 'wide'],
      ['time', esc(fmtTime(b.time))],
      ['guests', esc(t('guests', b.guests))],
      ['seating', esc(t('seat')[b.seating] || '')],
      ['name', esc(b.sample ? t('sample.name') : b.name) + ex],
      ['phone', '<bdi dir="ltr">+965 ' + esc(masked) + '</bdi>' + ex]
    ];
    if (b.occasion) rows.push(['occasion', esc(t('occ')[b.occasion] || '')]);
    var notes = b.sample ? t('sample.notes') : b.notes;
    if (notes) rows.push(['notes', esc(notes), 'wide']);
    $('#ticket-grid').innerHTML = rows.map(function (r) {
      return '<div' + (r[2] ? ' class="' + r[2] + '"' : '') + '><dt>' + esc(t('conf.' + r[0])) + '</dt><dd>' + r[1] + '</dd></div>';
    }).join('');
    $('#ticket-sample').hidden = !b.sample;
  }
  function showConfirmation(b, focus) {
    shownBooking = b;
    renderConfirmation(b);
    form.hidden = true;
    confirmEl.hidden = false;
    if (focus) {
      var card = $('.reserve-card');
      var top = card.getBoundingClientRect().top;
      if (top < headerH() || top > window.innerHeight * 0.6) scrollToY(card.getBoundingClientRect().top + window.scrollY - headerH() - 16, true);
      $('#confirm-title').focus({ preventScroll: true }); /* announces "Table reserved — demo" */
    }
  }
  function showForm() {
    shownBooking = null;
    confirmEl.hidden = true;
    form.hidden = false;
  }
  $('#btn-edit').addEventListener('click', function () {
    var b = shownBooking;
    showForm();
    if (b && !b.sample) {
      dateIn.value = b.date;
      slotsBox.setAttribute('data-keep', String(b.time));
      renderSlots();
      renderDateReadout();
    }
    replaceHash('#/reserve');
    dateIn.focus();
  });
  $('#btn-new').addEventListener('click', function () {
    form.reset();
    errors = {}; touched = {};
    FIELDS.forEach(function (n) { setError(n, null); });
    alertEl.hidden = true;
    dateIn.value = '';
    initDate();
    slotsBox.removeAttribute('data-keep');
    renderSlots();
    renderDateReadout();
    updateStepper();
    $('#notes-count').textContent = '0/240';
    showForm();
    replaceHash('#/reserve');
    dateIn.focus();
  });

  /* ------------------------------------------------------------------
     Routing (hash deep links) + smooth scrolling + scroll-spy
     ------------------------------------------------------------------ */
  var SECTIONS = ['home', 'signature', 'menu', 'story', 'gallery', 'visit', 'reserve'];
  var autoScroll = false, autoTimer = null, currentSec = null, booting = true, ignorePop = false;

  function parseRoute() {
    var h = location.hash || '';
    if (h.indexOf('#/') !== 0) return null;
    var bits = h.slice(2).split('?');
    var parts = bits[0].split('/').filter(Boolean).map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
    var params = {};
    (bits[1] || '').split('&').forEach(function (kv) { if (!kv) return; var x = kv.split('='); try { params[decodeURIComponent(x[0])] = decodeURIComponent((x[1] || '').replace(/\+/g, ' ')); } catch (e) { /* ignore */ } });
    return { parts: parts, params: params };
  }
  function replaceHash(h) {
    try { history.replaceState(history.state, '', location.pathname + location.search + h); } catch (e) { /* ignore */ }
  }
  function scrollToY(y, smooth) {
    autoScroll = true;
    window.clearTimeout(autoTimer);
    window.scrollTo({ top: Math.max(0, y), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    autoTimer = window.setTimeout(function () { autoScroll = false; spy(); }, smooth && !reduceMotion ? 1100 : 120);
  }
  function scrollToEl(el, smooth) {
    if (!el) return;
    var y = 0;
    if (el.id !== 'home') {
      y = el.getBoundingClientRect().top + window.scrollY - headerH();
      /* sections: skip most of the generous top padding so the heading lands just under the header */
      if (el.classList.contains('section')) y += Math.max(0, (parseFloat(window.getComputedStyle(el).paddingTop) || 0) - 40);
      else y -= 24;
    }
    scrollToY(y, smooth);
  }
  function handleRoute(opts) {
    opts = opts || {};
    var r = parseRoute();
    if (!r) return;
    var sec = r.parts[0] || 'home';
    if (SECTIONS.indexOf(sec) < 0) sec = 'home';
    var target = $('#' + sec), flash = null;

    if (sec === 'menu') {
      if (CATS.indexOf(r.parts[1]) > -1 && r.parts[1] !== menuState.cat) selectCat(r.parts[1], false);
      if (r.params.q != null && r.params.q !== menuState.q) { searchIn.value = r.params.q; menuState.q = r.params.q; renderMenu(); }
      if (r.parts[2]) { flash = focusDish(r.parts[2]); if (flash) target = flash; }
    }
    if (sec === 'gallery' && r.parts[1]) {
      var n = parseInt(r.parts[1], 10);
      if (n >= 1 && n <= galBtns.length) {
        if (!lbIsOpen()) scrollToEl(target, false);
        openLightbox(n - 1, false);
        return;
      }
    }
    if (lbIsOpen()) {
      closeLightbox();
      if (sec === 'gallery') return; /* Back from an open scene: just close it, keep the scroll position */
    }
    if (sec === 'reserve') {
      if (r.parts[1] === 'confirmed') { showConfirmation(lastBooking || sampleBooking(), false); target = $('.reserve-card'); }
      else if (r.parts[1] === 'check') { showForm(); FIELDS.forEach(function (f) { touched[f] = true; validateField(f); }); alertEl.hidden = false; alertEl.textContent = t('err.summary'); target = $('.reserve-card'); }
    }
    scrollToEl(target, opts.smooth);
    if (flash) {
      flash.classList.remove('flash'); void flash.offsetWidth; flash.classList.add('flash');
    }
    if (opts.focus && sec !== 'home') {
      /* a dish link moves focus to that dish; other links to the section heading */
      var heading = flash || $('.sec-title', $('#' + sec));
      if (heading) heading.focus({ preventScroll: true });
    }
  }
  function spy() {
    var y = window.scrollY + headerH() + window.innerHeight * 0.3, active = 'home';
    SECTIONS.forEach(function (id) { var el = $('#' + id); if (el && el.getBoundingClientRect().top + window.scrollY <= y) active = id; });
    if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 2) active = 'reserve';
    if (active !== currentSec) {
      currentSec = active;
      $$('[data-nav]').forEach(function (a) {
        if (a.getAttribute('data-nav') === active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    if (!autoScroll && !booting && !lbIsOpen()) {
      var r = parseRoute(), cur = r ? (r.parts[0] || 'home') : (location.hash ? null : 'home');
      if (cur !== null && cur !== active) replaceHash(active === 'home' ? '' : '#/' + active + (active === 'menu' ? '/' + menuState.cat : ''));
    }
  }
  var header = $('#site-header'), ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      header.classList.toggle('scrolled', window.scrollY > 8);
      spy();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  doc.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var wa = e.target.closest('[data-action="whatsapp"]');
    if (wa) { e.preventDefault(); toast(t('toast.wa')); return; }
    var a = e.target.closest('a[href^="#/"]');
    if (!a) return;
    e.preventDefault();
    closeMobileNav(false);
    var href = a.getAttribute('href');
    if (href === '#/') history.pushState(null, '', location.pathname + location.search + '#/');
    else history.pushState(null, '', href);
    handleRoute({ smooth: true, focus: true });
  });
  window.addEventListener('popstate', function () {
    if (ignorePop) { ignorePop = false; return; } /* our own history.back() after closing the lightbox */
    handleRoute({ smooth: true });
  });

  /* Mobile navigation */
  var navToggle = $('#nav-toggle'), mobileNav = $('#mobile-nav');
  function openMobileNav() {
    mobileNav.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', t('nav.close'));
    $('use', navToggle).setAttribute('href', '#i-x');
    header.classList.add('menu-open');
    html.classList.add('nav-open'); /* page behind the menu doesn't scroll */
    var first = $('a', mobileNav);
    if (first) first.focus();
  }
  function closeMobileNav(returnFocus) {
    if (mobileNav.hidden) return;
    mobileNav.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', t('nav.open'));
    $('use', navToggle).setAttribute('href', '#i-menu');
    header.classList.remove('menu-open');
    html.classList.remove('nav-open');
    if (returnFocus) navToggle.focus();
  }
  navToggle.addEventListener('click', function () { if (mobileNav.hidden) openMobileNav(); else closeMobileNav(true); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mobileNav.hidden) closeMobileNav(true); });
  /* a click outside the header, or on the dimmed scrim (the header's own ::after), closes the menu */
  doc.addEventListener('click', function (e) { if (!mobileNav.hidden && (!header.contains(e.target) || e.target === header)) closeMobileNav(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) closeMobileNav(false); });

  /* Map: the dark pill behind the "Marsa Ember" pin label is sized to the label (it changes with language and screen size) */
  function fitPinLabel() {
    var tx = $('#pin-label-text'), bg = $('#pin-label-bg'), b;
    if (!tx || !bg || !tx.getBBox) return;
    try { b = tx.getBBox(); } catch (e) { return; }
    if (!b || !b.width) return;
    var padX = Math.round(b.height * 0.55), h = b.height + 8, w = b.width + padX * 2;
    bg.setAttribute('x', (-w / 2).toFixed(1)); bg.setAttribute('width', w.toFixed(1));
    bg.setAttribute('y', (b.y - 4).toFixed(1)); bg.setAttribute('height', h.toFixed(1)); bg.setAttribute('rx', (h / 2).toFixed(1));
  }
  var pinTimer = null;
  window.addEventListener('resize', function () { window.clearTimeout(pinTimer); pinTimer = window.setTimeout(fitPinLabel, 120); });
  window.addEventListener('load', fitPinLabel);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitPinLabel);

  /* Floating buttons step aside while the booking section or footer is on screen (both have their own buttons) */
  var fabs = $$('.fab');
  if ('IntersectionObserver' in window && fabs.length) {
    var fabAway = {};
    var fabIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { fabAway[en.target.id || 'footer'] = en.isIntersecting; });
      var away = Object.keys(fabAway).some(function (k) { return fabAway[k]; });
      fabs.forEach(function (f) { f.classList.toggle('is-away', away); });
    }, { rootMargin: '0px 0px -12% 0px' });
    [$('#reserve'), $('.site-footer')].forEach(function (el) { if (el) fabIo.observe(el); });
  }

  /* ------------------------------------------------------------------
     Language switch
     ------------------------------------------------------------------ */
  var langBtn = $('#lang-toggle'), metaDesc = $('meta[name="description"]');
  function setLang(l, byUser) {
    var anchor = currentSec ? $('#' + currentSec) : null;
    var offset = anchor ? window.scrollY - (anchor.getBoundingClientRect().top + window.scrollY) : 0;
    lang = l;
    html.lang = l;
    html.dir = l === 'ar' ? 'rtl' : 'ltr';
    applyStatic();
    /* visible name of the other language (in its own language) + hidden hint: the accessible name starts with the visible text */
    langBtn.innerHTML = '<span lang="' + t('lang.code') + '">' + esc(t('lang.label')) + '</span><span class="visually-hidden"> – ' + esc(t('lang.aria')) + '</span>';
    navToggle.setAttribute('aria-label', mobileNav.hidden ? t('nav.open') : t('nav.close'));
    doc.title = t('meta.title');
    if (metaDesc) metaDesc.setAttribute('content', t('meta.desc'));
    fillDishes();
    renderMenu(true);
    renderHours();
    renderStatus();
    renderSlots();
    renderDateReadout();
    refreshErrors();
    if (shownBooking) renderConfirmation(shownBooking);
    if (lbIsOpen()) renderLightbox(false);
    html.classList.remove('i18n-pending');
    fitPinLabel();
    updateTabFade();
    if (byUser) {
      store.set('marsa-lang', l);
      try {
        var u = new URL(location.href);
        if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); history.replaceState(history.state, '', u.pathname + u.search + u.hash); }
      } catch (e) { /* ignore */ }
      if (anchor && currentSec !== 'home') scrollToY(anchor.getBoundingClientRect().top + window.scrollY + offset, false);
    }
  }
  langBtn.addEventListener('click', function () { setLang(lang === 'ar' ? 'en' : 'ar', true); });

  /* ------------------------------------------------------------------
     Reveal-on-scroll
     ------------------------------------------------------------------ */
  $$('[data-stagger]').forEach(function (p) {
    Array.prototype.forEach.call(p.children, function (c, i) { if (c.classList.contains('reveal')) c.style.setProperty('--d', (i * 0.08).toFixed(2) + 's'); });
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  initDate();
  updateStepper();
  setLang(lang, false);
  window.setInterval(function () { renderStatus(); renderHours(); }, 30000);

  /* Deep links: route now, then again once web fonts and the full page have settled (layout can shift). */
  var endBoot = function () { window.setTimeout(function () { booting = false; spy(); }, 700); };
  if (location.hash.indexOf('#/') === 0 && location.hash.length > 2) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var go = function () { if (!lbIsOpen()) handleRoute({ smooth: false }); };
    go();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { window.requestAnimationFrame(go); });
    if (doc.readyState === 'complete') { window.setTimeout(go, 60); endBoot(); }
    else window.addEventListener('load', function () { window.setTimeout(go, 60); endBoot(); });
  } else if (doc.readyState === 'complete') endBoot();
  else window.addEventListener('load', endBoot);
  onScroll();
})();
