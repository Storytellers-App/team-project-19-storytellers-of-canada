import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Routes from './Routes';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as languages from './Localization';
import {LocalizationContext} from './LocalizationContext';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      primary: string;
      accent: string;
    }

    interface Theme {
      roundness: number;
    }
  }
}

const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',

  }
};
i18n.fallbacks = true;
i18n.translations = languages;

export default function App() {
  const [locale, setLocale] = React.useState(Localization.locale);
  const localizationContext = React.useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      /*@ts-ignore*/
      <PaperProvider theme={theme}>
         <LocalizationContext.Provider value={localizationContext}>
        <SafeAreaProvider>
          <Routes />
          <StatusBar style='dark' />
        </SafeAreaProvider>
        </LocalizationContext.Provider>
      </PaperProvider>
    );
  }
}
