import Tabs from '../../../components/Tabs';

export default function SpacesLayout() {
  return (
    <Tabs
      tabs={[
        { name: 'classrooms', title: 'Aulas', icon: 'door', route: '/spaces/classrooms' },
        { name: 'readers', title: 'Lectores', icon: 'card-search', route: '/spaces/readers' },
      ]}
    />
  );
}
