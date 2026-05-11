import { ColumnConfig } from '../../../../components/DataTable';
import { Reader } from '../../../../types/Reader';

export const getReadersColumns = (): ColumnConfig<Reader>[] => [
  { key: 'readerCode', label: 'Código', flex: 1, sortKey: 'readerCode' },
  { key: 'roomId', label: 'Aula', flex: 1.8, sortKey: (reader) => reader.roomCode || reader.roomName || '' },
  { key: 'isActive', label: 'Estado', flex: 0.8, sortKey: (reader) => reader.isActive ? 1 : 0 },
  { key: 'actions', label: 'Acciones', flex: 0.45, sortable: false },
];
