import Tabs from '../../../components/Tabs';

export default function AcademicLayout() {
  return (
    <Tabs
      initialRouteName="courses"
      // initialRouteName="years"
      tabs={[
        // { name: 'years', title: 'Años Académicos', icon: 'calendar-range' },
        { name: 'courses', title: 'Cursos', icon: 'book-education', route: '/academic/courses' },
        { name: 'subjects', title: 'Asignaturas', icon: 'book-open-variant', route: '/academic/subjects' },
        { name: 'departments', title: 'Departamentos', icon: 'domain', route: '/academic/departments' },
        { name: 'assignments', title: 'Asignaciones', icon: 'account-school', route: '/academic/assignments' },
      ]}
    />
  );
}
