import LogoutBtn from '../../../components/logoutBtn';
import { getCurrentUser } from '../../../lib/actions/auth';

export default async function page() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className=" p-4 flex flex-col gap-4">
      Logged in as {user!.email}
      <LogoutBtn className="max-w-64" />
    </div>
  );
}
