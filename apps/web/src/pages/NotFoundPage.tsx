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
      <div className="container-content py-20 text-center space-y-5 max-w-md mx-auto">
        <div className="text-7xl">🐾</div>
        <h1 className="text-3xl font-bold text-walnut heading-display">{t('errors.not_found')}</h1>
        <Button to="/">{t('errors.back_home')}</Button>
      </div>
    </>
  );
}
