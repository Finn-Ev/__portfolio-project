import Link from 'next/link';
import { Button } from '../../components/ui/button';

export default function page() {
  return (
    <>
      <div className="text-center mb-2">
        <div className="font-bold text-2xl">Welcome to this app.</div>
        <div className="text-lg">To continue, please login or register</div>
      </div>
      <div className="flex gap-2 flex-col md:flex-row">
        <Link href={'/auth/login'}>
          <Button>Login to my account.</Button>
        </Link>
        <Link href={'/auth/register'}>
          <Button>Register a new account.</Button>
        </Link>
      </div>
    </>
  );
}
