import userService from '../services/user.service.js';
import logger from '../utils/logger.js';
import {
    setSuccess,
    setCreateSuccess,
    setNotFoundError,
    setBadRequest,
    setServerError,
    setNotAuthorized
} from '../utils/responseHelper.js';
import { validateEmail, validatePhoneNumber } from '../utils/utility.js';
import { ALL_PERMISSIONS } from '../constants/rolePermissions.js';

class UserController {
    /**
     * Create a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createUser(req, res) {
        logger.info(`user.controller.js >>> createUser >>> Request received for user creation`);
        try {
            const userData = req.body;

            if (!userData.name || !userData.email || !userData.password) {
                logger.warn(`user.controller.js >>> createUser >>> Missing required fields`);
                return setBadRequest(res, { message: 'Name, email, and password are required' });
            }

            if (!validateEmail(userData.email)) {
                logger.warn(`user.controller.js >>> createUser >>> Invalid email format: ${userData.email}`);
                return setBadRequest(res, { message: 'Invalid email format' });
            }

            if (userData.phone && !validatePhoneNumber(userData.phone)) {
                logger.warn(`user.controller.js >>> createUser >>> Invalid phone format: ${userData.phone}`);
                return setBadRequest(res, { message: 'Invalid phone number format' });
            }

            const user = await userService.createUser(userData);

            logger.info(`user.controller.js >>> createUser >>> User created successfully with ID: ${user._id}`);
            setCreateSuccess(res, { message: 'User created successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> createUser >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Get user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserById(req, res) {
        logger.info(`user.controller.js >>> getUserById >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            logger.info(`user.controller.js >>> getUserById >>> User retrieved successfully with ID: ${id}`);
            setSuccess(res, { message: 'User retrieved successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> getUserById >>> Error: ${error.message}`);
            if (error.message === 'User not found') {
                setNotFoundError(res, { message: error.message });
            } else {
                setServerError(res, { message: error.message });
            }
        }
    }

    /**
     * Get all users with pagination
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAllUsers(req, res) {
        logger.info(`user.controller.js >>> getAllUsers >>> Request received for all users`);
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                sort: req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 },
                filter: req.query.filter ? JSON.parse(req.query.filter) : {}
            };

            const result = await userService.getAllUsers(options);

            logger.info(`user.controller.js >>> getAllUsers >>> Retrieved ${result.data?.length || 0} users successfully`);
            setSuccess(res, {
                message: 'Users retrieved successfully',
                users: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            logger.error(`user.controller.js >>> getAllUsers >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Update user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateUser(req, res) {
        logger.info(`user.controller.js >>> updateUser >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const updateData = req.body;
            const user = await userService.updateUser(id, updateData);

            logger.info(`user.controller.js >>> updateUser >>> User updated successfully with ID: ${id}`);
            setSuccess(res, { message: 'User updated successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> updateUser >>> Error: ${error.message}`);
            if (error.message === 'User not found') {
                setNotFoundError(res, { message: error.message });
            } else {
                setBadRequest(res, { message: error.message });
            }
        }
    }

    /**
     * Delete user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteUser(req, res) {
        logger.info(`user.controller.js >>> deleteUser >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const user = await userService.deleteUser(id);

            logger.info(`user.controller.js >>> deleteUser >>> User deleted successfully with ID: ${id}`);
            setSuccess(res, { message: 'User deleted successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> deleteUser >>> Error: ${error.message}`);
            if (error.message === 'User not found') {
                setNotFoundError(res, { message: error.message });
            } else {
                setServerError(res, { message: error.message });
            }
        }
    }

    /**
     * Get user by email
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserByEmail(req, res) {
        logger.info(`user.controller.js >>> getUserByEmail >>> Request received for email: ${req.params.email}`);
        try {
            const { email } = req.params;
            const user = await userService.getUserByEmail(email);

            if (!user) {
                logger.info(`user.controller.js >>> getUserByEmail >>> No user found with email: ${email}`);
                setNotFoundError(res, { message: 'User not found' });
                return;
            }

            logger.info(`user.controller.js >>> getUserByEmail >>> User retrieved successfully with email: ${email}`);
            setSuccess(res, { message: 'User retrieved successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> getUserByEmail >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Get users by role
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUsersByRole(req, res) {
        logger.info(`user.controller.js >>> getUsersByRole >>> Request received for role: ${req.params.role}`);
        try {
            const { role } = req.params;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                sort: req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 }
            };

            const result = await userService.getUsersByRole(role, options);

            logger.info(`user.controller.js >>> getUsersByRole >>> Retrieved ${result.data?.length || 0} users with role: ${role}`);
            setSuccess(res, {
                message: `Users with role '${role}' retrieved successfully`,
                users: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            logger.error(`user.controller.js >>> getUsersByRole >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Search users by name or email
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async searchUsers(req, res) {
        logger.info(`user.controller.js >>> searchUsers >>> Request received for search`);
        try {
            const { q: searchTerm } = req.query;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                sort: req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 }
            };

            const result = await userService.searchUsers(searchTerm, options);

            logger.info(`user.controller.js >>> searchUsers >>> Found ${result.data?.length || 0} users matching: ${searchTerm}`);
            setSuccess(res, {
                message: 'Search completed successfully',
                users: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            logger.error(`user.controller.js >>> searchUsers >>> Error: ${error.message}`);
            setBadRequest(res, { message: error.message });
        }
    }

    /**
     * Update user password
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updatePassword(req, res) {
        logger.info(`user.controller.js >>> updatePassword >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            const user = await userService.updatePassword(id, newPassword);

            logger.info(`user.controller.js >>> updatePassword >>> Password updated successfully for user ID: ${id}`);
            setSuccess(res, { message: 'Password updated successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> updatePassword >>> Error: ${error.message}`);
            setBadRequest(res, { message: error.message });
        }
    }

    /**
     * Get all available permissions
     * @param {Object} req 
     * @param {Object} res 
     */
    async getAllPermissions(req, res) {
        logger.info(`user.controller.js >>> getAllPermissions >>> Fetching all permissions`);
        try {
            setSuccess(res, { message: "All Available Permission", permissions: ALL_PERMISSIONS });
        } catch (error) {
            logger.error(`user.controller.js >>> getAllPermissions >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Login user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async loginUser(req, res) {
        logger.info(`user.controller.js >>> loginUser >>> Login request received`);
        try {
            const { email, password } = req.body;

            const { user, token } = await userService.loginUser(email, password);

            logger.info(`user.controller.js >>> loginUser >>> Password verified successfully for email: ${email}`);
            setSuccess(res, { message: 'Login successful', user, token });
        } catch (error) {
            logger.error(`user.controller.js >>> loginUser >>> Error: ${error.message}`);
            if (error.message === 'User not found' || error.message === 'Invalid password') {
                setNotAuthorized(res, { message: error.message });
            } else {
                setServerError(res, { message: error.message });
            }
        }
    }

    /**
     * Get user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserProfile(req, res) {
        logger.info(`user.controller.js >>> getUserProfile >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const userProfile = await userService.getUserProfile(id);

            logger.info(`user.controller.js >>> getUserProfile >>> Profile retrieved successfully for user ID: ${id}`);
            setSuccess(res, { message: 'User profile retrieved successfully', userProfile });
        } catch (error) {
            logger.error(`user.controller.js >>> getUserProfile >>> Error: ${error.message}`);
            if (error.message === 'User not found') {
                setNotFoundError(res, { message: error.message });
            } else {
                setServerError(res, { message: error.message });
            }
        }
    }

    /**
     * Update user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateProfile(req, res) {
        logger.info(`user.controller.js >>> updateProfile >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const updateData = req.body;

            const userProfile = await userService.updateProfile(id, updateData);

            logger.info(`user.controller.js >>> updateProfile >>> Profile updated successfully for user ID: ${id}`);
            setSuccess(res, { message: 'Profile updated successfully', userProfile });
        } catch (error) {
            logger.error(`user.controller.js >>> updateProfile >>> Error: ${error.message}`);
            if (error.message === 'User not found') {
                setNotFoundError(res, { message: error.message });
            } else {
                setBadRequest(res, { message: error.message });
            }
        }
    }

    /**
     * Get user statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getUserStats(req, res) {
        logger.info(`user.controller.js >>> getUserStats >>> Request received for user statistics`);
        try {
            const stats = await userService.getUserStats();

            logger.info(`user.controller.js >>> getUserStats >>> Statistics retrieved successfully`);
            setSuccess(res, { message: 'User statistics retrieved successfully', stats });
        } catch (error) {
            logger.error(`user.controller.js >>> getUserStats >>> Error: ${error.message}`);
            setServerError(res, { message: error.message });
        }
    }

    /**
     * Deactivate user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deactivateUser(req, res) {
        logger.info(`user.controller.js >>> deactivateUser >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const user = await userService.deactivateUser(id);

            logger.info(`user.controller.js >>> deactivateUser >>> User deactivated successfully with ID: ${id}`);
            setSuccess(res, { message: 'User deactivated successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> deactivateUser >>> Error: ${error.message}`);
            setBadRequest(res, { message: error.message });
        }
    }

    /**
     * Reactivate user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async reactivateUser(req, res) {
        logger.info(`user.controller.js >>> reactivateUser >>> Request received for user ID: ${req.params.id}`);
        try {
            const { id } = req.params;
            const user = await userService.reactivateUser(id);

            logger.info(`user.controller.js >>> reactivateUser >>> User reactivated successfully with ID: ${id}`);
            setSuccess(res, { message: 'User reactivated successfully', user });
        } catch (error) {
            logger.error(`user.controller.js >>> reactivateUser >>> Error: ${error.message}`);
            setBadRequest(res, { message: error.message });
        }
    }
}

export default new UserController();