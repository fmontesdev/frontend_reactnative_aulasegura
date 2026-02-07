import Tabs from '../../../components/Tabs';

export default function AcademicLayout() {
  return (
    <Tabs
      initialRouteName="years"
      tabs={[
        { name: 'years', title: 'Años Académicos', icon: 'calendar-range' },
        { name: 'courses', title: 'Cursos', icon: 'book-education' },
        { name: 'subjects', title: 'Asignaturas', icon: 'book-open-variant' },
        { name: 'departments', title: 'Departamentos', icon: 'domain' },
      ]}
    />
  );
}
