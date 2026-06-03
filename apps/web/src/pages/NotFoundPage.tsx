import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>404 — {t('brand.name')}</title>
      </Helmet>
      <div className="container-content py-24 text-center space-y-6 max-w-md mx-auto">
        <p className="font-display text-6xl text-gold/40 tabular">404</p>
        <h1 className="text-h2 heading-display text-pearl">{t('errors.not_found')}</h1>
        <Button to="/" variant="gold">
          {t('errors.back_home')}
        </Button>
      </div>
    </>
  );
}
