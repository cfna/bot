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

export interface MacroExecutorOptions {
  mouseController: MouseController
  keyboardController: KeyboardController
}

export class MacroExecutor {

  private readonly logger: Logger;
  private readonly mouseController: MouseController
  private readonly keyboardController: KeyboardController

  constructor(options: MacroExecutorOptions) {
    this.logger = createLogger();
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
    this.logger.info(`Processing Action:`)
    this.logger.info(JSON.stringify(action))

    if (!action.type) {
      this.logger.warn('Missing type identifier for Action. Skipping')
      return
    }

    if (action.type === 'keyboard') {
      this.logger.info('=> Keyboard Action found!');
      const keyboardAction = (action as unknown) as KeyboardAction
      this.handleKeyboardAction(keyboardAction)
    } else if (action.type === 'mouse') {
      this.logger.info('=> Mouse Action found!')
      const mouseAction = (action as unknown) as MouseAction
      this.handleMouseAction(mouseAction)
    }

    this.logger.info('-')
  }

  private handleMouseAction(action: MouseAction) {
    if (action.action === 'click' && action.location) {
      this.handleMouseClick(action.location, action.button, action.click)
    } else if (action.action === 'move' && action.location) {
      this.handleMouseMove(action.location, action.smooth)
    }
  }

  private handleKeyboardAction(action: KeyboardAction) {
    if (action.action === 'key' && action.key) {
      this.handleKeyPress(action.key)
    } else if (action.action === 'text' && action.text) {
      this.handleTypeText(action.text)
    }
  }

  private handleMouseClick(location: TargetLocation, button: MouseButton = 'left', clickType: MouseClick = 'single', smooth: boolean = true) {
    this.logger.info(`handleMouseClick(): location: ${location} button: ${button} clickType: ${clickType}`)
    this.mouseController.click(location, button, clickType, smooth)
  }

  private handleMouseMove(location: TargetLocation, smooth?: boolean) {
    this.logger.info(`handleMouseMove(): location: ${location} smooth: ${smooth}`)
    this.mouseController.move(location, smooth)
  }

  private handleKeyPress(key: Key) {
    this.logger.info(`handleKeyPress(): key: ${key}`)
    this.keyboardController.pressKey(key)
  }

  private handleTypeText(text: string) {
    this.logger.info(`handleTypeText(): text: ${text}`)
    this.keyboardController.type(text)
  }

}
