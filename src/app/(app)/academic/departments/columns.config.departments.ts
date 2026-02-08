/**
 * Configuración de columnas para la tabla de departamentos
 */

import { ColumnConfig } from '../../../../components/DataTable';
import { Department } from '../../../../types/Department';

export const getDepartmentsColumns = (): ColumnConfig<Department>[] => [
  {
    key: 'name',
    label: 'Nombre',
    flex: 0.9,
    sortKey: 'name',
  },
  {
    key: 'subjects',
    label: 'Asignaturas',
    flex: 2,
    sortable: false,
  },
  {
    key: 'teachers',
    label: 'Profesores',
    flex: 2,
    sortable: false,
  },
  {
    key: 'isActive',
    label: 'Estado',
    flex: 0.6,
    sortKey: (department) => department.isActive ? 1 : 0,
  },
  {
    key: 'actions',
    label: 'Acciones',
    flex: 0.4,
    sortable: false,
  },
];
