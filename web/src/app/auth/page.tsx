import Link from 'next/link';

export default function page() {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold">Welcome to this app</div>
      <Link href={'/auth/login'} className="bg-background text-foreground w-fit p-3">
        Login
      </Link>
      <Link href={'/auth/register'} className="bg-background text-foreground w-fit p-3">
        Register
      </Link>
    </div>
  );
}
