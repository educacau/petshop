import {logger} from '.';

export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};
