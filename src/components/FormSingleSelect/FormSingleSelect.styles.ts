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
    maxHeight: 268,
    minWidth: 225,
  },
  menuScroll: {
    maxHeight: 286,
  },
  menuItem: {
    height: 34,
    minHeight: 34,
  },
  selectedMenuItem: {
    height: 34,
    minHeight: 34,
  },
  assignmentInput: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    justifyContent: 'center',
    position: 'relative',
  },
  assignmentInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  assignmentInputSegment: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  disabledInput: {
    opacity: 0.5,
  },
  assignmentMenuItem: {
    minHeight: 42,
    justifyContent: 'center',
  },
  assignmentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  assignmentOptionSegment: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assignmentOptionText: {
    flexShrink: 1,
    minWidth: 0,
  },
  assignmentOptionSeparator: {
    flexShrink: 0,
  },
  userInput: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    justifyContent: 'center',
    position: 'relative',
  },
  userInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  userMenuItem: {
    minHeight: 42,
    justifyContent: 'center',
  },
  userOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  userOptionText: {
    flex: 1,
    minWidth: 0,
  },
  floatingInputLabel: {
    position: 'absolute',
    top: -8,
    left: 14,
    zIndex: 1,
    paddingHorizontal: 4,
  },
});
