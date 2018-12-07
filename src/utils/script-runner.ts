import { CFBot } from '../';
import { Logger, createLogger } from '.';
import { Script, Action, MouseAction, KeyboardAction, TargetLocation, MouseButton, MouseClick, Key } from '../models';

export class ScriptRunner {

  private readonly logger: Logger;

  constructor(private readonly bot: CFBot) {
    this.logger = createLogger();
    this.bot.getController('keyboard');
  }

  public async run(script: Script) {
    this.logger.info(`Running Script: ${script.name}`);
    await script.actions.map(async (action) => this.processAction(action));
  }

  private async processAction<T extends Action = MouseAction | KeyboardAction>(action: T) {
    this.logger.info(`Processing Action:`);
    this.logger.info(JSON.stringify(action));

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
    this.bot.mouse().click(location, button, clickType);
  }

  private handleMouseMove(location: TargetLocation, smooth?: boolean) {
    this.bot.mouse().move(location, smooth);
  }

  private handleKeyPress(key: Key) {
    this.bot.keyboard().pressKey(key);
  }

  private handleTypeText(text: string) {
    this.bot.keyboard().type(text);
  }

}
