import { ColumnConfig } from '../../../../components/DataTable';
import { AccessLog } from '../../../../types/AccessLog';

export const getAccessLogsColumns = (): ColumnConfig<AccessLog>[] => [
  {
    key: 'user',
    label: 'Usuario',
    flex: 1.4,
    sortKey: (accessLog) => `${accessLog.user.name} ${accessLog.user.lastname}`,
  },
  {
    key: 'type',
    label: 'Tipo',
    flex: 0.7,
    sortKey: 'accessMethod',
  },
  {
    key: 'room',
    label: 'Aula',
    flex: 1.4,
    sortKey: (accessLog) => accessLog.room.name,
  },
  {
    key: 'reader',
    label: 'Lector',
    flex: 0.6,
    sortKey: 'readerId',
  },
  {
    key: 'date',
    label: 'Fecha',
    flex: 0.9,
    sortKey: 'createdAt',
  },
  {
    key: 'status',
    label: 'Estado',
    flex: 0.8,
    sortKey: 'accessStatus',
  },
];
