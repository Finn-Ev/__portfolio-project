'use client';

import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/actions/auth';

import { useToast } from '../../../components/ui/toast/use-toast';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    const response = await registerUser(payload);

    if (response) {
      toast({
        title: "You're logged in",
      });
      router.push('/bookmarks');
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred while registering. Please try again.', // TODO - add better error message
        variant: 'destructive',
      });
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username">Email: </label>
          <input type="email" id="email" name="email" required className="border rounded border-black" />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="border rounded border-black"
          />
        </div>

        <button type="submit" className="p-2 bg-background text-foreground w-fit rounded">
          Register
        </button>

        <Link href="/auth/login" className="p-2 bg-background text-foreground w-fit rounded">
          Already have an account? Login
        </Link>
      </form>
    </main>
  );
}
