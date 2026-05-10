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
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 22,
  },
  title: {
    flexShrink: 0,
    marginRight: 16,
  },
  quickFilters: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 620,
    alignItems: 'flex-end',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellWithAvatar: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellType: {
    flex: 0.7,
    justifyContent: 'center',
  },
  cellRoom: {
    flex: 1.4,
    justifyContent: 'center',
    gap: 2,
  },
  cellReader: {
    flex: 0.6,
    justifyContent: 'center',
  },
  cellStatus: {
    flex: 0.8,
    justifyContent: 'center',
  },
  cellDate: {
    flex: 0.9,
    justifyContent: 'center',
  },
  chipWrapper: {
    alignSelf: 'flex-start',
  },
});
