import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 24,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  titleContainer: {
    gap: 4,
  },
  rangeSelector: {
    minWidth: 300,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    marginBottom: 24,
  },
  chartCardContent: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  chartContainer: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 8,
  },
  chartBarWrapper: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  chartBarSlot: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartTooltipTarget: {
    width: '70%',
    minHeight: 2,
  },
  chartBar: {
    width: '100%',
    minHeight: 2,
    overflow: 'hidden',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  chartSegment: {
    width: '100%',
    minHeight: 1,
  },
  chartSegmentTop: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chartSegmentBottom: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  chartLabel: {
    fontSize: 10,
  },
  chartLabelSlot: {
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  rankingCard: {
    flex: 1,
    minWidth: 320,
  },
  rankingContent: {
    gap: 12,
  },
  rankingHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  lastRankingRow: {
    borderBottomWidth: 0,
  },
  roomRankingMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  userRankingMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userTextContainer: {
    width: 180,
  },
  rolesColumn: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'flex-start',
  },
  countBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
