import express from "express";
import smtpController from "../controller/smtpconfig.controller.js";

const router = express.Router();

router.post("/smtp/add-smtp", smtpController.createSmtp);
router.get("/smtp/get-smtp", smtpController.getAllSmtp);
router.get("/smtp/:id/smtp-by-id", smtpController.getSmtpById);
router.put("/smtp/:id/update-smtp", smtpController.updateSmtp);
router.delete("/smtp/:id/delete-smtp", smtpController.deleteSmtp);
router.get("/emailhistory/get-all-sentmails", smtpController.getAllSendMail);

import multer from "multer";

const upload = multer({ dest: "uploads/" });

import emailTemplateController from "../controller/emailTemplate.controller.js";

router.post("/template/add-template", upload.single("resume"), emailTemplateController.createTemplate);
router.post("/template/send-template-mail", emailTemplateController.sendTemplateMail);
router.get("/template/get-all-template", emailTemplateController.getAllTemplates);

export default router;
