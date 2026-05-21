/**
 * WhatsApp COD confirmation copy (storefront → customer opens chat after checkout).
 * Matches Supabase `hirra_record_whatsapp_confirmation_opened` logged template (Arabic).
 */
export function buildHirraOrderConfirmationWhatsAppText(
  orderNumber: string,
  locale: 'ar' | 'en',
): string {
  const n = orderNumber?.trim() || '';
  if (locale === 'ar') {
    return `مرحباً 👋
شكراً لطلبك من هِرّة 🐾

رقم الطلب:
${n}

يرجى الرد لتأكيد الطلب:
1️⃣ تأكيد
2️⃣ تعديل
3️⃣ إلغاء`;
  }
  return `Hello 👋
Thank you for your order from Hirra 🐾

Order number:
${n}

Please reply to confirm your order:
1️⃣ Confirm
2️⃣ Change
3️⃣ Cancel`;
}
