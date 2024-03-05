import Col from 'antd/lib/col';
import GitHubOutlined from '@ant-design/icons/GithubOutlined';
import Image from 'next/image';
import Link from 'next/link';
import LinkSvg from './LinkSvg';
import React, { ReactNode } from 'react';
import Row from 'antd/lib/row';
import ThemeBtn from './ThemeBtn';
import icon48 from '@/assets/icon48.png';
import styles from './Navbar.module.scss';

interface ExternalLinkProps {
  href: string
  children?: ReactNode
}

function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {children}
    </Link>
  );
}

const Navbar: React.FC = () => {
  return (
    <header>
      <Row className={styles.navbar}>
        <Col span={6}>
          {/* 多套一层div，修复 flex-gap-polyfill 导致同一行右侧的元素产生偏移的bug */}
          <div className={styles.navbarCol}>
            <Image src={icon48} alt="icon48.png" priority />
            <Link className={styles.appName} href="/">en-notes</Link>
          </div>
        </Col>

        <Col span={6} className={styles.navbarCol}>
          <ThemeBtn />
        </Col>

        <Col offset={6} className={styles.navbarCol}>
          <ExternalLink href="https://github.com/Hans774882968/en-notes">
            GitHub<GitHubOutlined className={styles.linkIcon} />
          </ExternalLink>
          <ExternalLink href="https://juejin.cn/user/1464964842528888">
            JueJin<LinkSvg className={styles.linkIcon} />
          </ExternalLink>
          <ExternalLink href="https://www.52pojie.cn/home.php?mod=space&uid=1906177">
            52PoJie<LinkSvg className={styles.linkIcon} />
          </ExternalLink>
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
