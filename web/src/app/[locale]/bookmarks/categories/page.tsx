import ErrorMessage from '@/components/error-message';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CategoryFormDialog from '@/components/category-form-dialog';
import CategoryList from '@/components/category-list';
import { getAllCategories } from '@/lib/actions/categories/get-all';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export default async function BookmarksPage() {
  const t = await getTranslations();

  const { value: categories, errorCode, success } = await getAllCategories();

  if (!success) {
    return <ErrorMessage errorCode={errorCode!} />;
  }

  return (
    <div className="category-page">
      <PageHeader
        title={t('Category.pageTitle')}
        actionButton={
          <CategoryFormDialog
            triggerElement={
              <Button variant="outline">
                {t('Category.createButtonLabel')} <PlusCircle className="ml-2" />
              </Button>
            }
          />
        }
      />
      <CategoryList emptyListText={t('Category.emptyListText')} categories={categories!} />
    </div>
  );
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t('Miscellaneous.PageTabTitles.categories'),
  };
}
