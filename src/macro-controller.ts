import { MouseController, KeyboardController } from './controllers'
import { MacroExecutor, MacroExecutorOptions } from './macro-executor'
import { Macro } from './models'

export interface MacroExecutionOptions {}

export class MacroController {

  private readonly macroExecutor: MacroExecutor

  constructor() {
    const executorOpts = this.buildMacroExecutorOptions()
    this.macroExecutor = new MacroExecutor(executorOpts)
  }

  // @ts-ignore
  public executeMacro(macro: Macro, options?: MacroExecutionOptions): Promise<void | undefined> {
    // TODO: add validation & proper options to customize macro execution
    return this.macroExecutor.run(macro)
  }

  private buildMacroExecutorOptions(): MacroExecutorOptions {
    return {
      keyboardController: new KeyboardController(),
      mouseController: new MouseController(),
    }
  }

}
