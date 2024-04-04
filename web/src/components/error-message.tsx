import { useTranslations } from 'next-intl';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const t = useTranslations();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center -mt-6">
      <span className="font-bold text-lg text-destructive">{message}</span>
      {t('Miscellaneous.genericErrorMessage')}
    </div>
  );
}
