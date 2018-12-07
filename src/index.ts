import { ScreenController, MouseController, KeyboardController } from './controllers';
import { ScriptRunner } from './utils';
import { Script } from './models'; 

export type ControllerType = 'screen' | 'mouse' | 'keyboard';
export type Controller = ScreenController | MouseController | KeyboardController;

export { ScreenController, KeyboardController, MouseController };

export class CFBot {

  private readonly screenController: ScreenController;
  private readonly mouseController: MouseController;
  private readonly keyboardController: KeyboardController;
  private readonly scriptRunner: ScriptRunner;

  constructor() {
    this.screenController = ScreenController.getInstance();
    this.mouseController = MouseController.getInstance();
    this.keyboardController = KeyboardController.getInstance();
    this.scriptRunner = new ScriptRunner(this);
  }

  public mouse(): MouseController {
    return this.mouseController;
  }

  public keyboard(): KeyboardController {
    return this.keyboardController;
  }

  public screen(): ScreenController {
    return this.screenController;
  }

  public getController(type: ControllerType): ScreenController | KeyboardController | MouseController {
    switch(type) {
      case 'screen':
        return this.screenController;
      case 'mouse':
        return this.mouseController;
      case 'keyboard':
        return this.keyboardController;
      default:
        throw new Error(`Invalid type passed to function! (got: ${type})`);
    }
  }

  public async run(script: Script) {
    await this.scriptRunner.run(script);
  }

}

