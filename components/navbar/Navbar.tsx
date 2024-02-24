import Col from 'antd/lib/col';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Row from 'antd/lib/row';
import ThemeBtn from './ThemeBtn';
import icon48 from '@/assets/icon48.png';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  return (
    <header>
      <Row className={styles.navbar}>
        <Col span={6}>
          {/* 多套一层div，修复 flex-gap-polyfill 导致同一行右侧的元素产生偏移的bug */}
          <div className={styles.navbarCol}>
            <Image src={icon48} alt="icon48.png" />
            <Link className={styles.pluginName} href="/">en-notes</Link>
          </div>
        </Col>

        <Col className={styles.navbarCol}>
          <ThemeBtn />
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
