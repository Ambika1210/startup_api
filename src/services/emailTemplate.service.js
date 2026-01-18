import EmailTemplate from "../models/emailTemplate.model.js";
import { repositoryFactory } from "../repositories/repository.helper.js";
import smtpService from "./smtpconfig.service.js";
import logger from "../utils/logger.js";

class EmailTemplateService {
  constructor() {
    this.templateRepository = repositoryFactory.getRepository(EmailTemplate);
  }

  async create(data) {
    try {
      logger.info(`emailTemplate.service.js >>> create >>> Creating new template for user: ${data.userId}`);
      const template = await this.templateRepository.create(data);
      logger.info(`emailTemplate.service.js >>> create >>> Template created successfully with ID: ${template._id}`);
      return template;
    } catch (error) {
      logger.error(`emailTemplate.service.js >>> create >>> Error creating template: ${error.message}`);
      throw error;
    }
  }

  async getById(id) {
    logger.debug(`emailTemplate.service.js >>> getById >>> Fetching template by ID: ${id}`);
    try {
      const template = await this.templateRepository.getById(id);
      if (!template) {
        logger.warn(`emailTemplate.service.js >>> getById >>> Template not found for ID: ${id}`);
        throw new Error("Template not found");
      }
      return template;
    } catch (error) {
      logger.error(`emailTemplate.service.js >>> getById >>> Error fetching template by ID: ${error.message}`);
      throw error;
    }
  }

  async getAllByUserId(userId) {
    try {
      logger.debug(`emailTemplate.service.js >>> getAllByUserId >>> Fetching all active templates for user: ${userId}`);
      const templates = await this.templateRepository.getAll({ filter: { userId, isActive: true } });
      logger.info(`emailTemplate.service.js >>> getAllByUserId >>> Found ${templates.data ? templates.data.length : 0} templates for user: ${userId}`);
      return templates;
    } catch (error) {
      logger.error(`emailTemplate.service.js >>> getAllByUserId >>> Error fetching templates for user: ${error.message}`);
      throw error;
    }
  }

  async sendResumeTemplateMail({ userId, templateId, to }) {
    try {
      logger.info(`emailTemplate.service.js >>> sendTemplateMail >>> Sending template mail. TemplateID: ${templateId}, UserID: ${userId}, To: ${to}`);
      
      const template = await this.templateRepository.getById(templateId);

      if (!template) {
        logger.warn(`emailTemplate.service.js >>> sendTemplateMail >>> Template not found or inactive. TemplateID: ${templateId}`);
        throw new Error("Template not found or inactive");
      }

      logger.debug(`emailTemplate.service.js >>> sendTemplateMail >>> Template found: ${template.name}`);

      let attachments = [];
      if (template.attachmentPath) {
        logger.debug(`emailTemplate.service.js >>> sendTemplateMail >>> Attachment found for template: ${template.attachmentName}`);
        attachments.push({
          filename: template.attachmentName,
          path: template.attachmentPath,
        });
      }

      // Delegate to SmtpService
      const result = await smtpService.sendMail({
        userId,
        to,
        subject: template.subject,
        html: template.htmlContent,
        attachments,templateId
      });

      logger.info(`emailTemplate.service.js >>> sendTemplateMail >>> Mail sent successfully via SMTP service.`);
      return result;
    } catch (error) {
       logger.error(`emailTemplate.service.js >>> sendTemplateMail >>> Error sending template mail: ${error.message}`);
      throw error;
    }
  }
}

export default new EmailTemplateService();
