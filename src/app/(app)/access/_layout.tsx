import { useMemo } from 'react';
import Tabs from '../../../components/Tabs';
import { usePermissions } from '../../../hooks/queries/usePermissions';

export default function AccessLayout() {
  const { data } = usePermissions();

  const pendingValidationsCount = useMemo(() => (
    (data ?? []).filter((permission) => permission.schedule.type === 'event' && permission.schedule.eventSchedule?.status === 'pending').length
  ), [data]);

  return (
    <Tabs
      initialRouteName="schedules"
      tabs={[
        { name: 'schedules', title: 'Horarios', icon: 'calendar-clock', route: '/access/schedules' },
        { name: 'permissions', title: 'Permisos semanales', icon: 'key', route: '/access/permissions' },
        { name: 'reservations', title: 'Reservas / pases', icon: 'calendar-check', route: '/access/reservations' },
        { name: 'validations', title: 'Validaciones', icon: 'check-decagram', route: '/access/validations', badge: pendingValidationsCount },
      ]}
    />
  );
}
