import Tabs from '../../../components/Tabs';

export default function SupervisionLayout() {
  return (
    <Tabs
      initialRouteName="events"
      tabs={[
        { name: 'events', title: 'Eventos de Accesos', icon: 'access-point', route: '/supervision/events' },
        { name: 'logs', title: 'Historial de Accesos', icon: 'file-document-multiple', route: '/supervision/logs' },
        { name: 'analytics', title: 'Analíticas', icon: 'chart-box', route: '/supervision/analytics' },
      ]}
    />
  );
}
