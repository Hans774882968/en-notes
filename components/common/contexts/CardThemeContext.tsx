import { MdEditorThemeName, useThemeContext } from './ThemeContext';
import {
  ReactNode,
  createContext,
  useContext
} from 'react';
import useLocalStorageState from 'use-local-storage-state';

// reference https://github.com/nicejade/markdown2png/blob/master/src/views/Home.vue
// TODO: 纸屑样式的纸屑 svg 没有出现在导出图像里，奇怪的是商务样式又正常。原作者也没解决，不得不感慨 html2canvas 真的乐色。只好先搁置了

export enum DarkThemeClassNames {
  DARK = 'dark' // 暗黑
}

export enum LightThemeClassNames {
  NOTE = 'note', // 便签
  ANTIQUITY = 'antiquity', // 古风
  BBBURST = 'bbburst', // 纸屑
  CLASSIC = 'classic', // 经典
  VITALITY = 'vitality', // 元气
  GRADIENT = 'gradient', // 渐变
  OFFICIAL = 'official', // 商务
  YELLOW = 'yellow' // 芒黄
}

export type CardThemeClassNames = DarkThemeClassNames | LightThemeClassNames

interface CardThemeOption {
  label: string
  value: CardThemeClassNames
}

export const CARD_THEME_LISTS: Record<MdEditorThemeName, Array<CardThemeOption>> = {
  dark: [
    { label: 'Dark', value: DarkThemeClassNames.DARK }
  ],
  light: [
    { label: 'Note', value: LightThemeClassNames.NOTE },
    { label: 'Antiquity', value: LightThemeClassNames.ANTIQUITY },
    { label: 'BBBurst', value: LightThemeClassNames.BBBURST },
    { label: 'Classic', value: LightThemeClassNames.CLASSIC },
    { label: 'Vitality', value: LightThemeClassNames.VITALITY },
    { label: 'Gradient', value: LightThemeClassNames.GRADIENT },
    { label: 'Official', value: LightThemeClassNames.OFFICIAL },
    { label: 'Yellow', value: LightThemeClassNames.YELLOW }
  ]
};

type ContextType = {
  cardTheme: CardThemeClassNames
  cardThemeSearchResultOptions: CardThemeOption[]
  handleCardThemeChange: (newCardTheme: CardThemeClassNames) => void
} | null;

type CardThemeLSData = Record<MdEditorThemeName, CardThemeClassNames>;

const CardThemeContext = createContext<ContextType>(null);

interface Props {
  children?: ReactNode
}

export function CardThemeProvider({ children }: Props) {
  const { mdEditorThemeName } = useThemeContext();

  const cardThemeSearchResultOptions = CARD_THEME_LISTS[mdEditorThemeName];
  const getInitialCardThemeData = () => ({
    dark: CARD_THEME_LISTS.dark[0].value,
    light: CARD_THEME_LISTS.light[0].value
  });
  const [cardThemeData, setCardThemeData] = useLocalStorageState<CardThemeLSData>('cardThemeData', {
    defaultValue: getInitialCardThemeData
  });
  const cardTheme = cardThemeData[mdEditorThemeName];

  const handleCardThemeChange = (newCardTheme: CardThemeClassNames) => {
    setCardThemeData((oldCardThemeData) => ({ ...oldCardThemeData, [mdEditorThemeName]: newCardTheme }));
  };

  return (
    <CardThemeContext.Provider
      value={{
        cardTheme,
        cardThemeSearchResultOptions,
        handleCardThemeChange
      }}
    >
      {children}
    </CardThemeContext.Provider>
  );
}

export const useCardThemeContext = () => {
  const ctx = useContext(CardThemeContext);
  if (ctx === null) {
    throw new Error('useCardThemeContext should be used in CardThemeProvider');
  }
  return ctx;
};
