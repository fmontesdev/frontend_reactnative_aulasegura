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
  },
  formGridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 280,
  },
  formGridItemLeft: {
    flexBasis: '49%',
    flexGrow: 0,
    minWidth: 280,
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 30,
    marginBottom: 32,
  },
});
