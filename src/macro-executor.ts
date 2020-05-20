import { MouseController, KeyboardController } from './controllers'
import { Logger, createLogger } from './utils'
import {
  Macro,
  Action,
  MouseAction,
  KeyboardAction,
  TargetLocation,
  MouseButton,
  MouseClick,
  Key,
  RepeatAction
} from './models'
import { CancelCallback } from './macro-controller';
import { MacroValidationHelper } from './internal';

export interface MacroExecutorOptions {
  mouseController: MouseController
  keyboardController: KeyboardController
  macroValidationHelper: MacroValidationHelper
}

export class MacroExecutor {

  private readonly logger: Logger;
  private readonly mouseController: MouseController
  private readonly keyboardController: KeyboardController
  private readonly macroValidationHelper: MacroValidationHelper

  constructor(options: MacroExecutorOptions) {
    this.logger = createLogger();
    this.macroValidationHelper = options.macroValidationHelper
    this.mouseController = options.mouseController
    this.keyboardController = options.keyboardController
  }

  public async run(macro: Macro, cancelCallback?: CancelCallback) {
    this.logger.info(`Running Script: ${macro.name}`);

    if (this.isAlwaysRepeatingAction(macro.repeat)) {
      await this.runAlways(macro, cancelCallback)
    } else {
      const repeatCount = this.getRepeatingActionCount(macro.repeat)
      await this.runCounted(macro, repeatCount, cancelCallback)
    }
  }

  private async runCounted(macro: Macro, repeatCount: number, cancelCallback?: CancelCallback) {
    let cancelProcessing = false

    for (let i = 0; i < repeatCount; i++) {
      macro.actions.map(async (action) => {
        if (cancelCallback) {
          cancelProcessing = cancelCallback()
        }
        if (cancelProcessing) {
          return
        }
        await this.processAction(action)
      });
    }
  }

  private async runAlways(macro: Macro, cancelCallback?: CancelCallback) {
    let cancelProcessing = false
    while(!cancelProcessing) {
      macro.actions.map(async (action) => {
        if (cancelCallback) {
          cancelProcessing = cancelCallback()
        }
        if (cancelProcessing) {
          return
        }
        await this.processAction(action)
      });
    }
  }

  private isAlwaysRepeatingAction(action: RepeatAction): boolean {
    return action == 'always'
  }

  private getRepeatingActionCount(action: RepeatAction): number {
    let repeatCount
    try {
      repeatCount = action as number
    } catch {
      this.logger.warn('Unable to retrieve repeat action count. Setting to single execution')
      repeatCount = 1
    }
    return repeatCount
  }

  private async processAction<T extends Action = MouseAction | KeyboardAction>(action: T) {
    this.logger.debug(`Processing Action: ${JSON.stringify(action)}`)

    if (!this.macroValidationHelper.isValidActionType(action.type)) {
      this.logger.warn('Missing or invalid type identifier specified for Action. Skipping execution.')
      return
    }

    if (action.type === 'keyboard') {
      this.logger.debug('=> Keyboard Action found!');
      const keyboardAction = (action as unknown) as KeyboardAction
      this.handleKeyboardAction(keyboardAction)
    } else if (action.type === 'mouse') {
      this.logger.debug('=> Mouse Action found!')
      const mouseAction = (action as unknown) as MouseAction
      this.handleMouseAction(mouseAction)
    }

    this.logger.debug('-')
  }

  private handleMouseAction(action: MouseAction) {
    const isValidLocation = this.macroValidationHelper.isValidLocation(action.location)
    const isValidMouseActionType = this.macroValidationHelper.isValidMouseActionType(action.action)
    
    if (!isValidLocation) {
      this.logger.warn('[MouseAction] Missing or invalid location specified. Skipping this step...')
      return
    }

    if (!isValidMouseActionType) {
      this.logger.warn('[MouseAction] Missing or invalid MouseActionType specified. Skipping this step...')
      return
    }

    if (action.action === 'click' && action.location) {
      this.handleMouseClick(action.location, action.button, action.click)
    } else if (action.action === 'move' && action.location) {
      this.handleMouseMove(action.location, action.smooth)
    }
  }

  private handleKeyboardAction(action: KeyboardAction) {
    const isValidKeyboardActionType = this.macroValidationHelper.isValidKeyboardActionType(action.action)

    if (!isValidKeyboardActionType) {
      this.logger.warn('[KeyboardAction] Missing or invalid KeyboardActionType specified. Skipping this step...')
      return
    }

    if (action.action === 'key' && action.key) {
      const isValidKeyboardKey = this.macroValidationHelper.isValidKeyboardKey(action.key)

      if (!isValidKeyboardKey) {
        this.logger.warn('[KeyboardAction] Missing or invalid Key specified. Skipping this step...')
        return
      }

      this.handleKeyPress(action.key)
    } else if (action.action === 'text' && action.text) {
      const isValidText = this.macroValidationHelper.isValidText(action.text)

      if (!isValidText) {
        this.logger.warn('[KeyboardAction] Missing or invalid Text specified. Skipping this step...')
        return
      }

      this.handleTypeText(action.text)
    }
  }

  private handleMouseClick(location: TargetLocation, button: MouseButton = 'left', clickType: MouseClick = 'single', smooth: boolean = true) {
    this.mouseController.click(location, button, clickType, smooth)
  }

  private handleMouseMove(location: TargetLocation, smooth?: boolean) {
    this.mouseController.move(location, smooth)
  }

  private handleKeyPress(key: Key) {
    this.keyboardController.pressKey(key)
  }

  private handleTypeText(text: string) {
    this.keyboardController.type(text)
  }

}
