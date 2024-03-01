import { useEffect } from 'react';
import { useThemeContext } from '../common/contexts/ThemeContext';
import Moon from './Moon';
import Sun from './Sun';
import styles from './ThemeBtn.module.scss';

export default function ThemeBtn() {
  const { mdEditorThemeName, preferDarkTheme, preferDarkThemeSetter } = useThemeContext();

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mdEditorThemeName);
  }, [mdEditorThemeName]);

  const title = `Switch between dark and light mode (currently ${mdEditorThemeName} mode)`;

  const onClick = () => preferDarkThemeSetter(!preferDarkTheme);

  return (
    <div
      className={styles.container}
      title={title}
      onClick={onClick}
    >
      {preferDarkTheme ? <Moon /> : <Sun />}
    </div>
  );
}
