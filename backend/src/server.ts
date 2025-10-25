import {config} from '@config/env';
import {createApp} from './app';
import {logger} from '@shared/logger';

const app = createApp();

const port = config.server.port;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
