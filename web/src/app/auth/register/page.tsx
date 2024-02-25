'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { authenticateUser } from '../../../lib/actions/auth';
import showErrorToast from '@/lib/utils/show-error-toast';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Enter an e-mail address' })
      .email({ message: 'Invalid e-mail address' }),
    password: z.string().min(8, { message: 'Password is too short' }),
    passwordConfirmation: z.string().min(8, { message: 'Password is too short' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export default function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { success, errorMessage } = await authenticateUser(values, true);

    if (success) {
      toast({
        title: "You're registered!",
      });
      router.push('/bookmarks');
    } else {
      showErrorToast(errorMessage);
    }
  };

  return (
    <>
      <h1 className="text-2xl mb-6">Register a new account.</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">E-mail address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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
                <FormDescription>Must be at least 8 characters long</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3 w-full">
            Register.
          </Button>
        </form>
      </Form>

      <Link href="/auth/login" className="flex justify-center">
        <Button variant={'link'}>Already have an account?</Button>
      </Link>
    </>
  );
}
