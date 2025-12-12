import { MD3LightTheme, MD3DarkTheme, useTheme } from 'react-native-paper';

// Customización de todas las variantes de fuentes MD3
const appFonts = {
  // Display - Textos muy grandes, títulos principales
  displayLarge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 62,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 45,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 44,
  },
  
  // Headline - Encabezados de sección
  headlineLarge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32,
  },
  
  // Title - Títulos de componentes
  titleLarge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.25,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  
  // Label - Botones, tabs, chips
  labelLarge: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  
  // Body - Cuerpo de texto, párrafos
  bodyLarge: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  
  // Default - Fuente por defecto cuando no se especifica variant
  default: {
    fontFamily: 'Roboto_400Regular',
    fontWeight: '400',
    letterSpacing: 0,
  },
} as const;

// Tema claro personalizado
const customLightTheme = {
  ...MD3LightTheme,
  fonts: appFonts,
  colors: {
    ...MD3LightTheme.colors,
    // Colores principales
    primary: 'rgb(24, 45, 115)',              // #182D73
    onPrimary: 'rgb(255, 255, 255)',          // #FFFFFF
    primaryContainer: 'rgb(243, 247, 251)',   // #F3F7FB
    onPrimaryContainer: 'rgb(0, 0, 0)',       // #000000
    
    // Colores secundarios
    secondary: 'rgb(48, 106, 198)',           // #306AC6
    onSecondary: 'rgb(255, 255, 255)',        // #FFFFFF
    secondaryContainer: 'rgb(171, 199, 245)', // #ABC7F5 (usando quaternary)
    onSecondaryContainer: 'rgb(0, 0, 0)',     // #000000
    
    // Colores terciarios
    tertiary: 'rgb(59, 130, 246)',            // #3B82F6
    onTertiary: 'rgb(255, 255, 255)',         // #FFFFFF
    tertiaryContainer: 'rgb(167, 243, 208)',  // #A7F3D0 (outline original)
    onTertiaryContainer: 'rgb(0, 0, 0)',      // #000000
    
    // Error
    error: 'rgb(220, 38, 38)',                // #DC2626
    onError: 'rgb(255, 255, 255)',            // #FFFFFF
    errorContainer: 'rgb(255, 234, 234)',     // #FFEAEA (lightRed)
    onErrorContainer: 'rgb(233, 104, 104)',   // #E96868 (onLightRed)
    
    // Background y Surface
    background: 'rgb(243, 247, 251)',         // #F3F7FB
    onBackground: 'rgb(0, 0, 0)',             // #000000
    surface: 'rgb(255, 255, 255)',            // #FFFFFF
    onSurface: 'rgb(0, 0, 0)',                // #000000
    surfaceVariant: 'rgb(171, 199, 245)',     // #ABC7F5 (quaternary)
    onSurfaceVariant: 'rgb(0, 0, 0)',         // #000000
    
    // Otros colores
    outline: 'rgb(167, 243, 208)',            // #A7F3D0
    outlineVariant: 'rgb(211, 211, 211)',     // #D3D3D3 (lightGrey)
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(30, 30, 30)',
    inverseOnSurface: 'rgb(255, 255, 255)',
    inversePrimary: 'rgb(171, 199, 245)',     // #ABC7F5 (quaternary)
    
    // Elevation (se mantienen por defecto de MD3)
    elevation: {
      level0: 'transparent',
      level1: 'rgb(248, 249, 252)',
      level2: 'rgb(243, 245, 250)',
      level3: 'rgb(238, 242, 248)',
      level4: 'rgb(236, 240, 247)',
      level5: 'rgb(233, 238, 245)',
    },
    
    // Disabled
    surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
    onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
    backdrop: 'rgba(24, 45, 115, 0.4)',
  },
} as const;

