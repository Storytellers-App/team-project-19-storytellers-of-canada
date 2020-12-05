import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Routes from './Routes';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';



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

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
       /*@ts-ignore*/
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <Routes />
          <StatusBar style='dark'/>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }
}
