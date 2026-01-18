import { repositoryFactory } from '../repositories/repository.helper.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';
import { generateHashPassword, validHashPassword, generateToken, validateEmail, validatePhoneNumber } from '../utils/utility.js';

class UserService {
  constructor() {
    this.userRepository = repositoryFactory.getRepository(User);
  }

  /**
   * Create a new user with password hashing
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    logger.info(`user.service.js >>> createUser >>> Starting user creation for email: ${userData?.email}`);
    try {
      // Check if user already exists
      logger.info(`user.service.js >>> createUser >>> Checking if user exists with email: ${userData.email}`);
      const existingUser = await this.userRepository.exists({ email: userData.email });
      if (existingUser) {
        logger.warn(`user.service.js >>> createUser >>> User already exists with email: ${userData.email}`);
        throw new Error('User with this email already exists');
      }

      // Hash password if provided
      if (userData.password) {
        logger.info(`user.service.js >>> createUser >>> Hashing password for user: ${userData.email}`);
        userData.password = generateHashPassword(userData.password);
        logger.info(`user.service.js >>> createUser >>> Password hashed successfully for user: ${userData.email}`);
      }

      logger.info(`user.service.js >>> createUser >>> Creating user in database: ${userData.email}`);
      const createdUser = await this.userRepository.create(userData);
      logger.info(`user.service.js >>> createUser >>> User created successfully with ID: ${createdUser._id}`);
      return createdUser;
    } catch (error) {
      logger.error(`user.service.js >>> createUser >>> Error creating user: ${error.message}`);
      throw error;
    }
  }

  // ... (getUserById, getAllUsers, updateUser, deleteUser, getUserByEmail, getUsersByRole, searchUsers remain unchanged)

  async getUserById(id) {
    logger.info(`user.service.js >>> getUserById >>> Fetching user with ID: ${id}`);
    try {
      const user = await this.userRepository.getById(id, 'companyEmployee');
      if (!user) {
        logger.warn(`user.service.js >>> getUserById >>> User not found with ID: ${id}`);
        throw new Error('User not found');
      }
      logger.info(`user.service.js >>> getUserById >>> User found successfully with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`user.service.js >>> getUserById >>> Error fetching user: ${error.message}`);
      throw error;
    }
  }

  async getAllUsers(options = {}) {
    logger.info(`user.service.js >>> getAllUsers >>> Fetching all users with options: ${JSON.stringify(options)}`);
    try {
      const result = await this.userRepository.getAll({
        ...options,
        populate: 'companyEmployee'
      });
      logger.info(`user.service.js >>> getAllUsers >>> Retrieved ${result.data?.length || 0} users successfully`);
      return result;
    } catch (error) {
      logger.error(`user.service.js >>> getAllUsers >>> Error fetching users: ${error.message}`);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    logger.info(`user.service.js >>> updateUser >>> Updating user with ID: ${id}, data: ${JSON.stringify(updateData)}`);
    try {
      const user = await this.userRepository.updateById(id, updateData, 'companyEmployee');
      if (!user) {
        logger.warn(`user.service.js >>> updateUser >>> User not found for update with ID: ${id}`);
        throw new Error('User not found');
      }
      logger.info(`user.service.js >>> updateUser >>> User updated successfully with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`user.service.js >>> updateUser >>> Error updating user: ${error.message}`);
      throw error;
    }
  }

  async deleteUser(id) {
    logger.info(`user.service.js >>> deleteUser >>> Deleting user with ID: ${id}`);
    try {
      const user = await this.userRepository.deleteById(id);
      if (!user) {
        logger.warn(`user.service.js >>> deleteUser >>> User not found for deletion with ID: ${id}`);
        throw new Error('User not found');
      }
      logger.info(`user.service.js >>> deleteUser >>> User deleted successfully with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`user.service.js >>> deleteUser >>> Error deleting user: ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email) {
    logger.info(`user.service.js >>> getUserByEmail >>> Fetching user with email: ${email}`);
    try {
      const user = await this.userRepository.findOne({ email }, 'companyEmployee');
      if (user) {
        logger.info(`user.service.js >>> getUserByEmail >>> User found with email: ${email}`);
      } else {
        logger.info(`user.service.js >>> getUserByEmail >>> No user found with email: ${email}`);
      }
      return user;
    } catch (error) {
      logger.error(`user.service.js >>> getUserByEmail >>> Error fetching user by email: ${error.message}`);
      throw error;
    }
  }

  async getUsersByRole(role, options = {}) {
    logger.info(`user.service.js >>> getUsersByRole >>> Fetching users with role: ${role}, options: ${JSON.stringify(options)}`);
    try {
      const result = await this.userRepository.getAll({
        ...options,
        filter: { role, ...options.filter },
        populate: 'companyEmployee'
      });
      logger.info(`user.service.js >>> getUsersByRole >>> Retrieved ${result.data?.length || 0} users with role: ${role}`);
      return result;
    } catch (error) {
      logger.error(`user.service.js >>> getUsersByRole >>> Error fetching users by role: ${error.message}`);
      throw error;
    }
  }

  async searchUsers(searchTerm, options = {}) {
    logger.info(`user.service.js >>> searchUsers >>> Searching users with term: ${searchTerm}, options: ${JSON.stringify(options)}`);
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        logger.warn(`user.service.js >>> searchUsers >>> Empty search term provided`);
        throw new Error('Search term is required');
      }
      const searchFilter = {
        $or: [
          { name: { $regex: searchTerm.trim(), $options: 'i' } },
          { email: { $regex: searchTerm.trim(), $options: 'i' } }
        ]
      };

      const result = await this.userRepository.getAll({
        ...options,
        filter: { ...searchFilter, ...options.filter },
        populate: 'companyEmployee'
      });
      logger.info(`user.service.js >>> searchUsers >>> Found ${result.data?.length || 0} users matching: ${searchTerm}`);
      return result;
    } catch (error) {
      logger.error(`user.service.js >>> searchUsers >>> Error searching users: ${error.message}`);
      throw error;
    }
  }


  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Updated user
   */
  async updatePassword(userId, newPassword) {
    logger.info(`user.service.js >>> updatePassword >>> Updating password for user ID: ${userId}`);
    try {
      if (!newPassword || newPassword.length < 6) {
        logger.warn(`user.service.js >>> updatePassword >>> Invalid password length for user ID: ${userId}`);
        throw new Error('Password must be at least 6 characters long');
      }

      logger.info(`user.service.js >>> updatePassword >>> Hashing new password for user ID: ${userId}`);
      const hashedPassword = generateHashPassword(newPassword);

      const updatedUser = await this.userRepository.updateById(userId, { password: hashedPassword }, 'companyEmployee');
      logger.info(`user.service.js >>> updatePassword >>> Password updated successfully for user ID: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`user.service.js >>> updatePassword >>> Error updating password: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - Password to verify
   * @returns {Promise<Object>} User object if password is correct
   */
  async loginUser(email, password) {
    logger.info(`user.service.js >>> loginUser >>> Verifying password for email: ${email}`);
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        logger.warn(`user.service.js >>> loginUser >>> User not found for email: ${email}`);
        throw new Error('User not found');
      }

      logger.info(`user.service.js >>> loginUser >>> Comparing password for email: ${email}`);
      const isPasswordValid = validHashPassword(password, user.password);
      if (!isPasswordValid) {
        logger.warn(`user.service.js >>> loginUser >>> Invalid password for email: ${email}`);
        throw new Error('Invalid password');
      }

      logger.info(`user.service.js >>> loginUser >>> Password verified successfully for email: ${email}`);
      
      // Generate Token
      const token = generateToken({ id: user._id, role: user.role });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();
      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error(`user.service.js >>> loginUser >>> Error verifying password: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user profile (without sensitive data)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getUserProfile(userId) {
    logger.info(`user.service.js >>> getUserProfile >>> Fetching profile for user ID: ${userId}`);
    try {
      const user = await this.getUserById(userId);

      // Remove sensitive fields
      const { password, ...userProfile } = user.toObject();
      logger.info(`user.service.js >>> getUserProfile >>> Profile retrieved successfully for user ID: ${userId}`);
      return userProfile;
    } catch (error) {
      logger.error(`user.service.js >>> getUserProfile >>> Error fetching user profile: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updateData) {
    logger.info(`user.service.js >>> updateProfile >>> Updating profile for user ID: ${userId}, data: ${JSON.stringify(updateData)}`);
    try {
      // Remove sensitive fields from update data
      const { password, role, ...safeUpdateData } = updateData;
      logger.info(`user.service.js >>> updateProfile >>> Sanitized update data for user ID: ${userId}`);

      const updatedUser = await this.userRepository.updateById(userId, safeUpdateData, 'companyEmployee');
      if (!updatedUser) {
        logger.warn(`user.service.js >>> updateProfile >>> User not found for profile update with ID: ${userId}`);
        throw new Error('User not found');
      }

      // Remove password from response
      const { password: _, ...userProfile } = updatedUser.toObject();
      logger.info(`user.service.js >>> updateProfile >>> Profile updated successfully for user ID: ${userId}`);
      return userProfile;
    } catch (error) {
      logger.error(`user.service.js >>> updateProfile >>> Error updating user profile: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    logger.info(`user.service.js >>> getUserStats >>> Fetching user statistics`);
    try {
      const [totalUsers, adminCount, userCount, employeeCount] = await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ role: 'admin' }),
        this.userRepository.count({ role: 'user' }),
        this.userRepository.count({ role: 'employee' })
      ]);

      const stats = {
        totalUsers,
        roleDistribution: {
          admin: adminCount,
          user: userCount,
          employee: employeeCount
        }
      };

      logger.info(`user.service.js >>> getUserStats >>> Statistics retrieved: ${JSON.stringify(stats)}`);
      return stats;
    } catch (error) {
      logger.error(`user.service.js >>> getUserStats >>> Error fetching user statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Soft delete user (deactivate)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deactivated user
   */
  async deactivateUser(userId) {
    logger.info(`user.service.js >>> deactivateUser >>> Deactivating user with ID: ${userId}`);
    try {
      const result = await this.userRepository.updateById(userId, {
        isActive: false,
        deactivatedAt: new Date()
      }, 'companyEmployee');
      logger.info(`user.service.js >>> deactivateUser >>> User deactivated successfully with ID: ${userId}`);
      return result;
    } catch (error) {
      logger.error(`user.service.js >>> deactivateUser >>> Error deactivating user: ${error.message}`);
      throw error;
    }
  }
  /**
   * Reactivate user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reactivated user
   */
  async reactivateUser(userId) {
    logger.info(`user.service.js >>> reactivateUser >>> Reactivating user with ID: ${userId}`);
    try {
      const result = await this.userRepository.updateById(userId, {
        isActive: true,
        deactivatedAt: null
      }, 'companyEmployee');
      logger.info(`user.service.js >>> reactivateUser >>> User reactivated successfully with ID: ${userId}`);
      return result;
    } catch (error) {
      logger.error(`user.service.js >>> reactivateUser >>> Error reactivating user: ${error.message}`);
      throw error;
    }
  }
}

export default new UserService();