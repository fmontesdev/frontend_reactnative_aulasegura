import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 10,
  },
  menu: {
    marginTop: 64,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuContent: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    minWidth: 340,
    maxWidth: 380,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipsAndInputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginLeft: 8,
  },
  helpIcon: {
    marginLeft: 8,
    padding: 2,
  },
  input: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 4,
    outlineStyle: 'none',
  } as any,
  clearButton: {
    marginLeft: 4,
    marginRight: -2,
    padding: 5,
    borderRadius: 20,
  },
});
