import { signIn, signOut, useSession } from 'next-auth/react';
import Button from 'antd/lib/button';
import UserInfo from './UserInfo';

export default function LoginInfo() {
  const { data: session } = useSession();

  const onLoginBtnClick = () => {
    signIn();
  };

  const onLogOutBtnClick = () => {
    signOut();
  };

  const loginBtn = (
    <Button type="primary" onClick={onLoginBtnClick}>Login</Button>
  );

  if (!session) return loginBtn;
  const user = session.user;
  if (!user) return loginBtn;

  return (
    <UserInfo
      name={user.name || ''}
      avatar={{
        alt: user.name || '',
        src: user.image || ''
      }}
      onLogOutBtnClick={onLogOutBtnClick}
    />
  );
}
