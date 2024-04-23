'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookmark } from '@/lib/actions/bookmarks/create';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateBookmark } from '@/lib/actions/bookmarks/update';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/lib/types/category';
import { getAllCategories } from '@/lib/actions/categories/get-all';
import LoadingIndicator from '@/components/loading-indicator';
import { toast } from './ui/toast/use-toast';

interface BookmarkFormDialogProps {
  triggerElement: React.ReactNode;
  bookmarkId?: number;
  defaultValues?: {
    title?: string;
    link?: string;
    description?: string | undefined;
    categoryId?: string | undefined;
  };
  onClose?: () => void; // optional callback to be called when the dialog gets closed
}

export default function BookmarkFormDialog({
  bookmarkId,
  defaultValues,
  triggerElement,
  onClose,
}: BookmarkFormDialogProps) {
  const t = useTranslations();

  const formSchema = z.object({
    title: z.string({ required_error: t('Bookmark.Form.Error.titleEmpty') }),
    link: z
      .string({ required_error: t('Bookmark.Form.Error.linkEmpty') })
      .url({ message: t('Bookmark.Form.Error.linkInvalid') }),
    description: z.string().optional(),
    categoryId: z.string().optional(),
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!bookmarkId;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  // maybe find a better way to solve this...
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    (async () => {
      const { value: categories } = await getAllCategories();
      setCategories(categories!);
    })();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isEditing && form.formState.isSubmitting) return; // prevent unintentional double creation of bookmarks
    setIsLoading(true);
    const { success, errorCode } = isEditing
      ? await updateBookmark(bookmarkId!, { ...values, categoryId: parseInt(values.categoryId!) })
      : await createBookmark({ ...values, categoryId: parseInt(values.categoryId!) });

    if (success) {
      router.refresh();
      if (!isEditing) form.reset(); // only reset the form if we're creating a new bookmark; otherwise the form would have the original values from before editing the bookmark
    } else {
      toast({
        title: t('Miscellaneous.genericErrorTitle'),
        description: t(`Miscellaneous.ErrorMessages.${errorCode}`),
        variant: 'destructive',
      });
    }

    setOpen(false);
    onClose?.();
    setIsLoading(false);
  }

  function onOpenChange(newOpenValue: boolean) {
    if (!newOpenValue) {
      onClose?.();
      form.reset();
    }
    setOpen(newOpenValue);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('Bookmark.editModalTitle') : t('Bookmark.createModalTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('Bookmark.Form.linkLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Bookmark.Form.linkPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('Bookmark.Form.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('Bookmark.Form.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {categories.length > 1 && ( // only show the category select if the user has created at least one category (in addition to the root category)}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Bookmark.Form.categoryLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Bookmark.Form.categoryPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO iterate over user categories */}
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.title === '__ROOT__'
                              ? t('Bookmark.categorySelect__RootCategoryName')
                              : category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="mt-3 w-full">
              {isLoading ? (
                <LoadingIndicator />
              ) : isEditing ? (
                t('Bookmark.Form.saveLabel')
              ) : (
                t('Bookmark.Form.submitLabel')
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
