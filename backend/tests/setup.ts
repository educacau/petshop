import {config} from '@config/env';

// Ensure NODE_ENV is set to test when running Jest.
if (config.env !== 'test') {
  process.env.NODE_ENV = 'test';
}
