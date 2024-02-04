'use server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="m-4">
        <div>{children}</div>
      </div>
    </main>
  );
}
