/**
 * WhatsApp confirmation copy (storefront → customer opens chat after checkout).
 */
export function buildRiyanaluxeOrderConfirmationWhatsAppText(
  orderNumber: string,
  locale: 'ar' | 'fr' | 'en',
): string {
  const n = orderNumber?.trim() || '';
  if (locale === 'ar') {
    return `السلام عليكم 👋
شكراً على طلبيتك من ريانا لوكس

رقم الطلبية:
${n}

عافاك جاوب باش نأكدو:
1️⃣ تأكيد
2️⃣ تعديل
3️⃣ إلغاء`;
  }
  if (locale === 'fr') {
    return `Bonjour 👋
Merci pour votre commande RIYANALUXE

N° de commande :
${n}

Merci de répondre pour confirmer :
1️⃣ Confirmer
2️⃣ Modifier
3️⃣ Annuler`;
  }
  return `Hello 👋
Thank you for your order from RIYANALUXE

Order number:
${n}

Please reply to confirm:
1️⃣ Confirm
2️⃣ Change
3️⃣ Cancel`;
}