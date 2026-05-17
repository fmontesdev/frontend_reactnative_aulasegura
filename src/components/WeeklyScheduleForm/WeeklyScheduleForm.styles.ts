import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formColumn: {
    maxWidth: 580,
    rowGap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    columnGap: 20,
  },
  timeField: {
    flexGrow: 1,
    flexBasis: 0,
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 30,
    marginBottom: 32,
  },
});
