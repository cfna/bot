import { TargetLocation, ActionType, MouseActionType, KeyboardActionType, Key } from '../models'

export class MacroValidationHelper {

  public isValidLocation(location?: TargetLocation): boolean {
    if (!location) {
      return false
    }
    if (location.x && location.x >= 0 && location.y && location.y >= 0) {
      return true
    }
    return false
  }

  public isValidActionType(type?: ActionType): boolean {
    if (!type) {
      return false
    }
    return type === 'keyboard' || type === 'mouse'
  }

  public isValidMouseActionType(mouseActionType?: MouseActionType): boolean {
    if (!mouseActionType) {
      return false
    }
    return mouseActionType === 'click' || mouseActionType === 'move'
  }

  public isValidKeyboardActionType(keyboardActionType?: KeyboardActionType): boolean {
    if (!keyboardActionType) {
      return false
    }
    return keyboardActionType === 'key' || keyboardActionType === 'text'
  }

  public isValidKeyboardKey(keyboardKey?: Key): boolean {
    if (!keyboardKey) {
      return false
    }
    switch (keyboardKey) {
      case 'alt':
      case 'backspace':
      case 'control':
      case 'delete':
      case 'down':
      case 'end':
      case 'enter':
      case 'escape':
      case 'home':
      case 'left':
      case 'pagedown':
      case 'pageup':
      case 'printscreen':
      case 'right':
      case 'right_shift':
      case 'shift':
      case 'space':
      case 'tab':
      case 'up':
        return true
      default:
        return false
    }
  }

  public isValidText(text?: string): boolean {
    if (text && text.trim().length > 0) {
      return true
    }
    return false
  }

}
