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
  cellName: {
    flex: 1.4,
    justifyContent: 'center',
  },
  cellCourse: {
    flex: 1.2,
    justifyContent: 'center',
  },
  cellSmall: {
    flex: 0.55,
    justifyContent: 'center',
  },
  cellReaders: {
    flex: 0.7,
    justifyContent: 'center',
  },
  cellActions: {
    flex: 0.45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readersBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  readersTooltip: {
    alignSelf: 'flex-start',
  },
  readersBadgeText: {
    fontWeight: '600',
  },
});
