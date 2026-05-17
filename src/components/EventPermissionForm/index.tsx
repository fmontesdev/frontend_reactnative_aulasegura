import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from 'react-native-paper';
import { FormDatePicker } from '../FormDatePicker';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormTextInput } from '../FormTextInput';
import { useRooms } from '../../hooks/queries/useRooms';
import { EventPermissionFormData, EventPermissionFormSchema } from '../../schemas/access.schema';
import { useAppTheme } from '../../theme';

interface EventPermissionFormProps {
  onSubmit: (data: EventPermissionFormData) => Promise<void>;
  isLoading?: boolean;
}

const today = new Date().toISOString();

export function EventPermissionForm({ onSubmit, isLoading = false }: EventPermissionFormProps) {
  const theme = useAppTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<EventPermissionFormData>({
    resolver: zodResolver(EventPermissionFormSchema),
    defaultValues: {
      roomId: 0,
      date: today,
      startTime: '',
      endTime: '',
      description: '',
    },
  });

  const { data: roomsResponse, isLoading: roomsLoading } = useRooms({ limit: 100 });

  const roomOptions = useMemo(() => [
    { value: 0, label: 'Selecciona aula' },
    ...(roomsResponse?.data ?? []).map((room) => ({ value: room.roomId, label: `${room.name} ${room.roomCode}` })),
  ], [roomsResponse]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGrid}>
        <View style={styles.formColumn}>
          <FormSingleSelect control={control} name="roomId" label="Aula" errors={errors} options={roomOptions} isLoading={roomsLoading} />
          <FormTextInput control={control} name="description" label="Descripción" errors={errors} multiline numberOfLines={3} />
        </View>

        <View style={styles.formColumn}>
          <FormDatePicker control={control} name="date" label="Fecha" errors={errors} />
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <FormTextInput control={control} name="startTime" label="Inicio (HH:mm)" errors={errors} />
            </View>
            <View style={styles.timeField}>
              <FormTextInput control={control} name="endTime" label="Fin (HH:mm)" errors={errors} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button icon="plus" mode="contained" onPress={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading} buttonColor={theme.colors.success}>
          Crear reserva
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 8 },
  formColumn: { flexBasis: '48%', flexGrow: 1, minWidth: 280, gap: 16 },
  timeRow: { flexDirection: 'row', gap: 12 },
  timeField: { flex: 1 },
  submitButtonContainer: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 8, paddingVertical: 16 },
});
