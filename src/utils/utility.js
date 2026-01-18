import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import NodeCache from 'node-cache';
import logger from './logger.js';
import serverConfig from '../config/config.js'; // Assuming config default export or named export matches
import { ENV_STAGING, ENV_PRODUCTION } from '../constants/enums.js'; // ENV_STAGING was requested

// Cache decoded JWTs for 1 minute
const tokenCache = new NodeCache({ stdTTL: 60 });

/* -----------------------------------------------
 🔐 TOKEN VERIFY (cached)
-------------------------------------------------*/
export function verifyJwtToken(token) {
  const cached = tokenCache.get(token);
  if (cached) return cached;
  // Using process.env.JWT_SECRET as fallback if serverConfig structure is different, 
  // but trying serverConfig first as requested
  const secret = serverConfig.JWT_SECRET; 
  const decoded = jwt.verify(token, secret);
  tokenCache.set(token, decoded);
  return decoded;
}

export function validHashPassword(password, user_password) {
  logger.info(`utility.js << validHashPassword() << checking password is valid or not`);

  // bcrypt.compareSync is correct for 'bcrypt' package too
  const isPasswordValid = bcrypt.compareSync(password, user_password);
  logger.info(`utility.js << validHashPassword() << IsPasswordValid : ${isPasswordValid}`);

  return isPasswordValid;
}

export function generateHashPassword(password) {
  logger.info(`utility.js << generateHashPassword() << generating Hash Password`);
  // bcrypt.hashSync(password, salt) - bcrypt package
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers: 10 digits, starts with 6-9
  return phoneRegex.test(phoneNumber);
}

export const generateToken = (payload) => {
  const secret = serverConfig.JWT_SECRET;
  let expiresIn = '24h';

  // Check if we are in staging to give long lived token
  if (serverConfig.STAGE === ENV_STAGING) {
      expiresIn = serverConfig.JWT_STAGING_EXPIRES_IN;
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}
