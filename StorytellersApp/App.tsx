import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Routes from './Routes';
import { UserContext } from './UserContext';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { UserType } from './types';
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
  const [user, setUser] = useState<UserType | undefined>(undefined);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      /*@ts-ignore*/
      <PaperProvider theme={theme}>
        <UserContext.Provider value= {{
            user: user,
            setUser: (user: UserType) => setUser(user)
        }}>
        <SafeAreaProvider>
          <Routes />
          <StatusBar style='dark' />
        </SafeAreaProvider>
        </UserContext.Provider>
      </PaperProvider>
    );
  }
}
