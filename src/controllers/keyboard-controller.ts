import robot from 'robotjs';
import { createLogger, Logger } from '../utils';
import { Key } from '../models';

export class KeyboardController {

  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger();
    this.logger.info('KeyboardController initialized!');
  }

  public type(text: string) {
    robot.typeString(text);
  }

  public pressKey(key: Key) {
    robot.keyTap(key);
  }

}
