import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormTextInput } from '../FormTextInput';
import { WeeklyScheduleFormData, WeeklyScheduleFormSchema } from '../../schemas/access.schema';
import { useAppTheme } from '../../theme';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './WeeklyScheduleForm.styles';

const dayOptions = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

type WeeklyScheduleFormProps =
  | {
      mode: 'create';
      onSubmit: (data: WeeklyScheduleFormData) => Promise<void>;
      isLoading?: boolean;
    }
  | {
      mode: 'edit';
      initialData: WeeklyScheduleFormData;
      onSubmit: (data: Partial<WeeklyScheduleFormData>) => Promise<void>;
      isLoading?: boolean;
    };

export { dayOptions };

function formatTimeForForm(time: string) {
  return time.slice(0, 5);
}

function formatTimeForApi(time: string) {
  return time.length === 5 ? `${time}:00` : time;
}

function getApiPayload(data: Partial<WeeklyScheduleFormData>) {
  const payload: Partial<WeeklyScheduleFormData> = {};

  if (data.dayOfWeek !== undefined) payload.dayOfWeek = data.dayOfWeek;
  if (data.startTime !== undefined) payload.startTime = formatTimeForApi(data.startTime);
  if (data.endTime !== undefined) payload.endTime = formatTimeForApi(data.endTime);

  return payload;
}

export function WeeklyScheduleForm(props: WeeklyScheduleFormProps) {
  const theme = useAppTheme();
  const defaultValues = props.mode === 'edit'
    ? {
      dayOfWeek: props.initialData.dayOfWeek,
      startTime: formatTimeForForm(props.initialData.startTime),
      endTime: formatTimeForForm(props.initialData.endTime),
    }
    : { dayOfWeek: 1, startTime: '', endTime: '' };

  const { control, handleSubmit, formState: { errors } } = useForm<WeeklyScheduleFormData>({
    resolver: zodResolver(WeeklyScheduleFormSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: WeeklyScheduleFormData) => {
    if (props.mode === 'edit') {
      const initialData = {
        dayOfWeek: props.initialData.dayOfWeek,
        startTime: formatTimeForForm(props.initialData.startTime),
        endTime: formatTimeForForm(props.initialData.endTime),
      };
      const changedFields = getChangedFields(
        data as unknown as Record<string, unknown>,
        initialData as unknown as Record<string, unknown>,
      );
      await props.onSubmit(getApiPayload(changedFields as Partial<WeeklyScheduleFormData>));
    } else {
      await props.onSubmit(getApiPayload({
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      }) as WeeklyScheduleFormData);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formColumn}>
        <View>
          <FormSingleSelect control={control} name="dayOfWeek" label="Día" errors={errors} options={dayOptions} />
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <FormTextInput control={control} name="startTime" label="Hora inicio (HH:mm)" errors={errors} />
          </View>
          <View style={styles.timeField}>
            <FormTextInput control={control} name="endTime" label="Hora fin (HH:mm)" errors={errors} />
          </View>
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon={props.mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={props.isLoading}
          disabled={props.isLoading}
          buttonColor={props.mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {props.mode === 'create' ? 'Crear horario' : 'Actualizar horario'}
        </Button>
      </View>
    </ScrollView>
  );
}
