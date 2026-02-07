import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 20,
    rowGap: 12,
    marginBottom: 12,
  },
  formGridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 280,
  },
  secondSection: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  avatarColumn: {
    flex: 1,
    minWidth: 325,
  },
  configColumn: {
    flex: 1,
    minWidth: 325,
  },
  departmentSection: {
    marginTop: 24,
  },
  validToSection: {
    marginTop: 5,
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 32,
    marginBottom: 32,
  },
});
