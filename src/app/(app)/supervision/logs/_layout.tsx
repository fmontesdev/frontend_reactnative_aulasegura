import { Stack } from 'expo-router';
import { useAppTheme } from '../../../../theme';

export default function LogsLayout() {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
