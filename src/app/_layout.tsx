import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { lightTheme } from '../theme';

// Layout raíz, configura los providers globales y la navegación
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <PaperProvider theme={lightTheme}>
        <Stack screenOptions={{headerShown: false}}/>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
