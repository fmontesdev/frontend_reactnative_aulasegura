import { Redirect } from 'expo-router';

// Pantalla inicial, redirige automáticamente al login
export default function Index() {
  return <Redirect href="/login" />;
}
