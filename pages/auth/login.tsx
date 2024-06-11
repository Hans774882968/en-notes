import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Alert from 'antd/lib/alert';
import EnLayout from '@/components/EnLayout';
import Spin from 'antd/lib/spin';
import styles from './login.module.scss';

const errors: Record<string, string> = {
  Callback: 'Try signing in with a different account.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  EmailCreateAccount: 'Try signing in with a different account.',
  EmailSignin: 'The e-mail could not be sent.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  SessionRequired: 'Please sign in to access this page.',
  Signin: 'Try signing in with a different account.',
  default: 'Unable to sign in.'
};

function getParamFromParams(params: string | string[]) {
  return Array.isArray(params) ? params[0] : params;
}

export default function Login({
  providers
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query } = useRouter();
  const { error: errorParam = '' } = query;
  const errorType = getParamFromParams(errorParam);
  const errorMsg = errorType && (errors[errorType] || errors.default);
  const [signInBtnClicked, setSignInBtnClicked] = useState(false);
  const spinStyleObj = { cursor: signInBtnClicked ? 'not-allowed' : '' };

  const onSignInBtnClick = (provider: ClientSafeProvider) => {
    setSignInBtnClicked(true);
    signIn(provider.id);
  };

  return (
    <EnLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          {
            errorMsg && (
              <Alert message={errorMsg} showIcon type="error" />
            )
          }
          {
            Object.values(providers).map((provider) => (
              <Spin
                key={provider.name}
                spinning={signInBtnClicked}
                tip="Logging in..."
                style={spinStyleObj}
              >
                <button
                  className={styles.signIn}
                  onClick={() => onSignInBtnClick(provider)}
                >
                  <span>Sign in with {provider.name}</span>
                </button>
              </Spin>
            ))
          }
        </div>
      </div>
    </EnLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { callbackUrl: callbackUrlParam = '/' } = context.query;
  // TODO: 如果调用 signIn 后有 error ，那么 callbackUrl 会变长，目前没想到做法
  if (session) {
    const callbackUrl = getParamFromParams(callbackUrlParam) || '/';
    return {
      redirect: { destination: callbackUrl }
    };
  }

  const providers = await getProviders() || [];
  return {
    props: {
      providers
    }
  };
}
