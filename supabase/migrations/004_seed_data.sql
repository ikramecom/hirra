-- =====================================================================
-- HIRRA — Seed Data
-- 3 products + 3 bundles + 7 anchor reviews
-- Image URLs are placeholders — replace after content shoot.
-- =====================================================================

-- =====================================================================
-- PRODUCTS
-- =====================================================================

insert into products (
  slug, name_ar, name_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  price_sar, compare_at_price_sar, cost_sar,
  sku, inventory_count, is_active, is_hero, display_order
) values
(
  'hirra-pro-roller',
  'هِرّة برو — رولر شعر القطط',
  'Hirra Pro Lint-Free Cat Hair Roller',
  'رولر سيليكون فاخر، قابل لإعادة الاستخدام',
  'Premium reusable silicone — for the Saudi home',
  'هِرّة برو رولر مصمم خصيصاً للبيت السعودي. سيليكون فاخر يلتقط شعر القطط بسحبة واحدة. قابل لإعادة الاستخدام إلى الأبد — لا أوراق لاصقة، لا هدر. آمن للعباية السوداء، السوفا المخمل، وكل أقمشة بيتك.',
  'The Hirra Pro Roller is designed for the Saudi home. Premium food-grade silicone picks up cat hair in a single swipe. Reusable forever — no sticky paper, no waste. Safe on black abayas, velvet majlis sofas, and every fabric in your home.',
  99.00, 129.00, 18.00,
  'HRR-PRO-001', 50, true, true, 1
),
(
  'hirra-honeycomb-mat',
  'حصيرة هِرّة العسلية لحبس الرمل',
  'Hirra Honeycomb Litter Trap Mat XL',
  'حصيرة مزدوجة الطبقات تحبس كل حبة رمل',
  'Double-layer mat that traps every grain',
  'حصيرة هِرّة العسلية بحجم XL (٧٥×٦٠ سم) تحبس كل حبة رمل قبل ما توصل لرخام بيتك. طبقتين: علوية بفتحات عسلية، وسفلية مقاومة للماء وعازلة للانزلاق. سهلة التنظيف بالنفض.',
  'The Hirra Honeycomb Mat XL (75×60 cm) traps every grain of litter before it reaches your marble floors. Two layers: a honeycomb top and a waterproof non-slip bottom. Clean it with a simple shake.',
  119.00, 149.00, 28.00,
  'HRR-MAT-001', 30, true, false, 2
),
(
  'hirra-aurora-fountain',
  'نافورة هِرّة أورورا للقطط',
  'Hirra Aurora Cat Water Fountain',
  'نافورة هادئة بإضاءة LED — تشتغل ٣٠ يوم بشحنة واحدة',
  'Silent LED fountain — 30 days per charge',
  'نافورة هِرّة أورورا — ماء بارد متجدد لقطتك في حر الرياض. مضخة هادئة (٢٥ ديسيبل)، فلتر كربون نشط قابل للاستبدال، إضاءة LED ناعمة تشتغل بالحركة، وسعة ٢.٥ لتر. تعمل بشحن USB — آمنة وعملية لكل بيت سعودي.',
  'Hirra Aurora Fountain — cool, filtered, flowing water for your cat in the Riyadh heat. Silent pump (25 dB), replaceable activated carbon filter, motion-activated soft LED, 2.5L capacity. USB-powered — safe and practical for every Saudi home.',
  229.00, 279.00, 65.00,
  'HRR-FNT-001', 20, true, false, 3
);

-- =====================================================================
-- PRODUCT IMAGES (placeholders — replace with Supabase Storage URLs)
-- =====================================================================

insert into product_images (product_id, url, alt_ar, alt_en, display_order, is_primary)
select
  p.id,
  'https://placehold.co/1080x1080/F4ECE0/0E5C42?text=Hirra+Pro',
  'هِرّة برو رولر',
  'Hirra Pro Roller',
  1,
  true
from products p where p.slug = 'hirra-pro-roller';

insert into product_images (product_id, url, alt_ar, alt_en, display_order, is_primary)
select
  p.id,
  'https://placehold.co/1080x1080/F4ECE0/0E5C42?text=Hirra+Mat',
  'حصيرة هِرّة',
  'Hirra Mat',
  1,
  true
from products p where p.slug = 'hirra-honeycomb-mat';

insert into product_images (product_id, url, alt_ar, alt_en, display_order, is_primary)
select
  p.id,
  'https://placehold.co/1080x1080/F4ECE0/0E5C42?text=Hirra+Aurora',
  'نافورة هِرّة أورورا',
  'Hirra Aurora Fountain',
  1,
  true
from products p where p.slug = 'hirra-aurora-fountain';

-- =====================================================================
-- PRODUCT VARIANTS (Hair Roller colors)
-- =====================================================================

insert into product_variants (product_id, name_ar, name_en, sku, inventory_count, display_order)
select p.id, 'زيتي', 'Olive', 'HRR-PRO-001-OLV', 20, 1
from products p where p.slug = 'hirra-pro-roller';

insert into product_variants (product_id, name_ar, name_en, sku, inventory_count, display_order)
select p.id, 'كريمي', 'Cream', 'HRR-PRO-001-CRM', 20, 2
from products p where p.slug = 'hirra-pro-roller';

