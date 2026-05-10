import React, { useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import { Text, Button, IconButton, HelperText } from 'react-native-paper';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { StyledCard } from '../StyledCard';
import { AvatarCarousel } from './components/AvatarCarousel';
import { useAppTheme } from '../../theme';
import { ImageFileSchema, VALID_IMAGE_TYPES } from '../../schemas/fileUpload.schema';
import { API_CONFIG } from '../../constants';
import { AVATARS } from '../../data/avatars';
import { useUploadAvatar } from '../../hooks/queries/useUsers';
import { styles } from './AvatarPicker.styles';

interface AvatarPickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  mode: 'create' | 'edit';
  initialAvatar?: string;
  disabled?: boolean;
  errors: FieldErrors<T>;
  onUploadError?: (message: string) => void;
}

export interface AvatarPickerRef {
  uploadAvatar: (userId: string) => Promise<string | null>;
  selectedFile: File | null;
}

function AvatarPickerComponent<T extends FieldValues>(
  {
    control,
    name,
    mode,
    initialAvatar,
    disabled = false,
    errors,
    onUploadError,
  }: AvatarPickerProps<T>,
  ref: React.Ref<AvatarPickerRef>
) {
  const theme = useAppTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();

  const isSubmitting = disabled || uploadAvatarMutation.isPending;

  // Organizar avatares por categorías
  const avatarCategories = useMemo(() => {
    const predefined = [...AVATARS];
    const custom: string[] = [];

    // Avatar personalizado del usuario (modo edit)
    if (mode === 'edit' && initialAvatar && !AVATARS.includes(initialAvatar)) {
      custom.push(initialAvatar);
    }

    // Preview del nuevo avatar
    if (previewUrl) {
      custom.unshift('__preview__');
    }

    return { predefined, custom };
  }, [mode, initialAvatar, previewUrl]);

  // Limpiar el preview actual
  const clearCustomAvatar = (onChange: (value: any) => void) => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    // Volver al avatar anterior o predeterminado
    if (mode === 'edit' && initialAvatar) {
      onChange(initialAvatar);
    } else {
      onChange('avatar.png');
    }
  };

  // Manejar la selección y subida de archivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar archivo con Zod schema
    const validation = ImageFileSchema.safeParse(file);
    if (!validation.success) {
      onUploadError?.(validation.error.errors[0].message);
      return;
    }

    // Guardar archivo y crear preview (tanto para CREATE como para EDIT)
    setSelectedFile(file);

    // Crear URL de preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Seleccionar automáticamente el preview
    onChange('__preview__');

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Subir avatar y retornar el nombre del archivo subido
  const uploadAvatar = async (targetUserId: string): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      const response = await uploadAvatarMutation.mutateAsync({ userId: targetUserId, file: selectedFile });
      return response.avatar;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      onUploadError?.('Error al subir el avatar');
      return null;
    }
  };

  // Exponer funciones para ser accedidas desde el padre
  useImperativeHandle(ref, () => ({
    uploadAvatar,
    selectedFile,
  }));

  const error = errors[name];

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={[styles.avatarHeader, { color: theme.colors.onSurface }]}>
        Avatar
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const isPreview = value === '__preview__';

          return (
            <View>
              {/* Secciones de avatares */}
              <StyledCard style={styles.avatarsCard}>
                <StyledCard.Content>
                  <View style={styles.avatarSectionsColumn}>
                    {/* Avatares personalizados */}
                    <View style={styles.customAvatarSection}>
                      <View style={styles.customHeader}>
                        <Text variant="labelMedium" style={{ color: theme.colors.grey }}>
                          Personalizado
                        </Text>
                        {/* Botón de subir */}
                        <View style={styles.customControls}>
                          {Platform.OS === 'web' && (
                            <>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept={VALID_IMAGE_TYPES.join(',')}
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(e, onChange)}
                              />
                              <Button
                                icon="upload"
                                mode="contained"
                                onPress={() => fileInputRef.current?.click()}
                                disabled={isSubmitting}
                                compact
                                style={styles.uploadButton}
                                buttonColor={theme.colors.tertiary}
                                textColor={theme.colors.onTertiary}
                                contentStyle={styles.uploadButtonContent}
                                labelStyle={styles.uploadButtonLabel}
                              >
                                Subir
                              </Button>
                            </>
                          )}
                          {isPreview && (
                            <IconButton
                              icon="close"
                              size={20}
                              iconColor={theme.colors.error}
                              onPress={() => clearCustomAvatar(onChange)}
                              disabled={isSubmitting}
                              style={styles.closeButton}
                            />
                          )}
                        </View>
                      </View>
                      {avatarCategories.custom.length > 0 && (
                        <View style={styles.customAvatarGrid}>
                          {avatarCategories.custom.map((avatar) => {
                            const isPreviewItem = avatar === '__preview__';
                            const imageSource = isPreviewItem && previewUrl
                              ? { uri: previewUrl }
                              : { uri: `${API_CONFIG.IMAGE_SERVER_URL}/${avatar}` };
                            const isSelected = value === avatar;

                            return (
                              <TouchableOpacity
                                key={avatar}
                                style={[
                                  styles.avatarOption,
                                  isSelected && [styles.avatarSelected, { borderColor: theme.colors.tertiary }],
                                ]}
                                onPress={() => onChange(avatar)}
                                activeOpacity={0.7}
                              >
                                <Image source={imageSource} style={styles.avatarImage} />
                                {isSelected && (
                                  <View style={[styles.checkmark, { backgroundColor: theme.colors.tertiary }]}>
                                    <Text style={[styles.checkmarkText, { color: theme.colors.onTertiary }]}>
                                      ✓
                                    </Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                    {/* Divider */}
                    <View style={[styles.dividerHorizontal, { backgroundColor: theme.colors.outlineVariant }]} />

                    {/* Avatares predefinidos con carrusel */}
                    <View style={styles.defaultAvatarSection}>
                      <AvatarCarousel
                        avatars={avatarCategories.predefined}
                        selectedAvatar={value as string}
                        onSelectAvatar={onChange}
                        imageBaseUrl={API_CONFIG.IMAGE_SERVER_URL}
                        disabled={isSubmitting}
                      />
                    </View>
                  </View>
                </StyledCard.Content>
              </StyledCard>
            </View>
          );
        }}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error.message as string}
        </HelperText>
      )}
    </View>
  );
}

export const AvatarPicker = forwardRef(AvatarPickerComponent) as <T extends FieldValues>(
  props: AvatarPickerProps<T> & { ref?: React.Ref<AvatarPickerRef> }
) => ReturnType<typeof AvatarPickerComponent>;
