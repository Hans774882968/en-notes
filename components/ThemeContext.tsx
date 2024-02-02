import ConfigProvider from 'antd/lib/config-provider';
import React, { ReactNode, createContext, useContext } from 'react';
import theme from 'antd/lib/theme';
import useLocalStorageState from 'use-local-storage-state';

type ContextType = {
  preferDarkTheme: boolean,
  preferDarkThemeSetter(preferDarkTheme: boolean): void,
  mdEditorThemeName: MdEditorThemeName,
} | null;

const ThemeContext = createContext<ContextType>(null);

enum MdEditorThemeName {
  DARK = 'dark',
  DEFAULT = 'light'
}

interface Props {
  children?: ReactNode
}

export const ThemeProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [preferDarkTheme, setPreferDarkTheme] = useLocalStorageState('preferDarkTheme', {
    defaultValue: true
  });
  const antdCurrentTheme = {
    algorithm: preferDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
  };
  const mdEditorThemeName = preferDarkTheme ? MdEditorThemeName.DARK : MdEditorThemeName.DEFAULT;

  const preferDarkThemeSetter = (newPreferDarkTheme: boolean) => {
    setPreferDarkTheme(newPreferDarkTheme);
    document.documentElement.setAttribute('data-color-mode', newPreferDarkTheme ? MdEditorThemeName.DARK : MdEditorThemeName.DEFAULT);
  };

  return (
    <ConfigProvider theme={antdCurrentTheme}>
      <ThemeContext.Provider
        value={{
          mdEditorThemeName,
          preferDarkTheme,
          preferDarkThemeSetter
        }}
      >
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
