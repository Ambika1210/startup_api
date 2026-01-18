import emailTemplateService from "../services/emailTemplate.service.js";
import { setSuccess, setBadRequest, setServerError, setCreateSuccess, setNotFoundError } from "../utils/responseHelper.js";
import logger from "../utils/logger.js";

class EmailTemplateController {
  async createTemplate(req, res) {
    logger.info(`emailTemplate.controller.js >>> createTemplate >>> Request received to create template`);
    try {
      const { userId, name, subject, htmlContent } = req.body;
      const file = req.file;

      if (!userId || !name || !subject || !htmlContent) {
        logger.warn(`emailTemplate.controller.js >>> createTemplate >>> Missing required fields`);
        return setBadRequest(res, { message: "All fields (userId, name, subject, htmlContent) are required" });
      }

      const data = { userId, name, subject, htmlContent };

      if (file) {
        logger.info(`emailTemplate.controller.js >>> createTemplate >>> Attachment found: ${file.originalname}`);
        data.attachmentPath = file.path;
        data.attachmentName = file.originalname;
      }

      const template = await emailTemplateService.create(data);
      
      logger.info(`emailTemplate.controller.js >>> createTemplate >>> Template created successfully with ID: ${template._id}`);

      return setCreateSuccess(res, {
        message: "Template created successfully",
        template,
      });
    } catch (error) {
      logger.error(`emailTemplate.controller.js >>> createTemplate >>> Error creating template: ${error.message}`);
      return setServerError(res, { message: error.message });
    }
  }

  async getAllTemplates(req, res) {
    const { userId } = req.query;
    logger.info(`emailTemplate.controller.js >>> getAllTemplates >>> Request received to fetch templates for user: ${userId}`);
    try {
      if (!userId) {
        logger.warn(`emailTemplate.controller.js >>> getAllTemplates >>> userId is missing in query`);
        return setBadRequest(res, { message: "userId is required" });
      }

      const result = await emailTemplateService.getAllByUserId(userId);
      logger.info(`emailTemplate.controller.js >>> getAllTemplates >>> Retrieved templates successfully`);
      return setSuccess(res, {
        message: "Templates fetched successfully",
        ...result
      });
    } catch (error) {
      logger.error(`emailTemplate.controller.js >>> getAllTemplates >>> Error fetching templates: ${error.message}`);
      return setServerError(res, { message: error.message });
    }
  }

  async sendTemplateMail(req, res) {
    const { userId, templateId, to } = req.body;
    logger.info(`emailTemplate.controller.js >>> sendTemplateMail >>> Request received to send mail command. TemplateID: ${templateId}, UserID: ${userId}, To: ${to}`);
    try {
      if (!userId || !templateId || !to) {
        logger.warn(`emailTemplate.controller.js >>> sendTemplateMail >>> Missing required fields`);
        return setBadRequest(res, { message: "userId, templateId, and to are required" });
      }

      await emailTemplateService.sendResumeTemplateMail({ userId, templateId, to });
      
      logger.info(`emailTemplate.controller.js >>> sendTemplateMail >>> Mail sent command executed successfully`);

      return setSuccess(res, {
        message: "Template mail sent successfully",
      });
    } catch (error) {
      logger.error(`emailTemplate.controller.js >>> sendTemplateMail >>> Error sending template mail: ${error.message}`);
      const status = error.message.includes("not found") ? 404 : 500;
      if (status === 404) return setNotFoundError(res, { message: error.message });
      return setServerError(res, { message: error.message });
    }
  }
}

export default new EmailTemplateController();
