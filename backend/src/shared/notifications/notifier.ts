import {config} from '@config/env';
import {logger} from '@shared/logger';

type NotificationPayload = {
  to: string;
  subject: string;
  message: string;
};

export class Notifier {
  async send({to, subject, message}: NotificationPayload) {
    switch (config.notifications.driver) {
      case 'console':
      default:
        logger.info(`[NOTIFICATION] to=${to} subject="${subject}" message="${message}"`);
        break;
    }
  }
}
