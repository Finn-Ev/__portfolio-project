import ErrorMessage from '@/components/error-message';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CategoryFormDialog from '@/components/category-form-dialog';
import CategoryList from '@/components/category-list';
import { getAllCategories } from '@/lib/actions/categories/get-all';

export default async function BookmarksPage() {
  const { value: categories, errorMessage, success } = await getAllCategories();

  if (!success) {
    return <ErrorMessage message={errorMessage!} />;
  }

  return (
    <div>
      <PageHeader
        title="All categories."
        actionButton={
          <CategoryFormDialog
            triggerElement={
              <Button variant="outline">
                Create category <PlusCircle className="ml-2" />
              </Button>
            }
          />
        }
      />
      <CategoryList emptyListText="Create your first category." categories={categories!} />
    </div>
  );
}
