import smtpService from "../services/smtpconfig.service.js";
import { 
  setBadRequest, 
  setServerError, 
  setSuccess, 
  setCreateSuccess, 
  setNotFoundError 
} from "../utils/responseHelper.js";
import logger from "../utils/logger.js";
import sentMailService from "../services/sentMail.service.js";

class SmtpController {
  /**
   * Create a new SMTP configuration
   */
  async createSmtp(req, res) {
    logger.info(`smtpconfig.controller.js >>> createSmtp >>> Request received for SMTP creation`);
    try {
      const smtp = await smtpService.create(req.body);

      logger.info(`smtpconfig.controller.js >>> createSmtp >>> SMTP created successfully for user ID: ${req.body.userId}`);
      return setCreateSuccess(res, {
        message: "SMTP configuration created successfully",
        smtp,
      });
    } catch (error) {
      logger.error(`smtpconfig.controller.js >>> createSmtp >>> Error: ${error.message}`);
      return setServerError(res, {
        message: error.message || "Failed to create SMTP configuration",
      });
    }
  }

  /**
   * Get all SMTP configurations
   */
  async getAllSmtp(req, res) {
    logger.info(`smtpconfig.controller.js >>> getAllSmtp >>> Request received to fetch all SMTP configs`);
    try {
      const smtpConfigs = await smtpService.getAll();

      logger.info(`smtpconfig.controller.js >>> getAllSmtp >>> Successfully retrieved all SMTP configs`);
      return setSuccess(res, {
        message: "All SMTP configurations fetched successfully",
        data: smtpConfigs
      });
    } catch (error) {
      logger.error(`smtpconfig.controller.js >>> getAllSmtp >>> Error: ${error.message}`);
      return setServerError(res, {
        message: error.message || "Failed to fetch SMTP configurations",
      });
    }
  }

  /**
   * Get SMTP configuration by user ID
   */
  async getSmtpById(req, res) {
    logger.info(`smtpconfig.controller.js >>> getSmtpById >>> Request received to fetch SMTP config by user ID: ${req.params.id}`);
    try {
      const smtp = await smtpService.getById(req.params.id);

      logger.info(`smtpconfig.controller.js >>> getSmtpById >>> Successfully fetched SMTP config for user ID: ${req.params.id}`);
      return setSuccess(res, {
        message: "SMTP configuration fetched successfully",
        smtp
      });
    } catch (error) {
      logger.error(`smtpconfig.controller.js >>> getSmtpById >>> Error: ${error.message}`);
      if (error.message === "SMTP configuration not found") {
        return setNotFoundError(res, { message: error.message });
      }
      return setServerError(res, {
        message: error.message || "Failed to fetch SMTP configuration",
      });
    }
  }

  /**
   * Update SMTP configuration
   */
  async updateSmtp(req, res) {
    logger.info(`smtpconfig.controller.js >>> updateSmtp >>> Request received to update SMTP config ID: ${req.params.id}`);
    try {
      const smtp = await smtpService.update(req.params.id, req.body);

      logger.info(`smtpconfig.controller.js >>> updateSmtp >>> SMTP config updated successfully for ID: ${req.params.id}`);
      return setSuccess(res, {
        message: "SMTP configuration updated successfully",
        smtp,
      });
    } catch (error) {
      logger.error(`smtpconfig.controller.js >>> updateSmtp >>> Error: ${error.message}`);
      if (error.message === "SMTP configuration not found") {
        return setNotFoundError(res, { message: error.message });
      }
      return setBadRequest(res, {
        message: error.message || "Failed to update SMTP configuration",
      });
    }
  }

  /**
   * Delete SMTP configuration
   */
  async deleteSmtp(req, res) {
    logger.info(`smtpconfig.controller.js >>> deleteSmtp >>> Request received to delete SMTP config ID: ${req.params.id}`);
    try {
      await smtpService.delete(req.params.id);

      logger.info(`smtpconfig.controller.js >>> deleteSmtp >>> SMTP config deleted successfully for ID: ${req.params.id}`);
      return setSuccess(res, {
        message: "SMTP configuration deleted successfully",
      });
    } catch (error) {
      logger.error(`smtpconfig.controller.js >>> deleteSmtp >>> Error: ${error.message}`);
      if (error.message === "SMTP configuration not found") {
        return setNotFoundError(res, { message: error.message });
      }
      return setServerError(res, {
        message: error.message || "Failed to delete SMTP configuration",
      });
    }
  }
  async getAllSendMail(req,res) {
    try {
    const result =  await sentMailService.getAllByUserId(req.query.userId)
    return setSuccess(res, {message:"All send Email list",result})
    } catch (error) {
      return setServerError(res, {
        message: error.message
      });
    }
  }
}

export default new SmtpController();
