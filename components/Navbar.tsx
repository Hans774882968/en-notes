import { useThemeContext } from './ThemeContext';
import Col from 'antd/lib/col';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Row from 'antd/lib/row';
import Switch from 'antd/lib/switch';
import icon48 from '@/assets/icon48.png';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const { preferDarkTheme, preferDarkThemeSetter, mdEditorThemeName } = useThemeContext()!;

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mdEditorThemeName);
  }, [mdEditorThemeName]);

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
          <Switch
            value={preferDarkTheme}
            checkedChildren="dark"
            unCheckedChildren="light"
            defaultChecked={preferDarkTheme}
            onChange={preferDarkThemeSetter}
          />
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
