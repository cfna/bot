import fs, { WriteStream } from 'fs'
import path from 'path'
import { createLogger } from '.'
// tslint:disable-next-line:no-var-requires
// const screenCaptureToFile = require('./screenCaptureToFile.js');

export type DebugCallback = (target: string, error?: Error) => void

export interface SaveOptions {
  prefix: boolean
}

const logger = createLogger()
const tmpDir = path.join(process.cwd(), '.tmp')
const defaultSaveOptions = {
  prefix: true
};
const defaultCallback = (name: string, error?: any) => {
  if(error) {
    logger.error(error)
  }
  logger.debug(`=> Saving to '${name}' done`)
}

async function ensureTmpDir() {
  const exists = await fs.existsSync(tmpDir)
  if(!exists) {
    await fs.mkdirSync(tmpDir)
  }
}

function appendPrefix(name: string): string {
  const prefix = Date.now().toLocaleString().replace(',', '')
  return `${prefix}_${name}`
}

export async function saveTemporary(fileName: string, data: any, opts: SaveOptions = defaultSaveOptions, cb: DebugCallback = defaultCallback): Promise<void> {
  await ensureTmpDir()
  const targetFile = opts.prefix ? appendPrefix(fileName) : fileName
  const target = path.join(tmpDir, targetFile)
  logger.debug(`Saving Temporary File to: ${target}`)
  // await screenCaptureToFile(target);
  const ws: WriteStream = fs.createWriteStream(target)
  await ws.write(data, (err) => {
    if(err) {
      cb(target, err)
    }
    cb(target)
  });
}
