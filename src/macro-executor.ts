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
  Key
} from './models'

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

  public async run(script: Macro) {
    this.logger.info(`Running Script: ${script.name}`);
    await script.actions.map(async (action) => this.processAction(action));
  }

  private async processAction<T extends Action = MouseAction | KeyboardAction>(action: T) {
    this.logger.info(`Processing Action:`);
    this.logger.info(JSON.stringify(action));

    if(!action.type) {
      this.logger.warn('Missing type identifier for Action. Skipping')
      return
    }

    if(action.type === 'keyboard') {
      this.logger.info('=> Keyboard Action found!');
      const keyboardAction = (action as unknown) as KeyboardAction;
      this.handleKeyboardAction(keyboardAction);
    } else if (action.type === 'mouse') {
      this.logger.info('=> Mouse Action found!');
      const mouseAction = (action as unknown) as MouseAction;
      this.handleMouseAction(mouseAction);
    }

    this.logger.info('-');
  }

  private handleMouseAction(action: MouseAction) {
    if(action.action === 'click' && action.location) {
      this.handleMouseClick(action.location, action.button, action.click);
    } else if (action.action === 'move' && action.location) {
      this.handleMouseMove(action.location, action.smooth);
    }
  }

  private handleKeyboardAction(action: KeyboardAction) {
    if(action.action === 'key' && action.key) {
      this.handleKeyPress(action.key);
    } else if (action.action === 'text' && action.text) {
      this.handleTypeText(action.text)
    }
  }

  private handleMouseClick(location: TargetLocation, button: MouseButton = 'left', clickType: MouseClick = 'single') {
    this.mouseController.click(location, button, clickType);
  }

  private handleMouseMove(location: TargetLocation, smooth?: boolean) {
    this.mouseController.move(location, smooth);
  }

  private handleKeyPress(key: Key) {
    this.keyboardController.pressKey(key);
  }

  private handleTypeText(text: string) {
    this.keyboardController.type(text);
  }

}
