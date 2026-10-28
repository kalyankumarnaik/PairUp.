export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  appName: process.env.APP_NAME || 'PairUp Core Backend',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  corsOrigin: (process.env.CORS_ORIGIN || '*').split(','),

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'pairup_dev_jwt_access_secret_super_secure_key_12345',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'pairup_dev_jwt_refresh_secret_super_secure_key_67890',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  throttler: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },

  tokens: {
    emailVerificationHours: parseInt(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || '24', 10),
    passwordResetMinutes: parseInt(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || '60', 10),
  },

  discovery: {
    defaultMaxDistanceKm: parseInt(process.env.DEFAULT_MAX_DISTANCE_KM || '50', 10),
    maxBatchSize: parseInt(process.env.MAX_DISCOVERY_BATCH_SIZE || '20', 10),
  },

  swagger: {
    enabled: process.env.ENABLE_SWAGGER !== 'false',
  },
});
