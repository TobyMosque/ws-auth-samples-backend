import * as express from 'express';
import configure from './index';
import http from 'http';
import https, { ServerOptions } from 'https';
import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

async function bootstrap() {
  const app = express();
  await configure({ app, prefix: 'api' });

  const httpsOptions: ServerOptions = {
    key: await readFileAsync('./secrets/ssl.key'),
    cert: await readFileAsync('./secrets/ssl.csr'),
  };

  await http.createServer(app).listen(3000);
  await https.createServer(httpsOptions, app).listen(3001);
}
bootstrap();
