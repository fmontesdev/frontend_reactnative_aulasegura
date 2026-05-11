import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { FormSingleSelect } from '../FormSingleSelect';
import { useAppTheme } from '../../theme';
import { ReaderFormData, ReaderFormSchema } from '../../schemas/reader.schema';
import { CreateReaderData, Reader, UpdateReaderData } from '../../types/Reader';
import { Room } from '../../types/Room';
import { useRooms } from '../../hooks/queries/useRooms';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './ReaderForm.styles';

interface ReaderFormProps {
  mode: 'create' | 'edit';
  initialData?: Reader;
  onSubmit: (data: CreateReaderData | UpdateReaderData) => Promise<Reader | void>;
  isLoading?: boolean;
}

export function ReaderForm({ mode, initialData, onSubmit, isLoading = false }: ReaderFormProps) {
  const theme = useAppTheme();
  const { data: roomsResponse, isLoading: roomsLoading } = useRooms({ limit: 100 });
  const rooms = roomsResponse?.data || [];

  const { control, handleSubmit, formState: { errors } } = useForm<ReaderFormData>({
    resolver: zodResolver(ReaderFormSchema),
    defaultValues: mode === 'edit' && initialData
      ? {
          readerCode: initialData.readerCode,
          roomId: initialData.roomId ?? undefined as unknown as number,
        }
      : {
          readerCode: '',
          roomId: undefined as unknown as number,
        },
  });

  const handleFormSubmit = async (data: ReaderFormData) => {
    if (mode === 'edit' && initialData) {
      const normalizedInitial: Record<string, unknown> = {
        readerCode: initialData.readerCode,
        roomId: initialData.roomId,
      };
      const changedFields = getChangedFields(data as unknown as Record<string, unknown>, normalizedInitial);
      await onSubmit(changedFields as UpdateReaderData);
    } else {
      await onSubmit(data as CreateReaderData);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGrid}>
        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="readerCode" label="Código único" errors={errors} />
        </View>

        <View style={styles.formGridItem}>
          <FormSingleSelect
            control={control}
            name="roomId"
            label="Aula"
            errors={errors}
            options={rooms.map((room: Room) => ({
              label: `${room.name} ${room.roomCode}`,
              value: room.roomId,
            }))}
            isLoading={roomsLoading}
            loadingText="Cargando aulas..."
            emptyText="No hay aulas disponibles"
          />
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon={mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {mode === 'create' ? 'Crear Lector' : 'Actualizar Lector'}
        </Button>
      </View>
    </ScrollView>
  );
}
