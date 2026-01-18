import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    attachmentPath: {
      type: String, // Path to the uploaded file
    },
    attachmentName: {
      type: String, // Original filename
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
