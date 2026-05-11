import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    fontSize: 14,
  },
  inputOutline: {
    borderRadius: 20,
  },
  inputOutlineFocused: {
    borderWidth: 1.5,
  },
  menuIcon: {
    width: 32,
    height: 32,
  },
  menuContainer: {
    marginTop: 10,
    width: '100%',
  },
  menuContent: {
    borderRadius: 20,
    alignSelf: 'flex-end',
    paddingVertical: 15,
    marginLeft: 'auto',
    maxHeight: 331,
    minWidth: 225,
  },
  menuScroll: {
    maxHeight: 320,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 43,
  },
  emptyItem: {
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    minHeight: 43,
  },
  emptyItemText: {
    fontSize: 14,
  },
  switchLabel: {
    flex: 1,
    marginLeft: 3,
    marginRight: 12,
    fontSize: 14,
  },
  switch: {
    transform: [{ scale: 0.9 }],
    marginLeft: 3,
  },
});
