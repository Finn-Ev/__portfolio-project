'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from './ui/toast/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookmark } from '../lib/actions/bookmarks/create';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateBookmark } from '../lib/actions/bookmarks/update';

interface BookmarkFormProps {
  triggerElement: React.ReactNode;
  bookmarkId?: number;
  defaultValues?: {
    title?: string;
    link?: string;
    description?: string | undefined;
  };
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Enter a title' }),
  link: z.string().url({ message: 'Invalid URL' }),
  description: z.string().optional(),
});

export default function BookmarkForm({ bookmarkId, defaultValues, triggerElement }: BookmarkFormProps) {
  const isEditing = !!bookmarkId;

  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

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
    const response = isEditing ? await updateBookmark(bookmarkId!, values) : await createBookmark(values);

    if (response.success) {
      setOpen(false);
      router.refresh();
      form.reset();
    } else {
      toast({
        title: 'Error',
        description: response.errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a bookmark</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Link</FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
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
