import yaml from 'js-yaml';
import fs from 'fs';
import { Logger, createLogger } from './createLogger';
import { Macro } from '../models';

export class ScriptLoadingError extends Error {}

export class ScriptLoader {

  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger();
  }

  public async load(scriptLocation: string): Promise<Macro> {
    const script: Macro = await yaml.safeLoad(fs.readFileSync(scriptLocation, { encoding: 'utf-8'})) as Macro;
    this.logger.info(`Loaded Script: ${script}`);
    return script;
  }
}
