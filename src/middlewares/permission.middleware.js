import { ROLE_PERMISSIONS } from '../constants/rolePermissions.js';
import logger from '../utils/logger.js';
import { setNotAuthorized, setForbidden, setServerError } from '../utils/responseHelper.js';
import { verifyJwtToken } from '../utils/utility.js';
import User from '../models/user.model.js';

export const protectRoutes = {
  checkPermission: (requiredPermission) => {
    return async (req, res, next) => {
      try {
        // ==========================
        // 1. AUTHENTICATION (Who are you?)
        // ==========================
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

        if (!token) {
          return setNotAuthorized(res, { message: 'Access denied. No token provided.' });
        }

        const decoded = verifyJwtToken(token);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return setNotAuthorized(res, { message: error.message });
        }

        req.user = user;

        // ==========================
        // 2. AUTHORIZATION (Are you allowed?)
        // ==========================
        const userRole = req.user.role;
        const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
        const userPermissions = req.user.permissions || [];

        // Combine role-based and user-specific permissions
        const allPermissions = new Set([...rolePermissions, ...userPermissions]);

        if (allPermissions.has(requiredPermission)) {
           return next();
        } else {
          return setForbidden(res, { message: 'Access denied. Insufficient permissions.' });
        }

      } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            logger.warn(`permission.middleware.js >>> checkPermission() >>> Auth Error: ${error.message}`);
            return setNotAuthorized(res, { message: error.message });
        }
        logger.error(`permission.middleware.js >>> checkPermission() >>> Unexpected Error: ${error.message}`);
        return setServerError(res, { message: 'Server error during permission check.' });
      }
    };
  }
};

export const checkPermission = protectRoutes.checkPermission;
