import BaseRepository from './base.repository.js';
import User from '../models/user.model.js';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null
     */
    async getByEmail(email) {
        return await this.findOne({ email }, 'companyEmployee');
    }

    /**
     * Get users by role with pagination
     * @param {string} role - User role
     * @param {Object} options - Pagination options
     * @returns {Promise<Object>} Paginated users result
     */
    async getByRole(role, options = {}) {
        return await this.getAll({
            ...options,
            filter: { role, ...options.filter },
            populate: 'companyEmployee'
        });
    }

    /**
     * Search users by name or email with pagination
     * @param {string} searchTerm - Search term
     * @param {Object} options - Pagination options
     * @returns {Promise<Object>} Paginated users result
     */
    async search(searchTerm, options = {}) {
        const searchFilter = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        };

        return await this.getAll({
            ...options,
            filter: { ...searchFilter, ...options.filter },
            populate: 'companyEmployee'
        });
    }

    /**
     * Check if user exists by email
     * @param {string} email - User email
     * @returns {Promise<boolean>} True if user exists
     */
    async existsByEmail(email) {
        return await this.exists({ email });
    }

    /**
     * Get user count by role
     * @param {string} role - User role
     * @returns {Promise<number>} Count of users
     */
    async countByRole(role) {
        return await this.count({ role });
    }
}

export default new UserRepository();