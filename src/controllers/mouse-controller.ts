import robot from 'robotjs';
import { createLogger, Logger } from '../utils';
import { MouseCoordinates, TargetLocation, MouseButton, MouseClick } from '../models';

export class MouseController {

  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger();
    this.logger.info('MouseController instance created!');
  }

  public moveAround(speed: number = 2): void {
    this.logger.info('moveAround: Preparing for mouse moveemnt ')
    robot.setMouseDelay(speed);
    const twoPi = Math.PI * 2.0;
    const screenSize = robot.getScreenSize();
    const width = screenSize.width;
    const height = (screenSize.height / 2) - 10;
    // tslint:disable-next-line:no-increment-decrement
    for (let x = 0; x < width; x++) {
      const y = height * Math.sin((twoPi * x) / width) + height;
      this.logger.info(`Moving Mouse to x=${x}, y=${y}`);
      robot.moveMouse(x, y);
    }
    this.logger.info('moveAround: Finished movement!');
  }

  public getCurrentPosition(): MouseCoordinates {
    return robot.getMousePos();
  }

  public move(location: TargetLocation, smooth: boolean = true) {
    if(smooth) {
      robot.moveMouseSmooth(location.x, location.y);
    } else {
      robot.moveMouse(location.x, location.y);
    }
  }

  public click(location: TargetLocation, button: MouseButton, clickType: MouseClick) {
    this.move(location);
    robot.mouseClick(button, clickType === 'double');
  }
}
