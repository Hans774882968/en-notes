import Col from 'antd/lib/col';
import EnglishSvg from './EnglishSvg';
import GitHubOutlined from '@ant-design/icons/GithubOutlined';
import Link from 'next/link';
import LinkSvg from './LinkSvg';
import LoginInfo from './loginInfo/LoginInfo';
import React, { ReactNode } from 'react';
import Row from 'antd/lib/row';
import ThemeBtn from './ThemeBtn';
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
            <Link className={styles.appName} href="/">
              <EnglishSvg width={48} height={48} />
              <span>en-notes</span>
            </Link>
          </div>
        </Col>

        <Col span={6} className={styles.navbarCol}>
          <ThemeBtn />
          <LoginInfo />
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