insert into product_variants (product_id, name_ar, name_en, sku, inventory_count, display_order)
select p.id, 'بني داكن', 'Walnut', 'HRR-PRO-001-WAL', 10, 3
from products p where p.slug = 'hirra-pro-roller';

-- =====================================================================
-- BUNDLES
-- =====================================================================

insert into bundles (slug, name_ar, name_en, description_ar, description_en, price_sar, savings_sar, image_url, is_active, display_order)
values
(
  'hirra-trio',
  'مجموعة هِرّة الثلاثية',
  'The Hirra Trio',
  'البطل الكامل — الرولر + الحصيرة + النافورة في مجموعة واحدة فاخرة، بسعر خاص.',
  'The complete cat-mom kit — roller + mat + fountain in one premium bundle, at a special price.',
  397.00, 50.00,
  'https://placehold.co/1200x900/F4ECE0/0E5C42?text=Hirra+Trio',
  true, 1
),
(
  'clean-home-bundle',
  'مجموعة البيت النظيف',
  'The Clean-Home Bundle',
  'بيت نظيف، قطة سعيدة. الرولر + الحصيرة بسعر مجموعة.',
  'Clean home, happy cat. The Roller + Mat at a bundle price.',
  189.00, 29.00,
  'https://placehold.co/1200x900/F4ECE0/0E5C42?text=Clean+Home',
  true, 2
),
(
  'pampered-cat-set',
  'مجموعة الدلال',
  'The Pampered Cat Set',
  'دلال على دلال. الرولر + النافورة لقطتك المدللة.',
  'Spoiled, with love. The Roller + Fountain for your pampered cat.',
  289.00, 39.00,
  'https://placehold.co/1200x900/F4ECE0/0E5C42?text=Pampered+Set',
  true, 3
);

-- Bundle compositions

insert into bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from bundles b
cross join products p
where b.slug = 'hirra-trio'
  and p.slug in ('hirra-pro-roller', 'hirra-honeycomb-mat', 'hirra-aurora-fountain');

insert into bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from bundles b
cross join products p
where b.slug = 'clean-home-bundle'
  and p.slug in ('hirra-pro-roller', 'hirra-honeycomb-mat');

insert into bundle_products (bundle_id, product_id, quantity)
select b.id, p.id, 1
from bundles b
cross join products p
where b.slug = 'pampered-cat-set'
  and p.slug in ('hirra-pro-roller', 'hirra-aurora-fountain');

-- =====================================================================
-- ANCHOR REVIEWS (7 — seeded in Saudi-natural Arabic)
-- =====================================================================

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'نورة', 'الرياض', 5,
  'أنقذني قبل الحفلات',
  'اشتريتها قبل أسبوع. الرولر ده أنقذني قبل الحفلات — كنت أمشي وعليّ شعر القطة وأنا ما أحس. هِرّة برو غيّر كل شي. والتغليف فخم. أوصي بها بقوة 💚',
  true, true, 1
from products p where p.slug = 'hirra-pro-roller';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'سارة', 'جدة', 5,
  'أول رولر يضبط معاي',
  'عندي ٣ قطط شيرازي وشعرهم في كل مكان. جربت كل أنواع الرولرات من أمازون، ما واحد ضبط معاي. هذا أول رولر يجمع الشعر فعلاً وما يحتاج لصقات.',
  true, true, 2
from products p where p.slug = 'hirra-pro-roller';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'ريما', 'الدمام', 4,
  'خدمة سعودية حقيقية',
  'جودة ممتازة، التغليف فخم، والخدمة على واتساب سريعة جداً. خصمت نجمة فقط لأن اللون اللي طلبته كان مختلف شوي عن الصورة — بس لما تواصلت معاهم، استبدلوا فوراً.',
  true, true, 3
from products p where p.slug = 'hirra-pro-roller';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'مايا', 'الرياض', 5,
  'هدية مثالية',
  'أهديته لأختي اللي عندها قطتها قمر، ومن يومها وهي تشكرني. التغليف يحس لك إنه من براند فاخر، مش دروبشيبنغ عادي.',
  true, true, 4
from products p where p.slug = 'hirra-pro-roller';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'علا', 'الخبر', 5,
  'يستاهل كل ريال',
  'أعمل في شركة وما أقدر أمشي وعليّ شعر القطة. الرولر ده وفّر علي كل صباح. بصراحة، يستاهل كل ريال.',
  true, true, 5
from products p where p.slug = 'hirra-pro-roller';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'هند', 'الرياض', 5,
  'وقفت رمل القطة عن المرمر',
  'الحصيرة كبيرة وتمسك الرمل تماماً. الرخام عندي نضيف لأول مرة من زمان. مع ضمان رضا فعلاً يطمنك.',
  true, true, 1
from products p where p.slug = 'hirra-honeycomb-mat';

insert into reviews (product_id, customer_name, customer_city, rating, title_ar, body_ar, is_verified, is_published, display_order)
select
  p.id, 'دانة', 'جدة', 5,
  'قطتي صارت تشرب أكثر',
  'النافورة هادية فعلاً وقطتي تشرب منها أكثر بكثير من الصحن العادي. الإضاءة جميلة وما تحتاج كهرباء — USB فقط.',
  true, true, 1
from products p where p.slug = 'hirra-aurora-fountain';
