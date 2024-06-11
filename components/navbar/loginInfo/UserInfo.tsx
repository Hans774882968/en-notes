import Avatar from 'antd/lib/avatar';
import Button from 'antd/lib/button';
import Link from 'next/link';
import styles from './UserInfo.module.scss';

interface UserInfoProps {
  name: string
  avatar: {
    src: string
    alt: string
  }
  onLogOutBtnClick?: () => void | Promise<void>
}

export default function UserInfo({ name, avatar: { src, alt }, onLogOutBtnClick }: UserInfoProps) {
  const githubUserLink = `https://github.com/${name}`;

  return (
    <div className={styles.container}>
      <Link
        href={githubUserLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <Avatar size="large" src={src} alt={alt} />
        <span>{name}</span>
      </Link>
      <Button onClick={onLogOutBtnClick}>Logout</Button>
    </div>
  );
}