// Tema oscuro personalizado con colores de AulaSegura
const customDarkTheme = {
  ...MD3DarkTheme,
  fonts: appFonts,
  colors: {
    ...MD3DarkTheme.colors,
    // Colores principales
    primary: 'rgb(24, 45, 115)',              // #182D73
    onPrimary: 'rgb(255, 255, 255)',          // #FFFFFF
    primaryContainer: 'rgb(23, 23, 23)',      // #171717
    onPrimaryContainer: 'rgb(255, 255, 255)', // #FFFFFF
    
    // Colores secundarios
    secondary: 'rgb(48, 106, 198)',           // #306AC6
    onSecondary: 'rgb(38, 38, 38)',           // #262626
    secondaryContainer: 'rgb(171, 199, 245)', // #ABC7F5
    onSecondaryContainer: 'rgb(0, 0, 0)',     // #000000
    
    // Colores terciarios
    tertiary: 'rgb(59, 130, 246)',            // #3B82F6
    onTertiary: 'rgb(0, 0, 0)',               // #000000
    tertiaryContainer: 'rgb(167, 243, 208)',  // #A7F3D0
    onTertiaryContainer: 'rgb(0, 0, 0)',      // #000000
    
    // Error
    error: 'rgb(220, 38, 38)',                // #DC2626
    onError: 'rgb(255, 255, 255)',            // #FFFFFF
    errorContainer: 'rgb(166, 13, 13)',       // #A60D0D (lightRed dark)
    onErrorContainer: 'rgb(255, 255, 255)',   // #FFFFFF (onLightRed dark)
    
    // Background y Surface
    background: 'rgb(23, 23, 23)',            // #171717
    onBackground: 'rgb(255, 255, 255)',       // #FFFFFF
    surface: 'rgb(30, 30, 30)',               // #1E1E1E
    onSurface: 'rgb(255, 255, 255)',          // #FFFFFF
    surfaceVariant: 'rgb(171, 199, 245)',     // #ABC7F5
    onSurfaceVariant: 'rgb(0, 0, 0)',         // #000000
    
    // Otros colores
    outline: 'rgb(167, 243, 208)',            // #A7F3D0
    outlineVariant: 'rgb(64, 64, 64)',        // #404040 (darkGrey)
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(255, 255, 255)',
    inverseOnSurface: 'rgb(30, 30, 30)',
    inversePrimary: 'rgb(24, 45, 115)',
    
    // Elevation para tema oscuro
    elevation: {
      level0: 'transparent',
      level1: 'rgb(35, 35, 37)',
      level2: 'rgb(39, 39, 42)',
      level3: 'rgb(43, 43, 48)',
      level4: 'rgb(45, 45, 50)',
      level5: 'rgb(48, 48, 54)',
    },
    
    // Disabled
    surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
    onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
    backdrop: 'rgba(23, 23, 23, 0.4)',
  },
} as const;

// Extender el tema con propiedades personalizadas
export const appLightTheme = {
  ...customLightTheme,
  colors: {
    ...customLightTheme.colors,
    // Colores personalizados adicionales
    quaternary: 'rgb(171, 199, 245)',      // #ABC7F5
    onQuaternary: 'rgb(0, 0, 0)',          // #000000
    success: 'rgb(46, 184, 114)',          // #2EB872
    onSuccess: 'rgb(255, 255, 255)',       // #FFFFFF
    warning: 'rgb(245, 158, 11)',          // #F59E0B
    onWarning: 'rgb(255, 255, 255)',       // #FFFFFF
    darkGrey: 'rgb(64, 64, 64)',           // #404040
    grey: 'rgb(128, 128, 128)',            // #808080
    lightGrey: 'rgb(211, 211, 211)',       // #D3D3D3
    highlight: 'rgb(24, 45, 115)',         // #182D73
    titles: 'rgb(127, 172, 245)',          // #7FACF5
    card: 'rgb(255, 255, 255)',            // #FFFFFF
  },
} as const;

export const appDarkTheme = {
  ...customDarkTheme,
  colors: {
    ...customDarkTheme.colors,
    // Colores personalizados adicionales
    quaternary: 'rgb(171, 199, 245)',      // #ABC7F5
    onQuaternary: 'rgb(0, 0, 0)',          // #000000
    success: 'rgb(46, 184, 114)',          // #2EB872
    onSuccess: 'rgb(11, 11, 11)',          // #0B0B0B
    warning: 'rgb(245, 158, 11)',          // #F59E0B
    onWarning: 'rgb(11, 11, 11)',          // #0B0B0B
    darkGrey: 'rgb(64, 64, 64)',           // #404040
    grey: 'rgb(128, 128, 128)',            // #808080
    lightGrey: 'rgb(211, 211, 211)',       // #D3D3D3
    highlight: 'rgb(255, 255, 255)',       // #FFFFFF
    titles: 'rgb(83, 83, 83)',             // #535353
    card: 'rgb(30, 30, 30)',               // #1E1E1E
  },
} as const;

// Tipo para el tema extendido
export type AppTheme = typeof appLightTheme;

// Hook personalizado tipado para usar el tema en toda la app
export const useAppTheme = () => useTheme<AppTheme>();

// Exportar temas por defecto para usar en PaperProvider
export { appLightTheme as lightTheme, appDarkTheme as darkTheme };
