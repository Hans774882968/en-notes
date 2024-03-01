import Col from 'antd/lib/col';
import Image from 'next/image';
import Link from 'next/link';
import LinkSvg from './LinkSvg';
import React from 'react';
import Row from 'antd/lib/row';
import ThemeBtn from './ThemeBtn';
import icon48 from '@/assets/icon48.png';
import styles from './Navbar.module.scss';

interface ExternalLinkProps {
  href: string
  text: string
}

function ExternalLink({ href, text }: ExternalLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {text}<LinkSvg className={styles.linkSvg} />
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
          <ExternalLink href="https://github.com/Hans774882968/en-notes" text="GitHub" />
          <ExternalLink href="https://juejin.cn/user/1464964842528888" text="JueJin" />
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
