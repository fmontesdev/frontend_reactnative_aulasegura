/**
 * Configuración de columnas para la tabla de cursos
 */

import { ColumnConfig } from '../../../../components/DataTable';
import { Course } from '../../../../types/Course';

export const getCoursesColumns = (): ColumnConfig<Course>[] => [
  {
    key: 'courseCode',
    label: 'Código',
    flex: 0.8,
    sortKey: 'courseCode',
  },
  {
    key: 'name',
    label: 'Nombre',
    flex: 1.8,
    sortKey: 'name',
  },
  {
    key: 'educationStage',
    label: 'Etapa',
    flex: 0.7,
    sortKey: 'educationStage',
  },
  {
    key: 'levelNumber',
    label: 'Nivel',
    flex: 0.5,
    sortKey: 'levelNumber',
  },
  {
    key: 'cfLevel',
    label: 'Nivel CF',
    flex: 0.7,
    sortKey: (course) => course.cfLevel || '',
  },
  {
    key: 'isActive',
    label: 'Estado',
    flex: 0.7,
    sortKey: (course) => course.isActive ? 1 : 0,
  },
  {
    key: 'actions',
    label: 'Acciones',
    flex: 0.4,
    sortable: false,
  },
];
