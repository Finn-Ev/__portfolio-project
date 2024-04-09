'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCategory } from '@/lib/actions/categories/create';
import { updateCategory } from '@/lib/actions/categories/update';
import showErrorToast from '@/lib/utils/show-error-toast';
import { useTranslations } from 'next-intl';
import { PulseLoader } from 'react-spinners';

interface CategoryFormDialogProps {
  triggerElement: React.ReactNode;
  categoryId?: number;
  defaultValues?: {
    title?: string;
    description?: string | undefined;
  };
  onClose?: () => void; // optional callback to be called when the dialog gets closed
}

export default function CategoryFormDialog({
  categoryId,
  defaultValues,
  triggerElement,
  onClose,
}: CategoryFormDialogProps) {
  const t = useTranslations();

  const formSchema = z.object({
    title: z.string().min(1, { message: t('Category.Form.Error.titleEmpty') }),
    description: z.string().optional(),
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!categoryId;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ...defaultValues,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isEditing && form.formState.isSubmitting) return; // prevent unintentional double creation of categories

    setIsLoading(true);

    const { success, errorMessage } = isEditing
      ? await updateCategory(categoryId!, values)
      : await createCategory(values);

    if (success) {
      router.refresh();
      if (!isEditing) form.reset(); // only reset the form if we're creating a new category; otherwise the form would have the original values from before editing the category
    } else {
      showErrorToast(errorMessage);
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
            {isEditing ? t('Category.editModalTitle') : t('Category.createModalTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">{t('Category.Form.titleLabel')}</FormLabel>
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
                  <FormLabel className="text-foreground">{t('Category.Form.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-3 w-full">
              {isLoading ? (
                <PulseLoader size={12} color="#FFF" />
              ) : isEditing ? (
                t('Category.Form.saveLabel')
              ) : (
                t('Category.Form.submitLabel')
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
