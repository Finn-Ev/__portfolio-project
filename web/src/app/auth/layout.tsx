'use server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col items-center p-8 rounded-lg bg-background m-4">
        <div>{children}</div>
      </div>
    </main>
  );
}
