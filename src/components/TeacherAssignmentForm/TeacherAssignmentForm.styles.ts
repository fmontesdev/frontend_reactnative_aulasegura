import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGrid: {
    flexDirection: 'column',
    rowGap: 12,
    marginBottom: 12,
  },
  formGridItem: {
    width: '100%',
    maxWidth: 560,
    minWidth: 280,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 16,
    rowGap: 8,
    flexWrap: 'wrap',
  },
  teacherSelectColumn: {
    width: '100%',
    maxWidth: 560,
    minWidth: 280,
  },
  teacherDepartmentColumn: {
    minWidth: 220,
    paddingTop: 12,
    justifyContent: 'center',
  },
  chipWrapper: {
    alignSelf: 'flex-start',
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 32,
    marginBottom: 32,
  },
});
