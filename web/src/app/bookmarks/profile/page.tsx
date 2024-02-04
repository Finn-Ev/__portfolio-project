import LogoutBtn from '../../../components/LogoutBtn';
import { getCurrentUser } from '../../../lib/actions/auth';

export default async function page() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col">
      Logged in as {user!.email}
      <LogoutBtn />
    </div>
  );
}