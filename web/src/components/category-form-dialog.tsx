'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/toast/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCategory } from '../lib/actions/categories/create';
import { updateCategory } from '../lib/actions/categories/update';

interface CategoryFormDialogProps {
  triggerElement: React.ReactNode;
  categoryId?: number;
  defaultValues?: {
    title?: string;
    description?: string | undefined;
  };
  onClose?: () => void; // optional callback to be called when the dialog gets closed
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Enter a title' }),
  description: z.string().optional(),
});

export default function CategoryFormDialog({
  categoryId,
  defaultValues,
  triggerElement,
  onClose,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);

  const isEditing = !!categoryId;

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ...defaultValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = isEditing ? await updateCategory(categoryId!, values) : await createCategory(values);

    if (response.success) {
      router.refresh();
      if (!isEditing) form.reset(); // only reset the form if we're creating a new category; otherwise the form would have the original values from before editing the category
    } else {
      toast({
        title: 'Error',
        description: response.errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Update category.' : 'Create a new category.'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Title</FormLabel>
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
                  <FormLabel className="text-foreground">Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-3 w-full">
              {isEditing ? 'Save.' : 'Submit.'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
