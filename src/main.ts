import * as express from 'express';
import configure from './index';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer, ServerOptions } from 'https';
import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

async function bootstrap() {
  const app = express();
  const nest = await configure({ app, prefix: 'api' });

  const httpsOptions: ServerOptions = {
    key: await readFileAsync('./certs/ssl.key'),
    cert: await readFileAsync('./certs/ssl.crt'),
  };
  await nest.init();

  await createHttpServer(app).listen(3000);
  await createHttpsServer(httpsOptions, app).listen(3001);
}
bootstrap();
