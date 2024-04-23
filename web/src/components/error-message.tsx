import { useTranslations } from 'next-intl';

export default function ErrorMessage({ errorCode = 'genericError' }) {
  const t = useTranslations();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center -mt-6">
      <span className="font-bold text-lg text-destructive">{t('Miscellaneous.genericErrorTitle')}</span>
      {t(`Miscellaneous.ErrorMessages.${errorCode}`)}
    </div>
  );
}
