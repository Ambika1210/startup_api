import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3002, // Changed port to avoid conflict with institute_api (3001)
  STAGE: process.env.STAGE || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://rajukumar957259_db_user:rajukumarAtlasUser%23321@champaran-food-service.dfianrw.mongodb.net/plusdotDB', // Changed DB name to plusdotDB
  LOG_MAX_FILES: process.env.LOG_MAX_FILES || '14d',
  JWT_STAGING_EXPIRES_IN: process.env.JWT_STAGING_EXPIRES_IN || '30d',
  S3: {
    SECRET_ACCESS_KEY: process.env.S3_SECRET,
    ACCESS_KEY_ID: process.env.S3_ACCESS_KEY,
    REGION: process.env.S3_REGION,
    BUCKET: process.env.S3_BUCKET,
  },
  SMTP: {
    ENABLED: process.env.SMTP_ENABLED !== 'false',
    HOST: process.env.SMTP_HOST,
    PORT: parseInt(process.env.SMTP_PORT) || 587,
    SECURE: process.env.SMTP_SECURE === 'true',
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
    FROM_NAME: process.env.SMTP_FROM_NAME || 'Plusdot API',
  },
  FILE_UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    MAX_AUDIO_FILE_SIZE: parseInt(process.env.MAX_AUDIO_FILE_SIZE) || 10485760,
  },
  // Retaining other configs structure even if not immediately used
  ELASTICSEARCH: {
    ENDPOINT: process.env.ES_ENDPOINT,
    USERNAME: process.env.ES_USERNAME,
    PASSWORD: process.env.ES_PASSWORD,
    INDEX_NAME: process.env.ES_INDEX_NAME,
  },
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    CURRENCY: process.env.STRIPE_CURRENCY,
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID,
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    CURRENCY: process.env.RAZORPAY_CURRENCY || 'INR',
    WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
};

export default config;
