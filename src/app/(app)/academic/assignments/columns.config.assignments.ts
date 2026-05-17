import { ColumnConfig } from '../../../../components/DataTable';
import { TeacherAssignment } from '../../../../types/TeacherAssignment';

export const getTeacherAssignmentsColumns = (): ColumnConfig<TeacherAssignment>[] => [
  {
    key: 'teacher',
    label: 'Profesor',
    flex: 1.4,
    sortKey: (assignment) => `${assignment.teacher.lastname} ${assignment.teacher.name}`,
  },
  {
    key: 'course',
    label: 'Curso',
    flex: 0.9,
    sortKey: (assignment) => assignment.course.courseCode,
  },
  {
    key: 'subject',
    label: 'Asignatura',
    flex: 1.2,
    sortKey: (assignment) => assignment.subject.name,
  },
  {
    key: 'department',
    label: 'Departamento',
    flex: 0.9,
    sortKey: (assignment) => assignment.teacher.department?.name || '',
  },
  {
    key: 'isActive',
    label: 'Estado',
    flex: 0.6,
    sortKey: (assignment) => assignment.isActive ? 1 : 0,
  },
  {
    key: 'actions',
    label: 'Acciones',
    flex: 0.35,
    sortable: false,
  },
];
