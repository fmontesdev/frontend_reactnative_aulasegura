import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StyledCard } from '../StyledCard';
import { StyledChip } from '../StyledChip';
import { useAppTheme } from '../../theme';
import { TeacherCourseSummary } from '../../types/User';
import { styles } from './UserForm.styles';

interface TeacherAcademicSummaryProps {
  userId: string;
  courses: TeacherCourseSummary[];
}

export function TeacherAcademicSummary({ userId, courses }: TeacherAcademicSummaryProps) {
  const router = useRouter();
  const theme = useAppTheme();

  const handleManageAssignments = () => {
    router.push(`/academic/assignments?filters=teacherId:${userId}`);
  };

  return (
    <StyledCard style={styles.academicSummaryCard}>
      <StyledCard.Content>
        <View style={styles.academicSummaryHeader}>
          <View style={styles.academicSummaryTitleGroup}>
            <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
              Resumen académico
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.grey }}>
              Asignaciones docentes activas del profesor
            </Text>
          </View>
          <Button
            mode="outlined"
            icon="book-cog"
            textColor={theme.colors.tertiary}
            onPress={handleManageAssignments}
          >
            Gestionar asignaciones
          </Button>
        </View>

        {courses.length === 0 ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.grey }}>
            Este profesor no tiene asignaciones activas.
          </Text>
        ) : (
          <View style={styles.academicCoursesContainer}>
            {courses.map((course) => (
              <View key={course.courseId} style={styles.academicCourseBlock}>
                <View style={styles.academicCourseHeader}>
                  <StyledChip color={theme.colors.warning}>{course.courseCode}</StyledChip>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {course.name}
                  </Text>
                </View>
                <View style={styles.academicSubjectsContainer}>
                  {course.subjects.map((subject) => (
                    <StyledChip key={subject.subjectId} color={theme.colors.tertiary}>
                      {`${subject.subjectCode} · ${subject.name}`}
                    </StyledChip>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </StyledCard.Content>
    </StyledCard>
  );
}
