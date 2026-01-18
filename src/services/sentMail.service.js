import sendEmail from "../models/sentMail.model.js";
import { repositoryFactory } from "../repositories/repository.helper.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";

class sentMailService{
    constructor(){
        this.sentMailRepository = repositoryFactory.getRepository(sendEmail)
    }
    async create(data) {
        logger.info(`sentMailService.js  << create() <<< creating mail tracking for ${data}`)
        try {
         const result = await this.sentMailRepository.create(data)
        logger.info(`sentMailService.js  << create() <<< Mail tracking created ${result._id}`)
        return result
        } catch (error) {
            logger.error(`sentMailService.js  << create() <<< failed to create mail tracking ${error.message}`)

            throw error
        }
    }

    async getAllByUserId(userId) {
        try {
          const result =   await this.sentMailRepository.getAll({userId:userId});
          return result
        } catch (error) {
            throw error
        }
    }
}


export default new sentMailService()