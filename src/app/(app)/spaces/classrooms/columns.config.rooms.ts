import { ColumnConfig } from '../../../../components/DataTable';
import { Room } from '../../../../types/Room';

export const getRoomsColumns = (): ColumnConfig<Room>[] => [
  { key: 'name', label: 'Nombre', flex: 1.4, sortKey: 'name' },
  { key: 'courseName', label: 'Curso', flex: 1.2, sortKey: (room) => room.courseName || '' },
  { key: 'building', label: 'Edificio', flex: 0.55, sortKey: 'building' },
  { key: 'floor', label: 'Planta', flex: 0.55, sortKey: 'floor' },
  { key: 'capacity', label: 'Capacidad', flex: 0.55, sortKey: 'capacity' },
  { key: 'readers', label: 'Lectores', flex: 0.7, sortKey: (room) => room.readers?.length || 0 },
  { key: 'actions', label: 'Acciones', flex: 0.45, sortable: false },
];
