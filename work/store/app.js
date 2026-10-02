/* Sadeem — concept online store (demo). Built by Q8Pixel. No data ever leaves the browser. */
(function () {
  'use strict';

  var D = window.SADEEM_DATA, A = window.SADEEM_ART;
  var P = D.PRODUCTS;
  var byId = {};
  P.forEach(function (p, i) { p.num = i + 1; byId[p.id] = p; });
  var GOV = {};
  D.GOVERNORATES.forEach(function (g) { GOV[g.id] = g; });
  var FREE = D.FREE_DELIVERY, FEE = D.DELIVERY_FEE;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= strings ================= */
  var STR = {
    en: {
      'meta.title': 'Sadeem — Oud & Perfume House · Concept store by Q8Pixel',
      'skip': 'Skip to content',
      'announce': 'Complimentary delivery across Kuwait on orders over <b>20.000 KD</b>',
      'announce.short': 'Free delivery over <b>20.000 KD</b>',
      'nav.label': 'Main', 'nav.shop': 'Shop all', 'nav.story': 'Our story', 'nav.home': 'Home',
      'menu': 'Open menu', 'menu.close': 'Close menu', 'menu.title': 'Menu', 'search': 'Search the shop',
      'search.go': 'Search',
      'lang.btn': 'عربي', 'lang.label': 'Switch to Arabic', 'lang.long': 'العربية',
      'cart.btn': 'Open cart, {n}',
      'concept': 'Concept project by Q8Pixel', 'concept.short': 'Concept project', 'home.label': 'Sadeem — home',
      'hero.eyebrow': 'Oud & perfume house · Salmiya, Kuwait',
      'hero.title': 'Aged oud, <em class="gold">with a modern soul.</em>',
      'hero.sub': 'Hand-blended oils, perfumes and bakhoor from our atelier in Salmiya — gift-wrapped and delivered across Kuwait.',
      'hero.cta': 'Shop the collection', 'hero.cta2': 'Our story',
      'hero.art': 'Three Sadeem pieces — an oud perfume, an oud oil and a bakhoor jar — on stone pedestals under a golden arch',
      'perks.label': 'Why shop with us',
      'perk.1': 'Free delivery over 20.000 KD', 'perk.2': 'Complimentary gift wrapping',
      'perk.3': 'Same-day delivery in Kuwait', 'perk.4': 'Two free samples in every order',
      'col.eyebrow': 'The collections', 'col.title': 'Four ways to wear scent',
      'col.sub': 'From pure dehn al oud to hand-made bakhoor, every piece is blended in small batches in Salmiya.',
      'best.eyebrow': 'Most loved', 'best.title': 'Bestsellers', 'best.all': 'View all scents',
      'rit.eyebrow': 'The Kuwaiti ritual', 'rit.title': 'Layer it the way our grandmothers did',
      'rit.1t': 'Oil first', 'rit.1d': 'Warm a drop of dehn al oud on your wrists and behind the ears. It anchors everything that follows.',
      'rit.2t': 'Then perfume', 'rit.2d': 'Mist a perfume over the oil — musk to soften, rose to brighten, oud to deepen.',
      'rit.3t': 'Finish with bakhoor', 'rit.3d': 'Let the smoke of the mabkhara pass through your dishdasha or abaya, and fill the majlis before guests arrive.',
      'rit.1a': 'An oud oil bottle with a falling drop', 'rit.2a': 'A perfume bottle with a fine mist', 'rit.3a': 'A brass mabkhara with rising smoke',
      'story.eyebrow': 'Our story', 'story.title': 'Carried by the dhows. Blended in Salmiya.',
      'story.def': 'Sadeem (<span lang="ar" class="ar-inline">سديم</span>) — the soft haze that rises from the mabkhara.',
      'story.p1': 'For generations, Kuwaiti dhows sailed to India and East Africa and came home carrying agarwood, sandalwood and saffron. Those scents became part of every home, every wedding and every Eid.',
      'story.p2': 'Sadeem is our tribute to that heritage: small batches of oils, perfumes and bakhoor, blended by hand and finished with a modern touch.',
      'story.v1t': 'Small batches', 'story.v1d': 'Every blend is aged and bottled in limited runs.',
      'story.v2t': 'Wrapped by hand', 'story.v2d': 'Every order leaves in our signature box.',
      'story.v3t': 'All of Kuwait', 'story.v3d': 'Delivered to all six governorates, from Jahra to Ahmadi.',
      'story.art': 'A Kuwaiti dhow sailing at sunset, framed by a golden arch',
      'gift.eyebrow': 'Gifting', 'gift.title': 'A gift that lingers',
      'gift.sub': 'Curated sets for Eid, weddings and new homes — wrapped in our signature box with a handwritten card.',
      'gift.cta': 'Shop gift sets', 'gift.art': 'A black gift box with a gold ribbon beside two Sadeem bottles',
      'news.title': 'Join the majlis', 'news.sub': 'New blends and seasonal bakhoor, once a month. No spam.',
      'news.label': 'Email address', 'news.ph': 'name@example.com', 'news.btn': 'Subscribe',
      'news.ok': 'Thank you! This is a demo, so your email was not saved or sent.',
      'crumbs': 'Breadcrumb',
      'shop.all': 'All scents', 'shop.allChip': 'All',
      'shop.blurb': 'Oud oils, perfumes, musk, bakhoor and gift sets — all hand-blended in small batches.',
      'shop.filter': 'Filter by collection', 'shop.searchLabel': 'Search products',
      'shop.ph': 'Search scents or notes…', 'shop.clear': 'Clear search', 'shop.sort': 'Sort by',
      'sort.featured': 'Featured', 'sort.asc': 'Price: low to high', 'sort.desc': 'Price: high to low',
      'shop.emptyT': 'No scents found',
      'shop.emptyD': 'Nothing matches “{q}” here. Try another note — like rose, saffron or musk.',
      'shop.emptyD2': 'Nothing in this collection matches your search.',
      'shop.reset': 'Clear filters',
      'from': 'From', 'qadd': 'Add {name} ({size}) to cart',
      'badge.best': 'Bestseller', 'badge.new': 'New',
      'pd.home': 'Home', 'pd.size': 'Size', 'pd.qty': 'Quantity', 'pd.dec': 'Decrease quantity', 'pd.inc': 'Increase quantity',
      'pd.add': 'Add to cart', 'pd.wa': 'Order on WhatsApp',
      'pd.notes': 'Fragrance notes', 'pd.top': 'Top notes', 'pd.heart': 'Heart notes', 'pd.base': 'Base notes',
      'pd.intensity': 'Intensity', 'pd.longevity': 'Longevity', 'pd.wear': 'Best for',
      'pd.how': 'How to use', 'pd.del': 'Delivery & gifting',
      'pd.delText': 'Delivered anywhere in Kuwait, usually within 24 hours. Delivery is free on orders over 20.000 KD, otherwise 1.000 KD. Every order arrives gift-wrapped with two samples.',
      'pd.perk1': 'Free delivery on orders over 20.000 KD', 'pd.perk2': 'Gift-wrapped by hand, free of charge', 'pd.perk3': 'Two complimentary samples with every order',
      'pd.like': 'You may also like', 'pd.likeE': 'Pairs well', 'pd.art': 'Illustration of {name}', 'meter': '{n} of 5',
      'pd.no': 'N° {n}', 'pd.quick': 'Quick add to cart',
      'pd.missing': 'We couldn’t find that scent.',
      'cart.title': 'Your cart', 'cart.close': 'Close cart',
      'cart.emptyT': 'Your cart is empty',
      'cart.emptyD': 'Start with a bestseller — or browse the collection to find your signature scent.',
      'cart.shop': 'Browse the collection',
      'cart.away': 'You are <b>{amt}</b> away from free delivery',
      'cart.free': 'Your order qualifies for free delivery',
      'cart.progress': 'Progress towards free delivery',
      'cart.sub': 'Subtotal', 'cart.del': 'Delivery', 'cart.freeTag': 'Free', 'cart.total': 'Total',
      'cart.checkout': 'Checkout', 'cart.remove': 'Remove', 'cart.removeA': 'Remove {name} from cart',
      'cart.removed': '{name} removed from your cart',
      'cart.note': 'Demo store — no payment is taken and nothing is sent.',
      'cart.each': '{price} each', 'added': '{name} added to your cart', 'view': 'View cart',
      'qtyA': '{name}: quantity {n}',
      'co.title': 'Checkout', 'co.steps': 'Checkout progress', 'co.step1': 'Cart', 'co.step2': 'Details', 'co.step3': 'Confirmation',
      'co.demoT': 'Demo store —', 'co.demo': 'no payment is taken and nothing is sent. Feel free to try the full checkout.',
      'co.contact': 'Contact details', 'co.name': 'Full name', 'co.phone': 'Mobile number', 'co.phoneHint': '8 digits, e.g. 5XXX XXXX',
      'co.email': 'Email (optional)', 'co.emailHint': 'For your order confirmation',
      'co.address': 'Delivery address', 'co.gov': 'Governorate', 'co.govPh': 'Select governorate',
      'co.area': 'Area', 'co.areaPh': 'Select area', 'co.areaFirst': 'Select a governorate first',
      'co.block': 'Block', 'co.street': 'Street', 'co.avenue': 'Avenue (optional)', 'co.house': 'House / building',
      'co.apt': 'Floor & apartment (optional)', 'co.notes': 'Directions for the driver (optional)',
      'co.time': 'Delivery time', 'co.gift': 'Gift options', 'co.wrap': 'Gift-wrap this order (complimentary)',
      'co.msg': 'Card message (optional)', 'co.msgLeft': '{n} characters left',
      'co.pay': 'Payment method',
      'co.payNote': 'In this demo no payment page opens and no card details are ever requested.',
      'co.summary': 'Order summary', 'co.edit': 'Edit cart', 'co.place': 'Place order', 'co.placing': 'Placing your order…',
      'co.alert': 'Please check the highlighted fields:', 'co.today': 'Today', 'co.tomorrow': 'Tomorrow',
      'co.emptyT': 'Your cart is empty', 'co.emptyD': 'Add a scent to your cart before checking out.',
      'co.qty': 'Qty: {n}',
      'addr.block': 'Block', 'addr.street': 'Street', 'addr.avenue': 'Avenue', 'addr.house': 'House',
      'err.name': 'Please enter your full name.',
      'err.phone': 'Enter an 8-digit Kuwaiti mobile number starting with 4, 5, 6 or 9.',
      'err.email': 'Please enter a valid email address.',
      'err.gov': 'Please choose a governorate.', 'err.area': 'Please choose an area.',
      'err.block': 'Enter a block number (digits only).', 'err.street': 'Enter a street name or number.',
      'err.house': 'Enter a house or building number.',
      'ok.eyebrow': 'Order confirmed', 'ok.title': 'Thank you, {name}.',
      'ok.sub': 'Your order is being prepared and gift-wrapped in our atelier.',
      'ok.no': 'Order number', 'ok.to': 'Delivering to', 'ok.when': 'Delivery time', 'ok.pay': 'Payment',
      'ok.demo': 'This is a demo order: nothing was charged, nothing was saved on a server and nothing was sent to anyone.',
      'ok.again': 'Continue shopping', 'ok.missT': 'Order not found',
      'ok.missD': 'We couldn’t find this order on this device. Orders in this demo are only kept in your browser.',
      'ok.items': 'Your items', 'ok.art': 'A gift box with a golden seal', 'ok.wrap': 'Gift-wrapped with a card:',
      'nf.title': 'This page drifted away like smoke.', 'nf.btn': 'Back to home',
      'ft.about': 'An imagined oud & perfume house in Salmiya, designed by Q8Pixel to show what a modern Kuwaiti boutique can look like online.',
      'ft.shop': 'Shop', 'ft.visit': 'Visit', 'ft.talk': 'Talk to us',
      'ft.addr': 'Salem Al-Mubarak Street, Salmiya, Kuwait',
      'ft.hours1': 'Sat – Thu · 10 am – 10 pm', 'ft.hours2': 'Friday · 4 – 10 pm',
      'ft.talkD': 'Questions about a scent or a gift? Our team is happy to help you choose.',
      'ft.disc': '<b>Sadeem is a concept project, not a real business.</b> Products, prices and orders are for demonstration only — nothing is sold, charged or sent.',
      'ft.credit': 'Designed &amp; built by <a href="../../">Q8Pixel</a>', 'ft.copy': '© 2026 Sadeem (concept)',
      'toast.wa': 'Demo only — in a real store this button would open a WhatsApp chat.',
      't.home': 'Sadeem — Oud & Perfume House · Concept store by Q8Pixel', 't.suffix': ' — Sadeem'
    },
    ar: {
      'meta.title': 'سديم — دار العود والعطور · متجر تجريبي من Q8Pixel',
      'skip': 'انتقل إلى المحتوى',
      'announce': 'توصيل مجاني لجميع مناطق الكويت للطلبات فوق <b>20.000 د.ك</b>',
      'announce.short': 'توصيل مجاني فوق <b>20.000 د.ك</b>',
      'nav.label': 'القائمة الرئيسية', 'nav.shop': 'جميع المنتجات', 'nav.story': 'قصتنا', 'nav.home': 'الرئيسية',
      'menu': 'فتح القائمة', 'menu.close': 'إغلاق القائمة', 'menu.title': 'القائمة', 'search': 'البحث في المتجر',
      'search.go': 'بحث',
      'lang.btn': 'EN', 'lang.label': 'التبديل إلى الإنجليزية', 'lang.long': 'English',
      'cart.btn': 'فتح السلة، {n}',
      'concept': 'مشروع تجريبي من Q8Pixel', 'concept.short': 'مشروع تجريبي', 'home.label': 'سديم — الصفحة الرئيسية',
      'hero.eyebrow': 'دار للعود والعطور · السالمية، الكويت',
      'hero.title': 'عود معتّق <em class="gold">بروح عصرية.</em>',
      'hero.sub': 'دهن عود وعطور وبخور نمزجها يدويًا في مشغلنا بالسالمية، ونغلّفها كهدية ونوصلها إلى جميع مناطق الكويت.',
      'hero.cta': 'تسوّق المجموعة', 'hero.cta2': 'قصتنا',
      'hero.art': 'ثلاث قطع من سديم: عطر عود ودهن عود وجرّة بخور، على قواعد حجرية تحت قوس ذهبي',
      'perks.label': 'لماذا تتسوّق معنا',
      'perk.1': 'توصيل مجاني فوق 20.000 د.ك', 'perk.2': 'تغليف هدايا مجاني',
      'perk.3': 'توصيل في اليوم نفسه داخل الكويت', 'perk.4': 'عيّنتان مجانيتان مع كل طلب',
      'col.eyebrow': 'المجموعات', 'col.title': 'أربع طرق للتعطّر',
      'col.sub': 'من دهن العود الخالص إلى البخور المعمول يدويًا، نمزج كل قطعة بكميات محدودة في السالمية.',
      'best.eyebrow': 'مختارات الدار', 'best.title': 'الأكثر مبيعًا', 'best.all': 'عرض جميع العطور',
      'rit.eyebrow': 'طقوس التعطّر الكويتية', 'rit.title': 'تعطّر كما علّمتنا جدّاتنا',
      'rit.1t': 'الدهن أولًا', 'rit.1d': 'دفّئ قطرة من دهن العود على المعصمين وخلف الأذنين، فهي الأساس الذي يثبّت كل ما يليها.',
      'rit.2t': 'ثم العطر', 'rit.2d': 'رشّ العطر فوق الدهن: المسك ليُلطّف، والورد ليُنعش، والعود ليمنح العمق.',
      'rit.3t': 'واختم بالبخور', 'rit.3d': 'مرّر دخان المبخرة على الدشداشة أو العباءة، وعطّر به المجلس قبل وصول الضيوف.',
      'rit.1a': 'قارورة دهن عود تتساقط منها قطرة', 'rit.2a': 'قارورة عطر يتطاير منها رذاذ ناعم', 'rit.3a': 'مبخرة نحاسية يتصاعد منها الدخان',
      'story.eyebrow': 'قصتنا', 'story.title': 'عودٌ حملته سفن الأجداد… ومزجناه في السالمية.',
      'story.def': 'السَّديم: ذلك الضباب الخفيف الذي يتصاعد من المبخرة.',
      'story.p1': 'على مدى أجيال، أبحرت السفن الكويتية إلى الهند وشرق أفريقيا وعادت محمّلة بخشب العود والصندل والزعفران، فصارت تلك الروائح جزءًا من كل بيت وكل عرس وكل عيد.',
      'story.p2': '«سديم» تحيّة منّا لهذا الإرث: دفعات صغيرة من دهن العود والعطور والبخور، نمزجها يدويًا ونضفي عليها لمسة عصرية.',
      'story.v1t': 'كميات محدودة', 'story.v1d': 'كل تركيبة تُعتّق وتُعبّأ بدفعات صغيرة.',
      'story.v2t': 'تغليف يدوي', 'story.v2d': 'يصلك كل طلب في علبتنا الخاصة.',
      'story.v3t': 'لكل الكويت', 'story.v3d': 'نوصل إلى المحافظات الست، من الجهراء إلى الأحمدي.',
      'story.art': 'سفينة شراعية كويتية تبحر عند الغروب داخل قوس ذهبي',
      'gift.eyebrow': 'الهدايا', 'gift.title': 'هدية يبقى أثرها',
      'gift.sub': 'أطقم مختارة للعيد والأعراس والبيوت الجديدة، مغلّفة في علبتنا الخاصة مع بطاقة مكتوبة بخط اليد.',
      'gift.cta': 'تسوّق أطقم الهدايا', 'gift.art': 'علبة هدايا سوداء بشريطة ذهبية بجانب قارورتين من سديم',
      'news.title': 'انضم إلى مجلسنا', 'news.sub': 'جديد تركيباتنا وبخورنا الموسمي في رسالة واحدة كل شهر، بلا إزعاج.',
      'news.label': 'البريد الإلكتروني', 'news.ph': 'name@example.com', 'news.btn': 'اشترك',
      'news.ok': 'شكرًا لك! هذا عرض تجريبي، لذلك لم يُحفظ بريدك ولم يُرسل.',
      'crumbs': 'مسار التصفح',
      'shop.all': 'جميع المنتجات', 'shop.allChip': 'الكل',
      'shop.blurb': 'دهن عود وعطور ومسك وبخور وأطقم هدايا، كلها ممزوجة يدويًا بكميات محدودة.',
      'shop.filter': 'تصفية حسب المجموعة', 'shop.searchLabel': 'البحث في المنتجات',
      'shop.ph': 'ابحث عن عطر أو مكوّن…', 'shop.clear': 'مسح البحث', 'shop.sort': 'ترتيب حسب',
      'sort.featured': 'الترتيب المقترح', 'sort.asc': 'السعر: من الأقل إلى الأعلى', 'sort.desc': 'السعر: من الأعلى إلى الأقل',
      'shop.emptyT': 'لم نجد ما تبحث عنه',
      'shop.emptyD': 'لا توجد نتائج مطابقة لـ«{q}». جرّب مكوّنًا آخر مثل الورد أو الزعفران أو المسك.',
      'shop.emptyD2': 'لا توجد منتجات مطابقة في هذه المجموعة.',
      'shop.reset': 'مسح عوامل التصفية',
      'from': 'ابتداءً من', 'qadd': 'أضف {name} ({size}) إلى السلة',
      'badge.best': 'الأكثر مبيعًا', 'badge.new': 'جديد',
      'pd.home': 'الرئيسية', 'pd.size': 'الحجم', 'pd.qty': 'الكمية', 'pd.dec': 'إنقاص الكمية', 'pd.inc': 'زيادة الكمية',
      'pd.add': 'أضف إلى السلة', 'pd.wa': 'اطلب عبر واتساب',
      'pd.notes': 'المكوّنات العطرية', 'pd.top': 'المقدّمة', 'pd.heart': 'القلب', 'pd.base': 'القاعدة',
      'pd.intensity': 'قوة الفوحان', 'pd.longevity': 'الثبات', 'pd.wear': 'يناسب',
      'pd.how': 'طريقة الاستخدام', 'pd.del': 'التوصيل والتغليف',
      'pd.delText': 'نوصل إلى أي منطقة في الكويت خلال 24 ساعة عادةً. التوصيل مجاني للطلبات التي تتجاوز 20.000 د.ك، وإلا فرسومه 1.000 د.ك. ويصلك كل طلب مغلّفًا كهدية مع عيّنتين مجانيتين.',
      'pd.perk1': 'توصيل مجاني للطلبات فوق 20.000 د.ك', 'pd.perk2': 'تغليف يدوي للهدايا بلا رسوم', 'pd.perk3': 'عيّنتان مجانيتان مع كل طلب',
      'pd.like': 'قد يعجبك أيضًا', 'pd.likeE': 'يُكمل اختيارك', 'pd.art': 'رسم توضيحي: {name}', 'meter': '{n} من 5',
      'pd.no': 'رقم {n}', 'pd.quick': 'إضافة سريعة إلى السلة',
      'pd.missing': 'لم نعثر على هذا المنتج.',
      'cart.title': 'سلة التسوق', 'cart.close': 'إغلاق السلة',
      'cart.emptyT': 'سلتك فارغة',
      'cart.emptyD': 'ابدأ بأحد منتجاتنا الأكثر مبيعًا، أو تصفّح المجموعة لتجد عطرك المميّز.',
      'cart.shop': 'تصفّح المجموعة',
      'cart.away': 'أضف <b>{amt}</b> لتحصل على توصيل مجاني',
      'cart.free': 'رائع! طلبك مؤهّل للتوصيل المجاني',
      'cart.progress': 'التقدّم نحو التوصيل المجاني',
      'cart.sub': 'المجموع الفرعي', 'cart.del': 'التوصيل', 'cart.freeTag': 'مجاني', 'cart.total': 'الإجمالي',
      'cart.checkout': 'إتمام الطلب', 'cart.remove': 'إزالة', 'cart.removeA': 'إزالة {name} من السلة',
      'cart.removed': 'تمت إزالة {name} من سلتك',
      'cart.note': 'متجر تجريبي — لا يُحصَّل أي مبلغ ولا يُرسل أي شيء.',
      'cart.each': '{price} للقطعة', 'added': 'أُضيف {name} إلى سلتك', 'view': 'عرض السلة',
      'qtyA': '{name}: الكمية {n}',
      'co.title': 'إتمام الطلب', 'co.steps': 'مراحل الطلب', 'co.step1': 'السلة', 'co.step2': 'البيانات', 'co.step3': 'التأكيد',
      'co.demoT': 'متجر تجريبي —', 'co.demo': 'لا يُحصَّل أي مبلغ ولا يُرسل أي شيء. جرّب خطوات الطلب كاملة بكل حرية.',
      'co.contact': 'بيانات التواصل', 'co.name': 'الاسم الكامل', 'co.phone': 'رقم الهاتف النقال', 'co.phoneHint': '8 أرقام، مثل 5XXX XXXX',
      'co.email': 'البريد الإلكتروني (اختياري)', 'co.emailHint': 'لإرسال تأكيد الطلب',
      'co.address': 'عنوان التوصيل', 'co.gov': 'المحافظة', 'co.govPh': 'اختر المحافظة',
      'co.area': 'المنطقة', 'co.areaPh': 'اختر المنطقة', 'co.areaFirst': 'اختر المحافظة أولًا',
      'co.block': 'القطعة', 'co.street': 'الشارع', 'co.avenue': 'الجادة (اختياري)', 'co.house': 'المنزل / المبنى',
      'co.apt': 'الدور والشقة (اختياري)', 'co.notes': 'إرشادات لمندوب التوصيل (اختياري)',
      'co.time': 'موعد التوصيل', 'co.gift': 'خيارات الهدية', 'co.wrap': 'تغليف الطلب كهدية (مجانًا)',
      'co.msg': 'رسالة البطاقة (اختياري)', 'co.msgLeft': 'الأحرف المتبقية: {n}',
      'co.pay': 'طريقة الدفع',
      'co.payNote': 'في هذا العرض التجريبي لن تُفتح أي صفحة دفع، ولن تُطلب منك بيانات أي بطاقة.',
      'co.summary': 'ملخص الطلب', 'co.edit': 'تعديل السلة', 'co.place': 'تأكيد الطلب', 'co.placing': 'جارٍ تأكيد طلبك…',
      'co.alert': 'يرجى مراجعة الحقول التالية:', 'co.today': 'اليوم', 'co.tomorrow': 'غدًا',
      'co.emptyT': 'سلتك فارغة', 'co.emptyD': 'أضف منتجًا إلى سلتك قبل إتمام الطلب.',
      'co.qty': 'الكمية: {n}',
      'addr.block': 'قطعة', 'addr.street': 'شارع', 'addr.avenue': 'جادة', 'addr.house': 'منزل',
      'err.name': 'يرجى إدخال الاسم الكامل.',
      'err.phone': 'أدخل رقم هاتف كويتيًا من 8 أرقام يبدأ بـ 4 أو 5 أو 6 أو 9.',
      'err.email': 'يرجى إدخال بريد إلكتروني صحيح.',
      'err.gov': 'يرجى اختيار المحافظة.', 'err.area': 'يرجى اختيار المنطقة.',
      'err.block': 'يرجى إدخال رقم القطعة (أرقام فقط).', 'err.street': 'يرجى إدخال اسم الشارع أو رقمه.',
      'err.house': 'يرجى إدخال رقم المنزل أو المبنى.',
      'ok.eyebrow': 'تم تأكيد الطلب', 'ok.title': 'شكرًا لك، {name}.',
      'ok.sub': 'نجهّز طلبك الآن ونغلّفه بعناية في مشغلنا.',
      'ok.no': 'رقم الطلب', 'ok.to': 'عنوان التوصيل', 'ok.when': 'موعد التوصيل', 'ok.pay': 'طريقة الدفع',
      'ok.demo': 'هذا طلب تجريبي: لم يُخصم أي مبلغ، ولم يُحفظ شيء على أي خادم، ولم يُرسل أي شيء إلى أي جهة.',
      'ok.again': 'متابعة التسوق', 'ok.missT': 'لم نعثر على الطلب',
      'ok.missD': 'لم نجد هذا الطلب على هذا الجهاز، فالطلبات في هذا العرض التجريبي تُحفظ في متصفحك فقط.',
      'ok.items': 'منتجاتك', 'ok.art': 'علبة هدية عليها ختم ذهبي', 'ok.wrap': 'مغلّف كهدية مع بطاقة:',
      'nf.title': 'تلاشت هذه الصفحة كالدخان.', 'nf.btn': 'العودة إلى الرئيسية',
      'ft.about': 'دار عود وعطور متخيَّلة في السالمية، صمّمتها Q8Pixel لتُظهر كيف يمكن أن يبدو متجر كويتي عصري على الإنترنت.',
      'ft.shop': 'تسوّق', 'ft.visit': 'زورونا', 'ft.talk': 'تواصل معنا',
      'ft.addr': 'شارع سالم المبارك، السالمية، الكويت',
      'ft.hours1': 'السبت – الخميس · 10 صباحًا – 10 مساءً', 'ft.hours2': 'الجمعة · 4 – 10 مساءً',
      'ft.talkD': 'لديك سؤال عن عطر أو هدية؟ يسعد فريقنا بمساعدتك في الاختيار.',
      'ft.disc': '<b>«سديم» مشروع تجريبي وليس نشاطًا تجاريًا حقيقيًا.</b> المنتجات والأسعار والطلبات لأغراض العرض فقط، فلا يُباع أي شيء ولا يُخصم أي مبلغ ولا يُرسل أي شيء.',
      'ft.credit': 'تصميم وتطوير <a href="../../">Q8Pixel</a>', 'ft.copy': '© 2026 سديم (مشروع تجريبي)',
      'toast.wa': 'للعرض فقط — في المتجر الحقيقي سيفتح هذا الزر محادثة واتساب.',
      't.home': 'سديم — دار العود والعطور · متجر تجريبي من Q8Pixel', 't.suffix': ' — سديم'
    }
  };

  var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  function t(k, vars) {
    var s = STR[lang][k];
    if (s == null) s = STR.en[k];
    if (s == null) return k;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, v) { return vars[v] != null ? vars[v] : m; });
    return s;
  }
  function L(o) { return o ? (o[lang] != null ? o[lang] : o.en) : ''; }
  function r3(v) { return Math.round(v * 1000) / 1000; }
  function money(v) { return r3(v).toFixed(3) + ' ' + (lang === 'ar' ? 'د.ك' : 'KD'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function itemsLabel(n) {
    if (lang === 'ar') return n === 1 ? 'قطعة واحدة' : n === 2 ? 'قطعتان' : (n >= 3 && n <= 10) ? n + ' قطع' : n + ' قطعة';
    return n === 1 ? '1 item' : n + ' items';
  }
  function productsLabel(n) {
    if (lang === 'ar') return n === 0 ? 'لا توجد منتجات' : n === 1 ? 'منتج واحد' : n === 2 ? 'منتجان' : (n <= 10) ? n + ' منتجات' : n + ' منتجًا';
    return n === 1 ? '1 product' : n + ' products';
  }

  /* ================= storage ================= */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('sadeem.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('sadeem.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var session = {
    get: function (k, d) { try { var v = sessionStorage.getItem('sadeem.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem('sadeem.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del: function (k) { try { sessionStorage.removeItem('sadeem.' + k); } catch (e) { /* ignore */ } }
  };

  function sanitizeCart(c) {
    if (!Array.isArray(c)) return [];
    return c.filter(function (l) {
      return l && byId[l.id] && byId[l.id].sizes[l.s] && l.q > 0;
    }).map(function (l) { return { id: l.id, s: +l.s, q: Math.min(99, Math.max(1, Math.floor(l.q))) }; });
  }
  var cart = sanitizeCart(store.get('cart', []));
  function saveCart() { store.set('cart', cart); }
  function cartCount() { return cart.reduce(function (n, l) { return n + l.q; }, 0); }
  function unit(l) { return byId[l.id].sizes[l.s].price; }
  function totals(lines) {
    lines = lines || cart;
    var sub = r3(lines.reduce(function (s, l) { return s + byId[l.id].sizes[l.s].price * l.q; }, 0));
    var del = sub === 0 ? 0 : (sub >= FREE ? 0 : FEE);
    return { sub: sub, del: del, total: r3(sub + del) };
  }

  /* ================= icons ================= */
  var I = {
    bag: '<path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h11"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    truck: '<path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4l3.5 3.6V16h-7.5"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    gift: '<path d="M4.5 11h15v9h-15zM3.5 7.5h17V11h-17zM12 7.5V20"/><path d="M12 7.5C10.5 4.5 6.5 4 6.5 6s3.5 1.5 5.5 1.5zm0 0c1.5-3 5.5-3.5 5.5-1.5s-3.5 1.5-5.5 1.5z"/>',
    vial: '<path d="M9 3.5h6M10 3.5v13a2 2 0 0 0 4 0v-13M10 11h4"/>',
    sparkle: '<path d="M12 3c.8 4.5 2.7 6.7 7 7.5-4.3.8-6.2 3-7 7.5-.8-4.5-2.7-6.7-7-7.5 4.3-.8 6.2-3 7-7.5z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8h.01"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.3h.01"/>',
    chat: '<path d="M4.5 19.5l1.1-3.4A7.6 7.6 0 1 1 8.9 19z"/><path d="M9.2 9.5c.3 2.4 2 4.3 5.1 5.1"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    card: '<rect x="3" y="6" width="18" height="12.5" rx="2"/><path d="M3 10.2h18M7 15h3.5"/>',
    bank: '<path d="M3 9.5L12 4.5l9 5M5.5 10.5v6.5M9.8 10.5v6.5M14.2 10.5v6.5M18.5 10.5v6.5M3 20h18"/>',
    cash: '<rect x="2.5" y="7" width="19" height="10.5" rx="1.5"/><circle cx="12" cy="12.2" r="2.6"/><path d="M6 10v4.5M18 10v4.5"/>',
    box: '<path d="M3.5 8l8.5-4 8.5 4v8.5L12 20.5l-8.5-4z"/><path d="M3.5 8L12 12l8.5-4M12 12v8.5"/>',
    map: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    ext: '<path d="M8 6h10v10M18 6L6 18"/>'
  };
  function ic(n, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + I[n] + '</svg>';
  }

  /* ================= DOM refs ================= */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var main = $('#main'), top = $('#chrome-top'), ftr = $('#ftr'), menuEl = $('#menu'), drawer = $('#drawer'),
    toasts = $('#toasts'), concept = $('#concept');

  /* ================= router ================= */
  function parseRoute(hash) {
    var h = hash != null ? hash : (location.hash || '#/');
    if (h === '#' || h === '') h = '#/';
    if (h.indexOf('#/') !== 0) return null;
    var raw = h.slice(2), qi = raw.indexOf('?');
    var path = qi >= 0 ? raw.slice(0, qi) : raw, qs = qi >= 0 ? raw.slice(qi + 1) : '';
    var parts = path.split('/').filter(Boolean).map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
    return { name: parts[0] || 'home', parts: parts, q: new URLSearchParams(qs), hash: h };
  }
  function homeRoute() { return { name: 'home', parts: [], q: new URLSearchParams(), hash: '#/' }; }
  var current = null, rendered = false;
  /* viewHash: the hash of the page currently rendered under any overlay (the cart drawer can sit on top at #/cart) */
  var viewHash = '#/', cartEntry = false, skipHash = null;
  /* remembered scroll positions per page, restored on Back/Forward; navHint marks link clicks (which start at the top) */
  var pos = {}, navHint = null;
  function hintNav(h) { navHint = { h: h, t: Date.now() }; }
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }

  function route() {
    var r = parseRoute();
    if (!r) return;
    if (rendered) pos[viewHash] = window.scrollY; /* remember where the page we are leaving was scrolled to */
    if (r.name === 'cart') {
      if (!rendered) { renderView(homeRoute(), false); cartEntry = false; }
      else cartEntry = true;
      openDrawer();
      return;
    }
    if (skipHash !== null) {
      var skip = skipHash === location.hash;
      skipHash = null;
      if (skip) return;
    }
    var wasOpen = drawer.classList.contains('open');
    if (wasOpen) closeDrawer(true);
    if (menuEl.classList.contains('open')) closeMenu(true);
    /* Back from #/cart to the page that was underneath: just close the drawer */
    if (wasOpen && rendered && location.hash === viewHash) { setNavCurrent(current); return; }
    renderView(r, rendered);
  }

  function renderView(r, isNav) {
    current = r;
    teardownSticky();
    var h = r.hash && r.name !== 'cart' ? r.hash : '#/';
    viewHash = h;
    var linkNav = !!(navHint && navHint.h === location.hash && Date.now() - navHint.t < 2000);
    navHint = null;
    var html, title;
    switch (r.name) {
      case 'home': case 'story':
        html = viewHome(); title = t('t.home'); break;
      case 'shop':
        html = viewShop(r); title = null; break;
      case 'product':
        var p = byId[r.parts[1]];
        if (p) { html = viewProduct(p); title = L(p.name) + ' · ' + L(p.type) + t('t.suffix'); }
        else { html = viewNotFound(t('pd.missing')); title = t('pd.missing') + t('t.suffix'); }
        break;
      case 'checkout':
        html = viewCheckout(); title = t('co.title') + t('t.suffix'); break;
      case 'order':
        html = viewOrder(r.parts[1]);
        var lo = store.get('lastOrder', null);
        title = (lo && lo.id === r.parts[1] ? t('ok.eyebrow') : t('ok.missT')) + t('t.suffix');
        break;
      default:
        html = viewNotFound(); title = t('nf.title') + t('t.suffix');
    }
    main.innerHTML = html;
    main.classList.remove('enter');
    void main.offsetWidth;
    main.classList.add('enter');
    if (title) document.title = title;
    setNavCurrent(r);
    if (r.name === 'shop') bindShop();
    if (r.name === 'product' && byId[r.parts[1]]) bindProduct();
    if (r.name === 'checkout') bindCheckout();
    if (r.name === 'home' || r.name === 'story') bindNews();
    observe();
    var restore = isNav && !linkNav && pos[viewHash] != null;
    if (restore) {
      window.scrollTo(0, pos[viewHash]);
      revealVisible();
    } else if (r.name === 'story') {
      var st = $('#story');
      if (st) {
        $$('.reveal', st).forEach(function (el) { el.classList.add('in'); });
        var go = function () { st.scrollIntoView({ behavior: reduced || !isNav ? 'auto' : 'smooth', block: 'start' }); };
        requestAnimationFrame(go);
        if (document.readyState !== 'complete') window.addEventListener('load', function () { if (current && current.name === 'story') go(); }, { once: true });
      }
    } else if (isNav) {
      window.scrollTo(0, 0);
    }
    if (isNav) {
      var h1 = main.querySelector('h1');
      if (h1 && (r.name !== 'story' || restore)) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
    if (r.name === 'product' && byId[r.parts[1]]) bindSticky();
    rendered = true;
  }

  function setNavCurrent(r) {
    var key = r.name === 'shop' ? '#/shop' + (r.parts[1] ? '/' + r.parts[1] : '') : r.name === 'story' ? '#/story' : r.name === 'product' && byId[r.parts[1]] ? '#/shop/' + byId[r.parts[1]].col : '';
    $$('.nav a, .menu-links a').forEach(function (a) {
      if (a.getAttribute('href') === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ================= reveal on scroll ================= */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }) : null;
  function observe() {
    $$('.reveal:not(.in)').forEach(function (el) { if (io && !reduced) io.observe(el); else el.classList.add('in'); });
    setTimeout(revealVisible, 350);
  }
  /* safety net: reveal anything already on screen (e.g. after a programmatic scroll) */
  function revealVisible() {
    var h = window.innerHeight || 800;
    $$('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.96 && r.bottom > 0) { el.classList.add('in'); if (io) io.unobserve(el); }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (rendered) pos[viewHash] = window.scrollY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; revealVisible(); });
  }, { passive: true });

  /* ================= chrome: header, menu, footer ================= */
  function renderChrome() {
    var cols = Object.keys(D.COLLECTIONS);
    var n = cartCount();
    var langBtn = function (long) {
      var other = lang === 'ar' ? 'en' : 'ar';
      return '<button class="lang-btn" type="button" data-act="lang"><span class="sr">' + t('lang.label') + ': </span>' +
        '<span class="l-' + other + '" lang="' + other + '">' + (long ? t('lang.long') : t('lang.btn')) + '</span></button>';
    };
    top.innerHTML =
      '<div class="announce"><p><span class="a-long">' + t('announce') + '</span><span class="a-short">' + t('announce.short') + '</span></p></div>' +
      '<header class="hdr"><div class="wrap hdr-in">' +
      '<button class="icon-btn menu-btn" type="button" data-act="menu-open" aria-label="' + t('menu') + '" aria-expanded="false" aria-controls="menu">' + ic('menu') + '</button>' +
      '<a class="brand" href="#/" aria-label="' + t('home.label') + '">' + A.logo('mark') + wordmark() + '</a>' +
      '<nav class="nav" aria-label="' + t('nav.label') + '"><a href="#/shop">' + t('nav.shop') + '</a>' +
      cols.map(function (k) { return '<a href="#/shop/' + k + '">' + L(D.COLLECTIONS[k]) + '</a>'; }).join('') +
      '<a href="#/story">' + t('nav.story') + '</a></nav>' +
      '<div class="hdr-tools">' +
      '<button class="icon-btn search-btn" type="button" data-act="search" aria-label="' + t('search') + '">' + ic('search') + '</button>' +
      langBtn(false) +
      '<button class="icon-btn cart-btn" type="button" data-act="cart-open" aria-controls="drawer" aria-label="' + t('cart.btn', { n: itemsLabel(n) }) + '">' + ic('bag') +
      '<span class="cart-count" data-n="' + n + '" aria-hidden="true">' + n + '</span></button>' +
      '</div></div></header>';

    menuEl.innerHTML = '<div class="menu-scrim" data-act="menu-close"></div>' +
      '<div class="menu-panel" role="dialog" aria-modal="true" aria-label="' + t('menu.title') + '">' +
      '<div class="menu-top"><span class="brand" aria-hidden="true">' + A.logo('mark') + wordmark() + '</span>' +
      '<button class="icon-btn" type="button" data-act="menu-close" aria-label="' + t('menu.close') + '">' + ic('close') + '</button></div>' +
      '<form class="menu-search" id="menu-search" role="search" novalidate><label class="sr" for="mq">' + t('shop.searchLabel') + '</label>' + ic('search', 'ms-ico') +
      '<input id="mq" class="input" type="search" enterkeyhint="search" autocomplete="off" placeholder="' + t('shop.ph') + '">' +
      '<button class="icon-btn" type="submit" aria-label="' + t('search.go') + '">' + ic('arrow', 'flip') + '</button></form>' +
      '<nav class="menu-links" aria-label="' + t('nav.label') + '">' +
      '<a href="#/shop">' + t('nav.shop') + '<small>' + productsLabel(P.length) + '</small></a>' +
      cols.map(function (k) { return '<a href="#/shop/' + k + '">' + L(D.COLLECTIONS[k]) + '<small>' + productsLabel(countIn(k)) + '</small></a>'; }).join('') +
      '<a href="#/story">' + t('nav.story') + '</a></nav>' +
      '<div class="menu-foot">' + langBtn(true) +
      '<p>' + ic('pin', 'inline') + ' ' + t('ft.addr') + '</p><a class="menu-concept" href="../../">' + t('concept') + ' ' + ic('ext', 'flip') + '</a></div></div>';

    ftr.innerHTML = '<div class="wrap"><div class="ftr-grid">' +
      '<div><a class="bil" href="#/" aria-label="' + t('home.label') + '">' + A.logo('mark') + '<b>SADEEM</b><i lang="ar">سديـــم</i></a><p class="about">' + t('ft.about') + '</p></div>' +
      '<nav aria-labelledby="ft-shop"><h2 id="ft-shop">' + t('ft.shop') + '</h2><ul><li><a href="#/shop">' + t('shop.all') + '</a></li>' +
      cols.map(function (k) { return '<li><a href="#/shop/' + k + '">' + L(D.COLLECTIONS[k]) + '</a></li>'; }).join('') +
      '<li><a href="#/story">' + t('nav.story') + '</a></li></ul></nav>' +
      '<div><h2>' + t('ft.visit') + '</h2><ul><li>' + t('ft.addr') + '</li><li>' + t('ft.hours1') + '</li><li>' + t('ft.hours2') + '</li></ul></div>' +
      '<div><h2>' + t('ft.talk') + '</h2><p>' + t('ft.talkD') + '</p><button class="btn btn-ghost" type="button" data-act="wa">' + ic('chat') + '<span>' + t('pd.wa') + '</span></button></div>' +
      '</div><div class="ftr-bottom"><p class="disc">' + ic('info') + '<span>' + t('ft.disc') + '</span></p>' +
      '<p>' + t('ft.copy') + ' · ' + t('ft.credit') + '</p></div></div>';

    concept.innerHTML = '<span class="px" aria-hidden="true">Q8</span><span class="c-full">' + t('concept') + '</span><span class="c-short" aria-hidden="true">' + t('concept.short') + '</span>' + ic('ext', 'flip');
    concept.setAttribute('aria-label', t('concept'));
    $('.skip').textContent = t('skip');
    if (current) setNavCurrent(current);
  }
  /* wordmark: spaced Cormorant capitals in English; an extended (kashida) Reem Kufi logotype in Arabic */
  function wordmark() {
    return lang === 'ar' ? '<span class="wm wm-ar">سديـــم</span>' : '<span class="wm">SADEEM</span>';
  }
  function countIn(k) { return P.filter(function (p) { return p.col === k; }).length; }

  function updateBadge(bump) {
    var n = cartCount();
    var b = $('.cart-count'), btn = $('.cart-btn');
    if (!b) return;
    b.textContent = n;
    b.setAttribute('data-n', n);
    btn.setAttribute('aria-label', t('cart.btn', { n: itemsLabel(n) }));
    if (bump && !reduced) {
      b.classList.remove('bump'); btn.classList.remove('wiggle');
      void b.offsetWidth;
      b.classList.add('bump'); btn.classList.add('wiggle');
    }
  }

  /* ================= shared fragments ================= */
  function badge(p) {
    if (!p.badge) return '';
    return '<span class="badge ' + p.badge + '">' + t('badge.' + p.badge) + '</span>';
  }
  function card(p, i) {
    var multi = p.sizes.length > 1;
    return '<article class="card reveal" style="--d:' + ((i || 0) % 4 * 0.07).toFixed(2) + 's">' +
      '<div class="card-media">' + A.scene(p) + badge(p) + '</div>' +
      '<div class="card-body"><p class="card-kicker">' + L(D.COLLECTIONS[p.col]) + '</p>' +
      '<h3 class="card-title"><a href="#/product/' + p.id + '">' + L(p.name) + '</a></h3>' +
      '<div class="card-row"><p class="price">' + (multi ? '<small>' + t('from') + '</small>' : '') + money(p.sizes[0].price) + '</p>' +
      '<button class="qadd" type="button" data-act="qadd" data-id="' + p.id + '" aria-label="' + esc(t('qadd', { name: L(p.name), size: L(p.sizes[0]) })) + '">' + ic('plus') + '</button></div>' +
      '</div></article>';
  }
  function sectionHead(eyebrow, title, id, extra, cls) {
    return '<div class="section-head"><div><p class="eyebrow">' + eyebrow + '</p><h2 id="' + id + '" class="' + (cls || 'h-lg') + '">' + title + '</h2></div>' + (extra || '') + '</div>';
  }

  /* ================= views ================= */
  function viewHome() {
    var best = ['nokhatha', 'musk-harir', 'bakhoor-majlis', 'amber-dune'].map(function (id) { return byId[id]; });
    var cols = Object.keys(D.COLLECTIONS);
    return '' +
      '<section class="hero dark" aria-labelledby="hero-h"><div class="wrap hero-in">' +
      '<div class="hero-copy"><p class="eyebrow">' + t('hero.eyebrow') + '</p>' +
      '<h1 id="hero-h" class="h-xl">' + t('hero.title') + '</h1>' +
      '<p class="lead">' + t('hero.sub') + '</p>' +
      '<div class="hero-ctas"><a class="btn btn-gold" href="#/shop">' + t('hero.cta') + ic('arrow', 'flip') + '</a>' +
      '<a class="btn btn-ghost" href="#/story">' + t('hero.cta2') + '</a></div></div>' +
      '<div class="hero-art-wrap">' + A.hero(P, t('hero.art')) + '</div>' +
      '</div></section>' +
      '<section class="perks" aria-label="' + t('perks.label') + '"><div class="wrap"><ul>' +
      '<li>' + ic('truck') + t('perk.1') + '</li><li>' + ic('gift') + t('perk.2') + '</li><li>' + ic('clock') + t('perk.3') + '</li><li>' + ic('vial') + t('perk.4') + '</li>' +
      '</ul></div></section>' +
      '<section class="section" aria-labelledby="col-h"><div class="wrap">' +
      sectionHead(t('col.eyebrow'), t('col.title'), 'col-h', '<p class="lead">' + t('col.sub') + '</p>') +
      '<div class="cols-grid">' + cols.map(function (k, i) {
        var c = D.COLLECTIONS[k], dark = c.bg === 'wine' || c.bg === 'dusk' || c.bg === 'ink';
        return '<a class="col-tile reveal' + (dark ? ' is-dark' : '') + '" data-bg="' + c.bg + '" href="#/shop/' + k + '" style="--d:' + (i * 0.08).toFixed(2) + 's">' +
          A.duo(P, c.show, c.bg) +
          '<div class="col-tile-body"><div><h3>' + L(c) + '</h3><p>' + productsLabel(countIn(k)) + '</p></div><span class="arrow">' + ic('arrow', 'flip') + '</span></div></a>';
      }).join('') + '</div></div></section>' +
      '<section class="section" style="padding-top:0" aria-labelledby="best-h"><div class="wrap">' +
      sectionHead(t('best.eyebrow'), t('best.title'), 'best-h', '<a class="link-arrow" href="#/shop">' + t('best.all') + ic('arrow', 'flip') + '</a>') +
      '<div class="grid g4">' + best.map(card).join('') + '</div></div></section>' +
      '<section class="section ritual dark" aria-labelledby="rit-h"><div class="wrap">' +
      sectionHead(t('rit.eyebrow'), t('rit.title'), 'rit-h') +
      '<ol class="ritual-grid">' + [1, 2, 3].map(function (i) {
        return '<li class="ritual-step reveal" style="--d:' + ((i - 1) * 0.1).toFixed(1) + 's"><div class="ritual-art">' + A.ritual(P, i, t('rit.' + i + 'a')) + '</div>' +
          '<p class="num">0' + i + '</p><h3>' + t('rit.' + i + 't') + '</h3><p>' + t('rit.' + i + 'd') + '</p></li>';
      }).join('') + '</ol></div></section>' +
      '<section class="section" id="story" aria-labelledby="story-h"><div class="wrap story-grid">' +
      '<div class="story-art reveal">' + A.dhow(t('story.art')) + '</div>' +
      '<div class="story-copy reveal" style="--d:.1s"><p class="eyebrow">' + t('story.eyebrow') + '</p><h2 id="story-h" class="h-lg">' + t('story.title') + '</h2>' +
      '<p class="def">' + t('story.def') + '</p><p>' + t('story.p1') + '</p><p>' + t('story.p2') + '</p>' +
      '<ul class="values"><li>' + ic('sparkle') + '<h3>' + t('story.v1t') + '</h3><p>' + t('story.v1d') + '</p></li>' +
      '<li>' + ic('gift') + '<h3>' + t('story.v2t') + '</h3><p>' + t('story.v2d') + '</p></li>' +
      '<li>' + ic('map') + '<h3>' + t('story.v3t') + '</h3><p>' + t('story.v3d') + '</p></li></ul></div>' +
      '</div></section>' +
      '<section class="gift-band dark" aria-labelledby="gift-h"><div class="wrap gift-in">' +
      '<div class="copy reveal"><p class="eyebrow">' + t('gift.eyebrow') + '</p><h2 id="gift-h" class="h-lg">' + t('gift.title') + '</h2>' +
      '<p class="lead">' + t('gift.sub') + '</p><a class="btn btn-gold" href="#/shop/gifts">' + t('gift.cta') + ic('arrow', 'flip') + '</a></div>' +
      '<div class="reveal" style="--d:.12s">' + A.gift(P, t('gift.art')) + '</div>' +
      '</div></section>' +
      '<section class="news" aria-labelledby="news-h"><div class="wrap news-in">' +
      '<h2 id="news-h" class="h-md">' + t('news.title') + '</h2><p class="lead">' + t('news.sub') + '</p>' +
      '<form class="news-form" id="news" novalidate><div class="field" data-f="nemail"><label for="f-nemail">' + t('news.label') + '</label>' +
      '<div class="news-row"><input id="f-nemail" name="nemail" class="input" type="email" autocomplete="email" placeholder="' + t('news.ph') + '" aria-describedby="e-nemail">' +
      '<button class="btn btn-dark" type="submit">' + t('news.btn') + '</button></div>' +
      '<p class="err" id="e-nemail">' + ic('alert') + '<span></span></p></div></form>' +
      '</div></section>';
  }

  /* ---------- shop ---------- */
  var shop = { col: 'all', q: '', sort: 'featured' };
  function viewShop(r) {
    var col = D.COLLECTIONS[r.parts[1]] ? r.parts[1] : 'all';
    var sort = r.q.get('sort');
    shop = { col: col, q: r.q.get('q') || '', sort: (sort === 'asc' || sort === 'desc') ? sort : 'featured' };
    var chips = ['all'].concat(Object.keys(D.COLLECTIONS)).map(function (k) {
      return '<button class="chip" type="button" data-act="chip" data-col="' + k + '" aria-pressed="' + (k === col) + '">' +
        (k === 'all' ? t('shop.allChip') : L(D.COLLECTIONS[k])) + '<span class="ct">' + (k === 'all' ? P.length : countIn(k)) + '</span></button>';
    }).join('');
    return '<div class="wrap shop-page">' +
      '<header class="page-head"><nav aria-label="' + t('crumbs') + '"><ol class="crumbs"><li><a href="#/">' + t('pd.home') + '</a></li><li id="crumb-cur" aria-current="page"></li></ol></nav>' +
      '<h1 class="h-lg" id="shop-title"></h1><p class="lead" id="shop-blurb"></p></header>' +
      '<div class="shop-bar"><div class="chips" role="group" aria-label="' + t('shop.filter') + '">' + chips + '</div>' +
      '<div class="tools"><div class="search"><label class="sr" for="q">' + t('shop.searchLabel') + '</label>' + ic('search') +
      '<input id="q" class="input" type="search" enterkeyhint="search" autocomplete="off" placeholder="' + t('shop.ph') + '" value="' + esc(shop.q) + '">' +
      '<button class="search-clear" type="button" data-act="clear-q" aria-label="' + t('shop.clear') + '"' + (shop.q ? '' : ' hidden') + '>' + ic('close') + '</button></div>' +
      '</div></div>' +
      '<div class="results-head"><p class="result-count" id="count" aria-live="polite"></p>' +
      '<div class="sort"><label for="sort">' + t('shop.sort') + '</label><select id="sort" class="input">' +
      ['featured', 'asc', 'desc'].map(function (k) { return '<option value="' + k + '"' + (shop.sort === k ? ' selected' : '') + '>' + t('sort.' + k) + '</option>'; }).join('') +
      '</select></div></div><div id="results"></div></div>';
  }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ًͯ-ٰٟـ]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
  }
  var HAY = {};
  P.forEach(function (p) {
    var bits = [p.name.en, p.name.ar, p.type.en, p.type.ar, D.COLLECTIONS[p.col].en, D.COLLECTIONS[p.col].ar, p.desc.en, p.desc.ar];
    ['top', 'heart', 'base'].forEach(function (k) { p.notes[k].forEach(function (x) { bits.push(x.en, x.ar); }); });
    HAY[p.id] = norm(bits.join(' '));
  });
  function filtered() {
    var q = norm(shop.q), words = q ? q.split(/\s+/) : [];
    var list = P.filter(function (p) {
      if (shop.col !== 'all' && p.col !== shop.col) return false;
      return words.every(function (w) { return HAY[p.id].indexOf(w) >= 0; });
    });
    if (shop.sort === 'asc') list.sort(function (a, b) { return a.sizes[0].price - b.sizes[0].price; });
    if (shop.sort === 'desc') list.sort(function (a, b) { return b.sizes[0].price - a.sizes[0].price; });
    return list;
  }
  function updateShop() {
    var list = filtered();
    var res = $('#results');
    if (!res) return;
    if (list.length) res.innerHTML = '<div class="grid' + (list.length === 4 ? ' g4' : '') + '">' + list.map(card).join('') + '</div>';
    else res.innerHTML = '<div class="empty row">' + A.empty() + '<h2 class="h-md">' + t('shop.emptyT') + '</h2><p>' +
      (shop.q ? t('shop.emptyD', { q: esc(shop.q) }) : t('shop.emptyD2')) + '</p>' +
      '<button class="btn btn-line" type="button" data-act="reset">' + t('shop.reset') + '</button></div>';
    var c = D.COLLECTIONS[shop.col];
    var title = c ? L(c) : t('shop.all');
    $('#shop-title').textContent = title;
    $('#crumb-cur').textContent = title;
    $('#shop-blurb').textContent = c ? L(c.blurb) : t('shop.blurb');
    $('#count').textContent = productsLabel(list.length);
    $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.col === shop.col)); });
    var clr = $('.search-clear');
    if (clr) clr.hidden = !shop.q;
    var qs = new URLSearchParams();
    if (shop.q) qs.set('q', shop.q);
    if (shop.sort !== 'featured') qs.set('sort', shop.sort);
    var h = '#/shop' + (shop.col !== 'all' ? '/' + shop.col : '') + (qs.toString() ? '?' + qs.toString() : '');
    var underCart = location.hash.indexOf('#/cart') === 0;
    if (location.hash !== h && !underCart) { try { history.replaceState(null, '', h); } catch (e) { /* ignore */ } }
    viewHash = h;
    current = parseRoute(h) || current;
    setNavCurrent(current);
    document.title = title + t('t.suffix');
    observe();
  }
  function bindShop() {
    var q = $('#q'), sort = $('#sort'), timer;
    q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { shop.q = q.value; updateShop(); }, 140);
    });
    q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { clearTimeout(timer); shop.q = q.value; updateShop(); } });
    sort.addEventListener('change', function () { shop.sort = sort.value; updateShop(); });
    updateShop();
  }

  /* ---------- product ---------- */
  var pd = { id: null, s: 0, q: 1 };
  function tier(i) {
    var parts = ['M22 2L29.6 13H14.4Z', 'M13.7 14H30.3L37.9 25H6.1Z', 'M5.4 26H38.6L44 34H0Z'];
    return '<svg viewBox="0 0 44 36" aria-hidden="true">' + parts.map(function (d, k) {
      return '<path d="' + d + '" fill="' + (k === i ? '#c9a46a' : 'none') + '" stroke="#77572a" stroke-opacity="' + (k === i ? 0 : 0.5) + '" stroke-width="1"/>';
    }).join('') + '</svg>';
  }
  function meter(label, n) {
    var dots = '';
    for (var i = 1; i <= 5; i++) dots += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<div class="meter"><span>' + t(label) + '</span><span class="dots" role="img" aria-label="' + t(label) + ': ' + t('meter', { n: n }) + '">' + dots + '</span></div>';
  }
  function viewProduct(p) {
    if (pd.id !== p.id) pd = { id: p.id, s: 0, q: 1 };
    var col = D.COLLECTIONS[p.col], size = p.sizes[pd.s];
    var rel = P.filter(function (x) { return x.col === p.col && x.id !== p.id; }).slice(0, 3);
    P.forEach(function (x) { if (rel.length < 4 && x.badge === 'best' && x.col !== p.col && rel.indexOf(x) < 0) rel.push(x); });
    var num = ('0' + p.num).slice(-2);
    return '<div class="wrap">' +
      '<nav class="page-head" style="padding-bottom:20px" aria-label="' + t('crumbs') + '"><ol class="crumbs"><li><a href="#/">' + t('pd.home') + '</a></li>' +
      '<li><a href="#/shop/' + p.col + '">' + L(col) + '</a></li><li aria-current="page">' + L(p.name) + '</li></ol></nav>' +
      '<article class="pd">' +
      '<div class="pd-media">' + A.scene(p, { label: esc(t('pd.art', { name: L(p.name) })) }) + badge(p) + '</div>' +
      '<div class="pd-info">' +
      '<div class="pd-title"><p class="eyebrow">' + L(col) + ' · ' + t('pd.no', { n: num }) + '</p><h1>' + L(p.name) + '</h1><p class="pd-type">' + L(p.type) + '</p></div>' +
      '<p class="pd-price" id="pd-price">' + money(size.price) + '</p>' +
      '<p class="pd-desc">' + L(p.desc) + '</p>' +
      '<div class="meters">' + meter('pd.intensity', p.intensity) + meter('pd.longevity', p.longevity) +
      '<div class="meter"><span>' + t('pd.wear') + '</span><div class="wear">' + p.wear.map(function (w) { return '<span>' + L(D.WEAR[w]) + '</span>'; }).join('') + '</div></div></div>' +
      '<fieldset><legend>' + t('pd.size') + '</legend><div class="sizes">' + p.sizes.map(function (z, i) {
        return '<label class="size"><input type="radio" name="size" value="' + i + '"' + (i === pd.s ? ' checked' : '') + '><span><b>' + L(z) + '</b><small>' + money(z.price) + '</small></span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="buy-row"><div class="qty" role="group" aria-label="' + t('pd.qty') + '">' +
      '<button type="button" data-act="pd-dec" aria-label="' + t('pd.dec') + '"' + (pd.q <= 1 ? ' disabled' : '') + '>−</button>' +
      '<output id="pd-q" aria-live="polite">' + pd.q + '</output>' +
      '<button type="button" data-act="pd-inc" aria-label="' + t('pd.inc') + '">+</button></div>' +
      '<button class="btn btn-dark" type="button" data-act="pd-add" id="pd-add">' + ic('bag') + '<span>' + t('pd.add') + '</span><span class="btn-price" id="pd-total">· ' + money(size.price * pd.q) + '</span></button></div>' +
      '<button class="btn btn-wa" type="button" data-act="wa">' + ic('chat') + '<span>' + t('pd.wa') + '</span></button>' +
      '<ul class="pd-perks"><li>' + ic('truck') + t('pd.perk1') + '</li><li>' + ic('gift') + t('pd.perk2') + '</li><li>' + ic('vial') + t('pd.perk3') + '</li></ul>' +
      '<section class="notes" aria-labelledby="notes-h"><h2 id="notes-h">' + t('pd.notes') + '</h2>' +
      ['top', 'heart', 'base'].map(function (k, i) {
        return '<div class="note-row">' + tier(i) + '<div><h3>' + t('pd.' + k) + '</h3><p class="note-chips">' +
          p.notes[k].map(function (x) { return '<span>' + L(x) + '</span>'; }).join('') + '</p></div></div>';
      }).join('') + '</section>' +
      '<div><details class="acc" open><summary>' + t('pd.how') + ic('plus') + '</summary><div class="acc-body">' + L(D.HOWTO[p.how]) + '</div></details>' +
      '<details class="acc"><summary>' + t('pd.del') + ic('plus') + '</summary><div class="acc-body">' + t('pd.delText') + '</div></details></div>' +
      '</div></article>' +
      '<section class="section" style="padding-top:0" aria-labelledby="like-h">' + sectionHead(t('pd.likeE'), t('pd.like'), 'like-h', '', 'h-md') +
      '<div class="grid g4">' + rel.map(card).join('') + '</div></section></div>' +
      /* phone/tablet: sticky buy bar, shown while the main Add to cart row is off screen */
      '<div class="pd-sticky" id="pd-sticky"><div class="wrap ps-in">' +
      '<div class="ps-info"><b>' + L(p.name) + '</b><span id="ps-meta">' + stickyMeta(p) + '</span></div>' +
      '<button class="btn btn-gold" type="button" data-act="pd-add" aria-label="' + esc(t('pd.add') + ' — ' + L(p.name)) + '">' + ic('bag') + '<span>' + t('pd.add') + '</span></button>' +
      '</div></div>';
  }
  function stickyMeta(p) {
    var z = p.sizes[pd.s];
    return esc(L(z)) + (pd.q > 1 ? ' × ' + pd.q : '') + ' · <span class="price">' + money(z.price * pd.q) + '</span>';
  }
  function refreshPd() {
    var p = byId[pd.id];
    if (!p) return;
    var price = p.sizes[pd.s].price;
    var pr = $('#pd-price');
    if (pr) pr.textContent = money(price);
    var q = $('#pd-q');
    if (q) q.textContent = pd.q;
    var add = $('#pd-total');
    if (add) add.textContent = '· ' + money(price * pd.q);
    var dec = $('[data-act="pd-dec"]');
    if (dec) dec.disabled = pd.q <= 1;
    var sm = $('#ps-meta');
    if (sm) sm.innerHTML = stickyMeta(p);
  }
  function bindProduct() {
    $$('input[name="size"]').forEach(function (r) {
      r.addEventListener('change', function () { pd.s = +r.value; refreshPd(); });
    });
  }
  var psObs = null;
  function teardownSticky() {
    if (psObs) { psObs.disconnect(); psObs = null; }
    document.body.classList.remove('ps-on');
  }
  function bindSticky() {
    var bar = $('#pd-sticky'), row = $('.buy-row');
    if (!bar || !row || !('IntersectionObserver' in window)) return;
    var hdr = $('.hdr');
    var topOff = hdr ? Math.round(hdr.getBoundingClientRect().height) : 64;
    psObs = new IntersectionObserver(function (es) {
      var show = !es[es.length - 1].isIntersecting;
      bar.classList.toggle('on', show);
      document.body.classList.toggle('ps-on', show);
    }, { rootMargin: '-' + topOff + 'px 0px -76px 0px', threshold: 0 });
    psObs.observe(row);
  }

  /* ---------- checkout ---------- */
  var draft = session.get('draft', {}) || {};
  function saveDraft() { session.set('draft', draft); }
  function field(o) {
    var v = draft[o.id] != null ? draft[o.id] : '';
    var describe = 'e-' + o.id + (o.hint ? ' h-' + o.id : '');
    var input = '<input id="f-' + o.id + '" name="' + o.id + '" class="input" type="' + (o.type || 'text') + '"' +
      (o.ac ? ' autocomplete="' + o.ac + '"' : '') + (o.im ? ' inputmode="' + o.im + '"' : '') +
      (o.max ? ' maxlength="' + o.max + '"' : '') + (o.req ? ' required aria-required="true"' : '') +
      ' value="' + esc(v) + '" aria-describedby="' + describe + '">';
    if (o.id === 'phone') input = '<div class="phone-wrap"><span class="cc" aria-hidden="true">+965</span>' + input + '</div>';
    return '<div class="field ' + (o.cls || '') + '" data-f="' + o.id + '"><label for="f-' + o.id + '">' + o.label + '</label>' + input +
      (o.hint ? '<p class="hint" id="h-' + o.id + '">' + o.hint + '</p>' : '') +
      '<p class="err" id="e-' + o.id + '">' + ic('alert') + '<span></span></p></div>';
  }
  function areaOptions(gid, sel) {
    var g = GOV[gid];
    if (!g) return '<option value="">' + t('co.areaFirst') + '</option>';
    var list = g.areas.map(function (a, i) { return { i: i, n: lang === 'ar' ? a[1] : a[0] }; });
    list.sort(function (a, b) { return a.n.localeCompare(b.n, lang); });
    return '<option value="">' + t('co.areaPh') + '</option>' + list.map(function (a) {
      return '<option value="' + a.i + '"' + (String(sel) === String(a.i) ? ' selected' : '') + '>' + esc(a.n) + '</option>';
    }).join('');
  }
  function summaryHTML(lines, tot, withEdit) {
    return '<ul class="mini-list">' + lines.map(function (l) {
      var p = byId[l.id];
      return '<li class="mini"><div class="mini-art">' + A.scene(p) + '<span class="q" aria-hidden="true">' + l.q + '</span></div>' +
        '<div><h3>' + L(p.name) + '</h3><p class="meta">' + L(p.sizes[l.s]) + ' · ' + t('co.qty', { n: l.q }) + '</p></div>' +
        '<p class="price">' + money(p.sizes[l.s].price * l.q) + '</p></li>';
    }).join('') + '</ul>' +
      '<div class="sum-row"><span>' + t('cart.sub') + '</span><span class="price">' + money(tot.sub) + '</span></div>' +
      '<div class="sum-row"><span>' + t('cart.del') + '</span>' + (tot.del ? '<span class="price">' + money(tot.del) + '</span>' : '<span class="free">' + t('cart.freeTag') + '</span>') + '</div>' +
      '<div class="sum-row total"><span>' + t('cart.total') + '</span><span class="price">' + money(tot.total) + '</span></div>';
  }
  function steps(cur) {
    return '<ol class="steps" aria-label="' + t('co.steps') + '">' + [1, 2, 3].map(function (i) {
      var st = i < cur ? 'done' : i === cur ? 'cur' : '';
      return '<li class="' + st + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="dot">' + (i < cur ? ic('check') : i) + '</span>' + t('co.step' + i) + '</li>';
    }).join('') + '</ol>';
  }
  /* ---------- delivery slots, built from the current time in Kuwait (UTC+3, no daylight saving) ---------- */
  function kuwaitNow() {
    var d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3 * 3600000);
  }
  function buildSlots() {
    var now = kuwaitNow(), hour = now.getHours() + now.getMinutes() / 60, out = [];
    for (var off = 0; off < 5 && out.length < 3; off++) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off);
      var dow = day.getDay(); /* 5 = Friday: afternoon deliveries only */
      var parts = off === 0 ? (hour < 16 ? ['eve'] : []) : (dow === 5 ? ['pm'] : ['am', 'pm']);
      parts.forEach(function (part) {
        if (out.length >= 3) return;
        var rel = off === 0 ? { en: STR.en['co.today'], ar: STR.ar['co.today'] } : off === 1 ? { en: STR.en['co.tomorrow'], ar: STR.ar['co.tomorrow'] } : null;
        var wd = D.DAYS[dow], tm = D.SLOT_TIMES[part];
        out.push({
          id: day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate() + '-' + part,
          day: rel || wd,
          sub: rel ? { en: wd.en + ' · ' + tm.en, ar: wd.ar + ' · ' + tm.ar } : tm,
          label: rel ? { en: rel.en + ', ' + wd.en + ' · ' + tm.en, ar: rel.ar + '، ' + wd.ar + ' · ' + tm.ar } : { en: wd.en + ' · ' + tm.en, ar: wd.ar + ' · ' + tm.ar }
        });
      });
    }
    return out;
  }
  var slots = buildSlots();

  function viewCheckout() {
    if (!cart.length) {
      return '<div class="wrap"><div class="empty" style="padding-top:64px">' + A.empty() + '<h1 class="h-md">' + t('co.emptyT') + '</h1><p>' + t('co.emptyD') + '</p>' +
        '<a class="btn btn-dark" href="#/shop">' + t('cart.shop') + '</a></div></div>';
    }
    slots = buildSlots();
    var d = draft, tot = totals();
    var slot = slots.some(function (s) { return s.id === d.slot; }) ? d.slot : slots[0].id, pay = d.pay || 'knet';
    var wrap = d.wrap == null ? true : d.wrap;
    var msg = d.msg || '';
    return '<div class="wrap">' +
      '<header class="page-head">' + steps(2) + '<h1 class="h-lg">' + t('co.title') + '</h1></header>' +
      '<div class="co-grid">' +
      /* phones/tablets: collapsible order summary above the form */
      '<details class="co-mini"><summary>' + ic('bag') + '<span class="cm-l">' + t('co.summary') + ' <small>' + itemsLabel(cartCount()) + '</small></span>' +
      '<b class="price">' + money(tot.total) + '</b><svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></summary>' +
      '<div class="co-mini-body">' + summaryHTML(cart, tot) + '</div></details>' +
      '<form id="co" class="co-form" novalidate>' +
      '<div class="demo-banner" role="note">' + ic('info') + '<p><b>' + t('co.demoT') + '</b> ' + t('co.demo') + '</p></div>' +
      '<div class="alert" id="co-alert" role="alert" tabindex="-1" hidden>' + ic('alert') + '<div><p>' + t('co.alert') + '</p><ul class="alert-list"></ul></div></div>' +
      '<section class="panel" aria-labelledby="p1"><div class="panel-h"><span class="n" aria-hidden="true">1</span><h2 id="p1">' + t('co.contact') + '</h2></div>' +
      '<div class="fgrid">' +
      field({ id: 'name', label: t('co.name'), ac: 'name', req: true, cls: 'full', max: 60 }) +
      field({ id: 'phone', label: t('co.phone'), type: 'tel', ac: 'tel-national', im: 'tel', req: true, hint: t('co.phoneHint'), cls: 'm-full', max: 16 }) +
      field({ id: 'email', label: t('co.email'), type: 'email', ac: 'email', hint: t('co.emailHint'), cls: 'm-full', max: 80 }) +
      '</div></section>' +
      '<section class="panel" aria-labelledby="p2"><div class="panel-h"><span class="n" aria-hidden="true">2</span><h2 id="p2">' + t('co.address') + '</h2></div>' +
      '<div class="fgrid">' +
      '<div class="field m-full" data-f="gov"><label for="f-gov">' + t('co.gov') + '</label><select id="f-gov" name="gov" class="input" required aria-required="true" aria-describedby="e-gov">' +
      '<option value="">' + t('co.govPh') + '</option>' + D.GOVERNORATES.map(function (g) { return '<option value="' + g.id + '"' + (d.gov === g.id ? ' selected' : '') + '>' + L(g) + '</option>'; }).join('') +
      '</select><p class="err" id="e-gov">' + ic('alert') + '<span></span></p></div>' +
      '<div class="field m-full" data-f="area"><label for="f-area">' + t('co.area') + '</label><select id="f-area" name="area" class="input" required aria-required="true" aria-describedby="e-area"' + (GOV[d.gov] ? '' : ' disabled') + '>' +
      areaOptions(d.gov, d.area) + '</select><p class="err" id="e-area">' + ic('alert') + '<span></span></p></div>' +
      field({ id: 'block', label: t('co.block'), im: 'numeric', req: true, max: 3 }) +
      field({ id: 'street', label: t('co.street'), ac: 'address-line1', req: true, max: 60 }) +
      field({ id: 'avenue', label: t('co.avenue'), max: 20 }) +
      field({ id: 'house', label: t('co.house'), req: true, max: 20 }) +
      field({ id: 'apt', label: t('co.apt'), cls: 'full', max: 40 }) +
      '<div class="field full" data-f="notes"><label for="f-notes">' + t('co.notes') + '</label><textarea id="f-notes" name="notes" class="input" rows="2" maxlength="200">' + esc(d.notes || '') + '</textarea></div>' +
      '</div></section>' +
      '<section class="panel" aria-labelledby="p3"><div class="panel-h"><span class="n" aria-hidden="true">3</span><h2 id="p3">' + t('co.time') + '</h2></div>' +
      '<div class="choices three" role="radiogroup" aria-labelledby="p3">' + slots.map(function (s) {
        return '<label class="choice"><input type="radio" name="slot" value="' + s.id + '"' + (slot === s.id ? ' checked' : '') + '><span class="c-main"><b>' + L(s.day) + '</b><small>' + L(s.sub) + '</small></span></label>';
      }).join('') + '</div>' +
      '<h3 class="sub-h" id="p3g">' + ic('gift') + t('co.gift') + '</h3>' +
      '<label class="check"><input type="checkbox" name="wrap"' + (wrap ? ' checked' : '') + '><span>' + t('co.wrap') + '</span></label>' +
      '<div class="field" data-f="msg"><label for="f-msg">' + t('co.msg') + '</label><textarea id="f-msg" name="msg" class="input" rows="2" maxlength="150" aria-describedby="h-msg">' + esc(msg) + '</textarea>' +
      '<p class="hint" id="h-msg" aria-live="polite">' + t('co.msgLeft', { n: 150 - msg.length }) + '</p></div>' +
      '</section>' +
      '<section class="panel" aria-labelledby="p4"><div class="panel-h"><span class="n" aria-hidden="true">4</span><h2 id="p4">' + t('co.pay') + '</h2></div>' +
      '<div class="choices" role="radiogroup" aria-labelledby="p4">' + D.PAYMENTS.map(function (m) {
        var icon = m.id === 'knet' ? 'bank' : m.id === 'card' ? 'card' : 'cash';
        return '<label class="choice"><input type="radio" name="pay" value="' + m.id + '"' + (pay === m.id ? ' checked' : '') + '>' +
          '<span class="c-main"><b>' + L(m.name) + '</b><small>' + L(m.desc) + '</small></span>' + ic(icon, 'c-ico') + '</label>';
      }).join('') + '</div>' +
      '<p class="demo-note">' + ic('info') + '<span>' + t('co.payNote') + '</span></p>' +
      '</section>' +
      '</form>' +
      '<aside class="co-summary" aria-labelledby="sum-h"><div class="panel">' +
      '<div class="line-top"><h2 id="sum-h" class="h-md" style="font-size:28px">' + t('co.summary') + '</h2><button class="edit-link" type="button" data-act="cart-open">' + t('co.edit') + '</button></div>' +
      summaryHTML(cart, tot) +
      '<button class="btn btn-gold btn-block" id="place" type="submit" form="co">' + ic('check') + '<span>' + t('co.place') + ' · ' + money(tot.total) + '</span></button>' +
      '<p class="demo-note">' + ic('info') + '<span>' + t('cart.note') + '</span></p>' +
      '</div></aside>' +
      '</div></div>';
  }

  function toLatinDigits(s) {
    return String(s || '').replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 0x660; })
      .replace(/[۰-۹]/g, function (c) { return c.charCodeAt(0) - 0x6F0; });
  }
  function normPhone(v) {
    var s = toLatinDigits(v).replace(/[\s\-().]/g, '');
    s = s.replace(/^(\+|00)?965/, function (m) { return s.length > 8 ? '' : m; });
    return s;
  }
  var RULES = {
    name: function (v) { return v.trim().length >= 3 || 'err.name'; },
    phone: function (v) { return /^[4569]\d{7}$/.test(normPhone(v)) || 'err.phone'; },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'err.email'; },
    gov: function (v) { return !!GOV[v] || 'err.gov'; },
    area: function (v) { return v !== '' && v != null || 'err.area'; },
    block: function (v) { return /^\d{1,3}$/.test(toLatinDigits(v).trim()) || 'err.block'; },
    street: function (v) { return v.trim().length >= 1 || 'err.street'; },
    house: function (v) { return v.trim().length >= 1 || 'err.house'; }
  };
  function validateField(name) {
    var form = $('#co');
    if (!form || !RULES[name]) return true;
    var el = form.elements[name];
    var res = RULES[name](el.value || '');
    var wrap = form.querySelector('[data-f="' + name + '"]');
    var err = wrap.querySelector('.err span');
    if (res === true) {
      wrap.classList.remove('invalid'); el.removeAttribute('aria-invalid'); err.textContent = '';
      return true;
    }
    wrap.classList.add('invalid'); el.setAttribute('aria-invalid', 'true'); err.textContent = t(res);
    return false;
  }
  /* error summary: one link per invalid field; kept in sync as fields are corrected */
  function refreshAlert(show) {
    var form = $('#co'), alertEl = $('#co-alert');
    if (!form || !alertEl) return 0;
    if (!show && alertEl.hidden) return 0;
    var bad = Object.keys(RULES).filter(function (k) {
      var w = form.querySelector('[data-f="' + k + '"]');
      return w && w.classList.contains('invalid');
    });
    if (!bad.length) { alertEl.hidden = true; alertEl.removeAttribute('data-k'); return 0; }
    var key = bad.join(',');
    if (!show && alertEl.getAttribute('data-k') === key) return bad.length; /* unchanged: don't re-announce on every keystroke */
    alertEl.setAttribute('data-k', key);
    alertEl.querySelector('.alert-list').innerHTML = bad.map(function (k) {
      var lb = form.querySelector('label[for="f-' + k + '"]'), er = form.querySelector('#e-' + k + ' span');
      return '<li><a href="#f-' + k + '" data-act="jump" data-to="f-' + k + '"><b>' + esc(lb ? lb.textContent : k) + '</b> — ' + esc(er ? er.textContent : '') + '</a></li>';
    }).join('');
    alertEl.hidden = false;
    return bad.length;
  }
  function bindCheckout() {
    var form = $('#co');
    if (!form) return;
    var submitting = false;
    function store1(el) {
      if (!el.name) return;
      if (el.type === 'checkbox') draft[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) draft[el.name] = el.value; }
      else draft[el.name] = el.value;
      saveDraft();
    }
    form.addEventListener('input', function (e) {
      var el = e.target;
      store1(el);
      if (el.name === 'msg') $('#h-msg').textContent = t('co.msgLeft', { n: 150 - el.value.length });
      var w = form.querySelector('[data-f="' + el.name + '"]');
      if (w && w.classList.contains('invalid')) { validateField(el.name); refreshAlert(false); }
    });
    form.addEventListener('change', function (e) {
      var el = e.target;
      store1(el);
      if (el.name === 'gov') {
        var area = $('#f-area');
        area.innerHTML = areaOptions(el.value, '');
        area.disabled = !GOV[el.value];
        draft.area = ''; saveDraft();
        validateField('gov');
        var aw = form.querySelector('[data-f="area"]');
        if (aw.classList.contains('invalid')) validateField('area');
        refreshAlert(false);
      } else if (el.name === 'area') { validateField('area'); refreshAlert(false); }
    });
    form.addEventListener('focusout', function (e) {
      var el = e.target;
      if (RULES[el.name] && el.tagName !== 'SELECT' && String(el.value).trim()) { validateField(el.name); refreshAlert(false); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;
      var bad = Object.keys(RULES).filter(function (k) { return !validateField(k); });
      if (bad.length) {
        refreshAlert(true);
        var first = form.elements[bad[0]];
        if (first.disabled) first = form.elements.gov;
        first.focus({ preventScroll: true });
        first.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      submitting = true;
      $('#co-alert').hidden = true;
      var btn = $('#place');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + t('co.placing') + '</span>';
      setTimeout(placeOrder, reduced ? 200 : 1100);
    });
  }
  function placeOrder() {
    var form = $('#co');
    if (!form || !cart.length) return;
    var v = function (n) { return form.elements[n] ? String(form.elements[n].value || '').trim() : ''; };
    var id = 'SD-' + String(Math.floor(100000 + Math.random() * 900000));
    var slotId = (form.querySelector('input[name="slot"]:checked') || {}).value;
    var sl = slots.filter(function (s) { return s.id === slotId; })[0] || slots[0];
    var order = {
      id: id, date: Date.now(),
      lines: cart.map(function (l) { return { id: l.id, s: l.s, q: l.q }; }),
      name: v('name'),
      addr: { gov: v('gov'), area: v('area'), block: toLatinDigits(v('block')), street: v('street'), avenue: v('avenue'), house: v('house'), apt: v('apt') },
      slot: sl.id, when: sl.label,
      pay: (form.querySelector('input[name="pay"]:checked') || {}).value || 'knet',
      wrap: !!(form.elements.wrap && form.elements.wrap.checked), msg: v('msg')
    };
    store.set('lastOrder', order);
    cart = []; saveCart(); updateBadge(false);
    draft = {}; session.del('draft');
    hintNav('#/order/' + id);
    location.hash = '#/order/' + id;
  }

  /* ---------- confirmation ---------- */
  function viewOrder(id) {
    var o = store.get('lastOrder', null);
    if (!o || o.id !== id || !Array.isArray(o.lines)) {
      return '<div class="wrap"><div class="nf">' + A.empty() + '<h1 class="h-md">' + t('ok.missT') + '</h1><p class="lead">' + t('ok.missD') + '</p>' +
        '<a class="btn btn-dark" href="#/shop">' + t('ok.again') + '</a></div></div>';
    }
    var lines = sanitizeCart(o.lines);
    var tot = totals(lines);
    var g = GOV[o.addr.gov];
    var area = g && g.areas[+o.addr.area] ? g.areas[+o.addr.area][lang === 'ar' ? 1 : 0] : '';
    var sep = lang === 'ar' ? '، ' : ', ';
    var addr = [area,
      t('addr.block') + ' ' + esc(o.addr.block),
      t('addr.street') + ' ' + esc(o.addr.street),
      o.addr.avenue ? t('addr.avenue') + ' ' + esc(o.addr.avenue) : '',
      t('addr.house') + ' ' + esc(o.addr.house),
      o.addr.apt ? esc(o.addr.apt) : '',
      g ? L(g) : ''].filter(Boolean).join(sep);
    var when = o.when && o.when.en ? L(o.when) : L((slots[0] || {}).label);
    var pay = D.PAYMENTS.filter(function (m) { return m.id === o.pay; })[0] || D.PAYMENTS[0];
    var first = String(o.name || '').split(/\s+/)[0];
    return '<div class="wrap"><div style="padding-top:clamp(24px,4vw,40px)">' + steps(3) + '</div><div class="confirm">' +
      '<div class="confirm-art-wrap">' + A.confirm(P, t('ok.art')) + '</div>' +
      '<div class="confirm-copy"><p class="eyebrow">' + t('ok.eyebrow') + '</p>' +
      '<h1 class="h-lg">' + t('ok.title', { name: esc(first) }) + '</h1><p class="lead">' + t('ok.sub') + '</p>' +
      '<p class="order-no"><span>' + t('ok.no') + '</span><b>' + esc(o.id) + '</b></p>' +
      '<div class="demo-banner" role="note">' + ic('info') + '<p>' + t('ok.demo') + '</p></div>' +
      '<dl class="facts"><div><dt>' + t('ok.to') + '</dt><dd>' + addr + '</dd></div>' +
      '<div><dt>' + t('ok.when') + '</dt><dd>' + esc(when) + '</dd></div>' +
      '<div><dt>' + t('ok.pay') + '</dt><dd>' + L(pay.name) + '</dd></div></dl>' +
      (o.wrap ? '<p class="demo-note">' + ic('gift') + '<span>' + t('ok.wrap') + ' ' + (o.msg ? '“' + esc(o.msg) + '”' : '—') + '</span></p>' : '') +
      '<div class="panel"><h2 class="h-md" style="font-size:26px">' + t('ok.items') + '</h2>' + summaryHTML(lines, tot) + '</div>' +
      '<div><a class="btn btn-dark" href="#/shop">' + t('ok.again') + ic('arrow', 'flip') + '</a></div>' +
      '</div></div></div>';
  }

  function viewNotFound(msg) {
    return '<div class="wrap"><div class="nf">' + A.empty() + '<h1 class="h-md">' + (msg || t('nf.title')) + '</h1>' +
      '<a class="btn btn-dark" href="#/">' + t('nf.btn') + '</a></div></div>';
  }

  /* ---------- newsletter (demo) ---------- */
  function bindNews() {
    var f = $('#news');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = $('#f-nemail'), w = f.querySelector('[data-f="nemail"]'), v = el.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        w.classList.add('invalid'); el.setAttribute('aria-invalid', 'true');
        w.querySelector('.err span').textContent = t('err.email');
        el.focus();
        return;
      }
      f.innerHTML = '<p class="ok-msg" role="status" tabindex="-1">' + ic('check') + '<span>' + t('news.ok') + '</span></p>';
      var ok = f.querySelector('.ok-msg');
      if (ok) ok.focus({ preventScroll: true });
    });
    f.addEventListener('input', function () {
      var w = f.querySelector('[data-f="nemail"]');
      if (w && w.classList.contains('invalid')) { w.classList.remove('invalid'); $('#f-nemail').removeAttribute('aria-invalid'); }
    });
  }

  /* ================= cart drawer ================= */
  var lastFocus = null;
  function setInert(on) {
    [top, main, ftr, concept].forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function renderDrawer(focusSel) {
    var n = cartCount(), tot = totals();
    var html = '<div class="drawer-scrim" data-act="cart-close"></div>' +
      '<aside class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">' +
      '<div class="drawer-head"><h2 id="drawer-title">' + t('cart.title') + (n ? ' <small>' + itemsLabel(n) + '</small>' : '') + '</h2>' +
      '<button class="icon-btn drawer-close" type="button" data-act="cart-close" aria-label="' + t('cart.close') + '">' + ic('close') + '</button></div>';
    if (!cart.length) {
      html += '<div class="drawer-body"><div class="drawer-empty">' + A.empty() + '<h3 class="h-md">' + t('cart.emptyT') + '</h3><p>' + t('cart.emptyD') + '</p>' +
        '<a class="btn btn-dark" href="#/shop">' + t('cart.shop') + '</a></div></div>';
    } else {
      var done = tot.sub >= FREE, pct = Math.min(100, tot.sub / FREE * 100);
      html += '<div class="ship' + (done ? ' done' : '') + '"><p>' + ic(done ? 'check' : 'truck') + '<span>' +
        (done ? t('cart.free') : t('cart.away', { amt: money(FREE - tot.sub) })) + '</span></p>' +
        '<div class="bar" role="progressbar" aria-label="' + t('cart.progress') + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><i style="width:' + pct.toFixed(1) + '%"></i></div></div>' +
        '<ul class="drawer-body">' + cart.map(function (l) {
          var p = byId[l.id], k = l.id + ':' + l.s, name = L(p.name);
          return '<li class="line"><div class="line-art">' + A.scene(p) + '</div><div class="line-main">' +
            '<div class="line-top"><h3><a href="#/product/' + p.id + '">' + name + '</a></h3><p class="price">' + money(unit(l) * l.q) + '</p></div>' +
            '<p class="meta">' + L(p.sizes[l.s]) + ' · ' + t('cart.each', { price: money(unit(l)) }) + '</p>' +
            '<div class="line-bot"><div class="qty sm" role="group" aria-label="' + esc(t('pd.qty') + ' — ' + name) + '">' +
            '<button type="button" data-act="l-dec" data-k="' + k + '" aria-label="' + t('pd.dec') + '"' + (l.q <= 1 ? ' disabled' : '') + '>−</button>' +
            '<output>' + l.q + '</output>' +
            '<button type="button" data-act="l-inc" data-k="' + k + '" aria-label="' + t('pd.inc') + '">+</button></div>' +
            '<button class="rm" type="button" data-act="l-rm" data-k="' + k + '" aria-label="' + esc(t('cart.removeA', { name: name })) + '">' + t('cart.remove') + '</button></div>' +
            '</div></li>';
        }).join('') + '</ul>' +
        '<div class="drawer-foot">' +
        '<div class="sum-row"><span>' + t('cart.sub') + '</span><span class="price">' + money(tot.sub) + '</span></div>' +
        '<div class="sum-row"><span>' + t('cart.del') + '</span>' + (tot.del ? '<span class="price">' + money(tot.del) + '</span>' : '<span class="free">' + t('cart.freeTag') + '</span>') + '</div>' +
        '<div class="sum-row total"><span>' + t('cart.total') + '</span><span class="price">' + money(tot.total) + '</span></div>' +
        '<a class="btn btn-dark btn-block" href="#/checkout">' + t('cart.checkout') + ic('arrow', 'flip') + '</a>' +
        '<p class="demo-note">' + ic('info') + '<span>' + t('cart.note') + '</span></p></div>';
    }
    html += '</aside>';
    drawer.innerHTML = html;
    if (focusSel) {
      var f = drawer.querySelector(focusSel);
      if (f && !f.disabled) f.focus(); else { var c = drawer.querySelector('.drawer-close'); if (c) c.focus(); }
    }
  }
  function openDrawer() {
    if (menuEl.classList.contains('open')) closeMenu(true);
    renderDrawer();
    if (!drawer.classList.contains('open')) lastFocus = document.activeElement;
    drawer.classList.add('open');
    setInert(true);
    setTimeout(function () { var c = drawer.querySelector('.drawer-close'); if (c) c.focus(); }, 60);
  }
  /* viaLink: a link inside the drawer was clicked and is about to navigate */
  function closeDrawer(silent, viaLink) {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    setInert(false);
    if (location.hash.indexOf('#/cart') === 0) {
      /* the drawer came from a #/cart link: give the URL back to the page underneath */
      if (cartEntry && !viaLink) { skipHash = viewHash; try { history.back(); } catch (e) { skipHash = null; } }
      else { try { history.replaceState(null, '', viewHash); } catch (e) { /* ignore */ } }
    }
    cartEntry = false;
    if (current) setNavCurrent(current);
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* ================= menu ================= */
  var menuFocus = null;
  function openMenu() {
    menuFocus = document.activeElement;
    menuEl.classList.add('open');
    setInert(true);
    var b = $('.menu-btn');
    if (b) b.setAttribute('aria-expanded', 'true');
    setTimeout(function () { var c = menuEl.querySelector('[data-act="menu-close"].icon-btn'); if (c) c.focus(); }, 60);
  }
  function closeMenu(silent) {
    if (!menuEl.classList.contains('open')) return;
    menuEl.classList.remove('open');
    setInert(false);
    var b = $('.menu-btn');
    if (b) b.setAttribute('aria-expanded', 'false');
    if (!silent && menuFocus && document.contains(menuFocus)) menuFocus.focus({ preventScroll: true });
  }

  /* ================= cart actions ================= */
  function addToCart(id, s, q, src, openAfter) {
    var p = byId[id];
    var ex = cart.filter(function (l) { return l.id === id && l.s === s; })[0];
    if (ex) ex.q = Math.min(99, ex.q + q); else cart.push({ id: id, s: s, q: q });
    saveCart();
    var dur = fly(src);
    setTimeout(function () {
      updateBadge(true);
      if (drawer.classList.contains('open')) renderDrawer();
      if (openAfter) openDrawer();
    }, dur);
    if (!openAfter) {
      toast(t('added', { name: L(p.name) + ' (' + L(p.sizes[s]) + ')' }), { label: t('view'), fn: openDrawer });
    }
  }
  function fly(src) {
    var target = $('.cart-btn');
    if (reduced || !src || !target || !src.getBoundingClientRect || !document.body.animate) return 0;
    var a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width || !b.width) return 0;
    var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    var dot = document.createElement('div');
    dot.className = 'fly';
    document.body.appendChild(dot);
    var anim = dot.animate([
      { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1)', opacity: 1 },
      { transform: 'translate(' + ((x0 + x1) / 2) + 'px,' + (Math.min(y0, y1) - 90) + 'px) scale(1.25)', opacity: 1, offset: 0.5 },
      { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.35)', opacity: 0.4 }
    ], { duration: 650, easing: 'cubic-bezier(.45,0,.3,1)' });
    anim.onfinish = function () { dot.remove(); };
    return 620;
  }
  function changeLine(k, delta, remove) {
    var idx = -1;
    cart.forEach(function (l, i) { if (l.id + ':' + l.s === k) idx = i; });
    if (idx < 0) return;
    var l = cart[idx], name = L(byId[l.id].name);
    var focusSel = null;
    if (remove) {
      cart.splice(idx, 1);
      toast(t('cart.removed', { name: name }));
      var next = cart[idx] || cart[idx - 1];
      focusSel = next ? '[data-act="l-rm"][data-k="' + next.id + ':' + next.s + '"]' : '.drawer-close';
    } else {
      l.q = Math.max(1, Math.min(99, l.q + delta));
      focusSel = '[data-act="' + (delta > 0 || l.q === 1 ? 'l-inc' : 'l-dec') + '"][data-k="' + k + '"]';
      announce(t('qtyA', { name: name + ' (' + L(byId[l.id].sizes[l.s]) + ')', n: l.q }));
    }
    saveCart();
    updateBadge(false);
    renderDrawer(focusSel);
    if (current && current.name === 'checkout') renderView(current, false);
  }

  /* ================= toasts ================= */
  function toast(msg, action) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = ic(action ? 'check' : 'info') + '<span>' + msg + '</span>' + (action ? '<button type="button">' + action.label + '</button>' : '');
    if (action) el.querySelector('button').addEventListener('click', function () { action.fn(); el.remove(); });
    while (toasts.children.length > 1) toasts.removeChild(toasts.firstChild);
    toasts.appendChild(el);
    /* stays while hovered or focused, so the action button can be reached */
    var timer = null;
    function hide() {
      el.classList.add('out');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
    }
    function start(ms) { clearTimeout(timer); timer = setTimeout(hide, ms); }
    function pause() { clearTimeout(timer); }
    function resume() {
      setTimeout(function () {
        if (el.contains(document.activeElement) || el.matches(':hover')) return;
        start(2500);
      }, 0);
    }
    el.addEventListener('mouseenter', pause);
    el.addEventListener('focusin', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusout', resume);
    start(action ? 6000 : 4200);
  }
  var srLive = null;
  function announce(msg) {
    if (!srLive) srLive = $('#sr-live');
    if (!srLive) return;
    srLive.textContent = '';
    setTimeout(function () { srLive.textContent = msg; }, 60);
  }

  /* ================= language ================= */
  function setLang(l) {
    lang = l;
    var html = document.documentElement;
    html.lang = l;
    html.dir = l === 'ar' ? 'rtl' : 'ltr';
    store.set('lang', l);
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); history.replaceState(null, '', u.pathname + u.search + u.hash); }
    } catch (e) { /* ignore */ }
    var y = window.scrollY;
    var menuOpen = menuEl.classList.contains('open');
    renderChrome();
    /* re-render the page that is showing (under the drawer this is viewHash, not #/cart) */
    var r = parseRoute(viewHash) || homeRoute();
    renderView(r, false);
    if (r.name !== 'story') window.scrollTo(0, y);
    if (drawer.classList.contains('open')) {
      renderDrawer('.drawer-close');
    } else if (menuOpen) {
      var mb = $('.menu-btn');
      if (mb) mb.setAttribute('aria-expanded', 'true');
      menuFocus = mb;
      var ml = menuEl.querySelector('.menu-foot .lang-btn');
      if (ml) ml.focus();
    } else {
      var lb = $('.hdr .lang-btn');
      if (lb) lb.focus({ preventScroll: true });
    }
  }

  /* ================= events ================= */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    var href = a ? a.getAttribute('href') || '' : '';
    if (href.indexOf('#/') === 0) hintNav(href);
    if (a && menuEl.contains(a)) closeMenu(true);
    if (a && drawer.contains(a)) closeDrawer(true, true);
    if (a && href === '#/story' && location.hash === '#/story') {
      e.preventDefault();
      var st = $('#story');
      if (st) st.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    switch (act) {
      case 'lang': setLang(lang === 'ar' ? 'en' : 'ar'); break;
      case 'cart-open': e.preventDefault(); openDrawer(); break;
      case 'cart-close': closeDrawer(); break;
      case 'menu-open': openMenu(); break;
      case 'menu-close': closeMenu(); break;
      case 'skip': e.preventDefault(); main.focus(); break;
      case 'search':
        if (current && current.name === 'shop') { var q = $('#q'); if (q) { q.focus({ preventScroll: true }); q.scrollIntoView({ block: 'center' }); } }
        else { hintNav('#/shop'); location.hash = '#/shop'; setTimeout(function () { var q2 = $('#q'); if (q2) q2.focus(); }, 80); }
        break;
      case 'jump':
        e.preventDefault();
        var to = document.getElementById(el.getAttribute('data-to'));
        if (to) {
          if (to.disabled) to = document.getElementById('f-gov') || to;
          to.focus({ preventScroll: true });
          to.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        }
        break;
      case 'qadd':
        var id = el.getAttribute('data-id');
        addToCart(id, 0, 1, el, false);
        el.classList.add('done'); el.innerHTML = ic('check');
        setTimeout(function () { el.classList.remove('done'); el.innerHTML = ic('plus'); }, 1400);
        break;
      case 'pd-inc': pd.q = Math.min(99, pd.q + 1); refreshPd(); break;
      case 'pd-dec': pd.q = Math.max(1, pd.q - 1); refreshPd(); break;
      case 'pd-add':
        addToCart(pd.id, pd.s, pd.q, el, true);
        pd.q = 1; refreshPd();
        break;
      case 'l-inc': changeLine(el.getAttribute('data-k'), 1); break;
      case 'l-dec': changeLine(el.getAttribute('data-k'), -1); break;
      case 'l-rm': changeLine(el.getAttribute('data-k'), 0, true); break;
      case 'wa': toast(t('toast.wa')); break;
      case 'chip': shop.col = el.getAttribute('data-col'); updateShop(); break;
      case 'clear-q':
        shop.q = ''; var qi = $('#q'); if (qi) { qi.value = ''; qi.focus(); } updateShop(); break;
      case 'reset':
        shop.q = ''; shop.col = 'all'; shop.sort = 'featured';
        var qr = $('#q'), so = $('#sort');
        if (qr) qr.value = '';
        if (so) so.value = 'featured';
        updateShop(); if (qr) qr.focus(); break;
    }
  });

  /* search from the mobile menu */
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'menu-search') return;
    e.preventDefault();
    var v = ($('#mq') || {}).value || '';
    v = v.trim();
    var h = v ? '#/shop?q=' + encodeURIComponent(v) : '#/shop';
    closeMenu(true);
    if (location.hash === h) { var q = $('#q'); if (q) q.focus(); return; }
    hintNav(h);
    location.hash = h;
    if (!v) setTimeout(function () { var q2 = $('#q'); if (q2) q2.focus(); }, 80);
  });

  document.addEventListener('keydown', function (e) {
    var dlg = drawer.classList.contains('open') ? drawer.querySelector('.drawer-panel') : menuEl.classList.contains('open') ? menuEl.querySelector('.menu-panel') : null;
    if (!dlg) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (drawer.classList.contains('open')) closeDrawer(); else closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', dlg).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('hashchange', route);
  window.addEventListener('storage', function (e) {
    if (e.key === 'sadeem.cart') {
      cart = sanitizeCart(store.get('cart', []));
      updateBadge(false);
      if (drawer.classList.contains('open')) renderDrawer();
    }
  });

  /* ================= demo seeding (?demo=1 or ?demo=low) — for previews/screenshots ================= */
  (function seed() {
    var params;
    try { params = new URLSearchParams(location.search); } catch (e) { return; }
    var mode = params.get('demo');
    if (!mode) return;
    var rr = parseRoute();
    if (!cart.length && !(rr && rr.name === 'order')) {
      cart = mode === 'low' ? [{ id: 'musk-ward', s: 0, q: 1 }] :
        [{ id: 'nokhatha', s: 0, q: 1 }, { id: 'musk-ward', s: 0, q: 1 }, { id: 'bakhoor-majlis', s: 0, q: 2 }];
      saveCart();
    }
    var r = parseRoute();
    if (r && r.name === 'order' && r.parts[1]) {
      var o = store.get('lastOrder', null);
      if (!o || o.id !== r.parts[1]) {
        store.set('lastOrder', {
          id: r.parts[1], date: Date.now(),
          lines: [{ id: 'nokhatha', s: 0, q: 1 }, { id: 'musk-ward', s: 0, q: 1 }, { id: 'bakhoor-majlis', s: 0, q: 2 }],
          name: lang === 'ar' ? 'سارة العلي' : 'Sara Al-Ali',
          addr: { gov: 'hawalli', area: 1, block: '10', street: lang === 'ar' ? 'سالم المبارك' : 'Salem Al-Mubarak', avenue: '', house: '24', apt: '' },
          slot: (slots[1] || slots[0]).id, when: (slots[1] || slots[0]).label,
          pay: 'knet', wrap: true, msg: lang === 'ar' ? 'عيدكم مبارك!' : 'Eid Mubarak!'
        });
      }
    }
  })();

  /* ================= boot ================= */
  renderChrome();
  route();
  if (!parseRoute()) renderView({ name: 'home', parts: [], q: new URLSearchParams() }, false);
})();
