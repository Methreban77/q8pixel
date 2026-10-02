/* Sadeem — concept store data (invented business, demo content only) */
(function () {
  'use strict';

  var COLLECTIONS = {
    oud: {
      en: 'Oud', ar: 'العود',
      blurb: { en: 'Rare oils and oud perfumes, aged for depth.', ar: 'دهن عود نادر وعطور عود معتّقة بعمق آسر.' },
      bg: 'wine', show: ['dehn-malaki', 'nokhatha']
    },
    musk: {
      en: 'Musk', ar: 'المسك',
      blurb: { en: 'Soft, clean musks for everyday elegance.', ar: 'مسك ناعم ونقي لأناقة كل يوم.' },
      bg: 'blush', show: ['musk-ward', 'musk-harir']
    },
    bakhoor: {
      en: 'Bakhoor', ar: 'البخور',
      blurb: { en: 'Hand-made blends for home, majlis and clothes.', ar: 'بخور معمول يدويًا للبيت والمجلس والملابس.' },
      bg: 'dusk', show: ['bakhoor-majlis', 'bakhoor-arous']
    },
    gifts: {
      en: 'Gift sets', ar: 'أطقم الهدايا',
      blurb: { en: 'Wrapped and ready for Eid, weddings and new homes.', ar: 'مغلّفة وجاهزة للعيد والأعراس والبيوت الجديدة.' },
      bg: 'sand', show: ['set-majlis']
    }
  };

  var WEAR = {
    day: { en: 'Day', ar: 'النهار' },
    evening: { en: 'Evening', ar: 'المساء' },
    occasion: { en: 'Occasions', ar: 'المناسبات' },
    home: { en: 'Home & majlis', ar: 'البيت والمجلس' },
    gift: { en: 'Gifting', ar: 'الإهداء' }
  };

  var HOWTO = {
    oil: {
      en: 'Warm a single drop between your wrists and behind the ears — a little goes a long way. Layer a perfume on top for extra depth.',
      ar: 'دفّئ قطرة واحدة على المعصمين وخلف الأذنين، فالقليل منه يكفي. ولعمقٍ أكبر، رشّ فوقه عطرك المفضّل.'
    },
    perfume: {
      en: 'Spray on skin and clothes from about 15 cm. For a longer trail, apply over a drop of dehn al oud.',
      ar: 'رشّه على البشرة والملابس من مسافة 15 سم تقريبًا، ولأثرٍ يدوم أطول ضعه فوق قطرة من دهن العود.'
    },
    bakhoor: {
      en: 'Light a charcoal disc and wait until it turns white, then place one or two pieces on top in your mabkhara.',
      ar: 'أشعل قطعة فحم وانتظر حتى يكسوها الرماد الأبيض، ثم ضع قطعة أو قطعتين من البخور فوقها في المبخرة.'
    },
    wood: {
      en: 'Place a small chip on a glowing charcoal, let it smoke slowly, then pass the mabkhara around your guests.',
      ar: 'ضع قطعة صغيرة على جمرة متّقدة واتركها تتبخّر على مهل، ثم مرّر المبخرة على ضيوفك.'
    },
    set: {
      en: 'Arrives gift-wrapped with a handwritten card — just add your message at checkout.',
      ar: 'يصلك مغلّفًا كهدية مع بطاقة مكتوبة بخط اليد، فقط أضف رسالتك عند إتمام الطلب.'
    }
  };

  function n(en, ar) { return { en: en, ar: ar }; }
  function s(en, ar, price) { return { en: en, ar: ar, price: price }; }

  var PRODUCTS = [
    {
      id: 'nokhatha', col: 'oud', badge: 'best', how: 'perfume',
      name: n('Nokhatha', 'النوخذة'),
      type: n('Oud eau de parfum', 'ماء عطر بالعود'),
      desc: n('Named after the dhow captains who brought oud home across the Gulf. Smoky Cambodian oud wrapped in saffron and Taifi rose, settling into soft leather — confident, warm and unmistakably Kuwaiti.',
        'سمّيناه تيمّنًا بالنواخذة الذين حملوا العود عبر الخليج إلى ديارهم. عود كمبودي مدخّن يلفّه الزعفران والورد الطائفي، ثم يستقر على لمسة جلد ناعمة؛ عطر واثق ودافئ وكويتي الهوية.'),
      notes: { top: [n('Saffron', 'زعفران'), n('Pink pepper', 'فلفل وردي')], heart: [n('Cambodian oud', 'عود كمبودي'), n('Taifi rose', 'ورد طائفي')], base: [n('Leather', 'جلد'), n('Sandalwood', 'صندل')] },
      sizes: [s('50 ml', '50 مل', 24.5), s('100 ml', '100 مل', 38)],
      intensity: 5, longevity: 5, wear: ['evening', 'occasion'],
      art: { shape: 'facet', glass: '#2b1d16', liquid: '#9a5320', level: 0.72, cap: 'crown', metal: 'gold', bg: 'wine', label: 'light' }
    },
    {
      id: 'dehn-malaki', col: 'oud', badge: 'best', how: 'oil',
      name: n('Dehn Al Oud Malaki', 'دهن العود الملكي'),
      type: n('Pure oud oil', 'دهن عود خالص'),
      desc: n('Our most treasured oil: wild agarwood, distilled slowly and aged for four years in glass. A single drop opens with dark honey and resin, then deepens into smooth, animalic wood that lasts all day.',
        'أثمن ما في دارنا: دهن من خشب العود البرّي، يُقطَّر على مهل ويُعتَّق أربع سنوات في الزجاج. تنفتح القطرة الواحدة على العسل الداكن والراتنج، ثم تتعمّق في خشب ناعم دافئ يدوم طوال اليوم.'),
      notes: { top: [n('Dark honey', 'عسل داكن'), n('Resin', 'راتنج')], heart: [n('Aged agarwood', 'خشب عود معتّق')], base: [n('Musk', 'مسك'), n('Smoked wood', 'خشب مدخّن')] },
      sizes: [s('3 ml', '3 مل', 18), s('6 ml', '6 مل', 34), s('12 ml · 1 tola', '12 مل · تولة واحدة', 62)],
      intensity: 5, longevity: 5, wear: ['evening', 'occasion'],
      art: { shape: 'attar', glass: '#8a4512', liquid: '#3e1a06', level: 0.62, cap: 'spire', metal: 'gold', bg: 'dusk', label: 'light' }
    },
    {
      id: 'layl-sadu', col: 'oud', badge: 'new', how: 'perfume',
      name: n('Sadu Night', 'ليل السدو'),
      type: n('Rose & oud eau de parfum', 'ماء عطر بالورد والعود'),
      desc: n('Inspired by the deep reds and blacks of Sadu weaving. Damask rose and plum meet dark oud and patchouli in an evening scent with real presence.',
        'مستوحى من الأحمر القاني والأسود في نسيج السدو. يلتقي الورد الدمشقي والبرقوق بالعود الداكن والباتشولي في عطر مسائي حاضر بقوة.'),
      notes: { top: [n('Plum', 'برقوق'), n('Blackcurrant', 'كشمش أسود')], heart: [n('Damask rose', 'ورد دمشقي'), n('Oud', 'عود')], base: [n('Patchouli', 'باتشولي'), n('Amber', 'عنبر')] },
      sizes: [s('50 ml', '50 مل', 22), s('100 ml', '100 مل', 34.5)],
      intensity: 4, longevity: 4, wear: ['evening'],
      art: { shape: 'tall', glass: '#5e1626', liquid: '#8c1f33', level: 0.8, cap: 'slab', metal: 'black', bg: 'blush', label: 'dark' }
    },
    {
      id: 'oud-bahar', col: 'oud', badge: null, how: 'perfume',
      name: n('Oud Al Bahar', 'عود البحر'),
      type: n('Fresh oud eau de parfum', 'ماء عطر بالعود المنعش'),
      desc: n('A breezy oud for long summer evenings on the Gulf coast. Sea salt and bergamot lift a clean, dry oud that rests on ambergris and driftwood.',
        'عود منعش لأمسيات الصيف الطويلة على ساحل الخليج. يُنعش ملحُ البحر والبرغموت عودًا نقيًا جافًا يستقر على العنبر الرمادي وأخشاب البحر.'),
      notes: { top: [n('Sea salt', 'ملح البحر'), n('Bergamot', 'برغموت')], heart: [n('Dry oud', 'عود جاف'), n('Lavender', 'خزامى')], base: [n('Ambergris', 'عنبر رمادي'), n('Driftwood', 'أخشاب بحرية')] },
      sizes: [s('50 ml', '50 مل', 19.5), s('100 ml', '100 مل', 29)],
      intensity: 3, longevity: 4, wear: ['day', 'evening'],
      art: { shape: 'round', glass: '#2f434a', liquid: '#7c9a9c', level: 0.66, cap: 'sphere', metal: 'silver', bg: 'mist', label: 'light' }
    },
    {
      id: 'amber-dune', col: 'oud', badge: 'best', how: 'perfume',
      name: n('Amber Dune', 'عنبر الكثبان'),
      type: n('Amber eau de parfum', 'ماء عطر بالعنبر'),
      desc: n('Golden hour over the desert. Warm amber, vanilla and benzoin glow around a soft heart of oud — sweet, smooth and easy to love.',
        'لحظة الغروب الذهبية فوق الكثبان. عنبر دافئ وفانيلا وجاوي تتوهّج حول قلب ناعم من العود؛ عطر حلو وانسيابي يُحَبّ من أول رشّة.'),
      notes: { top: [n('Cardamom', 'هيل'), n('Mandarin', 'يوسفي')], heart: [n('Oud', 'عود'), n('Labdanum', 'لادن')], base: [n('Amber', 'عنبر'), n('Vanilla', 'فانيلا'), n('Benzoin', 'جاوي')] },
      sizes: [s('50 ml', '50 مل', 21), s('100 ml', '100 مل', 32)],
      intensity: 4, longevity: 4, wear: ['day', 'evening'],
      art: { shape: 'drop', glass: '#b0661a', liquid: '#d98e2f', level: 0.7, cap: 'dome', metal: 'gold', bg: 'saffron', label: 'dark' }
    },
    {
      id: 'musk-harir', col: 'musk', badge: 'best', how: 'perfume',
      name: n('Silk Musk', 'مسك الحرير'),
      type: n('White musk eau de parfum', 'ماء عطر بالمسك الأبيض'),
      desc: n('Freshly washed linen and warm skin. A clean white musk softened with iris and a whisper of pear — the scent people will ask you about.',
        'رائحة القطن المغسول للتو ودفء البشرة. مسك أبيض نقي يلطّفه السوسن مع لمسة خفيفة من الكمثرى؛ العطر الذي سيسألك عنه الجميع.'),
      notes: { top: [n('Pear', 'كمثرى'), n('White tea', 'شاي أبيض')], heart: [n('Iris', 'سوسن'), n('Cotton flower', 'زهر القطن')], base: [n('White musk', 'مسك أبيض'), n('Cashmere wood', 'خشب الكشمير')] },
      sizes: [s('50 ml', '50 مل', 14.5), s('100 ml', '100 مل', 22)],
      intensity: 2, longevity: 3, wear: ['day'],
      art: { shape: 'flacon', glass: '#efe7da', liquid: '#f6efe2', level: 0.75, frosted: true, cap: 'cube', metal: 'gold', bg: 'ink', label: 'dark' }
    },
    {
      id: 'musk-ward', col: 'musk', badge: null, how: 'perfume',
      name: n('Rose Musk', 'مسك الورد'),
      type: n('Rose musk eau de parfum', 'ماء عطر بمسك الورد'),
      desc: n('A bouquet of Taifi rose petals resting on powdery musk. Soft enough for the office, romantic enough for a wedding.',
        'باقة من بتلات الورد الطائفي تستقر على مسك بودري ناعم؛ هادئ بما يكفي للعمل، ورومانسي بما يكفي لحفل زفاف.'),
      notes: { top: [n('Lychee', 'ليتشي'), n('Pink pepper', 'فلفل وردي')], heart: [n('Taifi rose', 'ورد طائفي'), n('Peony', 'فاوانيا')], base: [n('Powdery musk', 'مسك بودري'), n('Cedar', 'أرز')] },
      sizes: [s('50 ml', '50 مل', 15.5), s('100 ml', '100 مل', 23.5)],
      intensity: 3, longevity: 3, wear: ['day', 'occasion'],
      art: { shape: 'round', glass: '#d99a9b', liquid: '#ecb7b5', level: 0.7, cap: 'gem', metal: 'rose', bg: 'blush', label: 'light' }
    },
    {
      id: 'musk-ghaim', col: 'musk', badge: 'new', how: 'perfume',
      name: n('Cloud Musk', 'مسك الغيم'),
      type: n('Powdery musk eau de parfum', 'ماء عطر بالمسك البودري'),
      desc: n('Weightless and airy, like the first rain cloud over Kuwait in autumn. Musk, violet leaf and ambrette on a soft bed of vanilla.',
        'خفيف كالنسمة، كأول غيمة مطر تعبر سماء الكويت في الخريف. مسك وورق البنفسج وحبّ المسك على قاعدة ناعمة من الفانيلا.'),
      notes: { top: [n('Violet leaf', 'ورق البنفسج'), n('Rain accord', 'نفحة المطر')], heart: [n('Ambrette', 'حبّ المسك'), n('Magnolia', 'ماغنوليا')], base: [n('Musk', 'مسك'), n('Vanilla', 'فانيلا')] },
      sizes: [s('50 ml', '50 مل', 13), s('100 ml', '100 مل', 19.5)],
      intensity: 2, longevity: 3, wear: ['day'],
      art: { shape: 'tall', glass: '#c9c2d8', liquid: '#e4ddee', level: 0.78, cap: 'slab', metal: 'silver', bg: 'lilac', label: 'light' }
    },
    {
      id: 'ghawwas', col: 'musk', badge: null, how: 'perfume',
      name: n('Pearl Diver', 'الغوّاص'),
      type: n('Marine musk eau de parfum', 'ماء عطر بالمسك البحري'),
      desc: n('A tribute to Kuwait’s pearl divers. Cool sea air, black lime and a mother-of-pearl musk, finished with a soft trail of white amber.',
        'تحيّة لغوّاصي اللؤلؤ في الكويت. نسيم بحر بارد ولومي ومسك بلون الصدف، مع أثر ناعم من العنبر الأبيض.'),
      notes: { top: [n('Sea breeze', 'نسيم البحر'), n('Black lime', 'لومي')], heart: [n('Water lily', 'زنبق الماء'), n('Pearl musk', 'مسك اللؤلؤ')], base: [n('White amber', 'عنبر أبيض'), n('Vetiver', 'نجيل الهند')] },
      sizes: [s('50 ml', '50 مل', 16), s('100 ml', '100 مل', 24.5)],
      intensity: 3, longevity: 3, wear: ['day'],
      art: { shape: 'drop', glass: '#c3d3d8', liquid: '#a9c1c7', level: 0.64, cap: 'sphere', metal: 'silver', bg: 'pearl', label: 'light' }
    },
    {
      id: 'musk-zafaran', col: 'musk', badge: null, how: 'perfume',
      name: n('Saffron Musk', 'مسك الزعفران'),
      type: n('Saffron eau de parfum', 'ماء عطر بالزعفران'),
      desc: n('Golden saffron threads warmed by honeyed musk and a touch of rose — the scent of Gulf hospitality, made wearable.',
        'خيوط زعفران ذهبية يدفّئها مسك معسول ولمسة من الورد؛ رائحة الضيافة الخليجية في عطر يرافقك كل يوم.'),
      notes: { top: [n('Saffron', 'زعفران'), n('Cardamom', 'هيل')], heart: [n('Rose', 'ورد'), n('Honey', 'عسل')], base: [n('Musk', 'مسك'), n('Tonka bean', 'حبوب التونكا')] },
      sizes: [s('50 ml', '50 مل', 17.5), s('100 ml', '100 مل', 26.5)],
      intensity: 3, longevity: 4, wear: ['day', 'occasion'],
      art: { shape: 'facet', glass: '#c2611a', liquid: '#e58d2c', level: 0.7, cap: 'cube', metal: 'black', bg: 'sand', label: 'dark' }
    },
    {
      id: 'bakhoor-majlis', col: 'bakhoor', badge: 'best', how: 'bakhoor',
      name: n('Majlis Bakhoor', 'بخور المجلس'),
      type: n('Hand-made bakhoor', 'بخور معمول يدويًا'),
      desc: n('Our house blend for welcoming guests: oud chips soaked in rose oil with sandalwood and musk, pressed by hand. One piece fills the majlis.',
        'خلطة دارنا لاستقبال الضيوف: رقائق عود منقوعة في دهن الورد مع الصندل والمسك، معمولة يدويًا. قطعة واحدة تكفي لتعطير المجلس.'),
      notes: { top: [n('Rose oil', 'دهن الورد')], heart: [n('Oud', 'عود'), n('Sandalwood', 'صندل')], base: [n('Musk', 'مسك'), n('Amber', 'عنبر')] },
      sizes: [s('50 g', '50 غرام', 7.5), s('100 g', '100 غرام', 13.5)],
      intensity: 4, longevity: 4, wear: ['home', 'occasion'],
      art: { shape: 'jar', glass: '#d9c3a0', liquid: '#4a2614', cap: 'dome', metal: 'gold', bg: 'dusk', label: 'light', smoke: true }
    },
    {
      id: 'bakhoor-arous', col: 'bakhoor', badge: 'new', how: 'bakhoor',
      name: n('Bridal Bakhoor', 'بخور العروس'),
      type: n('Bridal bakhoor', 'بخور للعرائس'),
      desc: n('Made for the henna night and the wedding day — jasmine, saffron and rose over a sweet oud base that clings to fabric for hours.',
        'صُنع لليلة الحنّاء ويوم الزفاف: ياسمين وزعفران وورد فوق قاعدة عود حلوة تبقى عالقة في الأقمشة لساعات.'),
      notes: { top: [n('Jasmine', 'ياسمين'), n('Saffron', 'زعفران')], heart: [n('Rose', 'ورد')], base: [n('Sweet oud', 'عود حلو'), n('Musk', 'مسك')] },
      sizes: [s('50 g', '50 غرام', 9), s('100 g', '100 غرام', 16.5)],
      intensity: 4, longevity: 4, wear: ['occasion', 'home'],
      art: { shape: 'tin', glass: '#6a1a2a', cap: 'band', metal: 'gold', bg: 'blush', smoke: true }
    },
    {
      id: 'oud-hindi', col: 'bakhoor', badge: null, how: 'wood',
      name: n('Hindi Oud Chips', 'عود هندي'),
      type: n('Natural oud wood', 'خشب عود طبيعي'),
      desc: n('Hand-selected chips of aged Indian agarwood, rich in natural oil. On the charcoal they release a deep, smoky sweetness — the classic scent of a Kuwaiti home.',
        'قطع منتقاة يدويًا من خشب العود الهندي المعتّق والغني بالدهن الطبيعي. توضع على الجمر فتفوح منها حلاوة مدخّنة عميقة؛ رائحة البيت الكويتي الأصيلة.'),
      notes: { top: [n('Smoke', 'دخان')], heart: [n('Indian oud', 'عود هندي'), n('Resin', 'راتنج')], base: [n('Dark wood', 'خشب داكن')] },
      sizes: [s('½ tola', 'نصف تولة', 14), s('1 tola', 'تولة واحدة', 26), s('3 tolas', '3 تولات', 72)],
      intensity: 5, longevity: 4, wear: ['home', 'occasion'],
      art: { shape: 'chest', glass: '#5a381f', cap: 'none', metal: 'gold', bg: 'sand', smoke: true }
    },
    {
      id: 'bakhoor-layali', col: 'bakhoor', badge: null, how: 'bakhoor',
      name: n('Layali Bakhoor', 'بخور ليالي'),
      type: n('Sweet amber bakhoor', 'بخور بالعنبر الحلو'),
      desc: n('Sweet and comforting: amber, vanilla and caramelised sugar over soft woods. Made for winter evenings and Ramadan nights.',
        'حلو ودافئ: عنبر وفانيلا وسكر مكرمل فوق أخشاب ناعمة؛ رفيق أمسيات الشتاء وليالي رمضان.'),
      notes: { top: [n('Caramel', 'كراميل')], heart: [n('Amber', 'عنبر'), n('Vanilla', 'فانيلا')], base: [n('Soft woods', 'أخشاب ناعمة')] },
      sizes: [s('50 g', '50 غرام', 6.5), s('100 g', '100 غرام', 11.5)],
      intensity: 3, longevity: 3, wear: ['home'],
      art: { shape: 'jar', glass: '#2a211b', liquid: '#7a4a22', cap: 'dome', metal: 'black', bg: 'saffron', label: 'dark', smoke: true, opaque: true }
    },
    {
      id: 'set-majlis', col: 'gifts', badge: 'best', how: 'set',
      name: n('The Majlis Set', 'طقم المجلس'),
      type: n('Hosting gift set', 'طقم هدية للضيافة'),
      desc: n('Everything for hosting: Nokhatha eau de parfum (50 ml), Majlis Bakhoor (50 g) and a hand-finished brass mabkhara, presented in our signature box.',
        'كل ما تحتاجه لاستقبال ضيوفك: ماء عطر النوخذة (50 مل) وبخور المجلس (50 غرام) ومبخرة نحاسية مشغولة يدويًا، في علبتنا الخاصة.'),
      notes: { top: [n('Saffron', 'زعفران'), n('Rose oil', 'دهن الورد')], heart: [n('Cambodian oud', 'عود كمبودي')], base: [n('Sandalwood', 'صندل'), n('Musk', 'مسك')] },
      sizes: [s('Standard', 'الطقم الأساسي', 39), s('With name engraving', 'مع حفر الاسم', 42.5)],
      intensity: 4, longevity: 5, wear: ['gift', 'home'],
      art: { shape: 'openbox', glass: '#1a1512', ribbon: '#c9a46a', cap: 'none', metal: 'gold', bg: 'sand' }
    },
    {
      id: 'set-eid', col: 'gifts', badge: 'new', how: 'set',
      name: n('Eid Gift Box', 'صندوق العيد'),
      type: n('Gift box of three', 'علبة هدايا من ثلاثة عطور'),
      desc: n('Three 15 ml travel sprays — Silk Musk, Rose Musk and Amber Dune — in a keepsake box. A thoughtful Eidiya for family and friends.',
        'ثلاثة عطور للسفر بحجم 15 مل: مسك الحرير ومسك الورد وعنبر الكثبان، في علبة تذكارية أنيقة؛ عيدية مميّزة للأهل والأصدقاء.'),
      notes: { top: [n('Pear', 'كمثرى'), n('Lychee', 'ليتشي')], heart: [n('Taifi rose', 'ورد طائفي')], base: [n('White musk', 'مسك أبيض'), n('Amber', 'عنبر')] },
      sizes: [s('3 × 15 ml', '3 × 15 مل', 19.5), s('3 × 15 ml + bakhoor', '3 × 15 مل + بخور', 25)],
      intensity: 3, longevity: 3, wear: ['gift'],
      art: { shape: 'eidbox', glass: '#f1e8d8', ribbon: '#7a1f30', cap: 'none', metal: 'gold', bg: 'wine' }
    },
    {
      id: 'set-arous', col: 'gifts', badge: null, how: 'set',
      name: n('Bride’s Trousseau', 'جهاز العروس'),
      type: n('Bridal gift set', 'طقم هدايا للعروس'),
      desc: n('A wedding-day collection: Dehn Al Oud Malaki (3 ml), Rose Musk (50 ml), Bridal Bakhoor (50 g) and a crystal mabkhara, presented in a brass-studded mandoos chest tied with blush silk.',
        'مجموعة ليوم الزفاف: دهن العود الملكي (3 مل) ومسك الورد (50 مل) وبخور العروس (50 غرام) ومبخرة من الكريستال، في مندوس مرصّع بالنحاس ومربوط بشريطة من الحرير الوردي.'),
      notes: { top: [n('Jasmine', 'ياسمين'), n('Lychee', 'ليتشي')], heart: [n('Taifi rose', 'ورد طائفي'), n('Aged agarwood', 'خشب عود معتّق')], base: [n('Sweet oud', 'عود حلو'), n('Powdery musk', 'مسك بودري')] },
      sizes: [s('Standard', 'الطقم الأساسي', 49), s('With name engraving', 'مع حفر الاسم', 53)],
      intensity: 4, longevity: 5, wear: ['gift', 'occasion'],
      art: { shape: 'mandoos', glass: '#5b2a1c', ribbon: '#e6b4a8', cap: 'none', metal: 'gold', bg: 'blush' }
    },
    {
      id: 'set-discovery', col: 'gifts', badge: null, how: 'set',
      name: n('Discovery Set', 'طقم الاكتشاف'),
      type: n('Six sample vials', 'ست قوارير للتجربة'),
      desc: n('Not sure yet? Six 3 ml vials of our most-loved perfumes. Wear each for a day and find your signature scent before choosing a full bottle.',
        'لم تحسم اختيارك بعد؟ ست قوارير صغيرة بحجم 3 مل من أحبّ عطورنا. جرّب كل واحد منها ليوم كامل، واكتشف عطرك المميّز قبل اختيار القارورة الكاملة.'),
      notes: { top: [n('Saffron', 'زعفران'), n('Pear', 'كمثرى')], heart: [n('Rose', 'ورد'), n('Oud', 'عود')], base: [n('Musk', 'مسك'), n('Amber', 'عنبر')] },
      sizes: [s('6 × 3 ml', '6 × 3 مل', 9.5)],
      intensity: 3, longevity: 3, wear: ['gift', 'day'],
      art: { shape: 'vials', glass: '#e9dfcf', cap: 'none', metal: 'gold', bg: 'mist' }
    }
  ];

  var GOVERNORATES = [
    { id: 'capital', en: 'Capital', ar: 'العاصمة', areas: [
      ['Kuwait City', 'مدينة الكويت'], ['Sharq', 'شرق'], ['Dasman', 'دسمان'], ['Mirqab', 'المرقاب'], ['Qibla', 'القبلة'],
      ['Dasma', 'الدسمة'], ['Bneid Al-Gar', 'بنيد القار'], ['Daiya', 'الدعية'], ['Shamiya', 'الشامية'], ['Kaifan', 'كيفان'],
      ['Khaldiya', 'الخالدية'], ['Adailiya', 'العديلية'], ['Rawda', 'الروضة'], ['Yarmouk', 'اليرموك'], ['Surra', 'السرة'],
      ['Qortuba', 'قرطبة'], ['Nuzha', 'النزهة'], ['Faiha', 'الفيحاء'], ['Mansouriya', 'المنصورية'], ['Abdullah Al-Salem', 'ضاحية عبدالله السالم'], ['Shuwaikh', 'الشويخ']
    ] },
    { id: 'hawalli', en: 'Hawalli', ar: 'حولي', areas: [
      ['Hawalli', 'حولي'], ['Salmiya', 'السالمية'], ['Jabriya', 'الجابرية'], ['Rumaithiya', 'الرميثية'], ['Salwa', 'سلوى'],
      ['Mishref', 'مشرف'], ['Bayan', 'بيان'], ['Shaab', 'الشعب'], ['Hittin', 'حطين'], ['Salam', 'السلام'],
      ['Siddiq', 'الصديق'], ['Shuhada', 'الشهداء'], ['Zahra', 'الزهراء'], ['Mubarak Al-Abdullah', 'مبارك العبدالله']
    ] },
    { id: 'farwaniya', en: 'Farwaniya', ar: 'الفروانية', areas: [
      ['Farwaniya', 'الفروانية'], ['Khaitan', 'خيطان'], ['Jleeb Al-Shuyoukh', 'جليب الشيوخ'], ['Ardiya', 'العارضية'], ['Omariya', 'العمرية'],
      ['Rabiya', 'الرابية'], ['Rihab', 'الرحاب'], ['Andalous', 'الأندلس'], ['Ishbiliya', 'إشبيلية'], ['Firdous', 'الفردوس'], ['Abdullah Al-Mubarak', 'عبدالله المبارك']
    ] },
    { id: 'ahmadi', en: 'Ahmadi', ar: 'الأحمدي', areas: [
      ['Ahmadi', 'الأحمدي'], ['Fintas', 'الفنطاس'], ['Mahboula', 'المهبولة'], ['Mangaf', 'المنقف'], ['Fahaheel', 'الفحيحيل'],
      ['Abu Halifa', 'أبو حليفة'], ['Egaila', 'العقيلة'], ['Riqqa', 'الرقة'], ['Hadiya', 'هدية'], ['Sabahiya', 'الصباحية'],
      ['Fahad Al-Ahmad', 'فهد الأحمد'], ['Sabah Al-Ahmad', 'صباح الأحمد']
    ] },
    { id: 'jahra', en: 'Jahra', ar: 'الجهراء', areas: [
      ['Jahra', 'الجهراء'], ['Saad Al-Abdullah', 'سعد العبدالله'], ['Qasr', 'القصر'], ['Naeem', 'النعيم'], ['Oyoun', 'العيون'],
      ['Waha', 'الواحة'], ['Taima', 'تيماء'], ['Naseem', 'النسيم']
    ] },
    { id: 'mubarak', en: 'Mubarak Al-Kabeer', ar: 'مبارك الكبير', areas: [
      ['Mubarak Al-Kabeer', 'مبارك الكبير'], ['Adan', 'العدان'], ['Qurain', 'القرين'], ['Qusour', 'القصور'], ['Sabah Al-Salem', 'صباح السالم'],
      ['Messila', 'المسيلة'], ['Abu Fatira', 'أبو فطيرة'], ['Fnaitees', 'الفنيطيس'], ['Abu Al-Hasaniya', 'أبو الحصانية']
    ] }
  ];

  /* delivery windows; the checkout builds the next three available slots from the current Kuwait time */
  var SLOT_TIMES = {
    eve: n('6 – 10 pm', '6 – 10 مساءً'),
    am: n('10 am – 2 pm', '10 صباحًا – 2 ظهرًا'),
    pm: n('4 – 8 pm', '4 – 8 مساءً')
  };
  var DAYS = [
    n('Sunday', 'الأحد'), n('Monday', 'الاثنين'), n('Tuesday', 'الثلاثاء'), n('Wednesday', 'الأربعاء'),
    n('Thursday', 'الخميس'), n('Friday', 'الجمعة'), n('Saturday', 'السبت')
  ];

  var PAYMENTS = [
    { id: 'knet', name: n('KNET', 'كي نت'), desc: n('Pay with your Kuwaiti bank card on the KNET page.', 'ادفع ببطاقتك البنكية الكويتية عبر بوابة كي نت.') },
    { id: 'card', name: n('Credit card', 'بطاقة ائتمانية'), desc: n('Visa or Mastercard on a secure payment page.', 'فيزا أو ماستركارد عبر صفحة دفع آمنة.') },
    { id: 'cod', name: n('Cash on delivery', 'الدفع عند الاستلام'), desc: n('Pay the driver in cash or by card machine.', 'ادفع للمندوب نقدًا أو بالبطاقة عند الاستلام.') }
  ];

  window.SADEEM_DATA = {
    COLLECTIONS: COLLECTIONS, WEAR: WEAR, HOWTO: HOWTO, PRODUCTS: PRODUCTS,
    GOVERNORATES: GOVERNORATES, SLOT_TIMES: SLOT_TIMES, DAYS: DAYS, PAYMENTS: PAYMENTS,
    FREE_DELIVERY: 20, DELIVERY_FEE: 1
  };
})();
