import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Editorial top strip — soft cream-on-walnut, single line, slow rotation.
 *
 * Tightened from the previous emerald block: less shouty, more "fashion
 * house broadcast bar". Uses fade-in keying off the index for a calm change.
 */
export function AnnouncementBar() {
  const { t } = useTranslation();
  const messages = [
    t('announce.free_shipping'),
    t('announce.cod_available'),
    t('announce.fast_delivery'),
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="bg-walnut text-cream/90 text-xs sm:text-sm py-2.5 px-4 overflow-hidden">
      <p
        key={index}
        className="text-center animate-fade-in tracking-wide"
        aria-live="polite"
      >
        {messages[index]}
      </p>
    </div>
  );
}
