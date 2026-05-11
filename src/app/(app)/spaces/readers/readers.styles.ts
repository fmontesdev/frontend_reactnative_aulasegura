import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 2,
    paddingBottom: 4,
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
  cellCode: {
    flex: 1,
    justifyContent: 'center',
  },
  cellRoom: {
    flex: 1.8,
    justifyContent: 'center',
  },
  cellStatus: {
    flex: 0.8,
    justifyContent: 'center',
  },
  cellActions: {
    flex: 0.45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipWrapper: {
    alignSelf: 'flex-start',
  },
});
