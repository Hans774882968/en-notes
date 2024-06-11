import { Session } from 'next-auth';

export function loginAsTheGodOfTheGods(session: Session | null | undefined): session is Session {
  if (!session) return false;
  const user = session.user;
  if (!user) return false;
  if (user.name?.toLowerCase() !== 'hans774882968') return false;
  return true;
}
