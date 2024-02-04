'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../components/ui/toast/use-toast';
import { loginUser } from '../../../lib/actions/auth/loginUser';

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    const response = await loginUser(payload);

    if (response) {
      toast({
        title: "You're logged in",
      });
      router.push('/bookmarks');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid email or password',
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
          Login
        </button>

        <Link href="/auth/register" className="p-2 bg-background text-foreground w-fit rounded">
          Dont have an account? Register
        </Link>
      </form>
    </main>
  );
}
