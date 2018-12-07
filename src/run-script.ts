import yargs from 'yargs';
import path from 'path';
import { ScriptLoader } from './utils';
import { CFBot } from '.';

const argv = yargs.option('script', {
  alias: 's',
}).argv;

if(!argv.script) {
  yargs.showHelp();
  process.exit(1);
}

async function main() {
  const bot = new CFBot();
  const scriptLoader = new ScriptLoader();
  const targetPath = path.isAbsolute(argv.script) ? argv.script : path.join(process.cwd(), argv.script);
  const obj = await scriptLoader.load(targetPath);
  console.log(obj);
  bot.run(obj);
}

main();
