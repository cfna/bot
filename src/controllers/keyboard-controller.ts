import robot from 'robotjs';
import { createLogger, Logger } from '../utils';
import { Key } from '../models';

export class KeyboardController {
 
  public static getInstance(): KeyboardController {
    return this.singleton;
  }

  private static readonly singleton = new KeyboardController();

  private readonly logger: Logger;

  private constructor() {
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
