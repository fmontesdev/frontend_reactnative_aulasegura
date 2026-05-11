import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from '../FormTextInput';
import { FormSingleSelect } from '../FormSingleSelect';
import { FormMultiSelect } from '../FormMultiSelect';
import { useAppTheme } from '../../theme';
import { RoomFormData, RoomFormSchema } from '../../schemas/room.schema';
import { Room, CreateRoomData, UpdateRoomData } from '../../types/Room';
import { Course } from '../../types/Course';
import { useCourses } from '../../hooks/queries/useCourses';
import { useReaders, useUpdateReader } from '../../hooks/queries/useReaders';
import { getChangedFields } from '../../utils/formUtils';
import { styles } from './RoomForm.styles';

interface RoomFormProps {
  mode: 'create' | 'edit';
  initialData?: Room;
  onSubmit: (data: CreateRoomData | UpdateRoomData) => Promise<Room | void>;
  isLoading?: boolean;
}

function toRoomPayload(data: Partial<RoomFormData>, includeEmptyCourseAsNull: boolean): CreateRoomData | UpdateRoomData {
  const payload: UpdateRoomData = {};

  if (data.roomCode !== undefined) payload.roomCode = data.roomCode;
  if (data.name !== undefined) payload.name = data.name;
  if (data.capacity !== undefined) payload.capacity = Number(data.capacity);
  if (data.building !== undefined) payload.building = Number(data.building);
  if (data.floor !== undefined) payload.floor = Number(data.floor);
  if (data.courseId !== undefined) {
    if (data.courseId === 0) {
      if (includeEmptyCourseAsNull) payload.courseId = null;
    } else {
      payload.courseId = data.courseId;
    }
  }

  return payload;
}

export function RoomForm({ mode, initialData, onSubmit, isLoading = false }: RoomFormProps) {
  const theme = useAppTheme();
  const { data: coursesResponse, isLoading: coursesLoading } = useCourses({ limit: 100 });
  const { data: readersResponse, isLoading: readersLoading } = useReaders({ limit: 100, filters: ['active:true'] });
  const updateReader = useUpdateReader();
  const courses = coursesResponse?.data || [];
  const readers = readersResponse?.data || [];

  const { control, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: mode === 'edit' && initialData
      ? {
          roomCode: initialData.roomCode,
          name: initialData.name,
          courseId: initialData.courseId ?? 0,
          capacity: String(initialData.capacity),
          building: String(initialData.building),
          floor: String(initialData.floor),
          readerIds: initialData.readers?.map((reader) => reader.readerId) || [],
        }
      : {
          roomCode: '',
          name: '',
          courseId: 0,
          capacity: '',
          building: '',
          floor: '',
          readerIds: [],
        },
  });

  const assignSelectedReaders = async (roomId: number, readerIds: number[]) => {
    const currentReaderIds = initialData?.readers?.map((reader) => reader.readerId) || [];
    const readersToAssign = readerIds.filter((readerId) => !currentReaderIds.includes(readerId));

    for (const readerId of readersToAssign) {
      await updateReader.mutateAsync({ readerId, data: { roomId } });
    }
  };

  const handleFormSubmit = async (data: RoomFormData) => {
    const selectedReaderIds = data.readerIds || [];

    if (mode === 'edit' && initialData) {
      const normalizedInitial: Record<string, unknown> = {
        roomCode: initialData.roomCode,
        name: initialData.name,
        courseId: initialData.courseId ?? 0,
        capacity: String(initialData.capacity),
        building: String(initialData.building),
        floor: String(initialData.floor),
        readerIds: initialData.readers?.map((reader) => reader.readerId) || [],
      };
      const changedFields = getChangedFields(data as unknown as Record<string, unknown>, normalizedInitial) as Partial<RoomFormData>;
      await onSubmit(toRoomPayload(changedFields, true));
      await assignSelectedReaders(initialData.roomId, selectedReaderIds);
    } else {
      const createdRoom = await onSubmit(toRoomPayload(data, false) as CreateRoomData);
      if (createdRoom?.roomId) {
        await assignSelectedReaders(createdRoom.roomId, selectedReaderIds);
      }
    }
  };

  const courseOptions = [
    { label: 'Sin curso asignado', value: 0 },
    ...courses.map((course: Course) => ({
      label: `${course.name} (${course.courseCode})`,
      value: course.courseId,
    })),
  ];

  const availableReaders = readers.filter((reader) => (
    reader.roomId == null || reader.roomId === initialData?.roomId
  ));

  const readerOptions = availableReaders.map((reader) => ({
    label: reader.readerCode,
    value: reader.readerId,
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGrid}>
        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="roomCode" label="Código único" errors={errors} />
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="name" label="Nombre" errors={errors} />
        </View>

        <View style={styles.formGridItem}>
          <FormSingleSelect
            control={control}
            name="courseId"
            label="Curso"
            errors={errors}
            options={courseOptions}
            isLoading={coursesLoading}
            loadingText="Cargando cursos..."
            emptyText="No hay cursos disponibles"
          />
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="capacity" label="Capacidad" errors={errors} keyboardType="numeric" />
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="building" label="Edificio" errors={errors} keyboardType="numeric" />
        </View>

        <View style={styles.formGridItem}>
          <FormTextInput control={control} name="floor" label="Planta" errors={errors} keyboardType="numeric" />
        </View>

        <View style={styles.formGridItemLeft}>
          <FormMultiSelect
            control={control}
            name="readerIds"
            label="Lectores"
            errors={errors}
            options={readerOptions}
            isLoading={readersLoading}
            loadingText="Cargando lectores..."
            emptyText="No hay lectores activos disponibles"
          />
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon={mode === 'create' ? 'plus' : 'pencil'}
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading || updateReader.isPending}
          disabled={isLoading || updateReader.isPending}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {mode === 'create' ? 'Crear Aula' : 'Actualizar Aula'}
        </Button>
      </View>
    </ScrollView>
  );
}
