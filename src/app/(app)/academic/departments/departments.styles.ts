import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 22,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
  cellName: {
    flex: 0.9,
    justifyContent: 'center',
  },
  cellSubjects: {
    flex: 2,
    justifyContent: 'center',
    paddingRight: 14,
  },
  cellTeachers: {
    flex: 2,
    justifyContent: 'center',
    paddingRight: 14,
  },
  cellStatus: {
    flex: 0.6,
    justifyContent: 'center',
  },
  cellActions: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chipWrapper: {
    alignSelf: 'flex-start',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
});
