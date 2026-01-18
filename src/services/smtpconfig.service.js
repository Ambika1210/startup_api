import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { repositoryFactory } from "../repositories/repository.helper.js";
import SmtpConfig from "../models/smtpconfig.model.js";
import logger from "../utils/logger.js";
import sentMailService from "./sentMail.service.js";

class SmtpService {
  constructor(){
    this.smtpRepository = repositoryFactory.getRepository(SmtpConfig)
  }
  async create(data) {
    logger.info(`smtpconfig.service.js >>> create >>> Starting SMTP creation for user ID: ${data?.userId}`);
    try {
      if (
        !data?.smtpHost ||
        !data?.smtpPort ||
        !data?.smtpUsername ||
        !data?.smtpPassword ||
        !data?.fromEmail ||
        !data?.fromName
      ) {
        logger.warn(`smtpconfig.service.js >>> create >>> Missing required fields for SMTP creation`);
        throw new Error("All required SMTP fields are mandatory");
      }

      logger.info(`smtpconfig.service.js >>> create >>> Checking for existing SMTP config for user ID: ${data.userId}`);
      const existingSmtp = await this.smtpRepository.findOne({ userId: data.userId });
      if (existingSmtp) {
        logger.warn(`smtpconfig.service.js >>> create >>> User already has an existing SMTP configuration: ${data.userId}`);
        throw new Error("User already has an existing SMTP configuration");
      }

      logger.info(`smtpconfig.service.js >>> create >>> Saving new SMTP configuration to database`);
      const result = await this.smtpRepository.create(data);
      logger.info(`smtpconfig.service.js >>> create >>> SMTP configuration created successfully for user ID: ${data.userId}`);
      return result;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> create >>> Error creating SMTP configuration: ${error.message}`);
      throw error;
    }
  }

  async getAll() {
    logger.info(`smtpconfig.service.js >>> getAll >>> Fetching all SMTP configurations`);
    try {
      const result = await this.smtpRepository.getAll();
      logger.info(`smtpconfig.service.js >>> getAll >>> Successfully retrieved ${result.data?.length || 0} SMTP configurations`);
      return result;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> getAll >>> Error fetching SMTP configurations: ${error.message}`);
      throw error;
    }
  }

  async getById(userId) {
    logger.info(`smtpconfig.service.js >>> getById >>> Fetching SMTP configuration for user ID: ${userId}`);
    try {
      const smtp = await this.smtpRepository.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!smtp) {
        logger.info(`smtpconfig.service.js >>> getById >>> No SMTP configuration found for user ID: ${userId}`);
        throw new Error("SMTP configuration not found");
      }
      logger.info(`smtpconfig.service.js >>> getById >>> Successfully fetched SMTP configuration for user ID: ${userId}`);
      return smtp;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> getById >>> Error fetching SMTP configuration: ${error.message}`);
      throw error;
    }
  }

  async update(id, data) {
    logger.info(`smtpconfig.service.js >>> update >>> Updating SMTP configuration with ID: ${id}`);
    try {
      const result = await this.smtpRepository.updateById(id, data);
      if (!result) {
        logger.warn(`smtpconfig.service.js >>> update >>> SMTP configuration not found for update with ID: ${id}`);
        throw new Error("SMTP configuration not found");
      }
      logger.info(`smtpconfig.service.js >>> update >>> SMTP configuration updated successfully for ID: ${id}`);
      return result;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> update >>> Error updating SMTP configuration: ${error.message}`);
      throw error;
    }
  }

  async delete(id) {
    logger.info(`smtpconfig.service.js >>> delete >>> Deleting SMTP configuration with ID: ${id}`);
    try {
      const result = await this.smtpRepository.deleteById(id);
      if (!result) {
        logger.warn(`smtpconfig.service.js >>> delete >>> SMTP configuration not found for deletion with ID: ${id}`);
        throw new Error("SMTP configuration not found");
      }
      logger.info(`smtpconfig.service.js >>> delete >>> SMTP configuration deleted successfully for ID: ${id}`);
      return result;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> delete >>> Error deleting SMTP configuration: ${error.message}`);
      throw error;
    }
  }

  async sendMail({ to, subject, html, userId, attachments,templateId }) {
    logger.info(`smtpconfig.service.js >>> sendMail >>> Attempting to send mail to: ${to} for user ID: ${userId}`);
    try {
      const smtp = await this.smtpRepository.findOne({userId: new mongoose.Types.ObjectId(userId)});
      if (!smtp) {
        logger.warn(`smtpconfig.service.js >>> sendMail >>> No active SMTP configuration found for user ID: ${userId}`);
        throw new Error("No active SMTP configuration found for this user");
      }

      logger.info(`smtpconfig.service.js >>> sendMail >>> Creating nodemailer transporter for host: ${smtp.smtpHost}`);
      const transporter = nodemailer.createTransport({
        host: smtp.smtpHost,
        port: smtp.smtpPort,
        secure: smtp.isSecure,
        auth: {
          user: smtp.smtpUsername,
          pass: smtp.smtpPassword,
        },
      });

      logger.info(`smtpconfig.service.js >>> sendMail >>> Dispatching email to: ${to}`);
      const result = await transporter.sendMail({
        from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
        to,
        subject,
        html,
        attachments,
      });
      const mailTracked = await  sentMailService.create({userId,to,templateId})
      logger.info(`smtpconfig.service.js >>> sendMail >>> Email sent successfully to: ${to}`);
      return result;
    } catch (error) {
      logger.error(`smtpconfig.service.js >>> sendMail >>> Error sending email: ${error.message}`);
      throw error;
    }
  }
}

export default new SmtpService();
