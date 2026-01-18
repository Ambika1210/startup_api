class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get document by ID
   * @param {string} id - Document ID
   * @param {string|Object} populate - Fields to populate
   * @returns {Promise<Object|null>} Document or null
   */
  async getById(id, populate = '') {
    try {
      const query = this.model.findById(id);
      if (populate) {
        query.populate(populate);
      }
      return await query;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all documents with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated result
   */
  async getAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        filter = {},
        sort = { createdAt: -1 },
        populate = ''
      } = options;

      const skip = (page - 1) * limit;

      // Build query
      const query = this.model.find(filter);

      if (populate) {
        query.populate(populate);
      }

      // Execute queries in parallel
      const [documents, totalCount] = await Promise.all([
        query
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        this.model.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: documents,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} updateData - Data to update
   * @param {string|Object} populate - Fields to populate
   * @returns {Promise<Object|null>} Updated document or null
   */
  async updateById(id, updateData, populate = '') {
    try {
      const query = this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (populate) {
        query.populate(populate);
      }

      return await query;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>} Deleted document or null
   */
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find one document by filter
   * @param {Object} filter - Filter criteria
   * @param {string|Object} populate - Fields to populate
   * @returns {Promise<Object|null>} Document or null
   */
  async findOne(filter, populate = '') {
    try {
      const query = this.model.findOne(filter);
      if (populate) {
        query.populate(populate);
      }
      return await query;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count documents by filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} Document count
   */
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if document exists
   * @param {Object} filter - Filter criteria
   * @returns {Promise<boolean>} True if document exists
   */
  async exists(filter) {
    try {
      const document = await this.model.findOne(filter).select('_id');
      return !!document;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseRepository;