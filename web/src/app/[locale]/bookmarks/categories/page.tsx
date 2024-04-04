import ErrorMessage from '@/components/error-message';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CategoryFormDialog from '@/components/category-form-dialog';
import CategoryList from '@/components/category-list';
import { getAllCategories } from '@/lib/actions/categories/get-all';
import { getTranslations } from 'next-intl/server';

export default async function BookmarksPage() {
  const t = await getTranslations();

  const { value: categories, errorMessage, success } = await getAllCategories();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
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
