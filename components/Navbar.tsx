import { useThemeContext } from './ThemeContext';
import Col from 'antd/lib/col';
import Image from 'next/image';
import React from 'react';
import Row from 'antd/lib/row';
import Switch from 'antd/lib/switch';
import icon48 from '@/assets/icon48.png';
import styles from './Navbar.module.sass';

const Navbar: React.FC = () => {
  const { curClassNamePrefix, preferDarkTheme, setPreferDarkTheme } = useThemeContext()!;

  return (
    <header>
      <Row className={styles[`${curClassNamePrefix}-navbar`]}>
        <Col span={6}>
          {/* 多套一层div，修复 flex-gap-polyfill 导致同一行右侧的元素产生偏移的bug */}
          <div className={styles.navbarCol}>
            <Image src={icon48} alt="icon48.png" />
            <span className={styles[`${curClassNamePrefix}-plugin-name`]}>en-notes</span>
          </div>
        </Col>

        <Col className={styles.navbarCol}>
          <Switch
            value={preferDarkTheme}
            checkedChildren="暗黑"
            unCheckedChildren="默认"
            defaultChecked={preferDarkTheme}
            onChange={setPreferDarkTheme}
          />
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
