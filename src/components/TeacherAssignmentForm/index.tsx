import React, { useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSingleSelect } from '../FormSingleSelect';
import { useAppTheme } from '../../theme';
import { TeacherAssignmentFormData, TeacherAssignmentFormSchema } from '../../schemas/teacherAssignment.schema';
import { useUsers } from '../../hooks/queries/useUsers';
import { useSubjects } from '../../hooks/queries/useSubjects';
import { RoleName, User } from '../../types/User';
import { Course } from '../../types/Course';
import { Subject } from '../../types/Subject';
import { StyledChip } from '../StyledChip';
import { styles } from './TeacherAssignmentForm.styles';

interface TeacherAssignmentFormProps {
  onSubmit: (data: TeacherAssignmentFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TeacherAssignmentForm({ onSubmit, isLoading = false }: TeacherAssignmentFormProps) {
  const theme = useAppTheme();
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100, filters: ['rol:teacher'] });
  const { data: subjectsResponse, isLoading: subjectsLoading } = useSubjects({ limit: 100 });

  const { control, handleSubmit, watch, resetField, formState: { errors } } = useForm<TeacherAssignmentFormData>({
    resolver: zodResolver(TeacherAssignmentFormSchema),
    defaultValues: {
      teacherId: '',
      courseId: undefined,
      subjectId: undefined,
    },
  });

  const selectedTeacherId = watch('teacherId');
  const selectedCourseId = watch('courseId');

  const teachers = useMemo(
    () => (usersResponse?.data || []).filter((user: User) => user.roles.includes(RoleName.TEACHER)),
    [usersResponse?.data]
  );
  const subjects = useMemo(() => subjectsResponse?.data || [], [subjectsResponse?.data]);
  const selectedTeacher = useMemo(
    () => teachers.find((teacher) => teacher.userId === selectedTeacherId),
    [selectedTeacherId, teachers]
  );
  const selectedDepartmentId = selectedTeacher?.department?.departmentId;

  const departmentSubjects = useMemo(
    () => subjects.filter((subject: Subject) => subject.department.departmentId === selectedDepartmentId),
    [selectedDepartmentId, subjects]
  );

  const courses = useMemo(() => {
    const courseMap = new Map<number, Course>();

    departmentSubjects.forEach((subject) => {
      subject.courses.forEach((course) => {
        courseMap.set(course.courseId, course);
      });
    });

    return Array.from(courseMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [departmentSubjects]);

  const filteredSubjects = useMemo(
    () => departmentSubjects.filter((subject) =>
      subject.courses.some((course) => course.courseId === selectedCourseId)
    ),
    [departmentSubjects, selectedCourseId]
  );

  useEffect(() => {
    resetField('courseId');
    resetField('subjectId');
  }, [selectedTeacherId, resetField]);

  useEffect(() => {
    resetField('subjectId');
  }, [selectedCourseId, resetField]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGrid}>
        <View style={styles.teacherRow}>
          <View style={styles.teacherSelectColumn}>
            <FormSingleSelect
              control={control}
              name="teacherId"
              label="Profesor"
              errors={errors}
              options={teachers.map((teacher: User) => ({
                label: `${teacher.name} ${teacher.lastname} (${teacher.email})`,
                value: teacher.userId,
              }))}
              isLoading={usersLoading}
              loadingText="Cargando profesores..."
              emptyText="No hay profesores disponibles"
            />
          </View>

          <View style={styles.teacherDepartmentColumn}>
            {selectedTeacher?.department ? (
              <View style={styles.chipWrapper}>
                <StyledChip color={theme.colors.grey}>
                  {selectedTeacher.department.name}
                </StyledChip>
              </View>
            ) : (
              <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
                -
              </Text>
            )}
          </View>
        </View>

        <View style={styles.formGridItem}>
          <FormSingleSelect
            control={control}
            name="courseId"
            label="Curso"
            errors={errors}
            options={courses.map((course: Course) => ({
              label: `${course.name} (${course.courseCode})`,
              value: course.courseId,
            }))}
            isLoading={subjectsLoading}
            loadingText="Cargando cursos del departamento..."
            emptyText={selectedDepartmentId ? 'No hay cursos asociados al departamento' : 'Selecciona un profesor con departamento'}
            disabled={!selectedDepartmentId}
          />
        </View>

        <View style={styles.formGridItem}>
          <FormSingleSelect
            control={control}
            name="subjectId"
            label="Asignatura"
            errors={errors}
            options={filteredSubjects.map((subject: Subject) => ({
              label: `${subject.name} (${subject.subjectCode})`,
              value: subject.subjectId,
            }))}
            isLoading={subjectsLoading}
            loadingText="Cargando asignaturas..."
            emptyText={selectedCourseId ? 'No hay asignaturas disponibles para este curso' : 'Selecciona un curso'}
            disabled={!selectedCourseId}
          />
        </View>
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          icon="plus"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={theme.colors.success}
        >
          Crear Asignación
        </Button>
      </View>
    </ScrollView>
  );
}
