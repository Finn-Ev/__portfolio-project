'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast/use-toast';
import { authenticateUser } from '../../../lib/actions/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '@/components/ui/input';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Enter an e-mail address' })
    .email({ message: 'Invalid e-mail address' }),
  password: z.string().min(8, { message: 'Your password is at least 8 characters long' }),
});

export default function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { success, errorMessage } = await authenticateUser(values);

    if (success) {
      toast({
        title: "You're logged in",
      });
      router.push('/bookmarks');
    } else {
      toast({
        title: 'Error',
        description: errorMessage ?? 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl mb-6">Login to your account.</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">E-mail address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3 w-full">
            Login.
          </Button>
        </form>
      </Form>

      <Link href="/auth/register" className="flex justify-center">
        <Button variant={'link'}>Don't have an account?</Button>
      </Link>
    </>
  );
}
