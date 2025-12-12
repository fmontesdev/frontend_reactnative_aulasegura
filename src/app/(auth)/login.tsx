import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { TextInput, Button, Text, HelperText, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme';
import { validateEmail, validatePassword } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';

// Pantalla de login, ruta: /login
export default function LoginScreen() {
  const theme = useAppTheme();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // La primera validación se hace al perder el foco. Valida en tiempo real si el campo ya fue tocado
    if (touched.email) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // La primera validación se hace al perder el foco. Valida en tiempo real si el campo ya fue tocado
    if (touched.password) {
      setPasswordError(validatePassword(text));
    }
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    setPasswordError(validatePassword(password));
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    // Valida todos los campos
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTouched({ email: true, password: true });
    
    if (emailErr || passwordErr) {
      showSnackbar('Por favor, revisa los campos del formulario');
      return;
    }

    setIsLoading(true);

    try {
      // Intenta hacer login - el AuthContext redirigirá automáticamente a /home
      await signIn(email.trim(), password);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al iniciar sesión';
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.content}>
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="displayLarge" style={{ color: theme.colors.onPrimary }}>
            AulaSegura
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Email input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                label="Introduce tu email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                mode="flat"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress" // Autocompletar email en iOS
                autoCorrect={false}
                keyboardType="email-address" // Teclado optimizado para email en móviles
                error={touched.email && !!emailError}
                left={<TextInput.Icon icon="at" color={theme.colors.onPrimary} />}
                style={[styles.inputStyle, { backgroundColor: theme.colors.quaternary }]}
                underlineStyle={{ height: 0 }} // Elimina la línea inferior
                textColor={theme.colors.onSurface}
                theme={{ colors: {
                  onSurfaceVariant: theme.colors.primary, // Color del label
                } }}
              />
            </View>
            {/* Mensaje de error para email */}
            {touched.email && emailError ? (
              <HelperText type="error" visible={true} style={styles.helperText}>
                {emailError}
              </HelperText>
            ) : null}
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                label="Introduce tu contraseña"
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                mode="flat"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password" // Autocompletar contraseña en iOS
                autoCorrect={false}
                returnKeyType="done" // Tecla "Done" en el teclado en móviles
                onSubmitEditing={handleLogin} // Maneja el login al presionar "Enter" en web o "Done" en móviles
                error={touched.password && !!passwordError}
                left={<TextInput.Icon icon="lock-outline" color={theme.colors.onPrimary} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    color={theme.colors.onPrimary}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={[styles.inputStyle, { backgroundColor: theme.colors.quaternary }]}
                underlineStyle={{ height: 0 }} // Elimina la línea inferior
                textColor={theme.colors.onSurface}
                theme={{ colors: {
                  onSurfaceVariant: theme.colors.primary, // Color del label
                } }}
              />
            </View>
            {/* Mensaje de error para contraseña */}
            {touched.password && passwordError ? (
              <HelperText type="error" visible={true} style={styles.helperText}>
                {passwordError}
              </HelperText>
            ) : null}
          </View>

          {/* Link para recuperación de contraseña */}
          <Pressable 
            onPress={() => console.log('Recuperar contraseña')}
            style={({ pressed, hovered }: any) => [
              styles.forgotPasswordContainer,
              hovered && styles.forgotPasswordHovered,
              pressed && styles.forgotPasswordPressed,
            ]}
          >
            <Text variant="bodyLarge" style={{ color: theme.colors.onPrimary }}>
              ¿Se te olvidó la contraseña?
            </Text>
          </Pressable>

          {/* Botón de inicio de sesión */}
          <Button
            mode="contained"
            onPress={handleLogin}
            // loading={isLoading}
            // disabled={isLoading}
            style={[styles.button, { backgroundColor: theme.colors.tertiary }]}
            contentStyle={styles.buttonContent}
            labelStyle={theme.fonts.titleMedium}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </View>
      </View>

      {/* Snackbar para mostrar mensajes de error */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  inputStyle: {
    height: 50,
    marginTop: -2,
  },
  helperText: {
    paddingHorizontal: 12,
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 66,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  forgotPasswordHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  forgotPasswordPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  button: {
    justifyContent: 'center',
    borderRadius: 40,
  },
  buttonContent: {
    paddingVertical: 2,
  },
  snackbar: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 40,
  },
});
