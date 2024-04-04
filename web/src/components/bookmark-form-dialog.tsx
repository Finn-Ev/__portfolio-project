'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookmark } from '@/lib/actions/bookmarks/create';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateBookmark } from '@/lib/actions/bookmarks/update';
import showErrorToast from '@/lib/utils/show-error-toast';
import { useTranslations } from 'next-intl';

interface BookmarkFormDialogProps {
  triggerElement: React.ReactNode;
  bookmarkId?: number;
  defaultValues?: {
    title?: string;
    link?: string;
    description?: string | undefined;
  };
  onClose?: () => void; // optional callback to be called when the dialog gets closed
}

// TODO add functionality to set the category of a bookmark when creating/editing a bookmark if the user has created at least one category
// TODO => add a select input to the form that lists all categories

export default function BookmarkFormDialog({
  bookmarkId,
  defaultValues,
  triggerElement,
  onClose,
}: BookmarkFormDialogProps) {
  const t = useTranslations();

  const formSchema = z.object({
    title: z.string().min(1, { message: t('Bookmark.Form.Error.titleEmpty') }),
    link: z.string().url({ message: t('Bookmark.Form.Error.linkInvalid') }),
    description: z.string().optional(),
  });

  const [open, setOpen] = useState(false);

  const isEditing = !!bookmarkId;

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      link: '',
      description: '',
      ...defaultValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { success, errorMessage } = isEditing
      ? await updateBookmark(bookmarkId!, values)
      : await createBookmark(values);

    if (success) {
      router.refresh();
      if (!isEditing) form.reset(); // only reset the form if we're creating a new bookmark; otherwise the form would have the original values from before editing the bookmark
    } else {
      showErrorToast(errorMessage);
    }

    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Button type="submit" className="mt-3 w-full">
              {isEditing ? t('Bookmark.Form.saveLabel') : t('Bookmark.Form.submitLabel')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
