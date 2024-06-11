import { GetServerSideProps } from 'next';
import { LOGIN_PAGE_URL } from '../frontend/urls';
import { Session } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { loginAsTheGodOfTheGods } from './perm';

export interface UserSession {
  session: Session
}

export const noEditPerm: GetServerSideProps<UserSession> = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const redirectDestination = context.resolvedUrl;
  const redirectToLoginPage = {
    redirect: {
      destination: `${LOGIN_PAGE_URL}?callbackUrl=${redirectDestination}`,
      permanent: false
    }
  };

  if (!session) return redirectToLoginPage;

  const redirectTo403Page = {
    redirect: {
      destination: '/403',
      permanent: false
    }
  };
  if (!loginAsTheGodOfTheGods(session)) return redirectTo403Page;

  return {
    props: { session }
  };
};
