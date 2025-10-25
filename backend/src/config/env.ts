import {z} from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform(value =>
      value
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
    ),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must have at least 32 characters'),
  JWT_EXPIRES_IN: z.coerce.number().default(3600),
  SWAGGER_BASE_URL: z.string().default('/api-docs'),
  SCHEDULER_TIMEZONE: z.string().default('America/Sao_Paulo'),
  EMAIL_FROM: z.string().email().default('noreply@petshop.com'),
  NOTIFICATION_DRIVER: z.enum(['console', 'smtp', 'sms']).default('console')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const config = {
  env: parsed.data.NODE_ENV,
  server: {
    port: parsed.data.PORT,
    allowedOrigins: parsed.data.CORS_ALLOWED_ORIGINS
  },
  database: {
    url: parsed.data.DATABASE_URL
  },
  auth: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN
  },
  swagger: {
    baseUrl: parsed.data.SWAGGER_BASE_URL
  },
  scheduler: {
    timezone: parsed.data.SCHEDULER_TIMEZONE
  },
  notifications: {
    from: parsed.data.EMAIL_FROM,
    driver: parsed.data.NOTIFICATION_DRIVER
  }
};
