import robot, { Bitmap } from 'robotjs';
import { Logger, createLogger, saveTemporary } from '../utils';

export class ScreenController {

  public static getInstance(): ScreenController {
    return this.singleton;
  }

  private static readonly singleton = new ScreenController();

  private readonly logger: Logger;

  private constructor() {
    this.logger = createLogger();
    this.logger.info('ScreenController instance created!');
  }

  public printScreenInfo(): void {
    const screen = robot.getScreenSize();
    this.logger.info(`Screen Size: ${screen.width} x ${screen.height} (width/height)`);
  }

  public async capture(x: number, y: number, width: number, height: number): Promise<Bitmap> {
    const bitmap = await robot.screen.capture(x, y, width, height);
    await saveTemporary(`caputre_${bitmap.width}x${bitmap.height}.bmp`, bitmap.image);
    return bitmap;
  }

}
