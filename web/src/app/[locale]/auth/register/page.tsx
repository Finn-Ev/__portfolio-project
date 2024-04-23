'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/ui/toast/use-toast';
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
import { authenticateUser } from '@/lib/actions/auth';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import LoadingIndicator from '@/components/loading-indicator';

export default function AuthForm() {
  const t = useTranslations();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z
    .object({
      email: z
        .string({ required_error: t('Auth.Form.Error.emailEmpty') })
        .trim()
        .email({ message: t('Auth.Form.Error.emailInvalid') }),
      password: z
        .string({ required_error: t('Auth.Form.Error.passwordEmpty') })
        .trim()
        .min(8, { message: t('Auth.Form.Error.registrationPasswordTooShort') }),
      passwordConfirmation: z
        .string({ required_error: t('Auth.Form.Error.passwordEmpty') })
        .trim()
        .min(8, { message: t('Auth.Form.Error.passwordEmpty') }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('Auth.Form.Error.passwordsDoNotMatch'),
      path: ['passwordConfirmation'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.isSubmitting) return;
    setIsLoading(true);

    const { success, errorCode } = await authenticateUser(values, true);

    if (success) {
      toast({
        title: t('Auth.Toast.registerSuccessMessage'),
      });
      router.push('/bookmarks');
    } else {
      toast({
        title: t('Miscellaneous.genericErrorTitle'),
        description: t(`Miscellaneous.ErrorMessages.${errorCode}`),
        variant: 'destructive',
      });
    }

    form.reset({
      email: values.email,
      passwordConfirmation: '',
      password: '',
    });
    setIsLoading(false);
  }

  return (
    <>
      <h1 className="text-2xl mb-6">{t('Auth.registerTitle')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">{t('Auth.Form.emailLabel')}</FormLabel>
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
                <FormLabel className="text-foreground">{t('Auth.Form.passwordLabel')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>{t('Auth.Form.Error.passwordHint')}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  {t('Auth.Form.Error.passwordConfirmationLabel')}
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3 w-full">
            {isLoading ? <LoadingIndicator /> : t('Auth.Form.registerButtonLabel')}
          </Button>
        </form>
      </Form>

      <Link href="/auth/login" className="flex justify-center mt-3">
        <Button variant={'link'} className="underline">
          {t('Auth.alreadyHaveAccountText')}
        </Button>
      </Link>
    </>
  );
}
