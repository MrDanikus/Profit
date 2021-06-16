import * as http from 'http';
import config from 'config';

import app from './app';
import logger from './utils/logger';

const port: number = config.get('server.port');

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`server is running on port ${port}`);
});
